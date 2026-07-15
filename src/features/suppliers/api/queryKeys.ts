import type { SupplierQuery } from './types'

export const supplierKeys = {
  all: ['suppliers'] as const,
  lists: () => [...supplierKeys.all, 'list'] as const,
  list: (params?: SupplierQuery) => [...supplierKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...supplierKeys.all, id] as const,
}