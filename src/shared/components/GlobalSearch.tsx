import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Package, ShoppingCart, Users, Truck, Tags } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { useProducts } from '@/features/products/hooks'
import { useOrders } from '@/features/orders/hooks'
import { useCustomers } from '@/features/customers/hooks'
import { useSuppliers } from '@/features/suppliers/hooks'
import { useCategories } from '@/features/categories/hooks'
import { cn } from '@/shared/lib/utils'

interface SearchResult {
  id: string
  label: string
  sub: string
  type: 'product' | 'order' | 'customer' | 'supplier' | 'category'
  href: string
}

const typeIcon = { product: Package, order: ShoppingCart, customer: Users, supplier: Truck, category: Tags }

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [query, setQuery] = React.useState('')
  const navigate = useNavigate()

  const { data: productsData } = useProducts({ limit: 100 })
  const { data: ordersData } = useOrders({ limit: 100 })
  const { data: customersData } = useCustomers({ limit: 100 })
  const { data: suppliersData } = useSuppliers({ limit: 100 })
  const { data: categoriesData } = useCategories({ limit: 100 })

  const results: SearchResult[] = React.useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const out: SearchResult[] = []
    ;(productsData?.items ?? [])
      .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
      .slice(0, 5)
      .forEach((p) =>
        out.push({ id: String(p.id), label: p.name, sub: p.sku, type: 'product', href: `/products/${p.id}` }),
      )
    ;(ordersData?.items ?? [])
      .filter((o) => o.reference.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((o) =>
        out.push({ id: String(o.id), label: o.reference, sub: '', type: 'order', href: `/orders/${o.id}` }),
      )
    ;(customersData?.items ?? [])
      .filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
      .slice(0, 4)
      .forEach((c) =>
        out.push({ id: String(c.id), label: c.name, sub: c.email, type: 'customer', href: `/customers/${c.id}` }),
      )
    ;(suppliersData?.items ?? [])
      .filter((s) => s.name.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((s) =>
        out.push({ id: String(s.id), label: s.name, sub: s.email, type: 'supplier', href: `/suppliers/${s.id}` }),
      )
    ;(categoriesData?.items ?? [])
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((c) =>
        out.push({ id: String(c.id), label: c.name, sub: 'Category', type: 'category', href: `/categories` }),
      )
    return out
  }, [query, productsData, ordersData, customersData, suppliersData, categoriesData])

  const go = (href: string) => {
    navigate(href)
    onOpenChange(false)
    setQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 text-muted-foreground" />
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, orders, customers..."
            className="h-12 border-0 focus-visible:ring-0"
          />
        </div>
        <div className="max-h-80 overflow-y-auto p-2">
          {query && results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">No results for "{query}"</p>
          )}
          {!query && (
            <p className="py-8 text-center text-sm text-muted-foreground">Type to search across your store</p>
          )}
          {results.map((r) => {
            const Icon = typeIcon[r.type]
            return (
              <button
                key={`${r.type}-${r.id}`}
                onClick={() => go(r.href)}
                className={cn('flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm hover:bg-accent')}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{r.label}</p>
                  <p className="text-xs text-muted-foreground">{r.sub}</p>
                </div>
                <span className="text-xs capitalize text-muted-foreground">{r.type}</span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}