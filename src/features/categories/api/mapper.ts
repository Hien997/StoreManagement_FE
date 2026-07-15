import type { Category } from '@/shared/lib/types'
import type { CategoryResponse } from './types'

export function mapCategory(c: CategoryResponse): Category {
  return {
    id: String(c.id),
    name: c.name,
    parentId: c.parent_id ? String(c.parent_id) : null,
    description: c.description,
    productCount: 0,
  }
}