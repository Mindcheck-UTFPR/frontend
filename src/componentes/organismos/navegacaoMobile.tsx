import { NavLink } from 'react-router-dom'

const itens = [
  { caminho:'/home',rotulo:'Início',icone:'home' },
  { caminho:'/check-in',rotulo:'Check-in',icone:'checkin' },
  { caminho:'/questionnaires',rotulo:'Questionários',icone:'questionarios' },
  { caminho:'/dashboard',rotulo:'Dashboard',icone:'dashboard' },
  { caminho:'/history',rotulo:'Histórico',icone:'historico' },
]
export function NavegacaoMobile() {
  return <nav className="mobile-navigation" aria-label="Navegação mobile">{itens.map(item=><NavLink key={item.caminho} to={item.caminho}><span className="mobile-navigation__indicator"><span className={`mobile-navigation__icon mobile-navigation__icon--${item.icone}`} aria-hidden="true"/></span><span>{item.rotulo}</span></NavLink>)}</nav>
}
