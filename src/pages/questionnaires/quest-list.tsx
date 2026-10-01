import { Link } from 'react-router-dom'

const QuestList = () => {
  return (
    <section>
      <h1>Questionários</h1>

      <Link to="/questionnaires/1/instructions">
        Iniciar questionário de exemplo
      </Link>
    </section>
  )
}

export default QuestList