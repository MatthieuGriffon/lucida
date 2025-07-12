export async function getUserBooks(): Promise<
  { id: string; title: string; author?: string; epubPath: string; createdAt: string }[]
> {
  const response = await fetch('/api/books', {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Erreur lors du chargement des livres')
  }

  return await response.json()
}