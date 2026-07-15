import { customerApiClient } from '@/shared/api/client'
import type { ApiResponse } from '@/shared/types/api/response'
import { customerAuthEndpoints } from './endpoints'
import type {
  CustomerAuthResponse,
  CustomerLoginRequest,
  CustomerProfile,
  CustomerRegisterRequest,
} from './types'

export const customerAuthService = {
  login: (body: CustomerLoginRequest) =>
    customerApiClient
      .post<ApiResponse<CustomerAuthResponse>>(customerAuthEndpoints.login, body)
      .then((r) => r.data.data),

  register: (body: CustomerRegisterRequest) =>
    customerApiClient
      .post<ApiResponse<CustomerAuthResponse>>(customerAuthEndpoints.register, body)
      .then((r) => r.data.data),

  me: () =>
    customerApiClient
      .get<ApiResponse<CustomerProfile>>(customerAuthEndpoints.me)
      .then((r) => r.data.data),

  updateProfile: (id: number, body: Partial<CustomerProfile>) =>
    customerApiClient
      .put<ApiResponse<CustomerProfile>>(`/customers/${id}`, body)
      .then((r) => r.data.data),

  deleteAccount: (id: number) =>
    customerApiClient
      .delete<ApiResponse<unknown>>(`/customers/${id}`)
      .then((r) => r.data.data),
}
