import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Card } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import type { Brand } from '@/shared/lib/types'

export function BrandCard({ brand }: { brand: Brand }) {
  const { t } = useTranslation()
  const initial = (brand.name.trim()[0] ?? '?').toUpperCase()
  return (
    <Link to={`/shop/brand/${brand.id}`}>
      <Card className="flex items-center gap-3 p-4 transition-colors hover:border-primary">
        <Avatar className="h-12 w-12 rounded-lg">
          {brand.logoUrl ? <AvatarImage src={brand.logoUrl} alt={brand.name} /> : null}
          <AvatarFallback className="rounded-lg bg-primary/10 text-primary">{initial}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate font-semibold">{brand.name}</p>
          <p className="truncate text-xs text-muted-foreground">{brand.country ?? t('storefront.brands.globalBrand')}</p>
        </div>
      </Card>
    </Link>
  )
}
