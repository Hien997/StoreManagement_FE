import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { roleService } from './service'
import type {
  CreateRoleRequest,
  UpdateRoleRequest,
  AssignPermissionsRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const roleKeys = {
  all: ['roles'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['roles', 'list', params ?? {}] as const,
  detail: (id: number) => ['roles', 'detail', id] as const,
}

export function useRoles(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: roleKeys.list(params),
    queryFn: () => roleService.list(params),
  })
}

export function useRole(id: number) {
  return useQuery({
    queryKey: roleKeys.detail(id),
    queryFn: () => roleService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateRole() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateRoleRequest) => roleService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all })
      toast({ title: 'Role created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateRole() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateRoleRequest }) =>
      roleService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roleKeys.all })
      qc.invalidateQueries({ queryKey: roleKeys.detail(vars.id) })
      toast({ title: 'Role updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useAssignRolePermissions() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: AssignPermissionsRequest }) =>
      roleService.assignPermissions(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: roleKeys.all })
      qc.invalidateQueries({ queryKey: roleKeys.detail(vars.id) })
      toast({ title: 'Permissions assigned', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to assign', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteRole() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => roleService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: roleKeys.all })
      toast({ title: 'Role deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}