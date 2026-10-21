import { useState } from 'react'
import { Botao } from '../../componentes/atomos/botao'
import { AvisoErro } from '../../componentes/moleculas/avisoErro'
import { sessionStore } from './session'
export function LogoutButton() {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const logout = async () => {
    if (busy) return
    setBusy(true)
    setError('')
    try {
      await sessionStore.logout()
    } catch {
      setError(
        'Não foi possível confirmar a saída no servidor. Tente novamente ou remova apenas a sessão deste dispositivo.',
      )
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="logout-control">
      <Botao className="button--subtle" onClick={logout} disabled={busy}>
        {busy ? 'Saindo…' : 'Sair'}
      </Botao>
      <AvisoErro message={error} />
      {error && (
        <Botao className="button--subtle" onClick={() => sessionStore.forget()}>
          Remover sessão deste dispositivo
        </Botao>
      )}
    </div>
  )
}
