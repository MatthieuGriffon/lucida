import { BASE_API_URL } from '@/api/config'

export async function getUserBooks(): Promise<
  { id: string; title: string; author?: string; epubPath: string; createdAt: string }[]
> {
  const response = await fetch(`${BASE_API_URL}/api/books`, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Erreur lors du chargement des livres')
  }

  return await response.json()
}