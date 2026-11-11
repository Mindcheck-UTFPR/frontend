import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Experiencia } from './componentes/modelos/experiencia'
import { App } from './App'
import './styles.css'
import './styles/altaFidelidade.css'
import './styles/experiencia.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Experiencia><App /></Experiencia>
  </StrictMode>,
)
