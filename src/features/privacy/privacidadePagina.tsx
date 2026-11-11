import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Botao } from '../../componentes/atomos/botao'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { servicoPrivacidade, type EstadoPrivacidade, type PedidoPrivacidade, type ServicoPrivacidade } from './servicoPrivacidade'
import './privacidade.css'

const estados = { recebido:'Solicitação recebida', processando:'Em andamento', pronto:'Disponível para baixar', concluido:'Concluído', falhou:'Não foi possível concluir' }
function Pedido({ pedido }: { pedido: PedidoPrivacidade | null }) {
  return pedido ? <div className="privacy-status"><strong>{estados[pedido.estado]}</strong><p>Protocolo: {pedido.protocolo}</p>{pedido.prazo && <p>Prazo informado: {pedido.prazo}</p>}</div> : null
}
export function PrivacidadePagina({ servico = servicoPrivacidade }: { servico?: ServicoPrivacidade }) {
  const [dados,setDados] = useState<EstadoPrivacidade>({exportacao:null,exclusao:null})
  const [erro,setErro] = useState(''), [mensagem,setMensagem] = useState('')
  const [carregando,setCarregando] = useState(true), [ocupado,setOcupado] = useState(false)
  const [confirmar,setConfirmar] = useState(false), [ciente,setCiente] = useState(false)
  const [tentativa,setTentativa] = useState(0)
  const pendente=useRef(false)
  const confirmaRef=useRef<HTMLHeadingElement>(null)
  useEffect(()=>{
    let ativo=true
    servico.consultar().then(v=>{if(ativo)setDados(v)}).catch(c=>{if(ativo)setErro(c instanceof Error?c.message:'Não foi possível consultar seus pedidos.')}).finally(()=>{if(ativo)setCarregando(false)})
    return()=>{ativo=false}
  },[servico,tentativa])
  useEffect(()=>{if(confirmar)confirmaRef.current?.focus()},[confirmar])
  const executar=async(acao:'exportar'|'excluir'|'baixar')=>{
    if(pendente.current || (acao==='excluir' && !ciente))return
    pendente.current=true;setOcupado(true);setErro('');setMensagem('')
    try{
      if(acao==='baixar'){
        if(!dados.exportacao || dados.exportacao.estado!=='pronto')return
        const arquivo=await servico.baixarExportacao(dados.exportacao.protocolo)
        const url=URL.createObjectURL(new Blob([arquivo],{type:'application/json'}))
        const link=document.createElement('a');link.href=url;link.download='mindcheck-dados.json';link.click()
        window.setTimeout(()=>URL.revokeObjectURL(url),1000)
        setMensagem('Arquivo recebido. O download foi iniciado.')
      }else if(acao==='exportar'){
        const pedido=await servico.solicitarExportacao();setDados(v=>({...v,exportacao:pedido}));setMensagem('Solicitação de exportação recebida.')
      }else{
        const pedido=await servico.solicitarExclusao();setDados(v=>({...v,exclusao:pedido}));setConfirmar(false);setCiente(false);setMensagem('Solicitação de exclusão recebida. Consulte o andamento abaixo.')
      }
    }catch(c){setErro(c instanceof Error?c.message:'Não foi possível concluir a solicitação. Tente novamente.')}
    finally{pendente.current=false;setOcupado(false)}
  }
  const exportacaoPendente=Boolean(dados.exportacao && ['recebido','processando','pronto'].includes(dados.exportacao.estado))
  const exclusaoPendente=Boolean(dados.exclusao && ['recebido','processando','concluido'].includes(dados.exclusao.estado))
  return <section className="privacy-page"><header><Link to="/profile">← Voltar ao perfil</Link><h1>Privacidade da conta</h1></header>
    <p>Consulte e solicite uma cópia dos seus dados ou a exclusão da sua conta.</p>
    <AvisoErro message={erro}/>{mensagem&&<p className="success-notice" role="status">{mensagem}</p>}
    {carregando&&<p role="status">Consultando seus pedidos…</p>}
    <article className="privacy-card"><h2>Baixar meus dados</h2><p>Solicite uma cópia dos dados da sua conta. O arquivo ficará disponível quando o pedido estiver pronto.</p><Pedido pedido={dados.exportacao}/>
      <Botao disabled={ocupado||carregando||exportacaoPendente} onClick={()=>void executar('exportar')}>{ocupado?'Aguarde…':'Solicitar cópia dos dados'}</Botao>
      {dados.exportacao?.estado==='pronto'&&<Botao disabled={ocupado} onClick={()=>void executar('baixar')}>Baixar arquivo</Botao>}
    </article>
    <article className="privacy-card"><h2>Excluir minha conta</h2><p>Antes de solicitar, confira se deseja guardar uma cópia dos seus dados.</p><Pedido pedido={dados.exclusao}/>
      {!confirmar?<Botao className="privacy-danger" disabled={ocupado||carregando||exclusaoPendente} onClick={()=>setConfirmar(true)}>Solicitar exclusão</Botao>:<section className="privacy-confirm" aria-labelledby="privacy-confirm-title"><h3 id="privacy-confirm-title" tabIndex={-1} ref={confirmaRef}>Deseja solicitar a exclusão da conta?</h3><p>O pedido será enviado para processamento. O prazo e o andamento serão informados pelo serviço.</p><label><input type="checkbox" checked={ciente} disabled={ocupado} onChange={e=>setCiente(e.target.checked)}/>Entendo que a exclusão da conta pode remover meus registros e desejo continuar.</label><Botao className="privacy-danger" disabled={!ciente||ocupado} onClick={()=>void executar('excluir')}>Confirmar solicitação de exclusão</Botao><Botao className="button--subtle" disabled={ocupado} onClick={()=>{setConfirmar(false);setCiente(false)}}>Cancelar</Botao></section>}
    </article>
    <Botao className="button--subtle" disabled={ocupado||carregando} onClick={()=>{setErro('');setCarregando(true);setTentativa(tentativa+1)}}>Atualizar andamento</Botao>
  </section>
}
