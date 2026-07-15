import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateSalesOrderRequest, UpdateSalesOrderRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { orderKeys } from './queryKeys'
import { orderService } from './queries'

export function useCreateOrder() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateSalesOrderRequest) => orderService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all })
      toast({ title: 'Order created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateSalesOrderRequest }) =>
      orderService.updateStatus(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: orderKeys.all })
      qc.invalidateQueries({ queryKey: orderKeys.detail(vars.id) })
      toast({ title: 'Order updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteOrder() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => orderService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all })
      toast({ title: 'Order deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}