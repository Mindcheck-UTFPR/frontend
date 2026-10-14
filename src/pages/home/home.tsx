import React from 'react'
import { useSession } from '../../features/auth/use-session'

const Home = () => {
  const { user } = useSession()
  return (
    <section><h1 className="profile-value">Olá, {user?.nome}!</h1><p>Você está conectado ao MindCheck.</p><p>As jornadas de check-in, questionários e histórico ainda estão em desenvolvimento.</p></section>
  )
}

export default Home
