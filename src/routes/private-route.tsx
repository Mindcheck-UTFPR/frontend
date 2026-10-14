import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { sessionStore } from '../features/auth/session'
import { useSession } from '../features/auth/use-session'
import { Button } from '../shared/ui/atoms/button'
import { ErrorNotice } from '../shared/ui/molecules/error-notice'

export default function PrivateRoute() {
  const session = useSession()
  const location = useLocation()
  if (session.status === 'loading') return <main className="public-layout"><p role="status">Verificando sua sessão…</p></main>
  if (session.status === 'error') return <main className="public-layout"><section>
    <ErrorNotice message={session.message} />
    <Button onClick={() => void sessionStore.restore()}>Tentar novamente</Button>
    <Button className="button--subtle" onClick={() => sessionStore.forget()}>Voltar ao login</Button>
  </section></main>
  return session.status === 'authenticated' ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname + location.search + location.hash }} />
}
