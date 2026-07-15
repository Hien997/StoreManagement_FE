import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateCategoryRequest, UpdateCategoryRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { categoryKeys } from './queryKeys'
import { categoryService } from './queries'

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