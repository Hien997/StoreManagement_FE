import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { setLanguage, SUPPORTED_LANGUAGES, type Language } from '@/shared/i18n'

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('language.label')}>
          <Languages className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {SUPPORTED_LANGUAGES.map((code: Language) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code)}
            className={i18n.language.startsWith(code) ? 'font-semibold' : ''}
          >
            {t(`language.${code}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}