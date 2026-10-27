import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { ContractorDocument, DocumentReview, ReviewAction } from '#/lib/types'

export function useProjectDocuments(projectId: string) {
  return useQuery({
    queryKey: ['documents', projectId],
    queryFn: () => api<Array<ContractorDocument>>(`/projects/${projectId}/documents`),
    enabled: !!projectId,
  })
}

export type DocumentInput = {
  id?: string
  name?: string
  description?: string | null
  required?: boolean
  expires?: boolean
}

export function useSaveDocument(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: DocumentInput) =>
      id
        ? api<ContractorDocument>(`/documents/${id}`, { method: 'PATCH', body: data })
        : api<ContractorDocument>(`/projects/${projectId}/documents`, {
            method: 'POST',
            body: data,
          }),
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['documents'] }),
        queryClient.invalidateQueries({ queryKey: ['projects'] }),
        queryClient.invalidateQueries({ queryKey: ['contractors'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard'] }),
      ]),
  })
}

export function useDocumentReviews(documentId: string | undefined) {
  return useQuery({
    queryKey: ['document-reviews', documentId],
    queryFn: () => api<Array<DocumentReview>>(`/documents/${documentId}/reviews`),
    enabled: !!documentId,
  })
}

function useInvalidateDocuments() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all(
      ['documents', 'projects', 'contractors', 'reviews', 'document-reviews', 'dashboard'].map(
        (key) => queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    )
}

export function useUploadDocument(projectId: string) {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: ({
      documentId,
      file,
      expiresAt,
    }: {
      documentId: string
      file: File
      expiresAt?: string
    }) => {
      const form = new FormData()
      form.append('file', file)
      if (expiresAt) form.append('expiresAt', expiresAt)
      return api<ContractorDocument>(`/projects/${projectId}/documents/${documentId}/file`, {
        method: 'POST',
        body: form,
      })
    },
    onSuccess: invalidate,
  })
}

export function usePendingReviews() {
  return useQuery({
    queryKey: ['reviews', 'pending'],
    queryFn: () => api<Array<ContractorDocument>>('/reviews/pending'),
  })
}

export function usePendingCount(enabled: boolean) {
  return useQuery({
    queryKey: ['reviews', 'pending', 'count'],
    queryFn: () => api<{ count: number }>('/reviews/pending/count'),
    enabled,
    refetchInterval: 60_000,
    select: (data) => data.count,
  })
}

export function useReviewDocument() {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: ({ id, action, comment }: { id: string; action: ReviewAction; comment?: string }) =>
      api<ContractorDocument>(`/documents/${id}/review`, {
        method: 'POST',
        body: { action, comment },
      }),
    onSuccess: invalidate,
  })
}
