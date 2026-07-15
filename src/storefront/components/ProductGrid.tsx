import { memo } from 'react'
import type { StoreProduct } from '../types'
import { ProductCard } from './ProductCard'

interface ProductGridProps {
  products: StoreProduct[]
  view?: 'grid' | 'list'
}

function ProductGridBase({ products, view = 'grid' }: ProductGridProps) {
  if (view === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} view="list" />
        ))}
      </div>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}

export const ProductGrid = memo(ProductGridBase)
