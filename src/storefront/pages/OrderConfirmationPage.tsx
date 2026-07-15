import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, Package } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { customerOrderService } from '@/features/customers/auth/orderService'
import { useQuery } from '@tanstack/react-query'
import { formatCurrency } from '@/shared/lib/format'

export function OrderConfirmationPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)

  const { data: order, isLoading } = useQuery({
    queryKey: ['store', 'order', orderId],
    queryFn: () => customerOrderService.getById(orderId),
    enabled: !!id,
  })

  return (
    <div className="container max-w-2xl py-16">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight">{t('storefront.order.confirmationTitle')}</h1>
        <p className="mt-2 text-muted-foreground">
          {t('storefront.order.confirmationDesc')}
        </p>
      </div>

      <Card className="mt-8 p-6 shadow-store">
        {isLoading || !order ? (
          <div className="h-32 animate-pulse rounded-lg bg-muted" />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{t('storefront.order.reference')}</p>
                <p className="font-display text-lg font-semibold">{order.reference}</p>
              </div>
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium capitalize text-secondary-foreground">
                {order.status}
              </span>
            </div>

            <div className="my-4 border-t" />

            <ul className="space-y-2 text-sm">
              {order.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-2">
                  <span className="text-muted-foreground">
                    {item.quantity}× {t('storefront.product.productHash', { id: item.product_id })}
                  </span>
                  <span className="font-medium">{formatCurrency(item.unit_price * item.quantity)}</span>
                </li>
              ))}
            </ul>

            <div className="my-4 border-t" />
            <div className="flex items-center justify-between">
              <span className="font-medium">{t('storefront.order.total')}</span>
              <span className="text-xl font-bold">
                {formatCurrency(order.items.reduce((s, i) => s + i.unit_price * i.quantity, 0))}
              </span>
            </div>

            {order.notes && <p className="mt-4 text-sm text-muted-foreground">{t('storefront.order.note')}: {order.notes}</p>}
          </>
        )}
      </Card>

      <div className="mt-6 flex justify-center gap-3">
        <Button asChild>
          <Link to="/shop/orders">
            <Package className="h-4 w-4" /> {t('storefront.order.viewMyOrders')}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/shop/products">{t('storefront.order.continueShopping')}</Link>
        </Button>
      </div>
    </div>
  )
}
