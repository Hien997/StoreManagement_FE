import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Switch } from '@/shared/components/ui/switch'
import { Label } from '@/shared/components/ui/label'
import { Separator } from '@/shared/components/ui/separator'
import { Button } from '@/shared/components/ui/button'
import { Rating } from './Rating'
import { cn } from '@/shared/lib/utils'
import type { Category, Brand } from '@/shared/lib/types'
import type { ProductFilters } from '../types'

interface FilterSidebarProps {
  filters: ProductFilters
  onChange: (next: ProductFilters) => void
  categories: Category[]
  brands: Brand[]
  priceRange: [number, number]
  className?: string
}

export function FilterSidebar({ filters, onChange, categories, brands, priceRange, className }: FilterSidebarProps) {
  const { t } = useTranslation()
  const [price, setPrice] = useState<[number, number]>([filters.minPrice ?? priceRange[0], filters.maxPrice ?? priceRange[1]])

  const set = (patch: Partial<ProductFilters>) => onChange({ ...filters, ...patch })

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">{t('storefront.products.filters')}</h3>
        <Button variant="link" size="sm" className="h-auto p-0" onClick={() => onChange({ sort: filters.sort })}>
          {t('storefront.products.clearAll')}
        </Button>
      </div>

      <div>
        <p className="mb-2 text-sm font-medium">{t('storefront.products.category')}</p>
        <div className="space-y-1">
          {categories.map((c) => (
            <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === c.id}
                onChange={() => set({ categoryId: filters.categoryId === c.id ? undefined : c.id })}
                className="accent-primary"
              />
              {c.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-2 text-sm font-medium">{t('storefront.products.brand')}</p>
        <div className="max-h-44 space-y-1 overflow-y-auto pr-1">
          {brands.map((b) => (
            <label key={b.id} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="brand"
                checked={filters.brandId === b.id}
                onChange={() => set({ brandId: filters.brandId === b.id ? undefined : b.id })}
                className="accent-primary"
              />
              {b.name}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-2 text-sm font-medium">{t('storefront.products.priceRange')}</p>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            step={1000}
            value={price[0]}
            onChange={(e) => setPrice([Number(e.target.value), price[1]])}
            onMouseUp={() => set({ minPrice: price[0] })}
            onTouchEnd={() => set({ minPrice: price[0] })}
            className="w-full accent-primary"
          />
          <input
            type="range"
            min={priceRange[0]}
            max={priceRange[1]}
            step={1000}
            value={price[1]}
            onChange={(e) => setPrice([price[0], Number(e.target.value)])}
            onMouseUp={() => set({ maxPrice: price[1] })}
            onTouchEnd={() => set({ maxPrice: price[1] })}
            className="w-full accent-primary"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>{price[0].toLocaleString()}</span>
          <span>{price[1].toLocaleString()}</span>
        </div>
      </div>

      <Separator />

      <div>
        <p className="mb-2 text-sm font-medium">{t('storefront.products.rating')}</p>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => set({ rating: filters.rating === r ? undefined : r })}
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors',
                filters.rating === r ? 'bg-accent' : 'hover:bg-accent/50',
              )}
            >
              <Rating value={r} />
              <span className="text-muted-foreground">& {t('storefront.products.up')}</span>
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <Label htmlFor="in-stock" className="text-sm font-medium">
          {t('storefront.products.inStockOnly')}
        </Label>
        <Switch id="in-stock" checked={!!filters.inStockOnly} onCheckedChange={(v) => set({ inStockOnly: v })} />
      </div>
    </div>
  )
}
