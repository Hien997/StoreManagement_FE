import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Package } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { formatCurrency } from '@/shared/lib/format'
import { useMyOrders } from '../hooks'
import { EmptyState } from '../components/EmptyState'

const statusStyles: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  paid: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300',
  draft: 'bg-muted text-muted-foreground',
}

export function OrdersPage() {
  const { t } = useTranslation()
  const { myOrders, isLoading } = useMyOrders()

  if (isLoading) {
    return (
      <div className="container max-w-3xl py-16">
        <div className="mx-auto h-64 max-w-xl animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (myOrders.length === 0) {
    return (
      <div className="container max-w-3xl py-16">
        <EmptyState
          title={t('storefront.order.noOrders')}
          description={t('storefront.order.noOrdersDesc')}
          actionLabel={t('storefront.order.startShopping')}
          onAction={() => (window.location.href = '/shop/products')}
        />
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('storefront.order.myOrders')}</h1>

      <div className="mt-6 space-y-3">
        {myOrders.map((order) => {
          const total = order.items.reduce((s, i) => s + i.unit_price * i.quantity, 0)
          return (
            <Card key={order.id} className="flex items-center gap-4 p-4 shadow-store">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{order.reference}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      statusStyles[order.status] ?? 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('storefront.order.itemCount', { count: order.items.length })} · {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(total)}</p>
                <Button asChild variant="link" size="sm" className="mt-1 h-auto p-0">
                  <Link to={`/shop/order/${order.id}`}>{t('common.view')}</Link>
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
