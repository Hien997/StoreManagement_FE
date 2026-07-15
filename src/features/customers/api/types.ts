export type {
  CustomerResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '@/types/api'

export interface CustomerQuery {
  limit?: number
  cursor?: string
}