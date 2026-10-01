import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <section>
      <h1>Dashboard</h1>

      <Link to="/dashboard/results/1">
        Ver resultado detalhado de exemplo
      </Link>
    </section>
  )
}

export default Dashboard