import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useAuthStore } from '@/shared/store/useAuthStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)
  const fetchProfile = useAuthStore((s) => s.fetchProfile)
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && !user) {
      void fetchProfile()
    }
  }, [isAuthenticated, user, fetchProfile])

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}