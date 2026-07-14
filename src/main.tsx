import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from '@/shared/lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { router } from '@/router'
import { useThemeStore } from '@/shared/store/useThemeStore'
import { ToastProviderWrapper } from '@/shared/components/ui/toast'
import '@/shared/i18n'
import './index.css'

useThemeStore.getState().applyTheme()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProviderWrapper>
        <RouterProvider router={router} />
      </ToastProviderWrapper>
    </QueryClientProvider>
  </React.StrictMode>,
)