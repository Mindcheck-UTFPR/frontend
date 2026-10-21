type PropriedadesEstadoCarregamento = {
  mensagem?: string
}

const EstadoCarregamento = ({ mensagem = 'Carregando...' }: PropriedadesEstadoCarregamento) => {
  return (
    <section aria-live="polite" role="status">
      <p>{mensagem}</p>
    </section>
  )
}

export { EstadoCarregamento }
