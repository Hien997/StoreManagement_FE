import { apiClient } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/types/api/response'
import { authEndpoints } from './endpoints'
import type { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse, UserInfo } from './types'

export const authService = {
  login: (body: LoginRequest) =>
    apiClient.post<ApiResponse<LoginResponse>>(authEndpoints.login, body).then((r) => r.data.data),

  me: () => apiClient.get<ApiResponse<UserInfo>>(authEndpoints.me).then((r) => r.data.data),

  refresh: (body: RefreshRequest) =>
    apiClient.post<ApiResponse<RefreshResponse>>(authEndpoints.refresh, body).then((r) => r.data.data),
}