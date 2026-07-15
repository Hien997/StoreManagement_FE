import type { ProductQuery } from './types'

export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params?: ProductQuery) => [...productKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...productKeys.all, id] as const,
}