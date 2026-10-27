import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { Project, ProjectDocumentInput } from '#/lib/types'

export type ProjectInput = Pick<Project, 'name'> &
  Partial<Pick<Project, 'description' | 'code' | 'isActive'>> & {
    documents: Array<ProjectDocumentInput>
  }

function invalidateProjects(queryClient: ReturnType<typeof useQueryClient>, contractorId?: string) {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: ['projects'] }),
    queryClient.invalidateQueries({ queryKey: ['contractors'] }),
    queryClient.invalidateQueries({ queryKey: ['workers'] }),
    queryClient.invalidateQueries({ queryKey: ['documents'] }),
    queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
    contractorId
      ? queryClient.invalidateQueries({ queryKey: ['contractors', 'detail', contractorId] })
      : Promise.resolve(),
  ])
}

export function useProjects(contractorId: string) {
  return useQuery({
    queryKey: ['projects', contractorId],
    queryFn: () => api<Array<Project>>(`/contractors/${contractorId}/projects`),
    enabled: !!contractorId,
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: () => api<Project>(`/projects/${id}`),
    enabled: !!id,
  })
}

export function useSaveProject(contractorId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: ProjectInput & { id?: string }) =>
      id
        ? api<Project>(`/projects/${id}`, { method: 'PATCH', body: data })
        : api<Project>(`/contractors/${contractorId}/projects`, { method: 'POST', body: data }),
    onSuccess: () => invalidateProjects(queryClient, contractorId),
  })
}

export function useAssignWorker(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (workerId: string) =>
      api<Project>(`/projects/${projectId}/workers/${workerId}`, {
        method: 'POST',
        body: {},
      }),
    onSuccess: () => invalidateProjects(queryClient),
  })
}

export function useUnassignWorker(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (workerId: string) =>
      api<Project>(`/projects/${projectId}/workers/${workerId}`, { method: 'DELETE' }),
    onSuccess: () => invalidateProjects(queryClient),
  })
}
