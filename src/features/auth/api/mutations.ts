import { useMutation } from '@tanstack/react-query'
import type { LoginRequest, RefreshRequest, RegisterRequest } from './types'
import { authService } from './queries'

export function useLoginMutation() {
  return useMutation({ mutationFn: (body: LoginRequest) => authService.login(body) })
}

export function useRegisterMutation() {
  return useMutation({ mutationFn: (body: RegisterRequest) => authService.register(body) })
}

export function useRefreshMutation() {
  return useMutation({ mutationFn: (body: RefreshRequest) => authService.refresh(body) })
}