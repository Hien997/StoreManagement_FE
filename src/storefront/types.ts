import type { Product } from '@/shared/lib/types'

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock'

export type ProductSort = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'rating'

export interface StoreProduct extends Product {
  image: string
  rating: number
  reviewCount: number
  stock: number
  stockStatus: StockStatus
  salePrice?: number
  discountPercent?: number
  brandName?: string
  categoryName?: string
}

export interface ProductFilters {
  search?: string
  categoryId?: string
  brandId?: string
  minPrice?: number
  maxPrice?: number
  inStockOnly?: boolean
  rating?: number
  sort?: ProductSort
}

export type ViewMode = 'grid' | 'list'