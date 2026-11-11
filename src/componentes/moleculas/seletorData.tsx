import { lazy, Suspense, useId, useState } from 'react'
import { IconeInterface } from '../atomos/iconeInterface'
import '../controles.css'
import './seletorData.css'

const CalendarioConteudo = lazy(() => import('./calendarioConteudo').then(modulo => ({ default: modulo.CalendarioConteudo })))
export function SeletorData({ rotulo, valor, aoMudar, minimo, maximo }: {
  rotulo: string; valor: string; aoMudar: (data: string) => void; minimo?: string; maximo?: string
}) {
  const [aberto, setAberto] = useState(false)
  const [visitado, setVisitado] = useState(false)
  const id = useId()
  const partes = /^\d{4}-\d{2}-\d{2}$/.test(valor) ? valor.split('-') : []
  return <div className="mc-date" data-value={valor}>
    <span className="mc-label" id={`${id}-rotulo`}>{rotulo}</span>
    <button type="button" className="mc-date-trigger" aria-label={`Selecionar data: ${rotulo}`} aria-describedby={`${id}-valor`} aria-haspopup="dialog" aria-expanded={aberto} aria-controls={aberto ? id : undefined}
      onClick={() => { setVisitado(true); setAberto(true) }}>
      <span className={`mc-date-parts ${partes.length ? '' : 'mc-date-placeholder'}`} id={`${id}-valor`}><span>{partes[2] || 'dia'}</span><span className="mc-date-separator">/</span><span>{partes[1] || 'mês'}</span><span className="mc-date-separator">/</span><span>{partes[0] || 'ano'}</span></span>
      <IconeInterface nome="calendario"/>
    </button>
    {visitado && <Suspense fallback={aberto ? <span className="mc-date-loading" role="status">Carregando calendário…</span> : null}>
      <CalendarioConteudo id={id} rotulo={rotulo} valor={valor} aoMudar={aoMudar} aberto={aberto} aoAbrir={setAberto} minimo={minimo} maximo={maximo}/>
    </Suspense>}
  </div>
}
