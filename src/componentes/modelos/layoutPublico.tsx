import { EntradaSuave } from './experiencia'
import { Outlet, useLocation } from 'react-router-dom'

const LayoutPublico = () => {
  const { pathname } = useLocation()
  return (
    <main className="public-layout">
<EntradaSuave key={pathname} className="public-transition"><Outlet /></EntradaSuave>
    </main>
  )
}

export { LayoutPublico }
