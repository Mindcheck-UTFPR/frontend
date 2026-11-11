import { Link } from 'react-router-dom'
import { useSession } from '../../features/auth/use-session'

export function Inicio() {
  const { user: usuario } = useSession()
  return <section className="home-page">
    <h1 className="profile-value">Olá, {usuario?.nome}!</h1><p className="home-description">Veja seu resumo e escolha o próximo passo.</p>
    <article className="home-checkin"><h2>Faça seu check-in</h2><p>Como você está se sentindo hoje?</p><Link className="button" to="/check-in">Fazer check-in</Link></article>
    <h2 className="home-overline">Questionários</h2>
    <article className="home-card"><h3>Seus questionários</h3><p>Consulte os questionários disponíveis e retome suas respostas na lista.</p></article>
    <article className="home-card"><h3>Inicie um novo questionário</h3><p>Escolha entre os questionários disponíveis e descubra mais sobre como você tem se sentido.</p><Link className="button button--subtle" to="/questionnaires">Ver questionários disponíveis</Link></article>
    <p className="home-disclaimer">Acompanhamento pessoal. Não substitui diagnóstico ou orientação profissional.</p>
  </section>
}
