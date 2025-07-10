export type RequestStatus = 'PENDING' | 'FULFILLED' | 'REJECTED'

export type BookRequestWithUser = {
  id: string
  title: string
  author?: string | null
  status: RequestStatus
  fulfilledBookTitle?: string | null
  fulfilledBookAuthor?: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
}
