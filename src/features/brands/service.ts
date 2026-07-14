import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/types/api'

export interface BrandListParams {
  page?: number
  page_size?: number
  keyword?: string
}

export const brandService = {
  list: (params?: BrandListParams) =>
    apiClient
      .get<ApiResponse<PaginatedData<BrandResponse>>>('/brands', { params })
      .then((r) => r.data.data),

  get: (id: string) =>
    apiClient.get<ApiResponse<BrandResponse>>(`/brands/${id}`).then((r) => r.data.data),

  create: (body: CreateBrandRequest) =>
    apiClient.post<ApiResponse<BrandResponse>>('/brands', body).then((r) => r.data.data),

  update: (id: string, body: UpdateBrandRequest) =>
    apiClient.put<ApiResponse<BrandResponse>>(`/brands/${id}`, body).then((r) => r.data.data),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<unknown>>(`/brands/${id}`).then((r) => r.data.data),
}
