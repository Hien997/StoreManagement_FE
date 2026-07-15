export type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
} from '@/types/api'

export interface UserQuery {
  limit?: number
  cursor?: string
}