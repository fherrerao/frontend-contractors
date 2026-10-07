import { App, Form, Input, Modal, Typography } from 'antd'
import { useEffect } from 'react'
import { useReviewDocument } from '#/hooks/useDocuments'
import type { ContractorDocument, ReviewAction } from '#/lib/types'
import { FormField } from '../molecules'

interface ReviewModalProps {
  document: ContractorDocument | null
  action: ReviewAction | null
  onClose: () => void
  onDone?: () => void
}

export function ReviewModal({ document, action, onClose, onDone }: ReviewModalProps) {
  const [form] = Form.useForm<{ comment?: string }>()
  const { message } = App.useApp()
  const review = useReviewDocument()
  const isReject = action === 'REJECTED'

  useEffect(() => {
    if (action) form.resetFields()
  }, [action, form])

  const handleOk = async () => {
    if (!document || !action) return
    const { comment } = await form.validateFields()
    try {
      await review.mutateAsync({ id: document.id, action, comment })
      message.success(isReject ? 'Documento rechazado' : 'Documento aprobado')
      onClose()
      onDone?.()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={!!document && !!action}
      title={isReject ? 'Rechazar documento' : 'Aprobar documento'}
      okText={isReject ? 'Rechazar' : 'Aprobar'}
      okButtonProps={{ danger: isReject }}
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={review.isPending}
      destroyOnHidden
    >
      <Typography.Paragraph type="secondary">
        {document?.type.name}
        {document?.contractor && ` · ${document.contractor.name}`}
      </Typography.Paragraph>
      <Form form={form} layout="vertical">
        <FormField
          label={isReject ? 'Motivo del rechazo' : 'Comentario (opcional)'}
          name="comment"
          rules={
            isReject
              ? [{ required: true, whitespace: true, message: 'Indica el motivo del rechazo' }]
              : []
          }
        >
          <Input.TextArea
            rows={4}
            maxLength={1000}
            showCount
            placeholder={
              isReject
                ? 'Explica que debe corregir el contratista'
                : 'Observaciones para el contratista'
            }
          />
        </FormField>
      </Form>
    </Modal>
  )
}
