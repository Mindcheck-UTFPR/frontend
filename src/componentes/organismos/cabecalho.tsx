import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

const Cabecalho = ({ acaoConta }: { acaoConta?: ReactNode }) => {
  return (
    <header className="app-header">
      <Link to="/home" className="app-header__brand" aria-label="Ir para Tela Inicial">
        MindCheck
      </Link>

      <Link to="/profile" className="app-header__profile" aria-label="Ir para Perfil">
        Perfil
      </Link>
      {acaoConta}
    </header>
  )
}

export { Cabecalho }
