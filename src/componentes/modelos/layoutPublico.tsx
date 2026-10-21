import { Outlet } from 'react-router-dom'

const LayoutPublico = () => {
  return (
    <main className="public-layout">
      <Outlet />
    </main>
  )
}

export { LayoutPublico }
