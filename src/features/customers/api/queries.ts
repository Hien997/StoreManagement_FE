import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { CreateCustomerRequest, CustomerResponse, UpdateCustomerRequest } from './types'
import { customerKeys } from './queryKeys'

export const customerService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<CustomerResponse>>>('/customers', { params })
      .then((r) => r.data.data),

  get: (id: number) =>
    apiClient.get<ApiResponse<CustomerResponse>>(`/customers/${id}`).then((r) => r.data.data),

  me: () =>
    apiClient.get<ApiResponse<CustomerResponse>>('/customers/me').then((r) => r.data.data),

  create: (body: CreateCustomerRequest) =>
    apiClient.post<ApiResponse<CustomerResponse>>('/customers', body).then((r) => r.data.data),

  update: (id: number, body: UpdateCustomerRequest) =>
    apiClient.put<ApiResponse<CustomerResponse>>(`/customers/${id}`, body).then((r) => r.data.data),

  remove: (id: number) =>
    apiClient.delete<ApiResponse<unknown>>(`/customers/${id}`).then((r) => r.data.data),
}

export function useCustomers(params?: { limit?: number; cursor?: string; enabled?: boolean; staleTime?: number }) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.list(params),
    enabled: params?.enabled,
    staleTime: params?.staleTime,
  })
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.get(id),
    enabled: Number.isFinite(id),
  })
}