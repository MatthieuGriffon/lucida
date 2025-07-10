import type { BookRequestWithUser } from '@/types/bookRequest'

const BASE = '/api/admin/book-requests'

export async function getBookRequests(): Promise<BookRequestWithUser[]> {
  const res = await fetch(BASE, {
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Erreur lors du chargement des demandes')
  }

  return await res.json()
}

export async function fulfillRequest(id: string, data: {
  fulfilledTitle: string
  fulfilledAuthor?: string
}) {
  const res = await fetch(`${BASE}/${id}/fulfill`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Erreur lors du traitement de la demande')
  }

  return await res.json()
}

export async function rejectRequest(id: string) {
  const res = await fetch(`${BASE}/${id}/reject`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Erreur lors du rejet de la demande')
  }

  return await res.json()
}
