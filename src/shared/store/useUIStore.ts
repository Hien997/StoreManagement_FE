import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppNotification } from '@/shared/lib/types'

interface UIState {
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  notifications: AppNotification[]
  unreadCount: () => number
  markRead: (id: string) => void
  markAllRead: () => void
  removeNotification: (id: string) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      notifications: [],
      unreadCount: () => get().notifications.filter((n) => !n.read).length,
      markRead: (id) =>
        set((s) => ({
          notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      removeNotification: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
    }),
    {
      name: 'store-ui',
      partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed }),
    },
  ),
)