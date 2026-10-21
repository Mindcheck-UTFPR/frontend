import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/http'
import { Botao } from '../../componentes/atomos/botao'
import { CampoFormulario } from '../../componentes/moleculas/campoFormulario'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { ModeloAutenticacao } from '../../componentes/modelos/modeloAutenticacao'
import { sessionStore } from './session'
import { useSession } from './use-session'

export default function LoginPage() {
  const session = useSession()
  const location = useLocation()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const pending = useRef(false)
  const from = location.state?.from
  const target =
    typeof from === 'string' &&
    from.startsWith('/') &&
    !from.startsWith('//') &&
    !['/login', '/signup'].includes(from)
      ? from
      : '/home'
  if (session.status === 'authenticated') return <Navigate to={target} replace />
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()
    const senha = String(data.get('senha') || '')
    const invalid: Record<string, string> = {}
    if (!email || !form.querySelector<HTMLInputElement>('#login-email')?.validity.valid)
      invalid.email = 'Informe um e-mail válido.'
    if (!senha) invalid.senha = 'Informe a senha.'
    setFields(invalid)
    setError('')
    if (Object.keys(invalid).length) {
      form.querySelector<HTMLInputElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus()
      return
    }
    pending.current = true
    setBusy(true)
    try {
      await sessionStore.login(email, senha)
      navigate(target, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.')
      if (cause instanceof ApiError) setFields(cause.fields)
    } finally {
      pending.current = false
      setBusy(false)
    }
  }
  return (
    <ModeloAutenticacao title="Entre na sua conta" description="Acesse seu espaço no MindCheck.">
      {location.state?.created && (
        <p role="status" className="success-notice">
          Cadastro realizado. Entre com seu e-mail e senha.
        </p>
      )}
      {session.message && <p role="status">{session.message}</p>}
      <form onSubmit={submit} noValidate aria-busy={busy}>
        <AvisoErro message={error} />
        <fieldset disabled={busy}>
          <CampoFormulario
            id="login-email"
            name="email"
            label="E-mail"
            type="email"
            autoComplete="username"
            required
            maxLength={255}
            error={fields.email}
          />
          <CampoFormulario
            id="login-senha"
            name="senha"
            label="Senha"
            type="password"
            autoComplete="current-password"
            required
            maxLength={128}
            error={fields.senha}
          />
          <Botao type="submit">{busy ? 'Entrando…' : 'Entrar'}</Botao>
        </fieldset>
        <p className="auth-shell__links">
          Não tem uma conta? <Link to="/signup">Cadastre-se</Link>
        </p>
        <p className="auth-shell__help">Recuperação de senha ainda não disponível nesta versão.</p>
      </form>
    </ModeloAutenticacao>
  )
}
