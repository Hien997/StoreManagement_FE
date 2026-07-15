import { formatCurrency } from '@/shared/lib/format'
import { cn } from '@/shared/lib/utils'
import type { StoreProduct } from '../types'

interface ProductPriceProps {
  product: StoreProduct
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
}

export function ProductPrice({ product, className, size = 'md' }: ProductPriceProps) {
  const onSale = product.salePrice != null
  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      <span className={cn('font-bold text-foreground', sizeMap[size])}>
        {formatCurrency(product.salePrice ?? product.sellingPrice)}
      </span>
      {onSale && (
        <span className={cn('text-sm text-muted-foreground line-through', size === 'lg' && 'text-base')}>
          {formatCurrency(product.sellingPrice)}
        </span>
      )}
    </div>
  )
}