import type { RoleQuery } from './types'

export const roleKeys = {
  all: ['roles'] as const,
  lists: () => [...roleKeys.all, 'list'] as const,
  list: (params?: RoleQuery) => [...roleKeys.lists(), params ?? {}] as const,
  detail: (id: number) => [...roleKeys.all, id] as const,
}