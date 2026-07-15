export interface CustomerProfile {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  active: boolean
}

export interface CustomerLoginRequest {
  email: string
  password: string
}

export interface CustomerRegisterRequest {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
}

export interface CustomerAuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  customer: CustomerProfile
}