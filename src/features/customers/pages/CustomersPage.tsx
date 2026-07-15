import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2, Users } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { useCustomers, useDeleteCustomer } from '@/features/customers'
import { useOrders } from '@/features/orders'
import { toCustomer, toOrder } from '@/types/api/mappers'
import type { CustomerResponse } from '@/types/api'
import type { Customer } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useToast } from '@/shared/components/ui/toast'
import { CustomerFormDialog } from './CustomerFormDialog'

export function CustomersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: customersData, isLoading } = useCustomers({ limit: 100 })
  const { data: ordersData } = useOrders({ limit: 100 })
  const deleteCustomer = useDeleteCustomer()
  const customers = React.useMemo(() => (customersData?.items ?? []).map(toCustomer), [customersData])
  const orders = React.useMemo(() => (ordersData?.items ?? []).map(toOrder), [ordersData])

  const ordersByCustomer = React.useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {}
    orders.forEach((o) => {
      if (!map[o.customerId]) map[o.customerId] = { count: 0, total: 0 }
      map[o.customerId].count++
      map[o.customerId].total += o.total
    })
    return map
  }, [orders])

  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<CustomerResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Customer | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = React.useCallback(
    (c: Customer) => {
      const raw = customersData?.items.find((item) => String(item.id) === c.id) ?? null
      setEditing(raw)
      setFormOpen(true)
    },
    [customersData],
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCustomer.mutateAsync(Number(deleteTarget.id))
      toast({ title: t('customer.deleted'), variant: 'destructive' })
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('customer.customer'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${row.original.id}`} alt={row.original.name} />
              <AvatarFallback>{row.original.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'phone', header: t('customer.phone'), cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span> },
      {
        id: 'orders',
        header: t('customer.orders'),
        cell: ({ row }) => <span className="text-sm">{ordersByCustomer[row.original.id]?.count ?? 0}</span>,
      },
      {
        id: 'spent',
        header: t('customer.totalSpent'),
        cell: ({ row }) => <span className="font-medium">{formatCurrency(ordersByCustomer[row.original.id]?.total ?? 0)}</span>,
      },
      { accessorKey: 'createdAt', header: t('customer.joined'), cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span> },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" onClick={() => navigate(`/customers/${row.original.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [t, navigate, ordersByCustomer, openEdit],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('customer.title')}
        description={t('customer.description', { count: customers.length })}
        icon={Users}
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> {t('customer.add')}
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder={t('customer.searchPlaceholder')}
        loading={isLoading}
        onRowClick={(c) => navigate(`/customers/${c.id}`)}
      />

      <CustomerFormDialog open={formOpen} onOpenChange={setFormOpen} customer={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t('customer.deleteTitle')}
        description={t('customer.deleteDescription', { name: deleteTarget?.name })}
        confirmText={deleting ? t('common.deleting') : t('common.delete')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}