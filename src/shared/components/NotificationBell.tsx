import { Bell } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/shared/components/ui/dropdown-menu'
import { useUIStore } from '@/shared/store/useUIStore'
import { formatRelative } from '@/shared/lib/format'

export function NotificationBell() {
  const notifications = useUIStore((s) => s.notifications)
  const unread = useUIStore((s) => s.unreadCount())
  const markRead = useUIStore((s) => s.markRead)
  const markAllRead = useUIStore((s) => s.markAllRead)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
          {unread > 0 && (
            <button className="text-xs text-primary hover:underline" onClick={markAllRead}>
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-2 py-6 text-center text-sm text-muted-foreground">No notifications</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                className="flex w-full gap-3 rounded-sm px-2 py-2 text-left text-sm transition-colors hover:bg-accent"
                onClick={() => markRead(n.id)}
              >
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" style={{ opacity: n.read ? 0 : 1 }} />
                <div className="flex-1">
                  <p className="font-medium capitalize">{n.title}</p>
                  <p className="text-xs text-muted-foreground">{n.message}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{formatRelative(n.createdAt)}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}