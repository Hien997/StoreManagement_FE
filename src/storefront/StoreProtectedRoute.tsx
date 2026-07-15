import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { useCustomerAuthStore } from '@/features/customers/auth/store'

export function StoreProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const customer = useCustomerAuthStore((s) => s.customer)
  const fetchProfile = useCustomerAuthStore((s) => s.fetchProfile)
  const location = useLocation()

  useEffect(() => {
    if (isAuthenticated && !customer) {
      void fetchProfile()
    }
  }, [isAuthenticated, customer, fetchProfile])

  if (!isAuthenticated) {
    return <Navigate to="/shop/login" state={{ from: location.pathname }} replace />
  }
  return <>{children}</>
}