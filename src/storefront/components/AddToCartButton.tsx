import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, ShoppingBag } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { useToast } from '@/shared/components/ui/toast'
import { useCartStore } from '../store/cartStore'
import type { StoreProduct } from '../types'

interface AddToCartButtonProps {
  product: StoreProduct
  quantity?: number
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  fullWidth?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  className,
  size = 'default',
  variant = 'default',
  fullWidth,
}: AddToCartButtonProps) {
  const { t } = useTranslation()
  const add = useCartStore((s) => s.add)
  const toast = useToast()
  const [added, setAdded] = useState(false)

  const disabled = product.stockStatus === 'out_of_stock'

  const handleAdd = () => {
    if (disabled) return
    add(product, quantity)
    toast({ title: t('storefront.product.addedToCart'), description: product.name, variant: 'success' })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1200)
  }

  return (
    <Button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      size={size}
      variant={variant}
      className={className}
      style={fullWidth ? { width: '100%' } : undefined}
    >
      {added ? <Check className="h-4 w-4" /> : <ShoppingBag className="h-4 w-4" />}
      {disabled ? t('storefront.product.outOfStock') : added ? t('storefront.product.added') : t('storefront.product.addToCart')}
    </Button>
  )
}
