import { createFileRoute } from '@tanstack/react-router'
import { Card, Flex } from 'antd'
import { useState } from 'react'
import { PageTitle } from '#/components/atoms'
import { ReviewActions } from '#/components/molecules'
import { DocumentViewerDrawer, ReviewModal, ReviewQueueTable } from '#/components/organisms'
import { usePendingReviews } from '#/hooks/useDocuments'
import { requireRole } from '#/lib/auth'
import type { ContractorDocument, ReviewAction } from '#/lib/types'

export const Route = createFileRoute('/_app/reviews')({
  beforeLoad: () => requireRole('ADMIN', 'APPROVER'),
  head: () => ({ meta: [{ title: 'Revisiones · Gestion de Contratistas' }] }),
  component: ReviewsPage,
})

function ReviewsPage() {
  const { data = [], isLoading } = usePendingReviews()
  const [viewing, setViewing] = useState<ContractorDocument | null>(null)
  const [action, setAction] = useState<ReviewAction | null>(null)

  return (
    <>
      <PageTitle
        title="Revisiones pendientes"
        subtitle={`${data.length} documento(s) esperando aprobacion`}
      />
      <Card styles={{ body: { padding: 0 } }}>
        <ReviewQueueTable data={data} loading={isLoading} onOpen={setViewing} />
      </Card>

      <DocumentViewerDrawer
        document={viewing}
        onClose={() => setViewing(null)}
        footer={
          <Flex justify="flex-end">
            <ReviewActions
              onApprove={() => setAction('APPROVED')}
              onReject={() => setAction('REJECTED')}
            />
          </Flex>
        }
      />
      <ReviewModal
        document={viewing}
        action={action}
        onClose={() => setAction(null)}
        onDone={() => setViewing(null)}
      />
    </>
  )
}
