import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { reportService, settingService } from './service'
import type { UpsertSettingRequest } from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const reportKeys = {
  sales: (params?: { from?: string; to?: string }) => ['reports', 'sales', params ?? {}] as const,
  purchases: (params?: { from?: string; to?: string }) => ['reports', 'purchases', params ?? {}] as const,
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

export const settingKeys = {
  all: ['settings'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['settings', 'list', params ?? {}] as const,
  detail: (key: string) => ['settings', 'detail', key] as const,
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

export function useUpsertSetting() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: UpsertSettingRequest) => settingService.upsert(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.all })
      toast({ title: 'Setting saved', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to save', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteSetting() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (key: string) => settingService.remove(key),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: settingKeys.all })
      toast({ title: 'Setting deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}