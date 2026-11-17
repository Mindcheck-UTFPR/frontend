export const rotulosHumor = { muito_baixo: 'Muito mal', baixo: 'Mal', neutro: 'Regular', bom: 'Bem', muito_bom: 'Muito bem' } as const
export type RegistroCheckin = {
  id: string; data: string; humor: keyof typeof rotulosHumor
  sonoHoras: number | null; estudou: boolean | null; atividadeFisica: boolean | null
  observacoes: string; podeEditar: boolean
}
export type FiltrosCheckin = { inicio: string; fim: string; humor: string; pagina: number }
export interface ServicoHistorico {
  listar(filtros: FiltrosCheckin): Promise<{ registros: RegistroCheckin[]; temProxima: boolean }>
  detalhar(id: string): Promise<RegistroCheckin>
}
export const servicoHistorico: ServicoHistorico = {
  async listar(filtros) {
    const params = new URLSearchParams({ pagina: String(filtros.pagina), limite: '10' })
    if (filtros.inicio) params.set('dataInicio', filtros.inicio)
    if (filtros.fim) params.set('dataFim', filtros.fim)
    if (filtros.humor) params.set('humor', filtros.humor)
    const resposta = await sessionStore.request<{ checkins: CheckinApi[]; temProxima: boolean }>(`/checkins?${params}`)
    return { registros: resposta.checkins.map(converterCheckin), temProxima: resposta.temProxima }
  },
  async detalhar(id) {
    const resposta = await sessionStore.request<{ checkin: CheckinApi }>(`/checkins/${encodeURIComponent(id)}`)
    return converterCheckin(resposta.checkin)
  },
}
import { sessionStore } from '../auth/session'
import { converterCheckin, type CheckinApi } from '../checkin/servicoCheckin'
