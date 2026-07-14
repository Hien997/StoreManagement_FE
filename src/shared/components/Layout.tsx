import { Outlet, useLocation } from 'react-router-dom'

import { Sidebar } from '@/shared/components/Sidebar'
import { Header } from '@/shared/components/Header'
import { useUIStore } from '@/shared/store/useUIStore'

export function Layout() {
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const location = useLocation()

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      {!sidebarCollapsed && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={toggleSidebar} />
      )}
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <div key={location.pathname} className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}