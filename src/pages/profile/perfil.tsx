import { useSession } from '../../features/auth/use-session'

export function Perfil() {
  const { user: usuario } = useSession()
  return (
    <section>
      <h1>Seu perfil</h1>
      <p className="profile-value">{usuario?.nome}</p>
      <p className="profile-value">{usuario?.email}</p>
      <p>Edição de perfil em desenvolvimento.</p>
    </section>
  )
}
