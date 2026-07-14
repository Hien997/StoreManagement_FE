import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from './service'
import type {
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
} from '@/types/api'
import { useToast } from '@/shared/components/ui/toast'

export const userKeys = {
  all: ['users'] as const,
  list: (params?: { limit?: number; cursor?: string }) => ['users', 'list', params ?? {}] as const,
  detail: (id: number) => ['users', 'detail', id] as const,
}

export function useUsers(params?: { limit?: number; cursor?: string }) {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.list(params),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.get(id),
    enabled: Number.isFinite(id),
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (body: CreateUserRequest) => userService.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all })
      toast({ title: 'User created', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to create', description: err.message, variant: 'destructive' }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: UpdateUserRequest }) =>
      userService.update(id, body),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: userKeys.all })
      qc.invalidateQueries({ queryKey: userKeys.detail(vars.id) })
      toast({ title: 'User updated', variant: 'success' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to update', description: err.message, variant: 'destructive' }),
  })
}

export function useChangePassword() {
  const toast = useToast()
  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: ChangePasswordRequest }) =>
      userService.changePassword(id, body),
    onSuccess: () => toast({ title: 'Password changed', variant: 'success' }),
    onError: (err: { message?: string }) => toast({ title: 'Failed to change password', description: err.message, variant: 'destructive' }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  const toast = useToast()
  return useMutation({
    mutationFn: (id: number) => userService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: userKeys.all })
      toast({ title: 'User deleted', variant: 'destructive' })
    },
    onError: (err: { message?: string }) => toast({ title: 'Failed to delete', description: err.message, variant: 'destructive' }),
  })
}