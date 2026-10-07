import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { DashboardStats, DocumentType, Role, User } from '#/lib/types'

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => api<DashboardStats>('/dashboard/stats'),
  })
}

export function useDocumentTypes(includeInactive = false) {
  return useQuery({
    queryKey: ['document-types', includeInactive],
    queryFn: () =>
      api<Array<DocumentType>>('/document-types', {
        query: { includeInactive: includeInactive ? 'true' : undefined },
      }),
  })
}

export type DocumentTypeInput = Partial<Omit<DocumentType, 'id'>> & { id?: string }

export function useSaveDocumentType() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: DocumentTypeInput) =>
      id
        ? api<DocumentType>(`/document-types/${id}`, { method: 'PATCH', body: data })
        : api<DocumentType>('/document-types', { method: 'POST', body: data }),
    onSuccess: () =>
      Promise.all(
        ['document-types', 'documents', 'contractors', 'dashboard'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      ),
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
