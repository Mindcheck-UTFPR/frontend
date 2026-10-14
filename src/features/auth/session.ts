import { ApiError, http, jsonBody } from '../../shared/api/http'

export type User = { id: number; nome: string; email: string; papel: 'usuario' | 'admin' }
type Session = { accessToken: string; refreshToken: string; expiraEm: string; usuario: User }
type State = { status: 'loading' | 'anonymous' | 'authenticated' | 'error'; user: User | null; message: string }
export const REFRESH_KEY = 'mindcheck:auth:refresh'

function readRefresh() { try { return sessionStorage.getItem(REFRESH_KEY) } catch { return null } }
function persistRefresh(value: string | null) {
  try { if (value) sessionStorage.setItem(REFRESH_KEY, value); else sessionStorage.removeItem(REFRESH_KEY) } catch { /* Sessão continua apenas em memória se storage estiver bloqueado. */ }
}
function clearDrafts() {
  try {
    for (const key of Object.keys(sessionStorage)) if (key.startsWith('mindcheck:questionnaire:')) sessionStorage.removeItem(key)
    localStorage.removeItem('token') // Remove a credencial fictícia da PR de rotas, sem tocar em outras chaves.
  } catch { /* Sem storage não existem dados persistidos acessíveis. */ }
}

export function createSessionStore() {
  let state: State = { status: 'loading', user: null, message: '' }
  let access: string | null = null
  let refresh: string | null = readRefresh()
  let generation = 0
  let refreshFlight: Promise<void> | null = null
  let restoreFlight: Promise<void> | null = null
  let verificationFlight: Promise<void> | null = null
  const listeners = new Set<() => void>()
  const update = (next: State) => { state = next; listeners.forEach(fn => fn()) }
  const clear = (message = '') => {
    generation++; access = null; refresh = null; persistRefresh(null); clearDrafts()
    update({ status: 'anonymous', user: null, message })
  }
  const accept = (session: Session, epoch: number) => {
    if (epoch !== generation) throw new ApiError(401, 'SESSAO_SUBSTITUIDA', 'A sessão foi alterada. Entre novamente.')
    if (!session.accessToken || !/^[\w-]{43}$/.test(session.refreshToken) || !session.usuario?.id || !Number.isFinite(Date.parse(session.expiraEm))) {
      throw new ApiError(502, 'RESPOSTA_INVALIDA', 'Não foi possível validar a sessão recebida.')
    }
    access = session.accessToken; refresh = session.refreshToken; persistRefresh(refresh)
    update({ status: 'authenticated', user: session.usuario, message: '' })
  }
  const renew = (): Promise<void> => {
    if (refreshFlight) return refreshFlight
    if (!refresh) return Promise.reject(new ApiError(401, 'SESSAO_INVALIDA', 'Entre para continuar.'))
    const epoch = generation
    const current = refresh
    refreshFlight = http<Session>('/auth/refresh', jsonBody({ refreshToken: current }))
      .then(data => accept(data, epoch))
      .catch(error => {
        if (epoch === generation && error instanceof ApiError && [400, 401].includes(error.status)) clear('Sua sessão expirou. Entre novamente.')
        throw error
      }).finally(() => { refreshFlight = null })
    return refreshFlight
  }
  const restore = (): Promise<void> => {
    if (restoreFlight) return restoreFlight
    if (!refresh) { update({ status: 'anonymous', user: null, message: '' }); return Promise.resolve() }
    update({ status: 'loading', user: null, message: '' })
    restoreFlight = renew().catch(error => {
      if (state.status !== 'anonymous') update({ status: 'error', user: null, message: error instanceof Error ? error.message : 'Não foi possível verificar a sessão.' })
    }).finally(() => { restoreFlight = null })
    return restoreFlight
  }
  const request = async <T,>(path: string, init: RequestInit = {}): Promise<T> => {
    const epoch = generation
    const sentAccess = access
    const attempt = async () => {
      if (epoch !== generation) throw new ApiError(409, 'SESSAO_SUBSTITUIDA', 'A sessão foi alterada.')
      const data = await http<T>(path, { ...init, headers: { ...init.headers, Authorization: `Bearer ${access ?? ''}` } })
      if (epoch !== generation) throw new ApiError(409, 'SESSAO_SUBSTITUIDA', 'A sessão foi alterada.')
      return data
    }
    try { return await attempt() }
    catch (error) {
      if (!(error instanceof ApiError) || error.status !== 401 || epoch !== generation) throw error
      if (access === sentAccess) await renew()
      try { return await attempt() }
      catch (retryError) {
        if (epoch === generation && retryError instanceof ApiError && retryError.status === 401) clear('Sua sessão expirou. Entre novamente.')
        throw retryError
      }
    }
  }
  const verify = (): Promise<void> => {
    if (state.status !== 'authenticated') return Promise.resolve()
    if (verificationFlight) return verificationFlight
    const epoch = generation
    verificationFlight = request<{ usuario: User }>('/auth/me').then(data => {
      if (epoch === generation) update({ status: 'authenticated', user: data.usuario, message: '' })
    }).catch(error => {
      if (epoch === generation && state.status !== 'anonymous') update({ status: 'error', user: null, message: error instanceof Error ? error.message : 'Não foi possível verificar a sessão.' })
    }).finally(() => { verificationFlight = null })
    return verificationFlight
  }
  return {
    getSnapshot: () => state,
    subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn) } },
    restore, request, verify,
    login: async (email: string, senha: string) => {
      const epoch = ++generation
      const data = await http<Session>('/auth/login', jsonBody({ email: email.trim().toLowerCase(), senha }))
      clearDrafts(); accept(data, epoch)
    },
    logout: async () => {
      // Aguarda rotação em curso para não revogar um refresh já substituído.
      if (refreshFlight) await refreshFlight
      if (refresh) await http<void>('/auth/logout', { ...jsonBody({ refreshToken: refresh }), headers: access ? { Authorization: `Bearer ${access}` } : undefined })
      clear('Você saiu da sua conta.')
    },
    forget: () => clear('Sessão removida deste dispositivo. A revogação no servidor não foi confirmada.'),
  }
}

export const sessionStore = createSessionStore()
