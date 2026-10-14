import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ApiError, http, jsonBody } from '../../shared/api/http'
import { Button } from '../../shared/ui/atoms/button'
import { FormField } from '../../shared/ui/molecules/form-field'
import { ErrorNotice } from '../../shared/ui/molecules/error-notice'
import { AuthShell } from '../../shared/ui/templates/auth-shell'
import { useSession } from './use-session'

type Config = { termosVersao: string; termosUrl: string | null }
export default function SignupPage() {
  const session = useSession()
  const navigate = useNavigate()
  const [config, setConfig] = useState<Config | null>(null)
  const [configError, setConfigError] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [fields, setFields] = useState<Record<string, string>>({})
  const pending = useRef(false)
  useEffect(() => {
    let active = true
    http<Config>('/auth/config').then(value => {
      if (!active) return
      if (!value.termosVersao || (value.termosUrl && !value.termosUrl.startsWith('https://'))) throw new Error('Configuração de cadastro inválida.')
      setConfig(value); setConfigError('')
    }).catch(cause => { if (active) setConfigError(cause.message) })
    return () => { active = false }
  }, [attempt])
  if (session.status === 'authenticated') return <Navigate to="/home" replace />
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending.current || !config?.termosUrl) return
    const form = event.currentTarget
    const data = new FormData(form)
    const nome = String(data.get('nome') || '').trim()
    const email = String(data.get('email') || '').trim()
    const senha = String(data.get('senha') || '')
    const confirmacao = String(data.get('confirmacao') || '')
    const termosAceitos = data.get('termosAceitos') === 'on'
    const invalid: Record<string, string> = {}
    if (nome.length < 2 || nome.length > 120) invalid.nome = 'Informe um nome entre 2 e 120 caracteres.'
    if (!email || !form.querySelector<HTMLInputElement>('#cadastro-email')?.validity.valid) invalid.email = 'Informe um e-mail válido.'
    if (senha.length < 8 || senha.length > 128) invalid.senha = 'Use entre 8 e 128 caracteres.'
    if (senha !== confirmacao || !confirmacao) invalid.confirmacao = 'As senhas precisam ser iguais.'
    if (!termosAceitos) invalid.termosAceitos = 'Leia e aceite os termos para continuar.'
    setFields(invalid); setError('')
    if (Object.keys(invalid).length) { form.querySelector<HTMLInputElement>(`[name="${Object.keys(invalid)[0]}"]`)?.focus(); return }
    pending.current = true; setBusy(true)
    try {
      await http('/auth/cadastro', jsonBody({ nome, email, senha, termosAceitos, termosVersao: config.termosVersao }))
      form.reset()
      navigate('/login', { replace: true, state: { created: true } })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível cadastrar.')
      if (cause instanceof ApiError) setFields(cause.status === 409 ? { email: cause.message } : cause.fields)
    } finally { pending.current = false; setBusy(false) }
  }
  return <AuthShell title="Faça seu cadastro" description="Crie sua conta para começar.">
    <form onSubmit={submit} noValidate aria-busy={busy}>
      <ErrorNotice message={error || configError} />
      {configError && <Button type="button" className="button--subtle" onClick={() => { setConfig(null); setConfigError(''); setAttempt(attempt + 1) }}>Tentar carregar novamente</Button>}
      {!config && !configError && <p role="status">Carregando informações do cadastro…</p>}
      {config && !config.termosUrl && <p role="status">Cadastro indisponível: os termos de uso e privacidade ainda não foram publicados.</p>}
      <fieldset disabled={busy}>
        <FormField id="cadastro-nome" name="nome" label="Nome" autoComplete="name" required maxLength={120} error={fields.nome} />
        <FormField id="cadastro-email" name="email" label="E-mail" type="email" autoComplete="email" required maxLength={255} error={fields.email} />
        <FormField id="cadastro-senha" name="senha" label="Senha" type="password" autoComplete="new-password" required minLength={8} maxLength={128} hint="Use entre 8 e 128 caracteres." error={fields.senha} />
        <FormField id="cadastro-confirmacao" name="confirmacao" label="Confirme a senha" type="password" autoComplete="new-password" required maxLength={128} error={fields.confirmacao} />
        {config?.termosUrl && <div className="terms-field">
          <label><input type="checkbox" name="termosAceitos" required aria-invalid={Boolean(fields.termosAceitos)} aria-describedby={fields.termosAceitos ? 'termos-error' : undefined} />
            <span>Li e aceito os <a href={config.termosUrl} target="_blank" rel="noopener noreferrer">termos de uso e privacidade</a> (versão {config.termosVersao}).</span></label>
          {fields.termosAceitos && <small className="field-error" id="termos-error">{fields.termosAceitos}</small>}
        </div>}
        <Button type="submit" disabled={!config?.termosUrl}>{busy ? 'Criando conta…' : 'Criar conta'}</Button>
      </fieldset>
      <p className="auth-shell__links">Já tem uma conta? <Link to="/login">Entrar</Link></p>
    </form>
  </AuthShell>
}
