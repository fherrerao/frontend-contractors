import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { Worker } from '#/lib/types'

export type WorkerInput = Pick<Worker, 'name' | 'documentId' | 'position'> &
  Partial<Pick<Worker, 'phone' | 'email' | 'isActive'>> & {
    projectIds: string[]
  }

export function useWorkers(contractorId: string) {
  return useQuery({
    queryKey: ['workers', contractorId],
    queryFn: () => api<Array<Worker>>(`/contractors/${contractorId}/workers`),
    enabled: !!contractorId,
  })
}

export function useSaveWorker(contractorId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: WorkerInput & { id?: string }) =>
      id
        ? api<Worker>(`/workers/${id}`, { method: 'PATCH', body: data })
        : api<Worker>(`/contractors/${contractorId}/workers`, { method: 'POST', body: data }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['workers'] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
      ]),
  })
}
