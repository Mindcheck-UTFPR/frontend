import type { ReactNode } from 'react'
export function ModeloAutenticacao({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <section className="auth-shell" aria-labelledby="auth-title">
      <p className="auth-shell__brand">MindCheck</p>
      <h1 id="auth-title">{title}</h1>
      <p className="auth-shell__description">{description}</p>
      {children}
      <p className="auth-shell__disclaimer">
        Uma ferramenta acadêmica de autoconhecimento. Não substitui avaliação profissional nem
        fornece diagnóstico.
      </p>
    </section>
  )
}
