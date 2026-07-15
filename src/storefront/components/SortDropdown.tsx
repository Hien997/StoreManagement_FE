import { useTranslation } from 'react-i18next'
import { ArrowUpDown } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select'
import type { ProductSort } from '../types'

const OPTIONS: { value: ProductSort; labelKey: string }[] = [
  { value: 'newest', labelKey: 'storefront.products.newest' },
  { value: 'price_asc', labelKey: 'storefront.products.priceAsc' },
  { value: 'price_desc', labelKey: 'storefront.products.priceDesc' },
  { value: 'name_asc', labelKey: 'storefront.products.nameAsc' },
  { value: 'rating', labelKey: 'storefront.products.topRated' },
]

export function SortDropdown({ value, onChange }: { value: ProductSort; onChange: (v: ProductSort) => void }) {
  const { t } = useTranslation()
  return (
    <Select value={value} onValueChange={(v) => onChange(v as ProductSort)}>
      <SelectTrigger className="w-[180px]">
        <ArrowUpDown className="h-4 w-4 opacity-60" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {t(o.labelKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
