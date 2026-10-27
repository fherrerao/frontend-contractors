import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { App, Button, Col, Divider, Flex, Form, Input, Modal, Row, Switch, Typography } from 'antd'
import { useEffect } from 'react'
import { useSaveProject } from '#/hooks/useProjects'
import type { ProjectInput } from '#/hooks/useProjects'
import type { Project } from '#/lib/types'
import { AppInput } from '../atoms'
import { FormField } from '../molecules'

interface ProjectFormModalProps {
  open: boolean
  contractorId: string
  project?: Project | null
  onClose: () => void
}

export function ProjectFormModal({ open, contractorId, project, onClose }: ProjectFormModalProps) {
  const [form] = Form.useForm<ProjectInput>()
  const { message } = App.useApp()
  const save = useSaveProject(contractorId)

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (project) {
      form.setFieldsValue({
        name: project.name,
        code: project.code,
        description: project.description,
        isActive: project.isActive,
        documents: (project.documents ?? []).map((d) => ({
          id: d.id,
          name: d.name,
          description: d.description,
          required: d.required,
          expires: d.expires,
        })),
      })
    } else {
      form.setFieldsValue({
        documents: [{ name: '', required: true, expires: false }],
      })
    }
  }, [open, project, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const documents = (values.documents ?? []).map((d) => ({
      id: d.id,
      name: d.name.trim(),
      description: d.description?.trim() ? d.description.trim() : undefined,
      required: d.required ?? true,
      expires: d.expires ?? false,
    }))
    if (!documents.length) {
      message.error('Debes agregar al menos un documento')
      return
    }

    const payload: ProjectInput = {
      name: values.name,
      code: values.code === '' || values.code == null ? undefined : values.code,
      description:
        values.description === '' || values.description == null
          ? undefined
          : values.description,
      isActive: values.isActive,
      documents,
    }

    try {
      await save.mutateAsync({ ...payload, id: project?.id })
      message.success(project ? 'Proyecto actualizado' : 'Proyecto creado')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={open}
      title={project ? 'Editar proyecto' : 'Nuevo proyecto'}
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
          <Col xs={24} md={16}>
            <FormField label="Nombre" name="name" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={8}>
            <FormField label="Codigo" name="code">
              <AppInput placeholder="Opcional" />
            </FormField>
          </Col>
          <Col xs={24}>
            <FormField label="Descripcion" name="description">
              <Input.TextArea rows={2} placeholder="Opcional" allowClear />
            </FormField>
          </Col>
          {project && (
            <Col xs={24}>
              <FormField label="Activo" name="isActive" valuePropName="checked">
                <Switch />
              </FormField>
            </Col>
          )}
        </Row>

        <Divider style={{ margin: '8px 0 16px' }} />
        <Typography.Text strong>Documentos del proyecto</Typography.Text>
        <Typography.Paragraph type="secondary" style={{ marginTop: 4, marginBottom: 12 }}>
          Se asignaran automaticamente a los trabajadores del proyecto.
        </Typography.Paragraph>

        <Form.List
          name="documents"
          rules={[
            {
              validator: async (_, docs) => {
                if (!docs?.length) {
                  throw new Error('Debes agregar al menos un documento')
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <Flex vertical gap={12}>
              {fields.map((field) => (
                <div
                  key={field.key}
                  style={{
                    border: '1px solid var(--ant-color-border-secondary, #f0f0f0)',
                    borderRadius: 8,
                    padding: 12,
                  }}
                >
                  <Form.Item name={[field.name, 'id']} hidden>
                    <Input />
                  </Form.Item>
                  <Row gutter={12} align="middle">
                    <Col xs={24} md={14}>
                      <FormField
                        label="Nombre"
                        name={[field.name, 'name']}
                        rules={[{ required: true, message: 'Requerido' }]}
                        style={{ marginBottom: 8 }}
                      >
                        <AppInput placeholder="Ej. ARL, Certificado medico" />
                      </FormField>
                    </Col>
                    <Col xs={12} md={4}>
                      <FormField
                        label="Obligatorio"
                        name={[field.name, 'required']}
                        valuePropName="checked"
                        style={{ marginBottom: 8 }}
                      >
                        <Switch />
                      </FormField>
                    </Col>
                    <Col xs={12} md={4}>
                      <FormField
                        label="Expira"
                        name={[field.name, 'expires']}
                        valuePropName="checked"
                        style={{ marginBottom: 8 }}
                      >
                        <Switch />
                      </FormField>
                    </Col>
                    <Col xs={24} md={2} style={{ textAlign: 'right' }}>
                      <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        disabled={fields.length === 1}
                        onClick={() => remove(field.name)}
                        aria-label="Eliminar documento"
                      />
                    </Col>
                    <Col xs={24}>
                      <FormField
                        label="Descripcion"
                        name={[field.name, 'description']}
                        style={{ marginBottom: 0 }}
                      >
                        <Input.TextArea rows={1} placeholder="Opcional" allowClear />
                      </FormField>
                    </Col>
                  </Row>
                </div>
              ))}
              <Button type="dashed" onClick={() => add({ required: true, expires: false })} block icon={<PlusOutlined />}>
                Agregar documento
              </Button>
              <Form.ErrorList errors={errors} />
            </Flex>
          )}
        </Form.List>
      </Form>
    </Modal>
  )
}
