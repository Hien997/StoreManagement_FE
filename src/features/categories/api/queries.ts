import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { CategoryResponse, CreateCategoryRequest, UpdateCategoryRequest } from './types'
import { categoryKeys } from './queryKeys'

export const categoryService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<CategoryResponse>>>('/categories', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<CategoryResponse>>(`/categories/${id}`).then((r) => r.data.data),

  create: (body: CreateCategoryRequest) =>
    apiClient.post<ApiResponse<CategoryResponse>>('/categories', body).then((r) => r.data.data),

  update: (id: number, body: UpdateCategoryRequest) =>
    apiClient.put<ApiResponse<CategoryResponse>>(`/categories/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/categories/${id}`).then((r) => r.data.data),
}

export function useCategories(params?: { limit?: number; cursor?: string; enabled?: boolean; staleTime?: number }) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.list(params),
    enabled: params?.enabled,
    staleTime: params?.staleTime,
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.get(id),
    enabled: Number.isFinite(id),
  })
}