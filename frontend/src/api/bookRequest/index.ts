import { BASE_API_URL } from '@/api/config'

export type BookRequestPayload = {
  title: string
  author?: string
}

export type BookRequest = {
  id: string
  title: string
  author?: string
  status: 'PENDING' | 'FULFILLED' | 'REJECTED'
  fulfilledBookTitle?: string
  fulfilledBookAuthor?: string
  createdAt: string
  updatedAt: string
}

export async function submitBookRequest(
  payload: BookRequestPayload
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch(`${BASE_API_URL}/api/book-request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, message: error.message || 'Erreur serveur' }
    }

    return { success: true }
  } catch (err) {
    return { success: false, message: 'Erreur réseau ou serveur' }
  }
}

export async function getUserBookRequests(): Promise<BookRequest[]> {
  try {
    const response = await fetch(`${BASE_API_URL}/api/book-request`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des demandes')
    }

    return await response.json()
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function deleteBookRequest(id: string): Promise<void> {
  const res = await fetch(`${BASE_API_URL}/api/book-request/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Erreur HTTP ' + res.status)
  }
}