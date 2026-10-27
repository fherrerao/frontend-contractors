import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons'
import { Modal, Skeleton, Timeline, Typography } from 'antd'
import dayjs from 'dayjs'
import { useDocumentReviews } from '#/hooks/useDocuments'
import type { ContractorDocument } from '#/lib/types'
import { EmptyState } from '../molecules'

interface ReviewHistoryModalProps {
  document: ContractorDocument | null
  onClose: () => void
}

export function ReviewHistoryModal({ document, onClose }: ReviewHistoryModalProps) {
  const { data, isLoading } = useDocumentReviews(document?.id)

  return (
    <Modal
      open={!!document}
      title={`Historial · ${document?.name ?? ''}`}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      {isLoading ? (
        <Skeleton active />
      ) : !data?.length ? (
        <EmptyState description="Este documento aun no ha sido revisado" />
      ) : (
        <Timeline
          style={{ marginTop: 24 }}
          items={data.map((r) => ({
            key: r.id,
            color: r.action === 'APPROVED' ? 'green' : 'red',
            icon: r.action === 'APPROVED' ? <CheckCircleFilled /> : <CloseCircleFilled />,
            content: (
              <>
                <Typography.Text strong>
                  {r.action === 'APPROVED' ? 'Aprobado' : 'Rechazado'} por {r.reviewer.name}
                </Typography.Text>
                <br />
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {dayjs(r.createdAt).format('DD MMM YYYY HH:mm')}
                  {r.fileName && ` · ${r.fileName}`}
                </Typography.Text>
                {r.comment && (
                  <Typography.Paragraph style={{ marginTop: 4, marginBottom: 0 }}>
                    {r.comment}
                  </Typography.Paragraph>
                )}
              </>
            ),
          }))}
        />
      )}
    </Modal>
  )
}
