export type {
  SalesOrderResponse,
  OrderItemResponse,
  CreateSalesOrderRequest,
  UpdateSalesOrderRequest,
} from '@/types/api'

export interface OrderQuery {
  limit?: number
  cursor?: string
}