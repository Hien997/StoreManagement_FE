import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { CreateInventoryRequest, UpdateInventoryRequest } from './types'
import { useToast } from '@/shared/components/ui/toast'
import { inventoryKeys } from './queryKeys'
import { inventoryService } from './queries'

export function useCreateInventory() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateInventoryRequest) => inventoryService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all })
      toast({ title: 'Inventory record created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateInventory() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateInventoryRequest }) =>
      inventoryService.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all })
      toast({ title: 'Inventory updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteInventory() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => inventoryService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: inventoryKeys.all })
      toast({ title: 'Inventory record deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}