import { Link } from 'react-router-dom'
import { useState } from 'react'

export function BoasVindas() {
  const [etapa, setEtapa] = useState(0)
  const paginas = [
    { titulo: 'Acompanhe seu dia', texto: 'Faça check-ins diários rápidos e registre como está sendo o seu dia.' },
    { titulo: 'Tudo em um só lugar', texto: 'Responda questionários e consulte os resultados quando quiser.' },
    { titulo: 'Acompanhe sua evolução', texto: 'Visualize seu histórico e acompanhe suas mudanças ao longo do tempo.' },
  ]
  return (
    <section className="onboarding" aria-labelledby="onboarding-title">
      <Link className="onboarding__skip" to="/login">Pular</Link>
      <div className="onboarding__illustration"><img src={`/assets/figma/onboarding-${etapa + 1}.png`} alt=""/></div>
      <div aria-live="polite">
        <p className="onboarding__eyebrow">BEM-VINDO AO MINDCHECK</p>
        <h1 id="onboarding-title">{paginas[etapa].titulo}</h1>
        <p className="onboarding__description">{paginas[etapa].texto}</p>
      </div>
      <div className="onboarding__steps" aria-label={`Etapa ${etapa + 1} de 3`}>{paginas.map((_, i) => <span key={i} aria-current={i === etapa ? 'step' : undefined}/>)}</div>
      {etapa < 2 ? <button className="button" onClick={() => setEtapa(etapa + 1)}>Continuar</button> : <Link className="button" to="/login">Começar</Link>}
    </section>
  )
}
