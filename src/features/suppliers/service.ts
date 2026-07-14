import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  CreateSupplierRequest,
  SupplierResponse,
  UpdateSupplierRequest,
} from '@/types/api'

export const supplierService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<SupplierResponse>>>('/suppliers', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<SupplierResponse>>(`/suppliers/${id}`).then((r) => r.data.data),

  create: (body: CreateSupplierRequest) =>
    apiClient.post<ApiResponse<SupplierResponse>>('/suppliers', body).then((r) => r.data.data),

  update: (id: number, body: UpdateSupplierRequest) =>
    apiClient.put<ApiResponse<SupplierResponse>>(`/suppliers/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/suppliers/${id}`).then((r) => r.data.data),
}