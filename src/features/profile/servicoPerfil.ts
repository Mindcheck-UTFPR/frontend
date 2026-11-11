export type DadosPerfil = { nome: string; email: string }
export interface ServicoPerfil {
  salvar(dados: DadosPerfil): Promise<DadosPerfil>
  alterarSenha(dados: { senhaAtual: string; novaSenha: string }): Promise<void>
}
const indisponivel = async (): Promise<never> => { throw new Error('Essa alteração ainda não está disponível. Nenhuma mudança foi salva.') }
export const servicoPerfil: ServicoPerfil = { salvar: indisponivel, alterarSenha: indisponivel }
