import { useQuery } from '@tanstack/react-query'
import { authService } from './service'

export const authKeys = {
  me: ['auth', 'me'] as const,
}

export function useProfile() {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authService.me,
    retry: false,
  })
}