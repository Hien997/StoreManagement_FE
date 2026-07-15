export type {
  InventoryResponse,
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from '@/types/api'

export interface InventoryQuery {
  limit?: number
  cursor?: string
}