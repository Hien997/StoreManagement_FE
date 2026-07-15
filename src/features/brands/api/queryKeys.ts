import type { BrandQuery } from './types'

export const brandKeys = {
  all: ['brands'] as const,
  lists: () => [...brandKeys.all, 'list'] as const,
  list: (params?: BrandQuery) => [...brandKeys.lists(), params ?? {}] as const,
  detail: (id: string) => [...brandKeys.all, id] as const,
}