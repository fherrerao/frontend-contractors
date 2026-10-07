import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '#/lib/api'
import type { ContractorDocument, DocumentReview, ReviewAction } from '#/lib/types'

export function useContractorDocuments(contractorId: string) {
  return useQuery({
    queryKey: ['documents', contractorId],
    queryFn: () => api<Array<ContractorDocument>>(`/contractors/${contractorId}/documents`),
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
      ['documents', 'contractors', 'reviews', 'document-reviews', 'dashboard'].map((key) =>
        queryClient.invalidateQueries({ queryKey: [key] }),
      ),
    )
}

export function useUploadDocument(contractorId: string) {
  const invalidate = useInvalidateDocuments()
  return useMutation({
    mutationFn: ({ typeId, file, expiresAt }: { typeId: string; file: File; expiresAt?: string }) => {
      const form = new FormData()
      form.append('file', file)
      if (expiresAt) form.append('expiresAt', expiresAt)
      return api<ContractorDocument>(`/contractors/${contractorId}/documents/${typeId}`, {
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
