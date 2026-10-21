import { useSession } from '../../features/auth/use-session'

export function Inicio() {
  const { user: usuario } = useSession()
  return (
    <section>
      <h1 className="profile-value">Olá, {usuario?.nome}!</h1>
      <p>Você está conectado ao MindCheck.</p>
      <p>As jornadas de check-in, questionários e histórico ainda estão em desenvolvimento.</p>
    </section>
  )
}
