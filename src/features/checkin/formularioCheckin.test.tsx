import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, expect, it, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { FormularioCheckin } from './formularioCheckin'
import type { CheckinSalvo, ServicoCheckin } from './servicoCheckin'
afterEach(cleanup)
const salvo: CheckinSalvo = { id: 'c1', data: '2026-11-11', humor: 'bom', sonoHoras: 7.5, estudou: true, atividadeFisica: null, observacoes: 'Nota de teste', podeEditar: true }
function abrir(servico?: ServicoCheckin) { render(<MemoryRouter><FormularioCheckin servico={servico}/></MemoryRouter>) }
it('não mostra sucesso quando a integração não está disponível', async () => {
  abrir()
  expect(await screen.findByRole('alert')).toHaveTextContent('Nenhuma informação foi enviada')
  fireEvent.click(screen.getByLabelText('Bem', { exact: true }))
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
  expect(await screen.findByRole('alert')).toHaveTextContent('Nenhuma informação foi enviada')
  expect(screen.queryByText('Check-in registrado!')).not.toBeInTheDocument()
})
it('valida o humor e as horas antes de enviar', async () => {
  const salvar = vi.fn()
  abrir({ buscarHoje: async () => null, salvar })
  await screen.findByRole('button', { name: 'Confirmar' })
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
  expect(screen.getByText('Escolha como você está se sentindo.')).toBeInTheDocument()
  fireEvent.click(screen.getByLabelText('Bem', { exact: true }))
  fireEvent.change(screen.getByLabelText(/Quantas horas/), { target: { value: '25' } })
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
  expect(screen.getByText('Informe entre 0 e 24 horas.')).toBeInTheDocument()
  expect(salvar).not.toHaveBeenCalled()
})
it('envia opcionais vazios como null e impede envio duplicado', async () => {
  let resolver!: (v: CheckinSalvo) => void
  const salvar = vi.fn(() => new Promise<CheckinSalvo>(r => { resolver = r }))
  abrir({ buscarHoje: async () => null, salvar })
  await screen.findByRole('button', { name: 'Confirmar' })
  fireEvent.click(screen.getByLabelText('Regular', { exact: true }))
  const botao = screen.getByRole('button', { name: 'Confirmar' })
  fireEvent.click(botao); fireEvent.click(botao)
  expect(salvar).toHaveBeenCalledTimes(1)
  expect(salvar.mock.calls[0]).toEqual(expect.arrayContaining([expect.objectContaining({ humor: 'neutro', sonoHoras: null, estudou: null, atividadeFisica: null })]))
  resolver(salvo)
  expect(await screen.findByText('Check-in registrado!')).toBeInTheDocument()
})
it('edita o registro retornado pelo servidor e conserva as respostas em falha', async () => {
  const salvar = vi.fn().mockRejectedValue(new Error('Não foi possível salvar.'))
  abrir({ buscarHoje: async () => salvo, salvar })
  fireEvent.click(await screen.findByRole('button', { name: 'Editar check-in' }))
  expect(screen.getByLabelText('Bem', { exact: true })).toBeChecked()
  expect(screen.getByLabelText('Observações (opcional)')).toHaveValue('Nota de teste')
  fireEvent.click(screen.getByRole('button', { name: 'Salvar alterações' }))
  await waitFor(() => expect(salvar).toHaveBeenCalledWith(expect.objectContaining({ sonoHoras: 7.5 }), 'c1'))
  expect(await screen.findByRole('alert')).toHaveTextContent('Não foi possível salvar')
  expect(screen.getByLabelText('Observações (opcional)')).toHaveValue('Nota de teste')
})
