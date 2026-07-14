import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Menu, Search, Settings, User as UserIcon } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu'
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher'
import { NotificationBell } from '@/shared/components/NotificationBell'
import { GlobalSearch } from '@/shared/components/GlobalSearch'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'
import { useAuthStore } from '@/shared/store/useAuthStore'
import { useUIStore } from '@/shared/store/useUIStore'
import { useTranslation } from 'react-i18next'

export function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const [searchOpen, setSearchOpen] = React.useState(false)

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  const displayName = user?.full_name || user?.username || 'User'
  const initials = displayName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button variant="ghost" size="icon" className="md:hidden" onClick={() => useUIStore.getState().toggleSidebar()}>
        <Menu className="h-5 w-5" />
      </Button>

      <button
        onClick={() => setSearchOpen(true)}
        className="flex h-9 flex-1 items-center gap-2 rounded-md border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted md:max-w-md"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">{t('common.search')}</span>
        <kbd className="hidden rounded border bg-background px-1.5 text-[10px] font-medium sm:inline-block">⌘K</kbd>
      </button>

      <div className="ml-auto flex items-center gap-1">
        <LanguageSwitcher />
        <ThemeSwitcher />
        <NotificationBell />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline-block">{displayName}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>{displayName}</span>
                <span className="text-xs font-normal text-muted-foreground">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <UserIcon className="h-4 w-4" /> {t('auth.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4" /> {t('nav.settings')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
              <LogOut className="h-4 w-4" /> {t('auth.logOut')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  )
}