import type { UserQuery } from './types'

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: UserQuery) => [...userKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...userKeys.all, id] as const,
}