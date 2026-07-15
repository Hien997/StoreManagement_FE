import { customerApiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { CreateCustomerOrderRequest, CustomerOrderResponse } from '@/types/api'

export const customerOrderService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    customerApiClient
      .get<ApiResponse<PaginatedData<CustomerOrderResponse>>>('/customer/orders', { params })
      .then((r) => r.data.data),

  getById: (id: number) =>
    customerApiClient
      .get<ApiResponse<CustomerOrderResponse>>(`/customer/orders/${id}`)
      .then((r) => r.data.data),

  create: (body: CreateCustomerOrderRequest) =>
    customerApiClient
      .post<ApiResponse<CustomerOrderResponse>>('/customer/orders', body)
      .then((r) => r.data.data),
}