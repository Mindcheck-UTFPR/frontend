import { Link } from 'react-router-dom'

const ListaQuestionarios = () => {
  return (
    <section>
      <h1>Questionários</h1>

      <Link to="/questionnaires/1/instructions">Iniciar questionário de exemplo</Link>
    </section>
  )
}

export { ListaQuestionarios }
