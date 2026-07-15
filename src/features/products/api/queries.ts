import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from './types'
import { productKeys } from './queryKeys'

export const productService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<ProductResponse>>>('/products', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<ProductResponse>>(`/products/${id}`).then((r) => r.data.data),

  create: (body: CreateProductRequest) =>
    apiClient.post<ApiResponse<ProductResponse>>('/products', body).then((r) => r.data.data),

  update: (id: number, body: UpdateProductRequest) =>
    apiClient.put<ApiResponse<ProductResponse>>(`/products/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/products/${id}`).then((r) => r.data.data),
}

export function useProducts(params?: { limit?: number; cursor?: string; enabled?: boolean; staleTime?: number }) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.list(params),
    enabled: params?.enabled,
    staleTime: params?.staleTime,
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.get(id),
    enabled: Number.isFinite(id),
  })
}