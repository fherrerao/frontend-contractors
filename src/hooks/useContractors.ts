import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { Contractor, ContractorStatus } from '#/lib/types'

export interface ContractorFilters {
  search?: string
  status?: ContractorStatus
}

export type ContractorInput = Pick<Contractor, 'name' | 'taxId'> &
  Partial<Pick<Contractor, 'email' | 'phone' | 'address' | 'contactName' | 'isActive'>>

export function useContractors(filters: ContractorFilters = {}) {
  return useQuery({
    queryKey: ['contractors', filters],
    queryFn: () =>
      api<Array<Contractor>>('/contractors', {
        query: { search: filters.search, status: filters.status },
      }),
  })
}

export function useContractor(id: string) {
  return useQuery({
    queryKey: ['contractors', 'detail', id],
    queryFn: () => api<Contractor>(`/contractors/${id}`),
  })
}

export function useSaveContractor() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: ContractorInput & { id?: string }) =>
      id
        ? api<Contractor>(`/contractors/${id}`, { method: 'PATCH', body: data })
        : api<Contractor>('/contractors', { method: 'POST', body: data }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['contractors'] }),
  })
}
