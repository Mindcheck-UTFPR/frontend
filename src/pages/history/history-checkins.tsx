import { Link } from 'react-router-dom'

const HistoryCheckIns = () => {
  return (
    <section>
      <h1>Histórico de check-ins</h1>

      <Link to="/history/check-ins/1">
        Ver check-in de exemplo
      </Link>
    </section>
  )
}

export default HistoryCheckIns