import { App, Col, Form, Modal, Row, Switch } from 'antd'
import { useEffect } from 'react'
import { useSaveContractor } from '#/hooks/useContractors'
import type { ContractorInput } from '#/hooks/useContractors'
import type { Contractor } from '#/lib/types'
import { AppInput } from '../atoms'
import { FormField } from '../molecules'

interface ContractorFormModalProps {
  open: boolean
  contractor?: Contractor | null
  onClose: () => void
}

export function ContractorFormModal({ open, contractor, onClose }: ContractorFormModalProps) {
  const [form] = Form.useForm<ContractorInput>()
  const { message } = App.useApp()
  const save = useSaveContractor()

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (contractor) form.setFieldsValue(contractor)
  }, [open, contractor, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const cleaned = Object.fromEntries(
      Object.entries(values).map(([k, v]) => [k, v === '' ? null : v]),
    ) as ContractorInput
    try {
      await save.mutateAsync({ ...cleaned, id: contractor?.id })
      message.success(contractor ? 'Contratista actualizado' : 'Contratista creado')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={open}
      title={contractor ? 'Editar contratista' : 'Nuevo contratista'}
      okText="Guardar"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={save.isPending}
      width={640}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={14}>
            <FormField label="Razon social" name="name" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput placeholder="Empresa S.A.S." />
            </FormField>
          </Col>
          <Col xs={24} md={10}>
            <FormField label="NIT" name="taxId" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput placeholder="900123456-7" />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Persona de contacto" name="contactName">
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Telefono" name="phone">
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Email" name="email" rules={[{ type: 'email', message: 'Email invalido' }]}>
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Direccion" name="address">
              <AppInput />
            </FormField>
          </Col>
          {contractor && (
            <Col xs={24}>
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
