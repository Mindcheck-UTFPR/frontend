import { NavLink } from 'react-router-dom'

const MobileNavigation = () => {
  return (
    <nav className="mobile-navigation" aria-label="Navegação mobile">
      <NavLink to="/home">Início</NavLink>
      <NavLink to="/check-in">Check-in</NavLink>
      <NavLink to="/questionnaires">Questionários</NavLink>
      <NavLink to="/history">Histórico</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/profile">Perfil</NavLink>
    </nav>
  )
}

export default MobileNavigation