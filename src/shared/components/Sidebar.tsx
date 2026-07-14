import { NavLink } from 'react-router-dom'
import { ChevronLeft, Store } from 'lucide-react'

import { useNavGroups } from '@/shared/components/nav-config'
import { Button } from '@/shared/components/ui/button'
import { useUIStore } from '@/shared/store/useUIStore'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/lib/utils'

export function Sidebar() {
  const { t } = useTranslation()
  const navGroups = useNavGroups()
  const collapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggle = useUIStore((s) => s.toggleSidebar)

  return (
    <aside
      className={cn(
        'hidden shrink-0 flex-col border-r bg-card transition-all duration-300 md:flex',
        collapsed ? 'w-[68px]' : 'w-64',
      )}
    >
      <div className={cn('flex h-16 items-center gap-2 border-b px-4', collapsed && 'justify-center px-0')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Store className="h-5 w-5" />
        </div>
        {!collapsed && <span className="text-lg font-bold tracking-tight">StorePro</span>}
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  end={item.href === '/'}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                      collapsed && 'justify-center px-0',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                    )
                  }
                  title={collapsed ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="flex-1">{item.title}</span>}
                  {!collapsed && item.badge && (
                    <span className="rounded-full bg-destructive px-1.5 py-0.5 text-xs text-destructive-foreground">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t p-3">
        <Button variant="ghost" size="sm" className="w-full justify-center" onClick={toggle}>
          <ChevronLeft className={cn('h-4 w-4 transition-transform', collapsed && 'rotate-180')} />
          {!collapsed && <span>{t('common.collapse')}</span>}
        </Button>
      </div>
    </aside>
  )
}