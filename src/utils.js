export const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.userAgent)

/** The modifier symbol to print in shortcut hints. */
export const MOD = isMac ? '⌘' : 'Ctrl'

export function cx(...parts) {
  return parts.filter(Boolean).join(' ')
}
