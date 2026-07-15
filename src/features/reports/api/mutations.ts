import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { UpsertSettingRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { settingKeys } from './queryKeys'
import { settingService } from './queries'

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