import { useEffect, useState, useSyncExternalStore } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { useSession } from '../auth/use-session'
import { Botao } from '../../componentes/atomos/botao'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { EstadoErro } from '../../componentes/moleculas/estadoErro'
import { obterSessaoExecucao } from './sessaoExecucao'
import { respostaValida, servicoExecucao, type ServicoExecucao } from './servicoExecucao'
import './execucao.css'

export function ExecucaoPagina({ modo='respostas',servico=servicoExecucao,usuarioId }: {modo?:'respostas'|'revisao';servico?:ServicoExecucao;usuarioId?:number}) {
  const {user}=useSession(), {questionnaireId=''}=useParams()
  const id=usuarioId ?? user?.id
  if(!id || !questionnaireId)return <p role="status">Entre na sua conta para abrir o questionário.</p>
  return <ConteudoExecucao key={`${id}:${questionnaireId}:${modo}`} modo={modo} id={questionnaireId} usuarioId={id} servico={servico}/>
}
function ConteudoExecucao({modo,id,usuarioId,servico}:{modo:'respostas'|'revisao';id:string;usuarioId:number;servico:ServicoExecucao}){
  const sessao=obterSessaoExecucao(usuarioId,id,servico)
  const estado=useSyncExternalStore(sessao.subscribe,sessao.getSnapshot)
  const navegar=useNavigate(), [params,setParams]=useSearchParams()
  const [mapa,setMapa]=useState(false), [sair,setSair]=useState(false), [erroLocal,setErroLocal]=useState('')
  const exec=estado.execucao
  const indice=Math.max(0,Math.min((exec?.perguntas.length??1)-1,(Number(params.get('pergunta'))||1)-1))
  const pergunta=exec?.perguntas[indice]
  const respondidas=exec?.perguntas.filter(p=>respostaValida(p,estado.respostas[p.id])).length??0
  const pendentes=exec?.perguntas.filter(p=>p.obrigatoria&&!respostaValida(p,estado.respostas[p.id]))??[]
  useEffect(()=>{void sessao.carregar()},[sessao])
  useEffect(()=>{
    if(estado.revisao<=estado.revisaoSalva || estado.resultadoId)return
    const timer=window.setTimeout(()=>{void sessao.salvar().catch(()=>{})},700)
    return()=>window.clearTimeout(timer)
  },[estado.revisao,estado.revisaoSalva,estado.resultadoId,sessao])
  useEffect(()=>{
    if(estado.revisao<=estado.revisaoSalva)return
    const prevenir=(e:BeforeUnloadEvent)=>{e.preventDefault();e.returnValue=''}
    window.addEventListener('beforeunload',prevenir)
    return()=>window.removeEventListener('beforeunload',prevenir)
  },[estado.revisao,estado.revisaoSalva])
  const ir=(i:number)=>{setErroLocal('');setParams({pergunta:String(i+1)});setMapa(false)}
  const sairSalvando=async()=>{try{await sessao.salvar();navegar('/questionnaires')}catch{setErroLocal('Não foi possível salvar. Tente novamente antes de sair.')}}
  const concluir=async()=>{try{const resultado=await sessao.concluir();navegar(`/questionnaires/${id}/result?resultado=${encodeURIComponent(resultado.resultadoId)}`)}catch{setErroLocal('Não foi possível concluir. Suas respostas foram preservadas nesta sessão.')}}
  if(!exec)return <section className="question-page"><Link to="/questionnaires">← Voltar aos questionários</Link>{estado.erro?<EstadoErro mensagem={estado.erro} tentarNovamente={()=>void sessao.carregar()}/>:<p role="status">Carregando questionário…</p>}</section>
  return <section className="question-page" aria-busy={estado.concluindo}>
    <header className="question-heading"><button onClick={()=>setSair(true)} aria-label="Sair do questionário" className="question-icon">×</button><h1>{exec.nome}</h1><button className="question-icon question-icon--soft" aria-label="Abrir mapa de perguntas" onClick={()=>setMapa(true)}>▦</button></header>
    <div className="question-progress-label"><span>{respondidas}/{exec.perguntas.length} respondidas</span><span>{Math.round(respondidas/exec.perguntas.length*100)}%</span></div>
    <progress max={exec.perguntas.length} value={respondidas} aria-label="Progresso do questionário"/>
    <p className="question-save" role="status">{estado.salvando?'Salvando progresso…':estado.revisao>estado.revisaoSalva?'Alterações ainda não salvas.':'Progresso salvo.'}</p>
    <AvisoErro message={erroLocal || estado.erro}/>
    {pergunta&&<fieldset className="question-options" disabled={estado.concluindo}>
      <legend><span className="question-overline">Pergunta {indice+1} de {exec.perguntas.length}{!pergunta.obrigatoria?' • opcional':''}</span><span className="question-text">{pergunta.texto}</span></legend>
      {pergunta.tipo==='aberta'?<label className="question-open">Sua resposta<textarea rows={5} maxLength={pergunta.limiteCaracteres} value={estado.respostas[pergunta.id]??''} onChange={e=>sessao.responder(pergunta.id,e.target.value)}/></label>:pergunta.opcoes.map(opcao=><label key={opcao.id} className={estado.respostas[pergunta.id]===opcao.id?'selecionado':''}><input type="radio" name={pergunta.id} value={opcao.id} checked={estado.respostas[pergunta.id]===opcao.id} onChange={()=>sessao.responder(pergunta.id,opcao.id)}/>{opcao.texto}</label>)}
      {!pergunta.obrigatoria&&estado.respostas[pergunta.id]&&<button className="question-clear" onClick={()=>sessao.responder(pergunta.id,'')}>Limpar resposta</button>}
    </fieldset>}
    <footer className="question-actions"><Botao className="question-exit" onClick={()=>setSair(true)}>Sair</Botao><Botao className="button--subtle" disabled={indice===0 || estado.concluindo} onClick={()=>ir(indice-1)}>Voltar</Botao><Botao disabled={estado.concluindo} onClick={()=>{if(pergunta?.obrigatoria&&!respostaValida(pergunta,estado.respostas[pergunta.id])){setErroLocal('Responda a esta pergunta antes de avançar.');return}if(indice===exec.perguntas.length-1)navegar(`/questionnaires/${id}/review?pergunta=${indice+1}`);else ir(indice+1)}}>{indice===exec.perguntas.length-1?'Revisar':'Avançar'}</Botao></footer>
    <Dialog.Root open={modo==='revisao'||mapa||sair} onOpenChange={aberto=>{if(!aberto&&!estado.concluindo){setMapa(false);setSair(false);if(modo==='revisao')navegar(`/questionnaires/${id}/answer?pergunta=${indice+1}`)}}}>
      <Dialog.Portal><Dialog.Overlay className="question-overlay"/><Dialog.Content className="question-dialog" onEscapeKeyDown={e=>{if(estado.concluindo)e.preventDefault()}} onPointerDownOutside={e=>{if(estado.concluindo)e.preventDefault()}}>
        <Dialog.Title>{sair?'Sair do questionário?':modo==='revisao'?'Revisar antes de concluir':'Mapa de perguntas'}</Dialog.Title>
        <Dialog.Description>{sair?'Você pode salvar seu progresso para continuar depois. Se sair sem salvar, somente as respostas confirmadas pelo serviço serão mantidas.':`${respondidas} de ${exec.perguntas.length} respondidas. Toque em uma pergunta para revisar sua resposta.`}</Dialog.Description>
        <AvisoErro message={erroLocal||estado.erro}/>
        {sair?<><Botao disabled={estado.salvando||estado.concluindo} onClick={()=>void sairSalvando()}>Salvar e sair</Botao><Botao className="button--subtle" disabled={estado.salvando||estado.concluindo} onClick={()=>{sessao.restaurarSalvas();navegar('/questionnaires')}}>Sair sem salvar alterações</Botao><Dialog.Close asChild><Botao className="button--subtle">Continuar respondendo</Botao></Dialog.Close></>:<>
          <div className="question-map">{exec.perguntas.map((p,i)=><button key={p.id} className={respostaValida(p,estado.respostas[p.id])?'respondida':''} aria-label={`Pergunta ${i+1}, ${respostaValida(p,estado.respostas[p.id])?'respondida':'pendente'}`} onClick={()=>{if(modo==='revisao')navegar(`/questionnaires/${id}/answer?pergunta=${i+1}`);else ir(i)}}>{i+1}</button>)}</div>
          {modo==='revisao'&&<><p className="question-muted">{pendentes.length?`${pendentes.length} pergunta(s) obrigatória(s) pendente(s).`:'Todas as perguntas obrigatórias foram respondidas.'}</p><Botao disabled={pendentes.length>0||estado.concluindo} onClick={()=>void concluir()}>{estado.concluindo?'Concluindo…':'Concluir questionário'}</Botao></>}
          <Dialog.Close asChild><Botao className="button--subtle" disabled={estado.concluindo}>Voltar</Botao></Dialog.Close>
        </>}
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
  </section>
}
export function RevisaoPagina(){return <ExecucaoPagina modo="revisao"/>}
