// AES-GCM encryption for sensitive fields (API keys) stored in IndexedDB.
// Device key is generated once and kept in localStorage. This protects against
// raw IndexedDB file inspection without the browser's localStorage context.

const DEVICE_KEY_STORAGE = 'storythread.dk'

async function getDeviceKey(): Promise<CryptoKey> {
  const stored = localStorage.getItem(DEVICE_KEY_STORAGE)
  if (stored) {
    const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0))
    return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['encrypt', 'decrypt'])
  }
  const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
  const exported = await crypto.subtle.exportKey('raw', key)
  localStorage.setItem(DEVICE_KEY_STORAGE, btoa(String.fromCharCode(...new Uint8Array(exported))))
  return key
}

// Returns 'enc:<base64(iv + ciphertext)>' or '' for empty input.
export async function encryptField(value: string): Promise<string> {
  if (!value) return ''
  const key = await getDeviceKey()
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(value),
  )
  const combined = new Uint8Array(iv.length + ciphertext.byteLength)
  combined.set(iv)
  combined.set(new Uint8Array(ciphertext), iv.length)
  return `enc:${btoa(String.fromCharCode(...combined))}`
}

// Decrypts a value from encryptField. Returns plain text.
// Passes through legacy plain-text values transparently (migration path).
export async function decryptField(value: string): Promise<string> {
  if (!value) return ''
  if (!value.startsWith('enc:')) return value // legacy — not yet encrypted
  try {
    const key = await getDeviceKey()
    const combined = Uint8Array.from(atob(value.slice(4)), c => c.charCodeAt(0))
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: combined.slice(0, 12) },
      key,
      combined.slice(12),
    )
    return new TextDecoder().decode(decrypted)
  } catch {
    return ''
  }
}
