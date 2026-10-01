import React from 'react'
import { NavLink } from 'react-router-dom'

const DesktopNavigation = () => {
  return (
    <nav className="desktop-navigation" aria-label="Navegação principal">
      <NavLink to="/home">Início</NavLink>
      <NavLink to="/check-in">Check-in</NavLink>
      <NavLink to="/questionnaires">Questionários</NavLink>
      <NavLink to="/history">Histórico</NavLink>
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/profile">Perfil</NavLink>
    </nav>
  )
}

export default DesktopNavigation