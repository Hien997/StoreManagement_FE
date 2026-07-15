import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { CreateInventoryRequest, InventoryResponse, UpdateInventoryRequest } from './types'
import { inventoryKeys } from './queryKeys'

export const inventoryService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<InventoryResponse>>>('/inventory', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<InventoryResponse>>(`/inventory/${id}`).then((r) => r.data.data),

  create: (body: CreateInventoryRequest) =>
    apiClient.post<ApiResponse<InventoryResponse>>('/inventory', body).then((r) => r.data.data),

  update: (id: number, body: UpdateInventoryRequest) =>
    apiClient.put<ApiResponse<InventoryResponse>>(`/inventory/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/inventory/${id}`).then((r) => r.data.data),
}

export function useInventory(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => inventoryService.list(params),
  })
}

export function useInventoryRecord(id: number) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.get(id),
    enabled: Number.isFinite(id),
  })
}