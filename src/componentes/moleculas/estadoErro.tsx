type PropriedadesEstadoErro = {
  titulo?: string
  mensagem?: string
  tentarNovamente?: () => void
}

const EstadoErro = ({
  titulo = 'Não foi possível carregar os dados',
  mensagem = 'Tente novamente em alguns instantes.',
  tentarNovamente,
}: PropriedadesEstadoErro) => {
  return (
    <section role="alert">
      <h2>{titulo}</h2>
      <p>{mensagem}</p>

      {tentarNovamente && (
        <button type="button" onClick={tentarNovamente}>
          Tentar novamente
        </button>
      )}
    </section>
  )
}

export { EstadoErro }
