export type Pergunta = {
  id: string; texto: string; tipo: 'escala' | 'polar' | 'escolha_unica' | 'aberta'
  obrigatoria: boolean; limiteCaracteres?: number
  opcoes: { id: string; texto: string }[]
}
export type Respostas = Record<string, string>
export type Execucao = { id: string; avaliacaoId: string; versaoId: string; nome: string; perguntas: Pergunta[]; respostas: Respostas }
export type EnvioRespostas = { avaliacaoId: string; versaoId: string; respostas: Respostas }
export interface ServicoExecucao {
  carregar(id: string): Promise<Execucao>
  salvarRascunho(dados: EnvioRespostas): Promise<void>
  concluir(dados: EnvioRespostas): Promise<{ resultadoId: string }>
}
const indisponivel = async (): Promise<never> => { throw new Error('Este questionário ainda não está disponível. Tente novamente mais tarde.') }
export const servicoExecucao: ServicoExecucao = { carregar: indisponivel, salvarRascunho: indisponivel, concluir: indisponivel }
export function respostaValida(p: Pergunta, valor?: string) {
  if (!valor?.trim()) return false
  return p.tipo === 'aberta' ? (!p.limiteCaracteres || valor.length <= p.limiteCaracteres) : p.opcoes.some(o => o.id === valor)
}
