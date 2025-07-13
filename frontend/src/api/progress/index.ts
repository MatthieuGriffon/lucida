const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  `${location.protocol}//${location.hostname}:3000`;

console.debug('[api] BASE =', API_BASE);

// ---------------------------------------------------------------------
//  POST /api/progress
// ---------------------------------------------------------------------
export async function saveProgress(bookId: string, loc: number) {
   const base = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '')
            ?? `${location.protocol}//${location.hostname}:3000`

  const url  = `${base}/api/progress`
  console.log('%c[saveProgress] →', 'color:#f50;font-weight:bold', url, { bookId, loc })

  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',              // cookie de session
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookId, loc })
    });
    console.debug('[api]   →', res.status);
  } catch (err) {
    console.error('[api] POST error', err);
  }
}

// ---------------------------------------------------------------------
//  GET /api/progress/:bookId
// ---------------------------------------------------------------------
export async function fetchProgress(bookId: string): Promise<number | null> {
  const url = `${API_BASE}/api/progress/${bookId}`;
  console.debug('[api] GET', url);

  const res = await fetch(url, { credentials: 'include' });
  console.debug('[api]   →', res.status);

  if (res.status === 204) return null;
  if (!res.ok) throw new Error('progress error');

  const { loc } = await res.json();
  return loc;
}