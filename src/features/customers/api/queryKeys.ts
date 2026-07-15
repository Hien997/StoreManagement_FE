import type { CustomerQuery } from './types'

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: CustomerQuery) => [...customerKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...customerKeys.all, id] as const,
}