export interface ApiResponse<T> {
  code: number
  success: boolean
  message: string
  data: T
}

export interface Pagination {
  has_more: boolean
  limit: number
  next_cursor: string
}

export interface PaginatedData<T> {
  items: T[]
  pagination: Pagination
}

export class ApiError extends Error {
  code: number
  status: number
  details?: unknown

  constructor(message: string, code: number, status: number, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.status = status
    this.details = details
  }
}