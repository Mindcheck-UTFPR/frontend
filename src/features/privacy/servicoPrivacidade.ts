export type PedidoPrivacidade = {
  protocolo: string
  estado: 'recebido' | 'processando' | 'pronto' | 'concluido' | 'falhou'
  prazo?: string
}
export type EstadoPrivacidade = { exportacao: PedidoPrivacidade | null; exclusao: PedidoPrivacidade | null }
export interface ServicoPrivacidade {
  consultar(): Promise<EstadoPrivacidade>
  solicitarExportacao(): Promise<PedidoPrivacidade>
  baixarExportacao(protocolo: string): Promise<Blob>
  solicitarExclusao(): Promise<PedidoPrivacidade>
}
const indisponivel = async (): Promise<never> => { throw new Error('Essa solicitação ainda não está disponível. Nenhum pedido foi enviado.') }
export const servicoPrivacidade: ServicoPrivacidade = { consultar: indisponivel, solicitarExportacao: indisponivel, baixarExportacao: indisponivel, solicitarExclusao: indisponivel }
