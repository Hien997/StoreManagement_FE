import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Boxes, Download, Package, TrendingDown, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { StatCard } from '@/shared/components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useProducts } from '@/features/products'
import { useInventory } from '@/features/inventory'
import { toProduct, toStockMovement } from '@/types/api/mappers'
import type { StockMovement } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { exportCSV } from '@/shared/lib/export'

const typeVariant: Record<StockMovement['type'], 'success' | 'danger' | 'warning'> = {
  in: 'success',
  out: 'danger',
  adjustment: 'warning',
}

export function InventoryPage() {
  const { data: productsData } = useProducts({ limit: 100 })
  const { data: inventoryData, isLoading } = useInventory({ limit: 100 })
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])
  const movements = React.useMemo(
    () => (inventoryData?.items ?? []).map((inv) => {
      const product = products.find((p) => p.id === String(inv.product_id))
      return toStockMovement(inv, product?.name ?? `Product #${inv.product_id}`)
    }),
    [inventoryData, products],
  )

  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 15)
  const outOfStock = products.filter((p) => p.stock === 0)
  const inventoryValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0)

  const movementData = React.useMemo(() => {
    const byDay: Record<string, { in: number; out: number }> = {}
    movements.forEach((m) => {
      const day = formatDate(m.createdAt || new Date().toISOString())
      if (!byDay[day]) byDay[day] = { in: 0, out: 0 }
      byDay[day][m.type === 'in' ? 'in' : 'out'] += m.quantity
    })
    return Object.entries(byDay).slice(-10).map(([day, v]) => ({ day, ...v }))
  }, [movements])

  const columns = React.useMemo<ColumnDef<StockMovement>[]>(
    () => [
      {
        accessorKey: 'productName',
        header: 'Product',
        cell: ({ getValue }) => <span className="font-medium">{getValue<string>()}</span>,
      },
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => (
          <Badge variant={typeVariant[row.original.type]} className="capitalize">
            {row.original.type}
          </Badge>
        ),
      },
      { accessorKey: 'quantity', header: 'Qty', cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span> },
      { accessorKey: 'note', header: 'Note', cell: ({ getValue }) => <span className="text-sm text-muted-foreground">{getValue<string>()}</span> },
      { accessorKey: 'createdAt', header: 'Date', cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span> },
    ],
    [],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title="Inventory"
        description="Track stock levels and movements"
        actions={
          <Button variant="outline" onClick={() => exportCSV(movements as unknown as Record<string, unknown>[], 'stock-movements.csv')}>
            <Download className="h-4 w-4" /> Export
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Inventory Value" value={formatCurrency(inventoryValue)} icon={Package} />
        <StatCard title="Total Products" value={products.length} icon={Boxes} />
        <StatCard title="Low Stock" value={lowStock.length} icon={TrendingDown} />
        <StatCard title="Out of Stock" value={outOfStock.length} icon={TrendingUp} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Stock Movement (last 10 days)</CardTitle>
            <CardDescription>Inbound vs outbound quantity</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={movementData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="in" name="In" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="out" name="Out" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alert</CardTitle>
            <CardDescription>Items below 15 units</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {lowStock.slice(0, 8).map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-2 text-sm">
                <span className="truncate">{p.name}</span>
                <Badge variant="warning">{p.stock}</Badge>
              </div>
            ))}
            {lowStock.length === 0 && <p className="text-sm text-muted-foreground">All stocked up!</p>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stock Movements</CardTitle>
          <CardDescription>{movements.length} recorded movements</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={movements} searchKey="productName" searchPlaceholder="Search movements..." pageSize={15} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}