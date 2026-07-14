import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { supplierService } from './service'
import type {
  CreateSupplierRequest,
  UpdateSupplierRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const supplierKeys = {
  all: ['suppliers'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['suppliers', 'list', params ?? {}] as const,
  detail: (id: number) => ['suppliers', 'detail', id] as const,
}

export function useSuppliers(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: supplierKeys.list(params),
    queryFn: () => supplierService.list(params),
  })
}

export function useSupplier(id: number) {
  return useQuery({
    queryKey: supplierKeys.detail(id),
    queryFn: () => supplierService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateSupplier() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateSupplierRequest) => supplierService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.all })
      toast({ title: 'Supplier created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateSupplier() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateSupplierRequest }) =>
      supplierService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: supplierKeys.all })
      qc.invalidateQueries({ queryKey: supplierKeys.detail(vars.id) })
      toast({ title: 'Supplier updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteSupplier() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => supplierService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: supplierKeys.all })
      toast({ title: 'Supplier deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}