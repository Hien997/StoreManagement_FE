import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { orderService } from './service'
import type {
  CreateSalesOrderRequest,
  UpdateSalesOrderRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const orderKeys = {
  all: ['orders'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['orders', 'list', params ?? {}] as const,
  detail: (id: number) => ['orders', 'detail', id] as const,
}

export function useOrders(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderService.list(params),
  })
}

export function useOrder(id: number) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => orderService.get(id),
    enabled: Number.isFinite(id),
  })
}

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