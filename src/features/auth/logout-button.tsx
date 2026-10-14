import { useState } from 'react'
import { Button } from '../../shared/ui/atoms/button'
import { ErrorNotice } from '../../shared/ui/molecules/error-notice'
import { sessionStore } from './session'
export function LogoutButton() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const logout = async () => {
    if (busy) return
    setBusy(true); setError('')
    try { await sessionStore.logout() }
    catch { setError('Não foi possível confirmar a saída no servidor. Tente novamente ou remova apenas a sessão deste dispositivo.') }
    finally { setBusy(false) }
  }
  return <div className="logout-control">
    <Button className="button--subtle" onClick={logout} disabled={busy}>{busy ? 'Saindo…' : 'Sair'}</Button>
    <ErrorNotice message={error} />
    {error && <Button className="button--subtle" onClick={() => sessionStore.forget()}>Remover sessão deste dispositivo</Button>}
  </div>
}
