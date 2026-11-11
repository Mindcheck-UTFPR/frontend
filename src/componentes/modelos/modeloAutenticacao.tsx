import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
export function ModeloAutenticacao({
  title,
  description,
  children,
  backTo,
}: {
  title: string
  description?: string
  backTo?: string
  children: ReactNode
}) {
  return (
    <section className="auth-shell" aria-labelledby="auth-title">
      {backTo && <div className="auth-shell__top"><Link className="auth-shell__back" to={backTo} aria-label="Voltar">←</Link></div>}
      <h1 id="auth-title">{title}</h1>
      {description && <p className="auth-shell__description">{description}</p>}
      {children}
      <p className="auth-shell__disclaimer">
        Uma ferramenta acadêmica de autoconhecimento. Não substitui avaliação profissional nem
        fornece diagnóstico.
      </p>
    </section>
  )
}
