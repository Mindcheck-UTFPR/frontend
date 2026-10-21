import { useSyncExternalStore } from 'react'
import { sessionStore } from './session'
export function useSession() {
  return useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot)
}
