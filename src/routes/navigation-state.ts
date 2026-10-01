export const internalNavigationState = {
  mindcheckInternalNavigation: true,
} as const

export function hasInternalNavigationState(state: unknown) {
  return Boolean(
    state &&
      typeof state === 'object' &&
      'mindcheckInternalNavigation' in state &&
      (state as Record<string, unknown>).mindcheckInternalNavigation === true,
  )
}