import * as React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { Badge } from '@/shared/components/ui/badge'
import { useCustomer } from '@/features/customers/hooks'
import { useOrders } from '@/features/orders/hooks'
import { toCustomer, toOrder } from '@/types/api/mappers'
import { formatCurrency, formatDate } from '@/shared/lib/format'

export function CustomerDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const customerId = Number(id)
  const { data: customerData, isLoading } = useCustomer(customerId)
  const { data: ordersData } = useOrders({ limit: 100 })
  const customer = customerData ? toCustomer(customerData) : null
  const orders = React.useMemo(() => (ordersData?.items ?? []).map(toOrder), [ordersData])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <p className="text-muted-foreground">Loading customer…</p>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/customers')}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <p className="text-muted-foreground">Customer not found.</p>
      </div>
    )
  }

  const customerOrders = orders.filter((o) => o.customerId === customer.id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/customers')}>
        <ArrowLeft className="h-4 w-4" /> Back to Customers
      </Button>

      <PageHeader title={customer.name} description={`Customer since ${formatDate(customer.createdAt)}`} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center p-6 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${customer.id}`} alt={customer.name} />
              <AvatarFallback className="text-2xl">{customer.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <h2 className="mt-4 text-lg font-semibold">{customer.name}</h2>
            <div className="mt-3 space-y-1 text-sm text-muted-foreground">
              <p className="flex items-center justify-center gap-1"><Mail className="h-3.5 w-3.5" /> {customer.email}</p>
              <p className="flex items-center justify-center gap-1"><Phone className="h-3.5 w-3.5" /> {customer.phone}</p>
              <p className="flex items-center justify-center gap-1"><MapPin className="h-3.5 w-3.5" /> {customer.address}</p>
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-lg font-bold">{customer.totalOrders}</p>
                <p className="text-xs text-muted-foreground">Orders</p>
              </div>
              <div className="rounded-lg bg-muted p-3 text-center">
                <p className="text-lg font-bold">{formatCurrency(customer.totalSpent)}</p>
                <p className="text-xs text-muted-foreground">Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Order History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customerOrders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              customerOrders.map((o) => (
                <Link
                  key={o.id}
                  to={`/orders/${o.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{o.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(o.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(o.total)}</p>
                    <Badge variant={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'} className="capitalize">
                      {o.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}