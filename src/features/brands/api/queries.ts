import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { BrandListParams, BrandResponse, CreateBrandRequest, UpdateBrandRequest } from './types'
import { brandKeys } from './queryKeys'

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

export function useBrands(params?: BrandListParams) {
  return useQuery({
    queryKey: brandKeys.list(params),
    queryFn: () => brandService.list(params),
  })
}

export function useBrand(id: string) {
  return useQuery({
    queryKey: brandKeys.detail(id),
    queryFn: () => brandService.get(id),
    enabled: Boolean(id),
  })
}