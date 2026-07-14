import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  CreateSalesOrderRequest,
  SalesOrderResponse,
  UpdateSalesOrderRequest,
} from '@/types/api'

export const orderService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<SalesOrderResponse>>>('/orders', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<SalesOrderResponse>>(`/orders/${id}`).then((r) => r.data.data),

  create: (body: CreateSalesOrderRequest) =>
    apiClient.post<ApiResponse<SalesOrderResponse>>('/orders', body).then((r) => r.data.data),

  updateStatus: (id: number, body: UpdateSalesOrderRequest) =>
    apiClient.put<ApiResponse<SalesOrderResponse>>(`/orders/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/orders/${id}`).then((r) => r.data.data),
}