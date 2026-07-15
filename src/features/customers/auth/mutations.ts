import { useMutation } from '@tanstack/react-query'
import { customerAuthService } from './service'
import type { CustomerLoginRequest, CustomerRegisterRequest } from './types'

export function useCustomerLoginMutation() {
  return useMutation({ mutationFn: (body: CustomerLoginRequest) => customerAuthService.login(body) })
}

export function useCustomerRegisterMutation() {
  return useMutation({ mutationFn: (body: CustomerRegisterRequest) => customerAuthService.register(body) })
}