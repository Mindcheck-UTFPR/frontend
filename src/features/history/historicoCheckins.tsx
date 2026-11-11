import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SeletorData } from '../../componentes/moleculas/seletorData'
import { Selecao } from '../../componentes/atomos/selecao'
import { IconeInterface } from '../../componentes/atomos/iconeInterface'
import { Botao } from '../../componentes/atomos/botao'
import { EstadoErro } from '../../componentes/moleculas/estadoErro'
import { EstadoVazio } from '../../componentes/moleculas/estadoVazio'
import { rotulosHumor, servicoHistorico, type FiltrosCheckin, type RegistroCheckin, type ServicoHistorico } from './servicoHistorico'
import './historico.css'

const data = (v: string) => v.split('-').reverse().join('/')
const booleano = (v: boolean | null) => v === null ? 'Não informado' : v ? 'Sim' : 'Não'
function Rosto({ humor }: { humor: RegistroCheckin['humor'] }) {
  return <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="20" cy="20" r="17"/><path d="M14 14v3m12-3v3"/><path d={humor === 'neutro' ? 'M13 26h14' : ['baixo','muito_baixo'].includes(humor) ? 'M12 28q8-12 16 0' : 'M12 23q8 12 16 0'}/></svg>
}
export function HistoricoCheckinsPagina({ servico = servicoHistorico }: { servico?: ServicoHistorico }) {
  const [params] = useSearchParams()
  return <HistoricoCheckinsConteudo key={params.toString()} servico={servico}/>
}
function HistoricoCheckinsConteudo({ servico }: { servico: ServicoHistorico }) {
  const [params, setParams] = useSearchParams()
  const [resposta, setResposta] = useState<{ registros: RegistroCheckin[]; temProxima: boolean } | null>(null)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const inicio = params.get('inicio') ?? '', fim = params.get('fim') ?? '', humor = params.get('humor') ?? ''
  const pagina = Math.max(1, Number(params.get('pagina')) || 1)
  const [filtrosAbertos, setFiltrosAbertos] = useState(Boolean(inicio || fim || humor))
  const [rascunho, setRascunho] = useState({ inicio, fim, humor })
  const periodoInvalido = Boolean(inicio && fim && inicio > fim)
  useEffect(() => {
    let ativo = true
    if (periodoInvalido) return
    servico.listar({ inicio, fim, humor, pagina }).then(valor => { if (ativo) { setResposta(valor); setErro('') } })
      .catch(causa => { if (ativo) setErro(causa instanceof Error ? causa.message : 'Não foi possível consultar o histórico.') })
    return () => { ativo = false }
  }, [inicio, fim, humor, pagina, servico, tentativa, periodoInvalido])
  const navegar = (novos: FiltrosCheckin) => {
    setResposta(null); setErro('')
    const p = new URLSearchParams()
    if (novos.inicio) p.set('inicio', novos.inicio)
    if (novos.fim) p.set('fim', novos.fim)
    if (novos.humor) p.set('humor', novos.humor)
    if (novos.pagina > 1) p.set('pagina', String(novos.pagina))
    setParams(p)
  }
  return <section className="history-page">
    <h1>Histórico</h1><p className="history-muted">Seus check-ins e questionários concluídos.</p>
    <aside className="history-callout"><strong>Aviso importante</strong><p>Os resultados mostrados aqui são para acompanhamento pessoal e não substituem diagnóstico ou orientação profissional.</p></aside>
    <nav className="history-tabs" aria-label="Tipo de histórico"><Link to="/history/check-ins" aria-current="page">Check-ins</Link><Link to="/history/questionnaires">Questionários</Link></nav>
    <details className="history-filter-panel" open={filtrosAbertos} onToggle={e => setFiltrosAbertos(e.currentTarget.open)}>
      <summary><span className="history-filter-title"><IconeInterface nome="filtro"/>Filtrar registros{(inicio || fim || humor) && <span className="history-filter-count">{[inicio || fim,humor].filter(Boolean).length}</span>}</span><IconeInterface nome="baixo" tamanho={18}/></summary>
      <form className="history-filters" onSubmit={e => { e.preventDefault(); if (rascunho.inicio && rascunho.fim && rascunho.inicio > rascunho.fim) { setErro('A data inicial deve ser anterior à data final.'); return }; navegar({ ...rascunho, pagina: 1 }) }}>
        <div className="history-quick-dates" aria-label="Períodos rápidos">{[{dias:7,rotulo:'Últimos 7 dias'},{dias:30,rotulo:'Últimos 30 dias'}].map(item => <button type="button" key={item.dias} onClick={() => {
          const fim = new Date(), comeco = new Date(); comeco.setDate(comeco.getDate() - item.dias + 1)
          const local = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
          navegar({inicio:local(comeco),fim:local(fim),humor:rascunho.humor,pagina:1})
        }}>{item.rotulo}</button>)}</div>
        <SeletorData rotulo="De" valor={rascunho.inicio} aoMudar={v => setRascunho({...rascunho,inicio:v})} maximo={rascunho.fim}/>
        <SeletorData rotulo="Até" valor={rascunho.fim} aoMudar={v => setRascunho({...rascunho,fim:v})} minimo={rascunho.inicio}/>
        <div className="history-mood-filter"><Selecao rotulo="Humor" valor={rascunho.humor} aoMudar={v => setRascunho({...rascunho,humor:v})} opcoes={[{valor:'',rotulo:'Todos os humores'},...Object.entries(rotulosHumor).map(([valor,rotulo])=>({valor,rotulo}))]}/></div>
        <div className="history-filter-actions"><Botao type="button" className="button--subtle" onClick={() => { setRascunho({ inicio:'',fim:'',humor:'' }); navegar({ inicio:'',fim:'',humor:'',pagina:1 }) }}>Limpar filtros</Botao><Botao type="submit">Aplicar filtros</Botao></div>
      </form>
    </details>
    <h2 className="history-overline">Check-ins concluídos</h2>
    {periodoInvalido ? <EstadoErro mensagem="A data inicial deve ser anterior à data final."/> : erro ? <EstadoErro mensagem={erro} tentarNovamente={() => { setResposta(null); setErro(''); setTentativa(tentativa + 1) }}/> : !resposta ? <p role="status">Carregando histórico…</p> : <>
      {resposta.registros.length === 0 ? <EstadoVazio titulo={inicio || fim || humor ? 'Nenhum registro nesse período' : 'Você ainda não tem check-ins'} mensagem="Faça um check-in para começar seu acompanhamento."/> : <ul className="history-list">{resposta.registros.map(r => <li key={r.id}><Rosto humor={r.humor}/><div><strong>{data(r.data)}</strong><small>Humor: {rotulosHumor[r.humor]}</small></div><Link className="button button--subtle" to={`/history/check-ins/${encodeURIComponent(r.id)}?${params}`} aria-label={`Detalhes de ${data(r.data)}`}>Detalhes</Link></li>)}</ul>}
      <nav className="history-pagination" aria-label="Paginação"><Botao disabled={pagina <= 1} onClick={() => navegar({ inicio, fim, humor, pagina: pagina - 1 })}>Anterior</Botao><span>Página {pagina}</span><Botao disabled={!resposta.temProxima} onClick={() => navegar({ inicio, fim, humor, pagina: pagina + 1 })}>Próxima</Botao></nav>
    </>}
  </section>
}
export function DetalheCheckinPagina({ servico = servicoHistorico }: { servico?: ServicoHistorico }) {
  const { checkInId } = useParams()
  return <DetalheCheckinConteudo key={checkInId} servico={servico}/>
}
function DetalheCheckinConteudo({ servico }: { servico: ServicoHistorico }) {
  const { checkInId = '' } = useParams()
  const [params] = useSearchParams()
  const [registro, setRegistro] = useState<RegistroCheckin | null>(null)
  const [erro, setErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  useEffect(() => {
    let ativo = true
    servico.detalhar(checkInId).then(v => { if (ativo) setRegistro(v) }).catch(c => { if (ativo) setErro(c instanceof Error ? c.message : 'Não foi possível abrir esse registro.') })
    return () => { ativo = false }
  }, [checkInId, servico, tentativa])
  return <section className="history-page"><header className="history-detail-title"><Link to={`/history/check-ins?${params}`}>← Voltar</Link><h1>Histórico</h1>{registro && <time>{data(registro.data)}</time>}</header>
    {erro ? <EstadoErro mensagem={erro} tentarNovamente={() => { setErro(''); setRegistro(null); setTentativa(tentativa+1) }}/> : !registro ? <p role="status">Carregando registro…</p> : <>
      <h2 className="history-overline">Check-in diário</h2><article className="history-mood"><Rosto humor={registro.humor}/><div><small>Humor</small><h2>{rotulosHumor[registro.humor]}</h2></div></article>
      <dl className="history-summary"><div><dt>Sono</dt><dd>{registro.sonoHoras === null ? 'Não informado' : `${Math.floor(registro.sonoHoras)}h ${Math.round((registro.sonoHoras % 1)*60)}m`}</dd></div><div><dt>Estudou</dt><dd>{booleano(registro.estudou)}</dd></div><div><dt>Atividade física</dt><dd>{booleano(registro.atividadeFisica)}</dd></div></dl>
      <article className="history-note"><h2>Observações</h2><p>{registro.observacoes || 'Nenhuma observação registrada.'}</p></article>
      {registro.podeEditar && <Link className="button" to="/check-in">Editar check-in de hoje</Link>}
    </>}
  </section>
}
