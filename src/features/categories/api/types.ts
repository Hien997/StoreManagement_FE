export type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api'

export interface CategoryQuery {
  limit?: number
  cursor?: string
}