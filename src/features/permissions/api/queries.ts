import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  ChangePasswordRequest,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from './types'
import { userKeys } from './queryKeys'

export const userService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<UserResponse>>>('/users', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<UserResponse>>(`/users/${id}`).then((r) => r.data.data),

  create: (body: CreateUserRequest) =>
    apiClient.post<ApiResponse<UserResponse>>('/users', body).then((r) => r.data.data),

  update: (id: number, body: UpdateUserRequest) =>
    apiClient.put<ApiResponse<UserResponse>>(`/users/${id}`, body).then((r) => r.data.data),

  changePassword: (id: number, body: ChangePasswordRequest) =>
    apiClient
      .post<ApiResponse<unknown>>(`/users/${id}/change-password`, body)
      .then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/users/${id}`).then((r) => r.data.data),
}

export function useUsers(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.list(params),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.get(id),
    enabled: Number.isFinite(id),
  })
}