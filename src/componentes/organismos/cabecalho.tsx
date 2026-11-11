import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useSession } from '../../features/auth/use-session'

export function Cabecalho({ acaoConta }: { acaoConta?: ReactNode }) {
  const { pathname }=useLocation(),{user}=useSession()
  return <header className={`app-header ${pathname==='/home'?'app-header--home':''}`}>
    <Link to="/home" className="app-header__brand" aria-label="Ir para Tela Inicial">MindCheck</Link>
    <Link to="/profile" className="app-header__profile" aria-label="Ir para Perfil"><span className="app-header__avatar" aria-hidden="true">{user?.nome.trim().slice(0,1).toLocaleUpperCase('pt-BR')||'?'}</span><span className="app-header__profile-label">Perfil</span></Link>
    <div className="app-header__logout">{acaoConta}</div>
  </header>
}
