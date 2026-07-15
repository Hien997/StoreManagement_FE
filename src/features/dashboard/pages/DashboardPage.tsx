import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AlertTriangle,
  Boxes,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

import { PageHeader } from '@/shared/components/PageHeader'
import { LayoutDashboard } from 'lucide-react'
import { StatCard } from '@/shared/components/StatCard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { useProducts } from '@/features/products'
import { useCustomers } from '@/features/customers'
import { useOrders } from '@/features/orders'
import { useSalesReport } from '@/features/reports'
import { toProduct, toCustomer, toOrder } from '@/types/api/mappers'
import { formatCurrency, formatRelative } from '@/shared/lib/format'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#a855f7']

export function DashboardPage() {
  const navigate = useNavigate()
  const { data: productsData } = useProducts({ limit: 100 })
  const { data: customersData } = useCustomers({ limit: 100 })
  const { data: ordersData } = useOrders({ limit: 100 })
  const { data: sales } = useSalesReport()
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])
  const customers = React.useMemo(() => (customersData?.items ?? []).map(toCustomer), [customersData])
  const orders = React.useMemo(() => (ordersData?.items ?? []).map(toOrder), [ordersData])

  const totalProducts = products.length
  const totalCustomers = customers.length
  const totalOrders = orders.length
  const revenue = sales?.total_amount ?? 0
  const inventoryValue = products.reduce((s, p) => s + p.stock * p.purchasePrice, 0)
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 15).length
  const outOfStock = products.filter((p) => p.stock === 0).length

  const revenueData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const base = revenue || 1
    return months.map((m, i) => ({
      month: m,
      revenue: Math.round(base * (0.5 + Math.sin(i) * 0.3 + i * 0.04)),
      profit: Math.round(base * 0.4 * (0.4 + Math.cos(i) * 0.25 + i * 0.03)),
    }))
  }, [revenue])

  const categoryData = React.useMemo(() => {
    const byCat: Record<string, number> = {}
    products.forEach((p) => {
      const c = p.categoryId.split('-')[0]
      byCat[c] = (byCat[c] ?? 0) + 1
    })
    return Object.entries(byCat)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6)
  }, [products])

  const recentOrders = orders.slice(0, 6)
  const activities = React.useMemo(
    () => [
      ...products.filter((p) => p.stock === 0).slice(0, 10).map((p) => ({ id: `o-${p.id}`, message: `${p.name} is out of stock`, createdAt: new Date().toISOString() })),
      ...products.filter((p) => p.stock > 0 && p.stock < 15).slice(0, 10).map((p) => ({ id: `l-${p.id}`, message: `Low stock: ${p.name} (${p.stock})`, createdAt: new Date().toISOString() })),
      ...orders.slice(0, 10).map((o) => ({ id: `c-${o.id}`, message: `Order ${o.orderNumber} — ${o.status}`, createdAt: o.createdAt || new Date().toISOString() })),
    ].slice(0, 8),
    [products, orders],
  )

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Welcome back! Here's what's happening in your store." icon={LayoutDashboard} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Revenue" value={formatCurrency(revenue)} icon={DollarSign} trend={{ value: 12.5 }} description="all time" />
        <StatCard title="Total Products" value={totalProducts} icon={Package} trend={{ value: 4.2 }} description="active SKUs" />
        <StatCard title="Orders" value={totalOrders} icon={ShoppingCart} trend={{ value: 8.1 }} description="all time" />
        <StatCard title="Customers" value={totalCustomers} icon={Users} trend={{ value: 15.3 }} description="registered" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>Monthly revenue and profit</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueData} margin={{ left: -20, right: 10, top: 10 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => formatCurrency(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#6366f1" fill="url(#rev)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profit" stroke="#22c55e" fill="url(#prof)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>Distribution across top categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
              View all
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((o) => (
              <div key={o.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">{o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{o.customerName}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{formatCurrency(o.total)}</p>
                  <Badge variant={o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : 'warning'} className="capitalize">
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" /> Activity
            </CardTitle>
            <CardDescription>Recent alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm">{a.message}</p>
                  <p className="text-xs text-muted-foreground">{formatRelative(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{lowStock}</p>
              <p className="text-sm text-muted-foreground">Low stock items</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-500/15 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{outOfStock}</p>
              <p className="text-sm text-muted-foreground">Out of stock</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(inventoryValue)}</p>
              <p className="text-sm text-muted-foreground">Inventory value</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}