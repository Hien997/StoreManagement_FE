import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams, Link } from 'react-router-dom'
import { Search, Clock, Flame, X } from 'lucide-react'

import { useStoreProducts } from '../hooks'
import { applyProductFilters } from '../utils'
import { ProductGrid } from '../components/ProductGrid'
import { SearchBox } from '../components/SearchBox'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'

const RECENT_KEY = 'store.recent_searches'
const POPULAR = ['Milk', 'Coffee', 'Rice', 'Snack', 'Water']

export function SearchPage() {
  const { t } = useTranslation()
  const [params, setParams] = useSearchParams()
  const initial = params.get('q') ?? ''
  const [q, setQ] = useState(initial)
  const products = useStoreProducts()

  useEffect(() => {
    setQ(initial)
  }, [initial])

  const recent = useMemo<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]')
    } catch {
      return []
    }
  }, [])

  const saveRecent = (term: string) => {
    if (!term.trim()) return
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, 6)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
  }

  const results = useMemo(
    () => applyProductFilters(products.data ?? [], { search: q, sort: 'newest' }),
    [products.data, q],
  )

  const suggestions = useMemo(() => {
    if (!q.trim()) return []
    const term = q.toLowerCase()
    return (products.data ?? [])
      .filter((p) => p.name.toLowerCase().includes(term))
      .slice(0, 6)
  }, [products.data, q])

  const runSearch = (term: string) => {
    setParams({ q: term })
    saveRecent(term)
  }

  return (
    <div className="container py-8">
      <h1 className="mb-4 text-3xl font-bold tracking-tight">{t('storefront.search.title')}</h1>
      <SearchBox value={q} onChange={(v) => setParams({ q: v })} autoFocus className="max-w-xl" />

      {!q.trim() && (
        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Clock className="h-4 w-4" /> {t('storefront.search.recentSearches')}
            </p>
            {recent.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t('storefront.search.noRecentSearches')}</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {recent.map((r) => (
                  <button
                    key={r}
                    onClick={() => runSearch(r)}
                    className="flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-accent"
                  >
                    {r}
                    <X
                      className="h-3 w-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        const next = recent.filter((x) => x !== r)
                        localStorage.setItem(RECENT_KEY, JSON.stringify(next))
                        setParams({})
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Flame className="h-4 w-4" /> {t('storefront.search.popularSearches')}
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button key={p} onClick={() => runSearch(p)} className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary hover:bg-primary/20">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {q.trim() && suggestions.length > 0 && suggestions.length < results.length && (
        <div className="mt-4 rounded-xl border p-2">
          {suggestions.map((s) => (
            <Link
              key={s.id}
              to={`/shop/product/${s.id}`}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              <Search className="h-4 w-4 text-muted-foreground" />
              {s.name}
            </Link>
          ))}
        </div>
      )}

      {q.trim() && (
        <div className="mt-6">
          {products.isLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products.isError ? (
            <ErrorState onRetry={() => products.refetch()} />
          ) : results.length === 0 ? (
            <EmptyState title={t('storefront.search.noResults', { query: q })} description={t('storefront.search.noResultsDesc')} />
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">{t('storefront.search.resultsFor', { count: results.length, query: q })}</p>
              <ProductGrid products={results} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
