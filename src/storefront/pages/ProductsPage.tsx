import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/shared/components/ui/sheet'
import { useStoreProducts, useStoreCategories, useStoreBrands } from '../hooks'
import { applyProductFilters } from '../utils'
import type { ProductFilters, ProductSort, ViewMode } from '../types'
import { ProductGrid } from '../components/ProductGrid'
import { FilterSidebar } from '../components/FilterSidebar'
import { SortDropdown } from '../components/SortDropdown'
import { Pagination } from '../components/Pagination'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'

const PAGE_SIZE = 12

export function ProductsPage() {
  const { t } = useTranslation()
  const { categoryId, brandId } = useParams<{ categoryId?: string; brandId?: string }>()
  const products = useStoreProducts()
  const categories = useStoreCategories()
  const brands = useStoreBrands()

  const [filters, setFilters] = useState<ProductFilters>(() => ({
    sort: 'newest',
    categoryId,
    brandId,
  }))
  const [view, setView] = useState<ViewMode>('grid')
  const [page, setPage] = useState(1)

  const priceRange = useMemo<[number, number]>(() => {
    const list = products.data ?? []
    if (!list.length) return [0, 1000000]
    const prices = list.map((p) => p.salePrice ?? p.sellingPrice)
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]
  }, [products.data])

  const filtered = useMemo(
    () => applyProductFilters(products.data ?? [], filters),
    [products.data, filters],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, pageCount)
  const paged = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE)

  const onFilterChange = (next: ProductFilters) => {
    setFilters(next)
    setPage(1)
  }

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{t('storefront.products.allProducts')}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {products.isLoading ? t('common.loading') : t('storefront.products.resultsCount', { count: filtered.length })}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border p-5">
            <FilterSidebar
              filters={filters}
              onChange={onFilterChange}
              categories={categories.data ?? []}
              brands={brands.data ?? []}
              priceRange={priceRange}
            />
          </div>
        </aside>

        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden">
                  <SlidersHorizontal className="h-4 w-4" /> {t('storefront.products.filters')}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 overflow-y-auto">
                <SheetTitle>{t('storefront.products.filters')}</SheetTitle>
                <div className="mt-4">
                  <FilterSidebar
                    filters={filters}
                    onChange={onFilterChange}
                    categories={categories.data ?? []}
                    brands={brands.data ?? []}
                    priceRange={priceRange}
                  />
                </div>
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2">
              <SortDropdown value={(filters.sort ?? 'newest') as ProductSort} onChange={(sort) => onFilterChange({ ...filters, sort })} />
              <div className="hidden items-center rounded-md border p-0.5 sm:flex">
                <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('grid')} aria-label={t('storefront.products.gridView')}>
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setView('list')} aria-label={t('storefront.products.listView')}>
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {products.isLoading ? (
            <ProductGridSkeleton view={view} count={PAGE_SIZE} />
          ) : products.isError ? (
            <ErrorState onRetry={() => products.refetch()} />
          ) : filtered.length === 0 ? (
            <EmptyState actionLabel={t('storefront.products.clearFilters')} onAction={() => onFilterChange({ sort: filters.sort })} />
          ) : (
            <>
              <ProductGrid products={paged} view={view} />
              <div className="mt-8">
                <Pagination page={current} pageCount={pageCount} onChange={setPage} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
