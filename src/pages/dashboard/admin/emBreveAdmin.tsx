import { EstadoVazio } from '../../../componentes/moleculas/estadoVazio'

type EmBreveAdminProps = {
  titulo: string
}

export function EmBreveAdmin({ titulo }: EmBreveAdminProps) {
  return (
    <EstadoVazio
      titulo={titulo}
      mensagem="Em breve"
    />
  )
}
