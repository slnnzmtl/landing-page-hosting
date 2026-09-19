let pendingPopstate = false

export function markPopstatePending(): void {
  pendingPopstate = true
}

export function isPopstateNavigation(): boolean {
  return pendingPopstate
}

export function clearPopstateNavigation(): void {
  pendingPopstate = false
}
