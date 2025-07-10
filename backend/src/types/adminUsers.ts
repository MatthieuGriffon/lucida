export type CreateUserInput = {
  name: string
  email: string
  password: string
  role: 'USER' | 'ADMIN'
}

export type UpdateUserPasswordInput = {
  userId: string
  password: string
}