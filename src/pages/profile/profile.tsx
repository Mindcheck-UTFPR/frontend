import React from 'react'
import { useSession } from '../../features/auth/use-session'

const Profile = () => {
  const { user } = useSession()
  return (
    <section><h1>Seu perfil</h1><p className="profile-value">{user?.nome}</p><p className="profile-value">{user?.email}</p><p>Edição de perfil em desenvolvimento.</p></section>
  )
}

export default Profile
