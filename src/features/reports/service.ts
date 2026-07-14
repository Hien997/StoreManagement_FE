import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type {
  PurchaseSummary,
  SalesSummary,
  SettingResponse,
  UpsertSettingRequest,
} from '@/types/api'

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