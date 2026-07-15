import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  AssignPermissionsRequest,
  CreateRoleRequest,
  RoleResponse,
  UpdateRoleRequest,
} from './types'
import { roleKeys } from './queryKeys'

export const roleService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<RoleResponse>>>('/roles', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<RoleResponse>>(`/roles/${id}`).then((r) => r.data.data),

  create: (body: CreateRoleRequest) =>
    apiClient.post<ApiResponse<RoleResponse>>('/roles', body).then((r) => r.data.data),

  update: (id: number, body: UpdateRoleRequest) =>
    apiClient.put<ApiResponse<RoleResponse>>(`/roles/${id}`, body).then((r) => r.data.data),

  assignPermissions: (id: number, body: AssignPermissionsRequest) =>
    apiClient
      .post<ApiResponse<RoleResponse>>(`/roles/${id}/permissions`, body)
      .then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/roles/${id}`).then((r) => r.data.data),
}

export function useRoles(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleService.list(params),
  })
}

export function useRole(id: number) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleService.get(id),
    enabled: Number.isFinite(id),
  })
}