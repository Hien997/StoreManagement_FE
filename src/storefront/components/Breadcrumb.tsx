import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export interface Crumb {
  label: string
  to?: string
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  const { t } = useTranslation()
  return (
    <nav aria-label="Breadcrumb" className={cn('flex flex-wrap items-center gap-1 text-sm text-muted-foreground', className)}>
      <Link to="/shop" className="flex items-center gap-1 hover:text-foreground">
        <Home className="h-3.5 w-3.5" /> {t('storefront.nav.home')}
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {item.to && i < items.length - 1 ? (
            <Link to={item.to} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}