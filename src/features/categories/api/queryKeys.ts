import type { CategoryQuery } from './types'

export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (params?: CategoryQuery) => [...categoryKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...categoryKeys.all, id] as const,
}