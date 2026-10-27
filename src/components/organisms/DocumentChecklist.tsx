import { PlusOutlined } from '@ant-design/icons'
import { Card, Flex, Progress, Skeleton, Typography } from 'antd'
import { useState } from 'react'
import { useProjectDocuments } from '#/hooks/useDocuments'
import type { ContractorDocument, ReviewAction, Role } from '#/lib/types'
import { AppButton } from '../atoms'
import { DocumentItem, EmptyState, ReviewActions } from '../molecules'
import { DocumentFormModal } from './DocumentFormModal'
import { DocumentViewerDrawer } from './DocumentViewerDrawer'
import { ReviewHistoryModal } from './ReviewHistoryModal'
import { ReviewModal } from './ReviewModal'
import { UploadDocumentModal } from './UploadDocumentModal'

interface DocumentChecklistProps {
  projectId: string
  role: Role
}

export function DocumentChecklist({ projectId, role }: DocumentChecklistProps) {
  const { data = [], isLoading } = useProjectDocuments(projectId)
  const [uploading, setUploading] = useState<ContractorDocument | null>(null)
  const [viewing, setViewing] = useState<ContractorDocument | null>(null)
  const [history, setHistory] = useState<ContractorDocument | null>(null)
  const [reviewing, setReviewing] = useState<{
    doc: ContractorDocument
    action: ReviewAction
  } | null>(null)
  const [editing, setEditing] = useState<ContractorDocument | null | undefined>(undefined)

  const canUpload = role === 'CONTRACTOR_USER' || role === 'ADMIN'
  const canReview = role === 'APPROVER' || role === 'ADMIN'
  const canManage = role === 'ADMIN' || role === 'APPROVER'

  const required = data.filter((d) => d.required)
  const approved = required.filter((d) => d.status === 'APPROVED').length
  const percent = required.length ? Math.round((approved / required.length) * 100) : 0

  return (
    <Card
      title="Documentacion del proyecto"
      extra={
        <Flex align="center" gap={12} wrap>
          {!isLoading && (
            <Flex align="center" gap={12} style={{ minWidth: 180 }}>
              <Progress
                percent={percent}
                size="small"
                status={percent === 100 ? 'success' : 'active'}
                style={{ margin: 0, minWidth: 100 }}
              />
              <Typography.Text type="secondary" style={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                {approved}/{required.length} obligatorios
              </Typography.Text>
            </Flex>
          )}
          {canManage && (
            <AppButton type="primary" icon={<PlusOutlined />} onClick={() => setEditing(null)}>
              Nuevo documento
            </AppButton>
          )}
        </Flex>
      }
      styles={{ body: { display: 'flex', flexDirection: 'column', gap: 12 } }}
    >
      {isLoading ? (
        <Skeleton active paragraph={{ rows: 6 }} />
      ) : !data.length ? (
        <EmptyState description="No hay documentos en este proyecto. Crea el primero." />
      ) : (
        data.map((doc) => (
          <DocumentItem
            key={doc.id}
            document={doc}
            canUpload={canUpload}
            canReview={canReview}
            canManage={canManage}
            onUpload={() => setUploading(doc)}
            onView={() => setViewing(doc)}
            onHistory={() => setHistory(doc)}
            onReview={() => setViewing(doc)}
            onEdit={() => setEditing(doc)}
          />
        ))
      )}

      <UploadDocumentModal
        projectId={projectId}
        document={uploading}
        onClose={() => setUploading(null)}
      />
      <DocumentViewerDrawer
        document={viewing}
        onClose={() => setViewing(null)}
        footer={
          canReview &&
          viewing?.status === 'SUBMITTED' && (
            <Flex justify="flex-end">
              <ReviewActions
                onApprove={() => setReviewing({ doc: viewing, action: 'APPROVED' })}
                onReject={() => setReviewing({ doc: viewing, action: 'REJECTED' })}
              />
            </Flex>
          )
        }
      />
      <ReviewHistoryModal document={history} onClose={() => setHistory(null)} />
      <ReviewModal
        document={reviewing?.doc ?? null}
        action={reviewing?.action ?? null}
        onClose={() => setReviewing(null)}
        onDone={() => setViewing(null)}
      />
      <DocumentFormModal
        open={editing !== undefined}
        projectId={projectId}
        document={editing}
        onClose={() => setEditing(undefined)}
      />
    </Card>
  )
}
