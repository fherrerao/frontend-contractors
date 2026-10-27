import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { DashboardStats, Role, User } from '#/lib/types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api<DashboardStats>('/dashboard/stats'),
  })
}

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api<Array<User>>('/users'),
  })
}

export interface UserInput {
  id?: string
  email?: string
  name?: string
  password?: string
  role?: Role
  contractorId?: string | null
  isActive?: boolean
}

export function useSaveUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: UserInput) =>
      id
        ? api<User>(`/users/${id}`, { method: 'PATCH', body: data })
        : api<User>('/users', { method: 'POST', body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
