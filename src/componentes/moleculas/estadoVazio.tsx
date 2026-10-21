type PropriedadesEstadoVazio = {
  titulo: string
  mensagem?: string
}

const EstadoVazio = ({ titulo, mensagem }: PropriedadesEstadoVazio) => {
  return (
    <section className="empty-state">
      <h2>{titulo}</h2>
      {mensagem && <p>{mensagem}</p>}
    </section>
  )
}

export { EstadoVazio }
