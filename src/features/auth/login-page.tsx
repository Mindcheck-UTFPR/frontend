import { useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ApiError } from '../../shared/api/http'
import { Button } from '../../shared/ui/atoms/button'
import { FormField } from '../../shared/ui/molecules/form-field'
import { ErrorNotice } from '../../shared/ui/molecules/error-notice'
import { AuthShell } from '../../shared/ui/templates/auth-shell'
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
  const target = typeof from === 'string' && from.startsWith('/') && !from.startsWith('//') && !['/login', '/signup'].includes(from) ? from : '/home'
  if (session.status === 'authenticated') return <Navigate to={target} replace />
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current) return
    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim()
    const senha = String(data.get('senha') || '')
    const invalid: Record<string, string> = {}
    if (!email || !form.querySelector<HTMLInputElement>('#login-email')?.validity.valid) invalid.email = 'Informe um e-mail válido.'
    if (!senha) invalid.senha = 'Informe a senha.'
    setFields(invalid); setError('')
    if (Object.keys(invalid).length) { form.querySelector<HTMLInputElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus(); return }
    pending.current = true; setBusy(true)
    try {
      await sessionStore.login(email, senha)
      navigate(target, { replace: true })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível entrar.')
      if (cause instanceof ApiError) setFields(cause.fields)
    } finally { pending.current = false; setBusy(false) }
  }
  return <AuthShell title="Entre na sua conta" description="Acesse seu espaço no MindCheck.">
    {location.state?.created && <p role="status" className="success-notice">Cadastro realizado. Entre com seu e-mail e senha.</p>}
    {session.message && <p role="status">{session.message}</p>}
    <form onSubmit={submit} noValidate aria-busy={busy}>
      <ErrorNotice message={error} />
      <fieldset disabled={busy}>
        <FormField id="login-email" name="email" label="E-mail" type="email" autoComplete="username" required maxLength={255} error={fields.email} />
        <FormField id="login-senha" name="senha" label="Senha" type="password" autoComplete="current-password" required maxLength={128} error={fields.senha} />
        <Button type="submit">{busy ? 'Entrando…' : 'Entrar'}</Button>
      </fieldset>
      <p className="auth-shell__links">Não tem uma conta? <Link to="/signup">Cadastre-se</Link></p>
      <p className="auth-shell__help">Recuperação de senha ainda não disponível nesta versão.</p>
    </form>
  </AuthShell>
}
