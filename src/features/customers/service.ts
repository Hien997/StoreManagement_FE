import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  CreateCustomerRequest,
  CustomerResponse,
  UpdateCustomerRequest,
} from '@/types/api'

export const customerService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<CustomerResponse>>>('/customers', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<CustomerResponse>>(`/customers/${id}`).then((r) => r.data.data),

  create: (body: CreateCustomerRequest) =>
    apiClient.post<ApiResponse<CustomerResponse>>('/customers', body).then((r) => r.data.data),

  update: (id: number, body: UpdateCustomerRequest) =>
    apiClient.put<ApiResponse<CustomerResponse>>(`/customers/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/customers/${id}`).then((r) => r.data.data),
}