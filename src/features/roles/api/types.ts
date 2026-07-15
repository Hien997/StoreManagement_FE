export type {
  RoleResponse,
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from '@/types/api'

export interface RoleQuery {
  limit?: number
  cursor?: string
}