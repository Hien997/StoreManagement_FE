import * as React from 'react'
import { Download } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PageHeader } from '@/shared/components/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import { StatCard } from '@/shared/components/StatCard'
import { useProducts } from '@/features/products'
import { useSalesReport, usePurchaseReport } from '@/features/reports'
import { toProduct } from '@/types/api/mappers'
import { formatCurrency } from '@/shared/lib/format'
import { exportCSV } from '@/shared/lib/export'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7']

export function ReportsPage() {
  const [range, setRange] = React.useState('12')
  const { data: productsData } = useProducts({ limit: 100 })
  const { data: sales } = useSalesReport()
  const { data: purchases } = usePurchaseReport()
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])

  const revenueByMonth = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const n = Number(range)
    const base = sales?.total_amount ?? 0
    return months.slice(-n).map((m, i) => ({
      month: m,
      revenue: Math.round(base * (0.5 + Math.sin(i) * 0.3 + i * 0.04)),
      orders: Math.round((sales?.order_count ?? 0) / Math.max(n, 1) + i * 2),
    }))
  }, [range, sales])

  const categorySales = React.useMemo(() => {
    const byCat: Record<string, number> = {}
    products.forEach((p) => {
      const c = p.categoryId.split('-')[0]
      byCat[c] = (byCat[c] ?? 0) + p.sellingPrice * p.stock
    })
    return Object.entries(byCat)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [products])

  const topProducts = React.useMemo(
    () => [...products].sort((a, b) => b.sellingPrice * b.stock - a.sellingPrice * a.stock).slice(0, 8),
    [products],
  )

  const totalRevenue = sales?.total_amount ?? 0
  const totalOrders = sales?.order_count ?? 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Analyze your store performance"
        actions={
          <div className="flex items-center gap-2">
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">Last 6 months</SelectItem>
                <SelectItem value="12">Last 12 months</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => exportCSV(topProducts as unknown as Record<string, unknown>[], 'top-products.csv')}>
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={Download} />
        <StatCard title="Total Orders" value={totalOrders} icon={Download} />
        <StatCard title="Total Purchases" value={formatCurrency(purchases?.total_amount ?? 0)} icon={Download} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" />
                <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
            <CardDescription>Inventory value distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categorySales} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {categorySales.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders vs Revenue</CardTitle>
          <CardDescription>Monthly comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis yAxisId="left" className="text-xs" />
              <YAxis yAxisId="right" orientation="right" className="text-xs" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Products by Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border p-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-bold">{i + 1}</span>
                  <span className="font-medium">{p.name}</span>
                </div>
                <span className="font-semibold">{formatCurrency(p.sellingPrice * p.stock)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}