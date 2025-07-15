import { BASE_API_URL } from '@/api/config'

export async function fetchUsers() {
  const res = await fetch(`${BASE_API_URL}/api/admin/users`, { credentials: 'include' })
  if (!res.ok) throw new Error('Erreur chargement utilisateurs')
  return await res.json()
}

export async function createUser(user: {
  name: string
  email: string
  password: string
  role: 'USER' | 'ADMIN'
}) {
  const res = await fetch(`${BASE_API_URL}/api/admin/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(user),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur création utilisateur')
  return data
}

export async function changeUserPassword(id: string, password: string) {
  const res = await fetch(`${BASE_API_URL}/api/admin/users/${id}/password`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur changement mot de passe')
  return data
}

export async function deleteUser(id: string) {
  const res = await fetch(`${BASE_API_URL}/api/admin/users/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Erreur suppression utilisateur')
  return data
}