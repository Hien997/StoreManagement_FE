import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Search } from 'lucide-react'

import { Input } from '@/shared/components/ui/input'
import { useStoreBrands, useStoreProducts } from '../hooks'
import { BrandCard } from '../components/BrandCard'
import { ErrorState } from '../components/ErrorState'
import { EmptyState } from '../components/EmptyState'

export function BrandsPage() {
  const { t } = useTranslation()
  const brands = useStoreBrands()
  const products = useStoreProducts()
  const [q, setQ] = useState('')

  const enriched = useMemo(() => {
    const counts = new Map<string, number>()
    ;(products.data ?? []).forEach((p) => counts.set(p.brand, (counts.get(p.brand) ?? 0) + 1))
    return (brands.data ?? []).map((b) => ({ ...b, productCount: counts.get(b.id) ?? 0 }))
  }, [brands.data, products.data])

  const filtered = enriched.filter((b) => b.name.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('storefront.brands.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('storefront.brands.subtitle')}</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('storefront.products.searchBrands')} className="pl-9" />
        </div>
      </div>

      {brands.isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : brands.isError ? (
        <ErrorState onRetry={() => brands.refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState title={t('storefront.brands.noBrands')} description={t('storefront.brands.noBrandsDesc')} />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((b) => (
            <BrandCard key={b.id} brand={b} />
          ))}
        </div>
      )}
    </div>
  )
}
