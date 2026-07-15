import { useTranslation } from 'react-i18next'
import { Search, X } from 'lucide-react'
import { Input } from '@/shared/components/ui/input'
import { cn } from '@/shared/lib/utils'

interface SearchBoxProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  autoFocus?: boolean
}

export function SearchBox({ value, onChange, placeholder, className, autoFocus }: SearchBoxProps) {
  const { t } = useTranslation()
  return (
    <div className={cn('relative', className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        autoFocus={autoFocus}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? t('storefront.search.placeholder')}
        className="pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={t('storefront.search.clear')}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
