export async function uploadBookFile(formData: FormData): Promise<{ epubPath: string }> {
  const response = await fetch('/api/admin/book/upload', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  })

  const raw = await response.text()
  console.log('📨 Réponse brute du backend :', raw)

  if (!response.ok) {
    let error
    try {
      error = JSON.parse(raw)
    } catch (_) {
      error = null
    }
    throw new Error(error?.message || 'Erreur lors de l’envoi du fichier')
  }

  try {
    return JSON.parse(raw)
  } catch (err) {
    throw new Error('Réponse du backend invalide')
  }
}

export async function createBook(data: { title: string; author?: string; epubPath: string }) {
  const response = await fetch('/api/admin/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => null)
    throw new Error(error?.message || 'Erreur lors de la création du livre')
  }

  return await response.json()
} 