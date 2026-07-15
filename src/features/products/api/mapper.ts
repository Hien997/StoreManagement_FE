import type { Product, ProductStatus } from '@/shared/lib/types'
import type { ProductResponse } from './types'

export function mapProduct(p: ProductResponse): Product {
  return {
    id: String(p.id),
    sku: p.sku,
    barcode: '',
    name: p.name,
    description: p.description ?? '',
    categoryId: String(p.category_id),
    brand: String(p.brand_id),
    supplierId: String(p.supplier_id),
    purchasePrice: p.cost_price,
    sellingPrice: p.sale_price,
    stock: 0,
    unit: String(p.unit_id),
    status: (p.active ? 'active' : 'inactive') as ProductStatus,
    imageUrl: '',
    expiredDate: p.expired_date ?? '',
    createdAt: p.created_at ?? '',
    updatedAt: '',
  }
}