import { EntradaSuave } from './experiencia'
import { Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

import { Cabecalho } from '../organismos/cabecalho'
import { NavegacaoDesktop } from '../organismos/navegacaoDesktop'
import { NavegacaoMobile } from '../organismos/navegacaoMobile'

const LayoutPrivado = ({ acaoConta }: { acaoConta?: ReactNode }) => {
  const { pathname } = useLocation()
  return (
    <div className="private-layout"><a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
      <Cabecalho acaoConta={acaoConta} />

      <div className="private-layout__body">
        <aside className="private-layout__desktop-nav">
          <NavegacaoDesktop />
        </aside>

        <main tabIndex={-1} id="conteudo" className="private-layout__content">
          <EntradaSuave key={pathname} className="page-transition"><Outlet /></EntradaSuave>
        </main>
      </div>

      <NavegacaoMobile />
    </div>
  )
}

export { LayoutPrivado }
