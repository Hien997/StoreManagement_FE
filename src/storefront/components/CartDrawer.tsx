import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { formatCurrency } from '@/shared/lib/format'
import { useCartStore } from '../store/cartStore'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const { t } = useTranslation()
  const items = useCartStore((s) => s.items)
  const setQuantity = useCartStore((s) => s.setQuantity)
  const remove = useCartStore((s) => s.remove)
  const subtotal = useCartStore((s) => s.subtotal())

  return (
    <>
      {open && <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose} aria-hidden />}
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-card shadow-store-lg transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-label={t('storefront.cart.title')}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" /> {t('storefront.cart.title')}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label={t('storefront.cart.closeCart')}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t('storefront.cart.empty')}</p>
            <Button asChild onClick={onClose}>
              <Link to="/shop/products">{t('storefront.cart.shopNow')}</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 rounded-xl border p-3">
                  <img src={item.image} alt={item.name} className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/shop/product/${item.id}`} onClick={onClose} className="line-clamp-2 text-sm font-medium hover:text-primary">
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
                    <p className="text-sm font-semibold">{formatCurrency(item.salePrice ?? item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                        aria-label={t('storefront.cart.decreaseQty')}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                        aria-label={t('storefront.cart.increaseQty')}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('storefront.cart.subtotal')}</span>
                <span className="text-lg font-bold">{formatCurrency(subtotal)}</span>
              </div>
              <Button asChild className="w-full" onClick={onClose}>
                <Link to="/shop/cart">{t('storefront.cart.viewCartCheckout')}</Link>
              </Button>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
