import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { LayoutPrivado } from '../../../componentes/modelos/layoutPrivado'
import { RotaPrivada } from '../../../routes/rotaPrivada'
import { AuditoriaAdmin } from './auditoriaAdmin'
import { InicioAdmin } from './inicioAdmin'
import { QuestionariosAdmin } from './questionariosAdmin'
import { UsuariosAdmin } from './usuariosAdmin'

let estadoSessao: {
  status: 'loading' | 'anonymous' | 'authenticated' | 'error'
  user: { id: number; nome: string; email: string } | null
  message: string
} = {
  status: 'authenticated',
  user: { id: 1, nome: 'Conta Teste', email: 'teste@example.test' },
  message: '',
}

vi.mock('../../../features/auth/use-session', () => ({
  useSession: () => estadoSessao,
}))

afterEach(() => {
  cleanup()
})

function renderPrivado(caminho: string) {
  return render(
    <MemoryRouter initialEntries={[caminho]}>
      <Routes>
        <Route element={<RotaPrivada />}>
          <Route element={<LayoutPrivado acaoConta={null} />}>
            <Route path="/dashboard/admin" element={<InicioAdmin />} />
            <Route path="/dashboard/admin/questionarios" element={<QuestionariosAdmin />} />
            <Route path="/dashboard/admin/usuarios" element={<UsuariosAdmin />} />
            <Route path="/dashboard/admin/auditoria" element={<AuditoriaAdmin />} />
          </Route>
        </Route>
        <Route path="/login" element={<h1>Entre ou cadastre-se</h1>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('Páginas administrativas MIND-82', () => {
  it('usuário autenticado acessa /dashboard/admin', () => {
    estadoSessao = {
      status: 'authenticated',
      user: { id: 1, nome: 'Conta Teste', email: 'teste@example.test' },
      message: '',
    }

    renderPrivado('/dashboard/admin')

    expect(screen.getByRole('heading', { name: 'Painel administrativo' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Questionários' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Usuários autorizados' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Auditoria' })).toBeInTheDocument()
    expect(screen.getAllByText('Em breve')).toHaveLength(3)
  })

  it('usuário não autenticado é redirecionado', () => {
    estadoSessao = { status: 'anonymous', user: null, message: '' }

    renderPrivado('/dashboard/admin')

    expect(screen.getByRole('heading', { name: 'Entre ou cadastre-se' })).toBeInTheDocument()
  })

  it('sessão em carregamento é tratada', () => {
    estadoSessao = { status: 'loading', user: null, message: '' }

    renderPrivado('/dashboard/admin')

    expect(screen.getByRole('status')).toHaveTextContent('Verificando sua sessão')
  })

  it.each([
    ['/dashboard/admin/questionarios', 'Questionários'],
    ['/dashboard/admin/usuarios', 'Usuários autorizados'],
    ['/dashboard/admin/auditoria', 'Auditoria'],
  ] as const)('renderiza o placeholder em %s', (caminho, titulo) => {
    estadoSessao = {
      status: 'authenticated',
      user: { id: 1, nome: 'Conta Teste', email: 'teste@example.test' },
      message: '',
    }

    renderPrivado(caminho)

    expect(screen.getByRole('heading', { name: titulo })).toBeInTheDocument()
    expect(screen.getByText('Em breve')).toBeInTheDocument()
  })
})
