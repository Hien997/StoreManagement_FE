export type {
  SupplierResponse,
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '@/types/api'

export interface SupplierQuery {
  limit?: number
  cursor?: string
}