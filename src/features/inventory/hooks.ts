import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inventoryService } from './service'
import type {
  CreateInventoryRequest,
  UpdateInventoryRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const inventoryKeys = {
  all: ['inventory'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['inventory', 'list', params ?? {}] as const,
  detail: (id: number) => ['inventory', 'detail', id] as const,
}

export function useInventory(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: inventoryKeys.list(params),
    queryFn: () => inventoryService.list(params),
  })
}

export function useInventoryRecord(id: number) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => inventoryService.get(id),
    enabled: Number.isFinite(id),
  })
}

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