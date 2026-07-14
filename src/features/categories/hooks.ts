import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { categoryService } from './service'
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const categoryKeys = {
  all: ['categories'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['categories', 'list', params ?? {}] as const,
  detail: (id: number) => ['categories', 'detail', id] as const,
}

export function useCategories(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.list(params),
  })
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => categoryService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateCategoryRequest) => categoryService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast({ title: 'Category created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateCategory() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateCategoryRequest }) =>
      categoryService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      qc.invalidateQueries({ queryKey: categoryKeys.detail(vars.id) })
      toast({ title: 'Category updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: categoryKeys.all })
      toast({ title: 'Category deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}