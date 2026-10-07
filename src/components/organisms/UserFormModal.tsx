import { App, Col, Form, Modal, Row, Select, Switch } from 'antd'
import { useEffect } from 'react'
import { useSaveUser } from '#/hooks/useAdmin'
import type { UserInput } from '#/hooks/useAdmin'
import { useContractors } from '#/hooks/useContractors'
import { roleLabels } from '#/lib/labels'
import type { Role, User } from '#/lib/types'
import { AppInput, AppPasswordInput } from '../atoms'
import { FormField } from '../molecules'

interface UserFormModalProps {
  open: boolean
  user?: User | null
  onClose: () => void
}

export function UserFormModal({ open, user, onClose }: UserFormModalProps) {
  const [form] = Form.useForm<UserInput>()
  const { message } = App.useApp()
  const save = useSaveUser()
  const { data: contractors = [], isLoading } = useContractors()
  const role = Form.useWatch('role', form)

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (user) form.setFieldsValue({ ...user, password: undefined })
  }, [open, user, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    try {
      await save.mutateAsync({
        ...values,
        id: user?.id,
        password: values.password || undefined,
        contractorId: values.role === 'CONTRACTOR_USER' ? values.contractorId : null,
      })
      message.success(user ? 'Usuario actualizado' : 'Usuario creado')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={open}
      title={user ? 'Editar usuario' : 'Nuevo usuario'}
      okText="Guardar"
      cancelText="Cancelar"
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={save.isPending}
      width={600}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" requiredMark="optional" style={{ marginTop: 16 }}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <FormField label="Nombre" name="name" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Requerido' },
                { type: 'email', message: 'Email invalido' },
              ]}
            >
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Rol" name="role" rules={[{ required: true, message: 'Requerido' }]}>
              <Select
                options={(Object.keys(roleLabels) as Array<Role>).map((r) => ({
                  value: r,
                  label: roleLabels[r],
                }))}
              />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField
              label={user ? 'Nueva contrasena' : 'Contrasena'}
              name="password"
              extra={user ? 'Dejala vacia para mantener la actual' : undefined}
              rules={[
                { required: !user, message: 'Requerido' },
                { min: 6, message: 'Minimo 6 caracteres' },
              ]}
            >
              <AppPasswordInput autoComplete="new-password" />
            </FormField>
          </Col>
          {role === 'CONTRACTOR_USER' && (
            <Col xs={24}>
              <FormField
                label="Contratista"
                name="contractorId"
                rules={[{ required: true, message: 'Selecciona el contratista' }]}
              >
                <Select
                  showSearch={{ optionFilterProp: 'label' }}
                  loading={isLoading}
                  placeholder="Selecciona un contratista"
                  options={contractors.map((c) => ({ value: c.id, label: `${c.name} (${c.taxId})` }))}
                />
              </FormField>
            </Col>
          )}
          {user && (
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
