import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2 } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/format'
import { useCartStore } from '../store/cartStore'
import { EmptyState } from '../components/EmptyState'

export function CartPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)
  const subtotal = useCartStore((s) => s.subtotal())

  if (items.length === 0) {
    return (
      <div className="container max-w-3xl py-16">
        <EmptyState
          title={t('storefront.cart.empty')}
          description={t('storefront.cart.emptyDesc')}
          actionLabel={t('storefront.cart.shopNow')}
          onAction={() => navigate('/shop/products')}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('storefront.cart.title')}</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="flex gap-4 p-4 shadow-store">
              <Link to={`/shop/product/${item.id}`} className="shrink-0">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
              </Link>
              <div className="flex flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <Link to={`/shop/product/${item.id}`} className="font-semibold hover:text-primary">
                    {item.name}
                  </Link>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-muted-foreground hover:text-destructive"
                    aria-label={`${t('storefront.cart.remove')}: ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.salePrice ?? item.price)} {t('storefront.cart.each')}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(item.id, item.quantity - 1)}
                      aria-label={t('storefront.cart.decreaseQty')}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center tabular-nums">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setQuantity(item.id, item.quantity + 1)}
                      aria-label={t('storefront.cart.increaseQty')}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="font-bold">{formatCurrency((item.salePrice ?? item.price) * item.quantity)}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="h-fit p-5 shadow-store">
          <h2 className="font-display text-lg font-semibold">{t('storefront.cart.orderSummary')}</h2>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('storefront.cart.subtotal')}</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('storefront.cart.shipping')}</span>
            <span className="font-medium">{t('storefront.cart.shippingCalc')}</span>
          </div>
          <div className="my-4 border-t" />
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('storefront.cart.total')}</span>
            <span className="text-xl font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <Button className="mt-4 w-full" size="lg" onClick={() => navigate('/shop/checkout')}>
            {t('storefront.cart.checkout')}
          </Button>
          <Button asChild variant="ghost" className="mt-2 w-full">
            <Link to="/shop/products">{t('storefront.cart.continueShopping')}</Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}