export const estadoNavegacaoInterna = {
  mindcheckInternalNavigation: true,
} as const

export function possuiEstadoNavegacaoInterna(state: unknown) {
  return Boolean(
    state &&
      typeof state === 'object' &&
      'mindcheckInternalNavigation' in state &&
      (state as Record<string, unknown>).mindcheckInternalNavigation === true,
  )
}
