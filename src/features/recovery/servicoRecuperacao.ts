export interface ServicoRecuperacao {
  solicitar(email: string): Promise<{ tentarNovamenteEm: number }>
  redefinir(dados: { token: string; senha: string }): Promise<void>
}
export class ErroRecuperacao extends Error {
  constructor(readonly motivo: 'indisponivel' | 'link_invalido' | 'limite', readonly segundos = 0) {
    super(motivo)
  }
}
const indisponivel = async (): Promise<never> => { throw new ErroRecuperacao('indisponivel') }
export const servicoRecuperacao: ServicoRecuperacao = { solicitar: indisponivel, redefinir: indisponivel }
