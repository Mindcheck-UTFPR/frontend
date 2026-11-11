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
const indisponivel = async (): Promise<never> => { throw new Error('Seu histórico ainda não está disponível. Tente novamente mais tarde.') }
export const servicoHistorico: ServicoHistorico = { listar: indisponivel, detalhar: indisponivel }
