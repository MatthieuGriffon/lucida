export async function changePassword(oldPassword: string, newPassword: string) {
  const res = await fetch('/api/account/change-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ oldPassword, newPassword }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Échec du changement de mot de passe')
  }

  return await res.json()
}
// Déconnecte l'utilisateur
export async function logout() {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error('Échec de la déconnexion')
  }

  return await res.json()
}

// Supprime le compte de l'utilisateur
export async function deleteAccount(password: string) {
  const res = await fetch('/api/account/delete', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })

  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Échec de la suppression du compte')
  }

  return await res.json()
}