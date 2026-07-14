import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Theme = 'light' | 'dark' | 'system'

interface ThemeState {
  theme: Theme
  setTheme: (t: Theme) => void
  applyTheme: () => void
}

function resolveSystem(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme })
        get().applyTheme()
      },
      applyTheme: () => {
        const { theme } = get()
        const resolved = theme === 'system' ? resolveSystem() : theme
        const root = document.documentElement
        root.classList.toggle('dark', resolved === 'dark')
      },
    }),
    {
      name: 'store-theme',
      onRehydrateStorage: () => (state) => state?.applyTheme(),
    },
  ),
)