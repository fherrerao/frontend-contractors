import { Alert, App, DatePicker, Form, Modal, Typography } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { useEffect } from 'react'
import { useUploadDocument } from '#/hooks/useDocuments'
import type { ContractorDocument } from '#/lib/types'
import { FileUploadField, FormField } from '../molecules'

interface UploadDocumentModalProps {
  contractorId: string
  document: ContractorDocument | null
  onClose: () => void
}

interface UploadValues {
  file: File | null
  expiresAt?: Dayjs
}

export function UploadDocumentModal({ contractorId, document, onClose }: UploadDocumentModalProps) {
  const [form] = Form.useForm<UploadValues>()
  const { message } = App.useApp()
  const upload = useUploadDocument(contractorId)

  useEffect(() => {
    if (document) form.resetFields()
  }, [document, form])

  const handleOk = async () => {
    if (!document) return
    const values = await form.validateFields()
    try {
      await upload.mutateAsync({
        typeId: document.typeId,
        file: values.file as File,
        expiresAt: values.expiresAt?.endOf('day').toISOString(),
      })
      message.success('Documento enviado a revision')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={!!document}
      title={document?.fileName ? 'Reemplazar documento' : 'Subir documento'}
      okText="Enviar a revision"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={upload.isPending}
      destroyOnHidden
    >
      <Typography.Paragraph strong style={{ marginBottom: 4 }}>
        {document?.type.name}
      </Typography.Paragraph>
      {document?.type.description && (
        <Typography.Paragraph type="secondary">{document.type.description}</Typography.Paragraph>
      )}
      {document?.status === 'APPROVED' && (
        <Alert
          type="warning"
          showIcon
          title="Este documento ya esta aprobado. Al reemplazarlo volvera a revision."
          style={{ marginBottom: 16 }}
        />
      )}
      <Form form={form} layout="vertical">
        <FormField name="file" rules={[{ required: true, message: 'Adjunta un archivo' }]}>
          <FileUploadField />
        </FormField>
        {document?.type.expires && (
          <FormField
            label="Fecha de vencimiento"
            name="expiresAt"
            rules={[{ required: true, message: 'Indica la fecha de vencimiento' }]}
          >
            <DatePicker
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(d) => d.isBefore(dayjs().add(1, 'day'), 'day')}
            />
          </FormField>
        )}
      </Form>
    </Modal>
  )
}
