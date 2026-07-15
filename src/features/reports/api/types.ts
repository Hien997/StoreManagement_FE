export type {
  SalesSummary,
  PurchaseSummary,
  SettingResponse,
  UpsertSettingRequest,
} from '@/types/api'

export interface ReportQuery {
  from?: string
  to?: string
}

export interface SettingQuery {
  limit?: number
  cursor?: string
}