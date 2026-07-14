import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api'

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