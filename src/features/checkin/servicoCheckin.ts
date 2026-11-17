export const humores = [
  { valor: 'muito_baixo', rotulo: 'Muito mal', imagem: 'muito-mal' },
  { valor: 'baixo', rotulo: 'Mal', imagem: 'mal' },
  { valor: 'neutro', rotulo: 'Regular', imagem: 'regular' },
  { valor: 'bom', rotulo: 'Bem', imagem: 'bem' },
  { valor: 'muito_bom', rotulo: 'Muito bem', imagem: 'muito-bem' },
] as const

export type Humor = typeof humores[number]['valor']
export type DadosCheckin = {
  data: string
  humor: Humor
  sonoHoras: number | null
  estudou: boolean | null
  atividadeFisica: boolean | null
  observacoes: string
}
export type CheckinSalvo = DadosCheckin & { id: string; podeEditar: boolean }
export interface ServicoCheckin {
  buscarHoje(): Promise<CheckinSalvo | null>
  salvar(dados: DadosCheckin, id?: string): Promise<CheckinSalvo>
}
export type CheckinApi = Omit<CheckinSalvo, 'observacoes'> & { observacao: string | null }

export function converterCheckin(checkin: CheckinApi): CheckinSalvo {
  return { ...checkin, observacoes: checkin.observacao ?? '' }
}

export class CheckinExistente extends Error {
  constructor(readonly registro: CheckinSalvo) {
    super('Você já registrou um check-in hoje. Confira o registro antes de editar.')
  }
}

export const servicoCheckin: ServicoCheckin = {
  async buscarHoje() {
    const resposta = await sessionStore.request<{ checkin: CheckinApi | null }>('/checkins/hoje')
    return resposta.checkin ? converterCheckin(resposta.checkin) : null
  },
  async salvar(dados, id) {
    const corpo = { humor: dados.humor, sonoHoras: dados.sonoHoras, estudou: dados.estudou,
      atividadeFisica: dados.atividadeFisica, observacao: dados.observacoes || null }
    try {
      const resposta = await sessionStore.request<{ checkin: CheckinApi }>(
        id ? `/checkins/${encodeURIComponent(dados.data)}` : '/checkins',
        { method: id ? 'PATCH' : 'POST', body: JSON.stringify(corpo) },
      )
      return converterCheckin(resposta.checkin)
    } catch (erro) {
      if (erro instanceof ApiError && erro.status === 409 && erro.code === 'CHECKIN_JA_EXISTE') {
        const registro = await this.buscarHoje()
        if (registro) throw new CheckinExistente(registro)
      }
      throw erro
    }
  },
}
export function dataLocalHoje() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
import { sessionStore } from '../auth/session'
import { ApiError } from '../../shared/api/http'
