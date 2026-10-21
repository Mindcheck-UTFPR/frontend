import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { expect, it } from 'vitest'
import { ResultadoQuestionario } from './resultadoQuestionario'

it('não remove respostas só por abrir a URL de resultado', () => {
  const key = 'mindcheck:questionnaire:7:draft'
  sessionStorage.setItem(key, JSON.stringify({ q1: 3 }))
  render(
    <MemoryRouter initialEntries={['/questionnaires/7/result']}>
      <Routes>
        <Route path="/questionnaires/:questionnaireId/result" element={<ResultadoQuestionario />} />
      </Routes>
    </MemoryRouter>,
  )
  expect(screen.getByText(/Seu rascunho foi preservado/)).toBeInTheDocument()
  expect(sessionStorage.getItem(key)).toBe(JSON.stringify({ q1: 3 }))
  sessionStorage.removeItem(key)
})
