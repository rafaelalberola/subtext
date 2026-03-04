const STORAGE_KEY = 'reveald_fp'

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function getFingerprint(): Promise<string> {
  // Return cached fingerprint if available
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return stored
  } catch {
    // localStorage may be unavailable (private browsing, etc.)
  }

  const raw = [
    navigator.userAgent,
    screen.width.toString(),
    screen.height.toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
  ].join('|')

  const hash = await sha256(raw)

  try {
    localStorage.setItem(STORAGE_KEY, hash)
  } catch {
    // ignore storage errors
  }

  return hash
}
