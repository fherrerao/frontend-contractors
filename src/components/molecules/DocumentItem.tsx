import {
  AuditOutlined,
  CalendarOutlined,
  EyeOutlined,
  FileTextOutlined,
  HistoryOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Alert, Card, Flex, Space, Tag, Tooltip, Typography, theme } from 'antd'
import dayjs from 'dayjs'
import type { ContractorDocument } from '#/lib/types'
import { AppButton, StatusTag } from '../atoms'

interface DocumentItemProps {
  document: ContractorDocument
  canUpload: boolean
  canReview: boolean
  canManage?: boolean
  onUpload: () => void
  onView: () => void
  onHistory: () => void
  onReview: () => void
  onEdit?: () => void
}

export function DocumentItem({
  document,
  canUpload,
  canReview,
  canManage,
  onUpload,
  onView,
  onHistory,
  onReview,
  onEdit,
}: DocumentItemProps) {
  const { token } = theme.useToken()
  const lastReview = document.reviews?.[0]
  const hasFile = !!document.fileName
  const expiresSoon =
    document.status === 'APPROVED' &&
    document.expiresAt &&
    dayjs(document.expiresAt).diff(dayjs(), 'day') <= 30

  return (
    <Card size="small" styles={{ body: { padding: 16 } }}>
      <Flex gap={16} align="flex-start" wrap>
        <Flex
          align="center"
          justify="center"
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: token.colorPrimaryBg,
            color: token.colorPrimary,
            fontSize: 20,
            flexShrink: 0,
          }}
        >
          <FileTextOutlined />
        </Flex>

        <Flex vertical gap={6} style={{ flex: '1 1 240px', minWidth: 0 }}>
          <Flex gap={8} align="center" wrap>
            <Typography.Text strong>{document.name}</Typography.Text>
            {document.required ? (
              <Tag color="red" variant="outlined">
                Obligatorio
              </Tag>
            ) : (
              <Tag variant="outlined">Opcional</Tag>
            )}
            <StatusTag kind="document" status={document.status} />
          </Flex>
          {document.description && (
            <Typography.Text type="secondary" style={{ fontSize: 13 }}>
              {document.description}
            </Typography.Text>
          )}
          <Space size={16} wrap style={{ fontSize: 12 }}>
            {hasFile && (
              <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
                {document.fileName}
                {document.submittedAt &&
                  ` · ${dayjs(document.submittedAt).format('DD MMM YYYY')}`}
                {document.uploadedBy && ` · ${document.uploadedBy.name}`}
              </Typography.Text>
            )}
            {document.expiresAt && (
              <Typography.Text
                type={expiresSoon || document.status === 'EXPIRED' ? 'danger' : 'secondary'}
                style={{ fontSize: 12 }}
              >
                <CalendarOutlined /> Vence {dayjs(document.expiresAt).format('DD MMM YYYY')}
              </Typography.Text>
            )}
          </Space>
          {document.status === 'REJECTED' && lastReview?.comment && (
            <Alert
              type="error"
              showIcon
              title={`Rechazado por ${lastReview.reviewer.name}`}
              description={lastReview.comment}
              style={{ marginTop: 4 }}
            />
          )}
        </Flex>

        <Flex gap={8} wrap justify="flex-end" style={{ marginLeft: 'auto' }}>
          {canManage && onEdit && (
            <AppButton onClick={onEdit}>Editar</AppButton>
          )}
          {hasFile && (
            <Tooltip title="Ver archivo">
              <AppButton icon={<EyeOutlined />} onClick={onView} />
            </Tooltip>
          )}
          {hasFile && (
            <Tooltip title="Historial de revisiones">
              <AppButton icon={<HistoryOutlined />} onClick={onHistory} />
            </Tooltip>
          )}
          {canReview && document.status === 'SUBMITTED' && (
            <AppButton type="primary" icon={<AuditOutlined />} onClick={onReview}>
              Revisar
            </AppButton>
          )}
          {canUpload && (
            <AppButton
              type={hasFile ? 'default' : 'primary'}
              icon={<UploadOutlined />}
              onClick={onUpload}
            >
              {hasFile ? 'Reemplazar' : 'Subir'}
            </AppButton>
          )}
        </Flex>
      </Flex>
    </Card>
  )
}
