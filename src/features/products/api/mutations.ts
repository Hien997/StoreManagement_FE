import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateProductRequest, UpdateProductRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { productKeys } from './queryKeys'
import { productService } from './queries'

export function useCreateProduct() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateProductRequest) => productService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      toast({ title: 'Product created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateProduct() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateProductRequest }) =>
      productService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      qc.invalidateQueries({ queryKey: productKeys.detail(vars.id) })
      toast({ title: 'Product updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => productService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: productKeys.all })
      toast({ title: 'Product deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}