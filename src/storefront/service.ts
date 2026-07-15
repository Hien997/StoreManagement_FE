import { apiClient } from '@/shared/api/client'
import type { ApiResponse, PaginatedData } from '@/shared/types/api/response'
import type { ProductResponse, CategoryResponse, BrandResponse } from '@/types/api'
import { toProduct, toCategory, toBrand } from '@/types/api/mappers'
import type { Product, Category, Brand } from '@/shared/lib/types'
import { deriveStorefrontFields } from './utils'
import type { StoreProduct } from './types'

async function fetchAll<T>(endpoint: string, map: (r: T) => unknown): Promise<unknown[]> {
  const out: unknown[] = []
  let cursor: string | undefined
  for (let i = 0; i < 50; i++) {
    const { data } = await apiClient.get<ApiResponse<PaginatedData<T>>>(endpoint, {
      params: { limit: 100, cursor },
    })
    const page = data.data
    out.push(...page.items.map(map))
    if (!page.pagination.has_more || !page.pagination.next_cursor) break
    cursor = page.pagination.next_cursor
  }
  return out
}

export const storeService = {
  products: async (): Promise<StoreProduct[]> => {
    const items = (await fetchAll<ProductResponse>('/products', toProduct)) as Product[]
    return items.map(deriveStorefrontFields)
  },
  categories: async (): Promise<Category[]> => {
    const items = (await fetchAll<CategoryResponse>('/categories', toCategory)) as Category[]
    return items
  },
  brands: async (): Promise<Brand[]> => {
    const items = (await fetchAll<BrandResponse>('/brands', toBrand)) as Brand[]
    return items
  },
}