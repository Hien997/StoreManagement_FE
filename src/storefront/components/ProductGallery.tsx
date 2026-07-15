import { useState } from 'react'
import { cn } from '@/shared/lib/utils'
import type { StoreProduct } from '../types'

export function ProductGallery({ product }: { product: StoreProduct }) {
  const [active, setActive] = useState(0)
  const views = [product.image, product.image, product.image, product.image]
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
        <img
          src={views[active]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {views.map((v, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              'aspect-square overflow-hidden rounded-lg border-2 transition-colors',
              active === i ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30',
            )}
          >
            <img src={v} alt={`${product.name} view ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}