import { sessionStore } from '../auth/session'
import { respostaValida, type Execucao, type Respostas, type ServicoExecucao } from './servicoExecucao'
type Estado = {
  execucao: Execucao | null; respostas: Respostas; carregando: boolean; erro: string
  revisao: number; revisaoSalva: number; salvando: boolean; concluindo: boolean; resultadoId: string | null
}
export function criarSessaoExecucao(id: string, servico: ServicoExecucao) {
  let estado: Estado = { execucao:null,respostas:{},carregando:false,erro:'',revisao:0,revisaoSalva:0,salvando:false,concluindo:false,resultadoId:null }
  const ouvintes = new Set<() => void>()
  let ativa = true, salvas: Respostas = {}, fila = Promise.resolve(), ultimaRevisaoEnfileirada = -1, pendentes = 0
  const atualizar = (novo: Partial<Estado>) => { if (!ativa) return; estado={...estado,...novo}; ouvintes.forEach(o=>o()) }
  const payload = (respostas:Respostas) => {
    if (!estado.execucao) throw new Error('Questionário indisponível.')
    return {avaliacaoId:estado.execucao.avaliacaoId,versaoId:estado.execucao.versaoId,respostas:{...respostas}}
  }
  const salvar = () => {
    if (!ativa || !estado.execucao) return Promise.reject(new Error('Questionário indisponível.'))
    if (estado.revisao <= estado.revisaoSalva) return fila
    if (estado.revisao === ultimaRevisaoEnfileirada) return fila
    const revisao=estado.revisao, dados=payload(estado.respostas)
    ultimaRevisaoEnfileirada=revisao; pendentes++; atualizar({salvando:true,erro:''})
    const tarefa=fila.catch(()=>{}).then(async()=>{
      if(!ativa)throw new Error('Sessão encerrada.')
      await servico.salvarRascunho(dados)
      if(!ativa)return
      salvas={...dados.respostas}
      atualizar({revisaoSalva:revisao})
    }).catch(c=>{
      ultimaRevisaoEnfileirada=-1
      atualizar({erro:'Não foi possível salvar o progresso. Suas respostas continuam nesta sessão.'})
      throw c
    }).finally(()=>{pendentes--;atualizar({salvando:pendentes>0})})
    fila=tarefa
    return tarefa
  }
  return {
    getSnapshot:()=>estado,
    subscribe:(ouvinte:()=>void)=>{ouvintes.add(ouvinte);return()=>{ouvintes.delete(ouvinte)}},
    carregar:async()=>{
      if(estado.carregando || estado.execucao || !ativa)return
      atualizar({carregando:true,erro:''})
      try{
        const execucao=await servico.carregar(id)
        if(!execucao.versaoId || !execucao.avaliacaoId || !execucao.perguntas.length || execucao.perguntas.some(p=>p.tipo!=='aberta'&&!p.opcoes.length))throw new Error('As perguntas deste questionário ainda não estão disponíveis.')
        salvas={...execucao.respostas};atualizar({execucao,respostas:{...salvas},carregando:false})
      }catch(c){atualizar({carregando:false,erro:c instanceof Error?c.message:'Não foi possível abrir o questionário.'})}
    },
    responder:(perguntaId:string,valor:string)=>{
      if(!ativa || estado.concluindo || estado.resultadoId || !estado.execucao?.perguntas.some(p=>p.id===perguntaId))return
      atualizar({respostas:{...estado.respostas,[perguntaId]:valor},revisao:estado.revisao+1})
    },
    salvar,
    concluir:async()=>{
      if(estado.concluindo || estado.resultadoId)throw new Error('O envio já está em andamento ou concluído.')
      if(!estado.execucao || estado.execucao.perguntas.some(p=>p.obrigatoria&&!respostaValida(p,estado.respostas[p.id])))throw new Error('Responda às perguntas obrigatórias antes de concluir.')
      atualizar({concluindo:true,erro:''})
      try{
        await salvar()
        if(!ativa)throw new Error('Sessão encerrada.')
        const resultado=await servico.concluir(payload(estado.respostas))
        atualizar({resultadoId:resultado.resultadoId})
        return resultado
      }catch(c){atualizar({erro:'Não foi possível concluir. Confira a conexão e tente novamente.'});throw c}
      finally{atualizar({concluindo:false})}
    },
    restaurarSalvas:()=>{if(!estado.salvando)atualizar({respostas:{...salvas},revisao:estado.revisaoSalva})},
    descartar:()=>{ativa=false;ouvintes.clear();salvas={};estado={...estado,execucao:null,respostas:{}}}
  }
}
type Sessao = ReturnType<typeof criarSessaoExecucao>
const sessoes = new Map<string,{servico:ServicoExecucao;sessao:Sessao}>()
export function limparSessoesQuestionario(){sessoes.forEach(v=>v.sessao.descartar());sessoes.clear()}
let usuarioAnterior = sessionStore.getSnapshot().user?.id
sessionStore.subscribe(()=>{
  const id=sessionStore.getSnapshot().user?.id
  if(id!==usuarioAnterior){limparSessoesQuestionario();usuarioAnterior=id}
})
export function obterSessaoExecucao(usuarioId:number,id:string,servico:ServicoExecucao){
  const chave=`${usuarioId}:${id}`
  const anterior=sessoes.get(chave)
  if(anterior?.servico===servico)return anterior.sessao
  anterior?.sessao.descartar()
  const sessao=criarSessaoExecucao(id,servico);sessoes.set(chave,{servico,sessao});return sessao
}
