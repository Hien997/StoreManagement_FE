import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  PurchaseSummary,
  SalesSummary,
  SettingResponse,
  UpsertSettingRequest,
} from './types'
import { reportKeys, settingKeys } from './queryKeys'

export const reportService = {
  salesSummary: (params?: { from?: string; to?: string }) =>
    apiClient
      .get<ApiResponse<SalesSummary>>('/reports/sales', { params })
      .then((r) => r.data.data),

  purchaseSummary: (params?: { from?: string; to?: string }) =>
    apiClient
      .get<ApiResponse<PurchaseSummary>>('/reports/purchases', { params })
      .then((r) => r.data.data),
}

export const settingService = {
  list: (params?: { limit?: number; cursor?: string }) =>
    apiClient
      .get<ApiResponse<PaginatedData<SettingResponse>>>('/settings', { params })
      .then((r) => r.data.data),

  get: (key: string) =>
    apiClient.get<ApiResponse<SettingResponse>>(`/settings/${key}`).then((r) => r.data.data),

  upsert: (body: UpsertSettingRequest) =>
    apiClient.put<ApiResponse<SettingResponse>>('/settings', body).then((r) => r.data.data),

  remove: (key: string) =>
    apiClient.delete<ApiResponse<unknown>>(`/settings/${key}`).then((r) => r.data.data),
}

export function useSalesReport(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.sales(params),
    queryFn: () => reportService.salesSummary(params),
  })
}

export function usePurchaseReport(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: reportKeys.purchases(params),
    queryFn: () => reportService.purchaseSummary(params),
  })
}

export function useSettings(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: settingKeys.list(params),
    queryFn: () => settingService.list(params),
  })
}

export function useSetting(key: string) {
  return useQuery({
    queryKey: settingKeys.detail(key),
    queryFn: () => settingService.get(key),
    enabled: Boolean(key),
  })
}