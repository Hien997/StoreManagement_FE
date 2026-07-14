import { Monitor, Moon, Sun } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { useThemeStore } from '@/shared/store/useThemeStore'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

const options = [
  { value: 'light', labelKey: 'common.theme.light', icon: Sun },
  { value: 'dark', labelKey: 'common.theme.dark', icon: Moon },
  { value: 'system', labelKey: 'common.theme.system', icon: Monitor },
] as const

export function ThemeSwitcher() {
  const { t } = useTranslation()
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={t('common.toggleTheme')}>
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">{t('common.toggleTheme')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((o) => (
          <DropdownMenuItem key={o.value} onClick={() => setTheme(o.value)} className={cn(theme === o.value && 'bg-accent')}>
            <o.icon className="h-4 w-4" />
            {t(o.labelKey)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
