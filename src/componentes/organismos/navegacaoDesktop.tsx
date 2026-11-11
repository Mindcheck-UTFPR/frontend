import { NavLink } from 'react-router-dom'
import { IconeInterface } from '../atomos/iconeInterface'

const destinos = [
  {caminho:'/home',rotulo:'Início',icone:'home'},
  {caminho:'/check-in',rotulo:'Check-in',icone:'checkin'},
  {caminho:'/questionnaires',rotulo:'Questionários',icone:'questionarios'},
  {caminho:'/dashboard',rotulo:'Dashboard',icone:'dashboard'},
  {caminho:'/history',rotulo:'Histórico',icone:'historico'},
]
export function NavegacaoDesktop() {
  return <nav className="desktop-navigation" aria-label="Navegação principal">
    {destinos.map(item=><NavLink key={item.caminho} to={item.caminho}><span className={`desktop-navigation__icon mobile-navigation__icon mobile-navigation__icon--${item.icone}`} aria-hidden="true"/>{item.rotulo}</NavLink>)}
    <NavLink to="/profile"><span className="desktop-navigation__icon"><IconeInterface nome="pessoa"/></span>Perfil</NavLink>
  </nav>
}
