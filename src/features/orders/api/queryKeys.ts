import type { OrderQuery } from './types'

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (params?: OrderQuery) => [...orderKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...orderKeys.all, id] as const,
}