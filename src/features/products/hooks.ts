import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productService } from './service'
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const productKeys = {
  all: ['products'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['products', 'list', params ?? {}] as const,
  detail: (id: number) => ['products', 'detail', id] as const,
}

export function useProducts(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.list(params),
  })
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.get(id),
    enabled: Number.isFinite(id),
  })
}

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