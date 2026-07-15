import { useTranslation } from 'react-i18next'
import { PackageOpen } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = 'storefront.product.notFound',
  description = 'storefront.product.notFoundDesc',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageOpen className="h-7 w-7" />
      </div>
      <h3 className="text-lg font-semibold">{title ? t(title) : t('storefront.product.notFound')}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description ? t(description) : null}</p>
      {actionLabel && onAction && (
        <Button className="mt-4" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
