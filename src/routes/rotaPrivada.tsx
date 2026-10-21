import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { sessionStore } from '../features/auth/session'
import { useSession } from '../features/auth/use-session'
import { Botao } from '../componentes/atomos/botao'
import { AvisoErro } from '../componentes/moleculas/avisoErro'

export function RotaPrivada() {
  const sessao = useSession()
  const localizacao = useLocation()
  if (sessao.status === 'loading')
    return (
      <main className="public-layout">
        <p role="status">Verificando sua sessão…</p>
      </main>
    )
  if (sessao.status === 'error')
    return (
      <main className="public-layout">
        <section>
          <AvisoErro message={sessao.message} />
          <Botao onClick={() => void sessionStore.restore()}>Tentar novamente</Botao>
          <Botao className="button--subtle" onClick={() => sessionStore.forget()}>
            Voltar ao login
          </Botao>
        </section>
      </main>
    )
  return sessao.status === 'authenticated' ? (
    <Outlet />
  ) : (
    <Navigate
      to="/login"
      replace
      state={{ from: localizacao.pathname + localizacao.search + localizacao.hash }}
    />
  )
}
