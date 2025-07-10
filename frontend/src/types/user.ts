export type Role = 'ADMIN' | 'USER'

export type User = {
  id: string
  email: string
  name: string // ← ajoute cette ligne
  role: Role
  createdAt?: string // facultatif
}