import { App, Col, Form, Input, Modal, Row, Switch } from 'antd'
import { useEffect } from 'react'
import { useSaveDocumentType } from '#/hooks/useAdmin'
import type { DocumentTypeInput } from '#/hooks/useAdmin'
import type { DocumentType } from '#/lib/types'
import { AppInput } from '../atoms'
import { FormField } from '../molecules'

interface DocumentTypeFormModalProps {
  open: boolean
  documentType?: DocumentType | null
  onClose: () => void
}

export function DocumentTypeFormModal({ open, documentType, onClose }: DocumentTypeFormModalProps) {
  const [form] = Form.useForm<DocumentTypeInput>()
  const { message } = App.useApp()
  const save = useSaveDocumentType()

  useEffect(() => {
    if (!open) return
    form.resetFields()
    form.setFieldsValue(documentType ?? { required: true, expires: false })
  }, [open, documentType, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    try {
      await save.mutateAsync({ ...values, id: documentType?.id })
      message.success(documentType ? 'Tipo actualizado' : 'Tipo creado')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={open}
      title={documentType ? 'Editar tipo de documento' : 'Nuevo tipo de documento'}
      okText="Guardar"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={save.isPending}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
        <FormField label="Nombre" name="name" rules={[{ required: true, message: 'Requerido' }]}>
          <AppInput />
        </FormField>
        <FormField label="Descripcion" name="description">
          <Input.TextArea rows={3} />
        </FormField>
        <Row gutter={16}>
          <Col xs={12} md={8}>
            <FormField label="Obligatorio" name="required" valuePropName="checked">
              <Switch />
            </FormField>
          </Col>
          <Col xs={12} md={8}>
            <FormField label="Tiene vencimiento" name="expires" valuePropName="checked">
              <Switch />
            </FormField>
          </Col>
          {documentType && (
            <Col xs={12} md={8}>
              <FormField label="Activo" name="isActive" valuePropName="checked">
                <Switch />
              </FormField>
            </Col>
          )}
        </Row>
      </Form>
    </Modal>
  )
}
