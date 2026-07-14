import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { clearTokens, setTokens } from '@/shared/api/client'
import { authService } from '@/features/auth/service'
import type { UserInfo } from '@/features/auth/types'

interface AuthState {
  user: UserInfo | null
  isAuthenticated: boolean
  setSession: (user: UserInfo, access: string, refresh: string) => void
  fetchProfile: () => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setSession: (user, access, refresh) => {
        setTokens(access, refresh)
        set({ user, isAuthenticated: true })
      },
      fetchProfile: async () => {
        try {
          const user = await authService.me()
          set({ user, isAuthenticated: true })
          return true
        } catch {
          clearTokens()
          set({ user: null, isAuthenticated: false })
          return false
        }
      },
      logout: () => {
        clearTokens()
        set({ user: null, isAuthenticated: false })
      },
    }),
    {
      name: 'store-auth',
      partialize: (s) => ({ user: s.user, isAuthenticated: s.isAuthenticated }),
    },
  ),
)