import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

import { Input } from '@/shared/components/ui/input'
import { useStoreCategories, useStoreProducts } from '../hooks'
import { CategoryCard } from '../components/CategoryCard'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'

export function CategoriesPage() {
  const { t } = useTranslation()
  const categories = useStoreCategories()
  const products = useStoreProducts()
  const [q, setQ] = useState('')

  const enriched = useMemo(() => {
    const counts = new Map<string, number>()
    ;(products.data ?? []).forEach((p) => counts.set(p.categoryId, (counts.get(p.categoryId) ?? 0) + 1))
    return (categories.data ?? []).map((c) => ({ ...c, productCount: counts.get(c.id) ?? c.productCount }))
  }, [categories.data, products.data])

  const filtered = enriched.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('storefront.categories.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('storefront.categories.subtitle')}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('storefront.products.searchCategories')} className="pl-9" />
        </div>
      </div>

      {categories.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : categories.isError ? (
        <ErrorState onRetry={() => categories.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('storefront.categories.noCategories')} description={t('storefront.categories.noCategoriesDesc')} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      )}
    </div>
  )
}
