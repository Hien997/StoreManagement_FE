import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateBrandRequest, UpdateBrandRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { brandKeys } from './queryKeys'
import { brandService } from './queries'

export function useCreateBrand() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateBrandRequest) => brandService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brandKeys.all })
      toast({ title: 'Brand created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateBrand() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateBrandRequest }) =>
      brandService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: brandKeys.all })
      qc.invalidateQueries({ queryKey: brandKeys.detail(vars.id) })
      toast({ title: 'Brand updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteBrand() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: string) => brandService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: brandKeys.all })
      toast({ title: 'Brand deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}