import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { customerService } from './service'
import type {
  CreateCustomerRequest,
  UpdateCustomerRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const customerKeys = {
  all: ['customers'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['customers', 'list', params ?? {}] as const,
  detail: (id: number) => ['customers', 'detail', id] as const,
}

export function useCustomers(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: customerKeys.list(params),
    queryFn: () => customerService.list(params),
  })
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: customerKeys.detail(id),
    queryFn: () => customerService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateCustomer() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateCustomerRequest) => customerService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all })
      toast({ title: 'Customer created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateCustomer() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCustomerRequest }) =>
      customerService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: customerKeys.all })
      qc.invalidateQueries({ queryKey: customerKeys.detail(vars.id) })
      toast({ title: 'Customer updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteCustomer() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => customerService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: customerKeys.all })
      toast({ title: 'Customer deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}