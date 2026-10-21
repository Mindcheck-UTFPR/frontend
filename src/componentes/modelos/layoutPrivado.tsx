import { Outlet } from 'react-router-dom'

import { Cabecalho } from '../organismos/cabecalho'
import { NavegacaoDesktop } from '../organismos/navegacaoDesktop'
import { NavegacaoMobile } from '../organismos/navegacaoMobile'

const LayoutPrivado = () => {
  return (
    <div className="private-layout">
      <Cabecalho />

      <div className="private-layout__body">
        <aside className="private-layout__desktop-nav">
          <NavegacaoDesktop />
        </aside>

        <main className="private-layout__content">
          <Outlet />
        </main>
      </div>

      <NavegacaoMobile />
    </div>
  )
}

export { LayoutPrivado }
