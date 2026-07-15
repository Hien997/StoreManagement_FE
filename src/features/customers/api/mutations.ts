import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { CreateCustomerRequest, UpdateCustomerRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { customerKeys } from './queryKeys'
import { customerService } from './queries'

export function useCreateCustomer() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateCustomerRequest) => customerService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all })
      toast({ title: t('customer.created'), variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: t('customer.createFailed'), description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateCustomer() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCustomerRequest }) =>
      customerService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: customerKeys.all })
      qc.invalidateQueries({ queryKey: customerKeys.detail(vars.id) })
      toast({ title: t('customer.updated'), variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: t('customer.updateFailed'), description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteCustomer() {
  const { t } = useTranslation()
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => customerService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all })
      toast({ title: t('customer.deleted'), variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: t('customer.deleteFailed'), description: err.message, variant: 'destructive' }),
  })
}