import type { Product } from '@/shared/lib/types'
import type { ProductFilters, StockStatus, StoreProduct } from './types'

function hashString(input: string): number {
  let h = 2166136261
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return Math.abs(h)
}

const PALETTE = [
  ['#0F766E', '#14B8A6'],
  ['#F59E0B', '#FBBF24'],
  ['#6366F1', '#A855F7'],
  ['#EF4444', '#F97316'],
  ['#0EA5E9', '#22D3EE'],
  ['#10B981', '#84CC16'],
]

export function placeholderImage(seed: string, label: string): string {
  const h = hashString(seed)
  const [from, to] = PALETTE[h % PALETTE.length]
  const initial = (label.trim()[0] ?? '?').toUpperCase()
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/><stop offset="100%" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="600" height="600" fill="url(#g)"/>
    <circle cx="300" cy="250" r="120" fill="rgba(255,255,255,0.18)"/>
    <text x="300" y="320" font-family="Inter, system-ui, sans-serif" font-size="160" font-weight="700" fill="rgba(255,255,255,0.92)" text-anchor="middle">${initial}</text>
  </svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function stockStatusFor(stock: number): StockStatus {
  if (stock <= 0) return 'out_of_stock'
  if (stock < 20) return 'low_stock'
  return 'in_stock'
}

export function deriveStorefrontFields(p: Product): StoreProduct {
  const h = hashString(`${p.id}:${p.name}`)
  const rating = Math.round((3.5 + (h % 15) / 10) * 10) / 10
  const reviewCount = 12 + (h % 480)
  const stock = p.status === 'active' ? 5 + (h % 240) : 0
  const onSale = h % 3 === 0
  const discountPercent = onSale ? 10 + (h % 21) : 0
  const salePrice = onSale ? Math.round(p.sellingPrice * (1 - discountPercent / 100)) : undefined

  return {
    ...p,
    image: placeholderImage(p.id, p.name),
    rating,
    reviewCount,
    stock,
    stockStatus: stockStatusFor(stock),
    salePrice,
    discountPercent: onSale ? discountPercent : undefined,
  }
}

export function applyProductFilters(products: StoreProduct[], filters: ProductFilters): StoreProduct[] {
  const q = filters.search?.trim().toLowerCase()
  let result = products.filter((p) => {
    if (q && !p.name.toLowerCase().includes(q)) return false
    if (filters.categoryId && p.categoryId !== filters.categoryId) return false
    if (filters.brandId && p.brand !== filters.brandId) return false
    if (filters.minPrice != null && (p.salePrice ?? p.sellingPrice) < filters.minPrice) return false
    if (filters.maxPrice != null && (p.salePrice ?? p.sellingPrice) > filters.maxPrice) return false
    if (filters.inStockOnly && p.stockStatus === 'out_of_stock') return false
    if (filters.rating != null && p.rating < filters.rating) return false
    return true
  })

  const sort = filters.sort ?? 'newest'
  result = [...result].sort((a, b) => {
    switch (sort) {
      case 'price_asc':
        return (a.salePrice ?? a.sellingPrice) - (b.salePrice ?? b.sellingPrice)
      case 'price_desc':
        return (b.salePrice ?? b.sellingPrice) - (a.salePrice ?? a.sellingPrice)
      case 'name_asc':
        return a.name.localeCompare(b.name)
      case 'rating':
        return b.rating - a.rating
      case 'newest':
      default:
        return b.createdAt.localeCompare(a.createdAt)
    }
  })
  return result
}

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: 'In stock',
  low_stock: 'Low stock',
  out_of_stock: 'Out of stock',
}