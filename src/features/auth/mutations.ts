import { useMutation } from '@tanstack/react-query'
import { authService } from './service'
import type { LoginRequest, RefreshRequest } from './types'

export function useLoginMutation() {
  return useMutation({ mutationFn: (body: LoginRequest) => authService.login(body) })
}

export function useRefreshMutation() {
  return useMutation({ mutationFn: (body: RefreshRequest) => authService.refresh(body) })
}