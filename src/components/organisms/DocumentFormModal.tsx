import { App, Col, Form, Modal, Row, Switch } from 'antd'
import { useEffect } from 'react'
import { useSaveDocument } from '#/hooks/useDocuments'
import type { DocumentInput } from '#/hooks/useDocuments'
import type { ContractorDocument } from '#/lib/types'
import { AppInput } from '../atoms'
import { FormField } from '../molecules'

interface DocumentFormModalProps {
  open: boolean
  projectId: string
  document?: ContractorDocument | null
  onClose: () => void
}

export function DocumentFormModal({
  open,
  projectId,
  document,
  onClose,
}: DocumentFormModalProps) {
  const [form] = Form.useForm<DocumentInput>()
  const { message } = App.useApp()
  const save = useSaveDocument(projectId)

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (document) {
      form.setFieldsValue({
        name: document.name,
        description: document.description,
        required: document.required,
        expires: document.expires,
      })
    } else {
      form.setFieldsValue({ required: true, expires: false })
    }
  }, [open, document, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    try {
      await save.mutateAsync({
        ...values,
        description: values.description === '' ? null : values.description,
        id: document?.id,
      })
      message.success(document ? 'Documento actualizado' : 'Documento creado')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={open}
      title={document ? 'Editar documento' : 'Nuevo documento'}
      okText="Guardar"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={save.isPending}
      width={560}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col xs={24}>
            <FormField label="Nombre" name="name" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24}>
            <FormField label="Descripcion" name="description">
              <AppInput />
            </FormField>
          </Col>
          <Col xs={12}>
            <FormField label="Obligatorio" name="required" valuePropName="checked">
              <Switch />
            </FormField>
          </Col>
          <Col xs={12}>
            <FormField label="Vence" name="expires" valuePropName="checked">
              <Switch />
            </FormField>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}
