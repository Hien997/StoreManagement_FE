import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { useOrder } from '@/features/orders/hooks'
import { useCustomer } from '@/features/customers/hooks'
import { toOrder, toCustomer } from '@/types/api/mappers'
import type { OrderStatus } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useTranslation } from 'react-i18next'

const statusVariant: Record<OrderStatus, 'success' | 'secondary' | 'warning' | 'info' | 'danger'> = {
  draft: 'secondary',
  pending: 'warning',
  paid: 'info',
  completed: 'success',
  cancelled: 'danger',
}

export function OrderDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const orderId = Number(id)
  const { data: orderData, isLoading } = useOrder(orderId)
  const { data: customerData } = useCustomer(orderData ? Number(orderData.customer_id) : 0)
  const order = orderData ? toOrder(orderData) : null
  const customer = customerData ? toCustomer(customerData) : null

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <p className="text-muted-foreground">{t('common.loadingOrder')}</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <p className="text-muted-foreground">{t('common.orderNotFound')}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/orders')}>
        <ArrowLeft className="h-4 w-4" /> {t('common.backToOrders')}
      </Button>

      <PageHeader
        title={order.orderNumber}
        description={formatDate(order.createdAt)}
        actions={
          <>
            <Badge variant={statusVariant[order.status]} className="capitalize text-sm">
              {order.status}
            </Badge>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> {t('order.print')}
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t('order.items')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{item.productName || t('common.productHash', { id: item.productId })}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.quantity} × {formatCurrency(item.price)}
                  </p>
                </div>
                <span className="font-semibold">{formatCurrency(item.quantity * item.price)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>{t('common.total')}</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('order.customer')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
                <p className="text-muted-foreground">{t('common.name')}</p>
              <Link to={`/customers/${customer?.id}`} className="font-medium hover:underline">
                {customer?.name ?? '—'}
              </Link>
            </div>
            <div>
                <p className="text-muted-foreground">{t('common.email')}</p>
              <p className="font-medium">{customer?.email ?? '—'}</p>
            </div>
            <div>
                <p className="text-muted-foreground">{t('common.phone')}</p>
              <p className="font-medium">{customer?.phone ?? '—'}</p>
            </div>
            <div>
                <p className="text-muted-foreground">{t('common.address')}</p>
              <p className="font-medium">{customer?.address ?? '—'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}