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
const indisponivel = async (): Promise<never> => {
  throw new Error('O registro de check-in ainda não está disponível. Nenhuma informação foi enviada.')
}
// Substituir apenas este adaptador quando MIND-23/60 definirem o contrato autenticado.
export const servicoCheckin: ServicoCheckin = { buscarHoje: indisponivel, salvar: indisponivel }
export function dataLocalHoje() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
