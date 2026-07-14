import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { useCustomers } from '@/features/customers/hooks'
import { useOrders } from '@/features/orders/hooks'
import { toCustomer, toOrder } from '@/types/api/mappers'
import type { Customer } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'

export function CustomersPage() {
  const navigate = useNavigate()
  const { data: customersData, isLoading } = useCustomers({ limit: 100 })
  const { data: ordersData } = useOrders({ limit: 100 })
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

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: 'name',
      header: 'Customer',
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
    { accessorKey: 'phone', header: 'Phone', cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span> },
    {
      id: 'orders',
      header: 'Orders',
      cell: ({ row }) => <span className="text-sm">{ordersByCustomer[row.original.id]?.count ?? 0}</span>,
    },
    {
      id: 'spent',
      header: 'Total Spent',
      cell: ({ row }) => <span className="font-medium">{formatCurrency(ordersByCustomer[row.original.id]?.total ?? 0)}</span>,
    },
    { accessorKey: 'createdAt', header: 'Joined', cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end">
          <button className="rounded-md p-2 hover:bg-accent" onClick={() => navigate(`/customers/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Customers" description={`${customers.length} customers`} />
      <DataTable
        columns={columns}
        data={customers}
        searchKey="name"
        searchPlaceholder="Search customers..."
        loading={isLoading}
        onRowClick={(c) => navigate(`/customers/${c.id}`)}
      />
    </div>
  )
}