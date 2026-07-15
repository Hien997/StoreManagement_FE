import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'

import { Card } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { cn } from '@/shared/lib/utils'
import type { StoreProduct } from '../types'
import { Rating } from './Rating'
import { ProductPrice } from './ProductPrice'
import { ProductBadge } from './ProductBadge'
import { AddToCartButton } from './AddToCartButton'

interface ProductCardProps {
  product: StoreProduct
  view?: 'grid' | 'list'
}

function ProductCardBase({ product, view = 'grid' }: ProductCardProps) {
  if (view === 'list') {
    return (
      <Card className="flex flex-col gap-4 overflow-hidden p-3 sm:flex-row sm:items-center">
        <Link to={`/shop/product/${product.id}`} className="shrink-0">
          <img src={product.image} alt={product.name} className="h-28 w-28 rounded-lg object-cover" loading="lazy" />
        </Link>
        <div className="flex flex-1 flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <Link to={`/shop/product/${product.id}`} className="line-clamp-1 font-semibold hover:text-primary">
              {product.name}
            </Link>
            <ProductBadge product={product} />
          </div>
          <Rating value={product.rating} count={product.reviewCount} />
          <p className="line-clamp-1 text-sm text-muted-foreground">{product.categoryName ?? product.brandName}</p>
          <ProductPrice product={product} />
        </div>
        <Button size="sm" className="shrink-0 self-start sm:self-center" disabled={product.stockStatus === 'out_of_stock'}>
          <ShoppingBag className="h-4 w-4" /> Add to cart
        </Button>
      </Card>
    )
  }

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }}>
      <Card className="card-lift group flex h-full flex-col overflow-hidden shadow-store">
        <Link to={`/shop/product/${product.id}`} className="relative block aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-2 top-2">
            <ProductBadge product={product} />
          </div>
          <div className="quick-view absolute inset-x-2 bottom-2">
            <Button asChild size="sm" className="w-full" variant="secondary">
              <Link to={`/shop/product/${product.id}`}>Quick view</Link>
            </Button>
          </div>
        </Link>
        <div className="flex flex-1 flex-col gap-2 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {product.brandName ?? 'Brand'}
            </span>
            <Rating value={product.rating} count={product.reviewCount} />
          </div>
          <Link to={`/shop/product/${product.id}`} className={cn('line-clamp-2 min-h-[2.5rem] font-semibold leading-tight hover:text-primary')}>
            {product.name}
          </Link>
          <div className="mt-auto flex items-center justify-between pt-2">
            <ProductPrice product={product} />
            <AddToCartButton product={product} size="icon" variant="secondary" aria-label="Add to cart" />
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export const ProductCard = memo(ProductCardBase)
