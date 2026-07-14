import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Plus, ShoppingCart, Trash2 } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select'
import { useOrders, useDeleteOrder, useUpdateOrderStatus } from '@/features/orders/hooks'
import { toOrder } from '@/types/api/mappers'
import type { Order, OrderStatus } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useToast } from '@/shared/components/ui/toast'
import { useTranslation } from 'react-i18next'

const statusVariant: Record<OrderStatus, 'success' | 'secondary' | 'warning' | 'info' | 'danger'> = {
  draft: 'secondary',
  pending: 'warning',
  paid: 'info',
  completed: 'success',
  cancelled: 'danger',
}

const statusOptions: OrderStatus[] = ['pending', 'completed', 'cancelled']

export function OrdersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { data, isLoading } = useOrders({ limit: 100 })
  const deleteOrder = useDeleteOrder()
  const updateOrderStatus = useUpdateOrderStatus()
  const orders = React.useMemo(() => (data?.items ?? []).map(toOrder), [data])

  const [deleteTarget, setDeleteTarget] = React.useState<Order | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteOrder.mutateAsync(Number(deleteTarget.id))
      toast({ title: t('order.deleted'), variant: 'destructive' })
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = (order: Order, status: 'pending' | 'completed' | 'cancelled') => {
    updateOrderStatus.mutate(
      { id: Number(order.id), body: { status } },
      {
        onError: (err: { message?: string }) =>
          toast({ title: t('order.updateStatusFailed'), description: err.message, variant: 'destructive' }),
      },
    )
  }

  const columns: ColumnDef<Order>[] = [
    { accessorKey: 'orderNumber', header: t('order.orderNumber'), cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span> },
    { accessorKey: 'customerName', header: t('order.customer'), cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span> },
    {
      accessorKey: 'status',
      header: t('common.status'),
      cell: ({ row }) => (
        <Select
          value={row.original.status as 'pending' | 'completed' | 'cancelled'}
          onValueChange={(v) => handleStatusChange(row.original, v as 'pending' | 'completed' | 'cancelled')}
        >
          <SelectTrigger className="h-8 w-36">
            <SelectValue>
              <Badge variant={statusVariant[row.original.status]} className="capitalize">
                {row.original.status}
              </Badge>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ),
    },
    { accessorKey: 'total', header: t('common.total'), cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue<number>())}</span> },
    { accessorKey: 'createdAt', header: t('common.date'), cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/orders/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('order.title')}
        description={t('order.description', { count: orders.length })}
        actions={
          <Button onClick={() => navigate('/orders/new')}>
            <Plus className="h-4 w-4" /> {t('order.add')}
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={orders}
        searchKey="orderNumber"
        searchPlaceholder={t('common.searchOrders')}
        loading={isLoading}
        toolbar={
          <Button variant="outline" onClick={() => navigate('/orders/new')}>
            <ShoppingCart className="h-4 w-4" /> {t('order.create')}
          </Button>
        }
        onRowClick={(o) => navigate(`/orders/${o.id}`)}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t('order.deleteTitle')}
        description={t('order.deleteDescription', { orderNumber: deleteTarget?.orderNumber })}
        confirmText={deleting ? t('common.deleting') : t('common.delete')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}