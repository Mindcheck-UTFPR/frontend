import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { BotaoVoltar } from './botaoVoltar'
import { estadoNavegacaoInterna } from '../../routes/estadoNavegacao'

function CaminhoAtual() {
  const localizacao = useLocation()

  return <div>{localizacao.pathname}</div>
}

describe('BackButton', () => {
  it('falls back to the provided path when opened directly', async () => {
    render(
      <MemoryRouter initialEntries={['/history/questionnaires/123']}>
        <Routes>
          <Route
            path="/history/questionnaires/:questionnaireId"
            element={<BotaoVoltar caminhoRetorno="/history/questionnaires" />}
          />
          <Route path="/history/questionnaires" element={<CaminhoAtual />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(screen.getByText('/history/questionnaires')).toBeInTheDocument()
  })

  it('goes back when the route was reached internally', async () => {
    render(
      <MemoryRouter
        initialEntries={[
          '/history/check-ins',
          {
            pathname: '/history/check-ins/123',
            state: estadoNavegacaoInterna,
          },
        ]}
        initialIndex={1}
      >
        <Routes>
          <Route
            path="/history/check-ins/:checkInId"
            element={<BotaoVoltar caminhoRetorno="/history/check-ins" />}
          />
          <Route path="/history/check-ins" element={<CaminhoAtual />} />
        </Routes>
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Voltar' }))

    expect(screen.getByText('/history/check-ins')).toBeInTheDocument()
  })
})
