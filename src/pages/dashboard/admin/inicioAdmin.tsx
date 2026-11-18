import { Link } from 'react-router-dom'

import { EstadoVazio } from '../../../componentes/moleculas/estadoVazio'

const modulos = [
  { titulo: 'Questionários', caminho: '/dashboard/admin/questionarios' },
  { titulo: 'Usuários autorizados', caminho: '/dashboard/admin/usuarios' },
  { titulo: 'Auditoria', caminho: '/dashboard/admin/auditoria' },
]

export function InicioAdmin() {
  return (
    <section className="admin-page">
      <header className="admin-page__header">
        <p className="admin-page__eyebrow">Administração</p>
        <h1>Painel administrativo</h1>
        <p>Escolha o módulo administrativo que deseja consultar.</p>
      </header>

      <div className="admin-page__grid">
        {modulos.map((modulo) => (
          <article className="admin-card" key={modulo.caminho}>
            <h2>{modulo.titulo}</h2>
            <EstadoVazio titulo="Em breve" />
            <Link
              aria-label={`Abrir ${modulo.titulo}`}
              className="button button--subtle"
              to={modulo.caminho}
            >
              Abrir
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
