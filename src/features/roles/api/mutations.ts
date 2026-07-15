import { useMutation, useQueryClient } from '@tanstack/react-query'
import type {
  AssignPermissionsRequest,
  CreateRoleRequest,
  UpdateRoleRequest,
} from './types'
import { useToast } from '@/shared/components/ui/toast'
import { roleKeys } from './queryKeys'
import { roleService } from './queries'

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