import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { HistoricoCheckinsPagina, DetalheCheckinPagina } from './historicoCheckins'
import type { RegistroCheckin, ServicoHistorico } from './servicoHistorico'

afterEach(cleanup)
const registro: RegistroCheckin = { id:'1', data:'2026-11-10', humor:'bom', sonoHoras:null, estudou:null, atividadeFisica:false, observacoes:'', podeEditar:false }
function abrir(servico?: ServicoHistorico, rota = '/history/check-ins') {
  render(<MemoryRouter initialEntries={[rota]}><Routes><Route path="/history/check-ins" element={<HistoricoCheckinsPagina servico={servico}/>}/><Route path="/history/check-ins/:checkInId" element={<DetalheCheckinPagina servico={servico}/>}/></Routes></MemoryRouter>)
}
it('mostra falha de serviço sem inventar uma lista vazia', async () => {
  abrir()
  expect(await screen.findByRole('alert')).toHaveTextContent('ainda não está disponível')
  expect(screen.queryByText('Você ainda não tem check-ins')).not.toBeInTheDocument()
})
it('recusa período invertido recebido pela URL antes de consultar o serviço', () => {
  const listar=vi.fn()
  abrir({listar,detalhar:vi.fn()},'/history/check-ins?inicio=2026-11-11&fim=2026-11-01')
  expect(screen.getByRole('alert')).toHaveTextContent('data inicial')
  expect(listar).not.toHaveBeenCalled()
})
it('mantém período ao abrir/voltar do detalhe e ao trocar página', async () => {
  const listar = vi.fn().mockResolvedValue({ registros:[registro], temProxima:true })
  abrir({ listar, detalhar:async()=>registro },'/history/check-ins?inicio=2026-11-01&fim=2026-11-10')
  fireEvent.click(await screen.findByRole('link', { name:'Detalhes de 10/11/2026' }))
  await screen.findByRole('heading', { name:'Check-in diário' })
  expect(screen.getAllByText('Não informado')).toHaveLength(2)
  expect(screen.queryByRole('link', {name:'Editar check-in de hoje'})).not.toBeInTheDocument()
  fireEvent.click(screen.getByRole('link', {name:'← Voltar'}))
  await screen.findByRole('link', { name:'Detalhes de 10/11/2026' })
  expect(screen.getByRole('button',{name:'Selecionar data: De'})).toHaveAccessibleDescription('01/11/2026')
  fireEvent.click(screen.getByRole('button', {name:'Próxima'}))
  await waitFor(() => expect(listar).toHaveBeenLastCalledWith(expect.objectContaining({inicio:'2026-11-01',fim:'2026-11-10',pagina:2})))
})
it('distingue ausência de registros em um filtro', async () => {
  abrir({ listar:async () => ({registros:[],temProxima:false}), detalhar:vi.fn() }, '/history/check-ins?humor=bom')
  expect(await screen.findByRole('heading', {name:'Nenhum registro nesse período'})).toBeInTheDocument()
  expect(screen.getByRole('button', {name:'Próxima'})).toBeDisabled()
})
