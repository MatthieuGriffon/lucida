export type BookRequestPayload = {
  title: string
  author?: string
}

// Type d'une demande retournée depuis l'API
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

// POST : soumettre une demande
export async function submitBookRequest(
  payload: BookRequestPayload
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('/api/book-request', {
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

// GET : récupérer les demandes de l'utilisateur connecté
export async function getUserBookRequests(): Promise<BookRequest[]> {
  try {
    const response = await fetch('/api/book-request', {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Erreur lors du chargement des demandes')
    }

    const data = await response.json()
    return data as BookRequest[]
  } catch (err) {
    console.error(err)
    return []
  }
}