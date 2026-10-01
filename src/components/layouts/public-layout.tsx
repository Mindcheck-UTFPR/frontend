import React from 'react'
import { Outlet } from 'react-router-dom'

const PublicLayout = () => {
  return (
    <main className = "public-layout">
      <Outlet />
    </main>
  )
}

export default PublicLayout