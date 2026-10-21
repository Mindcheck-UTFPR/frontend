import { Outlet } from 'react-router-dom'
import type { ReactNode } from 'react'

import { Cabecalho } from '../organismos/cabecalho'
import { NavegacaoDesktop } from '../organismos/navegacaoDesktop'
import { NavegacaoMobile } from '../organismos/navegacaoMobile'

const LayoutPrivado = ({ acaoConta }: { acaoConta?: ReactNode }) => {
  return (
    <div className="private-layout">
      <Cabecalho acaoConta={acaoConta} />

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
