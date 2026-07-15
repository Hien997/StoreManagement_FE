import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateSupplierRequest, UpdateSupplierRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { supplierKeys } from './queryKeys'
import { supplierService } from './queries'

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