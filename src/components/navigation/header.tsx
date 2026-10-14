import React from 'react'
import { Link } from 'react-router-dom'
import { LogoutButton } from '../../features/auth/logout-button'

const Header = () => {
  return (
    <header className="app-header">
        <Link to = "/home" className = "app-header__brand" aria-label='Ir para Tela Inicial'> 
            MindCheck
        </Link>

        <Link to = "/profile" className = "app-header__profile" aria-label='Ir para Perfil'>
            Perfil
        </Link>
        <LogoutButton />
    </header>
  )
}

export default Header
