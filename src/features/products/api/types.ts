export type {
  ProductResponse,
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/api'

export interface ProductQuery {
  limit?: number
  cursor?: string
}