import type { InventoryQuery } from './types'

export const inventoryKeys = {
  all: ['inventory'] as const,
  lists: () => [...inventoryKeys.all, 'list'] as const,
  list: (params?: InventoryQuery) => [...inventoryKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...inventoryKeys.all, id] as const,
}