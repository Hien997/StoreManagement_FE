import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/types/api/response'
import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse, RegisterRequest, RegisterResponse, UserInfo } from './types'
import { authEndpoints } from './endpoints'

export const authService = {
  login: (body: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>(authEndpoints.login, body).then((r) => r.data.data),

  register: (body: RegisterRequest) =>
    apiClient.post<ApiResponse<RegisterResponse>>(authEndpoints.register, body).then((r) => r.data.data),

  me: () => apiClient.get<ApiResponse<UserInfo>>(authEndpoints.me).then((r) => r.data.data),

  refresh: (body: RefreshRequest) =>
    apiClient.post<ApiResponse<RefreshResponse>>(authEndpoints.refresh, body).then((r) => r.data.data),
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => authService.me(),
  })
}