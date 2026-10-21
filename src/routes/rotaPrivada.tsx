import { Navigate, Outlet } from 'react-router-dom'

const RotaPrivada = () => {
  const estaAutenticado = Boolean(localStorage.getItem('token'))

  return estaAutenticado ? <Outlet /> : <Navigate to="/login" replace />
}
export { RotaPrivada }
