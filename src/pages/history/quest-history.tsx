import { Link } from 'react-router-dom'

const QuestHistory = () => {
  return (
    <section>
      <h1>Histórico de questionários</h1>

      <Link to="/history/questionnaires/1">
        Ver questionário de exemplo
      </Link>
    </section>
  )
}

export default QuestHistory