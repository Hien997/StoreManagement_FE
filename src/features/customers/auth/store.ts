import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearCustomerTokens, setCustomerTokens } from '@/shared/api/client'
import { customerAuthService } from './service'
import type { CustomerProfile } from './types'

interface CustomerAuthState {
  customer: CustomerProfile | null
  isAuthenticated: boolean
  setSession: (customer: CustomerProfile, access: string, refresh: string) => void
  fetchProfile: () => Promise<boolean>
  logout: () => void
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set) => ({
      customer: null,
      isAuthenticated: false,
      setSession: (customer, access, refresh) => {
        setCustomerTokens(access, refresh)
        set({ customer, isAuthenticated: true })
      },
      fetchProfile: async () => {
        try {
          const customer = await customerAuthService.me()
          set({ customer, isAuthenticated: true })
          return true
        } catch {
          clearCustomerTokens()
          set({ customer: null, isAuthenticated: false })
          return false
        }
      },
      logout: () => {
        clearCustomerTokens()
        set({ customer: null, isAuthenticated: false })
      },
    }),
    {
      name: 'store-customer-auth',
      partialize: (s) => ({ customer: s.customer, isAuthenticated: s.isAuthenticated }),
    },
  ),
)