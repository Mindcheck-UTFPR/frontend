import { afterEach, expect, it, vi } from 'vitest'
import { sessionStore } from '../auth/session'
import { ApiError } from '../../shared/api/http'
import { CheckinExistente, servicoCheckin } from './servicoCheckin'
import { servicoHistorico } from '../history/servicoHistorico'

const registro = { id: '42', data: '2026-11-17', humor: 'bom' as const, sonoHoras: 7.5,
  estudou: true, atividadeFisica: null, observacao: null, podeEditar: true }

afterEach(() => vi.restoreAllMocks())

it('consulta o dia da API e converte observação ausente', async () => {
  const chamada = vi.spyOn(sessionStore, 'request').mockResolvedValue({ checkin: registro })
  expect(await servicoCheckin.buscarHoje()).toMatchObject({ id: '42', observacoes: '' })
  expect(chamada).toHaveBeenCalledWith('/checkins/hoje')
})

it('cria sem enviar data do dispositivo e edita pela data recebida', async () => {
  const chamada = vi.spyOn(sessionStore, 'request').mockResolvedValue({ checkin: registro })
  const dados = { ...registro, observacoes: 'Anotação' }
  await servicoCheckin.salvar(dados)
  expect(chamada).toHaveBeenLastCalledWith('/checkins', expect.objectContaining({ method: 'POST' }))
  const corpo = JSON.parse((chamada.mock.calls[0][1] as RequestInit).body as string)
  expect(corpo).not.toHaveProperty('data')
  expect(corpo.observacao).toBe('Anotação')
  await servicoCheckin.salvar(dados, '42')
  expect(chamada).toHaveBeenLastCalledWith('/checkins/2026-11-17', expect.objectContaining({ method: 'PATCH' }))
})

it('recupera o registro existente quando a criação entra em conflito', async () => {
  vi.spyOn(sessionStore, 'request')
    .mockRejectedValueOnce(new ApiError(409, 'CHECKIN_JA_EXISTE', 'Já existe'))
    .mockResolvedValueOnce({ checkin: registro })
  await expect(servicoCheckin.salvar({ ...registro, observacoes: '' })).rejects.toBeInstanceOf(CheckinExistente)
})

it('envia filtros e página para o histórico e consulta o detalhe real', async () => {
  const chamada = vi.spyOn(sessionStore, 'request')
    .mockResolvedValueOnce({ checkins: [registro], temProxima: true })
    .mockResolvedValueOnce({ checkin: registro })
  const lista = await servicoHistorico.listar({ inicio: '2026-11-01', fim: '', humor: 'bom', pagina: 2 })
  expect(chamada.mock.calls[0][0]).toContain('pagina=2')
  expect(chamada.mock.calls[0][0]).toContain('humor=bom')
  expect(lista).toMatchObject({ registros: [{ id: '42', observacoes: '' }], temProxima: true })
  expect(await servicoHistorico.detalhar('42')).toMatchObject({ id: '42' })
  expect(chamada).toHaveBeenLastCalledWith('/checkins/42')
})
