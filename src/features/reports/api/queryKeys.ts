import type { ReportQuery, SettingQuery } from './types'

export const reportKeys = {
  sales: (params?: ReportQuery) => ['reports', 'sales', params ?? {}] as const,
  purchases: (params?: ReportQuery) => ['reports', 'purchases', params ?? {}] as const,
}

export const settingKeys = {
  all: ['settings'] as const,
  lists: () => [...settingKeys.all, 'list'] as const,
  list: (params?: SettingQuery) => [...settingKeys.lists(), params ?? {}] as const,
  detail: (key: string) => [...settingKeys.all, key] as const,
}