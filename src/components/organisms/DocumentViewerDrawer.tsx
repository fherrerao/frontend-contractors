import { DownloadOutlined } from '@ant-design/icons'
import { Descriptions, Drawer, Flex, Grid, Typography, theme } from 'antd'
import dayjs from 'dayjs'
import type { ReactNode } from 'react'
import { documentFileUrl } from '#/lib/api'
import type { ContractorDocument } from '#/lib/types'
import { AppButton, StatusTag } from '../atoms'

interface DocumentViewerDrawerProps {
  document: ContractorDocument | null
  onClose: () => void
  footer?: ReactNode
}

export function DocumentViewerDrawer({ document, onClose, footer }: DocumentViewerDrawerProps) {
  const screens = Grid.useBreakpoint()
  const { token } = theme.useToken()
  const url = document ? documentFileUrl(document.id) : ''
  const isImage = document?.mimeType?.startsWith('image/')

  return (
    <Drawer
      open={!!document}
      onClose={onClose}
      size={screens.lg ? 860 : '100%'}
      title={document?.type.name}
      extra={
        document && (
          <AppButton icon={<DownloadOutlined />} href={url} target="_blank">
            Abrir
          </AppButton>
        )
      }
      footer={footer}
      destroyOnHidden
      styles={{ body: { display: 'flex', flexDirection: 'column', gap: 16 } }}
    >
      {document && (
        <>
          <Descriptions
            size="small"
            column={{ xs: 1, sm: 2 }}
            items={[
              ...(document.contractor
                ? [{ key: 'c', label: 'Contratista', children: document.contractor.name }]
                : []),
              {
                key: 's',
                label: 'Estado',
                children: <StatusTag kind="document" status={document.status} />,
              },
              { key: 'f', label: 'Archivo', children: document.fileName },
              {
                key: 'u',
                label: 'Enviado',
                children: document.submittedAt
                  ? `${dayjs(document.submittedAt).format('DD MMM YYYY HH:mm')}${
                      document.uploadedBy ? ` por ${document.uploadedBy.name}` : ''
                    }`
                  : '-',
              },
              ...(document.expiresAt
                ? [
                    {
                      key: 'e',
                      label: 'Vence',
                      children: dayjs(document.expiresAt).format('DD MMM YYYY'),
                    },
                  ]
                : []),
            ]}
          />
          <Flex
            flex={1}
            align="center"
            justify="center"
            style={{
              minHeight: 420,
              background: token.colorFillTertiary,
              borderRadius: token.borderRadiusLG,
              overflow: 'hidden',
            }}
          >
            {isImage ? (
              <img
                src={url}
                alt={document.fileName ?? ''}
                style={{ maxWidth: '100%', maxHeight: '70vh', objectFit: 'contain' }}
              />
            ) : document.mimeType === 'application/pdf' ? (
              <iframe
                src={url}
                title={document.fileName ?? 'Documento'}
                style={{ width: '100%', height: '100%', minHeight: 520, border: 0 }}
              />
            ) : (
              <Typography.Text type="secondary">Vista previa no disponible</Typography.Text>
            )}
          </Flex>
        </>
      )}
    </Drawer>
  )
}
