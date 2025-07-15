import { BASE_API_URL } from '@/api/config'

export async function saveProgress(bookId: string, loc: number) {
  const url = `${BASE_API_URL}/api/progress`
  console.log('%c[saveProgress] →', 'color:#f50;font-weight:bold', url, { bookId, loc })

  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, loc }),
    })
    console.debug('[api]   →', res.status)
  } catch (err) {
    console.error('[api] POST error', err)
  }
}

export async function fetchProgress(bookId: string): Promise<number | null> {
  const url = `${BASE_API_URL}/api/progress/${bookId}`
  console.debug('[api] GET', url)

  const res = await fetch(url, { credentials: 'include' })
  console.debug('[api]   →', res.status)

  if (res.status === 204) return null
  if (!res.ok) throw new Error('progress error')

  const { loc } = await res.json()
  return loc
}