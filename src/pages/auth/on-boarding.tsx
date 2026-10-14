import React from 'react'
import { Link } from 'react-router-dom'
import { AuthShell } from '../../shared/ui/templates/auth-shell'

const Onboarding = () => {
  return (
    <AuthShell title="Bem-vindo ao MindCheck!" description="Um espaço para acompanhar seu bem-estar.">
      <p>Cadastre-se ou entre para acessar sua conta.</p>
      <p className="auth-shell__links"><Link className="button" to="/login">Entrar</Link> <Link to="/signup">Criar conta</Link></p>
    </AuthShell>
  )
}

export default Onboarding
