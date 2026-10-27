import { App, Col, Form, Modal, Row, Select, Switch } from 'antd'
import { useEffect, useMemo } from 'react'
import { useProjects } from '#/hooks/useProjects'
import { useSaveWorker } from '#/hooks/useWorkers'
import type { WorkerInput } from '#/hooks/useWorkers'
import type { Worker } from '#/lib/types'
import { AppInput } from '../atoms'
import { FormField } from '../molecules'

interface WorkerFormModalProps {
  open: boolean
  contractorId: string
  worker?: Worker | null
  onClose: () => void
}

export function WorkerFormModal({ open, contractorId, worker, onClose }: WorkerFormModalProps) {
  const [form] = Form.useForm<WorkerInput>()
  const { message } = App.useApp()
  const save = useSaveWorker(contractorId)
  const { data: projects = [], isLoading: loadingProjects } = useProjects(contractorId)

  const activeProjects = useMemo(
    () => projects.filter((p) => p.isActive || worker?.projects?.some((wp) => wp.id === p.id)),
    [projects, worker],
  )

  useEffect(() => {
    if (!open) return
    form.resetFields()
    if (worker) {
      form.setFieldsValue({
        name: worker.name,
        documentId: worker.documentId,
        position: worker.position,
        phone: worker.phone,
        email: worker.email,
        isActive: worker.isActive,
        projectIds: worker.projects?.map((p) => p.id) ?? [],
      })
    } else {
      form.setFieldsValue({ projectIds: [] })
    }
  }, [open, worker, form])

  const handleOk = async () => {
    const values = await form.validateFields()
    const payload: WorkerInput = {
      name: values.name,
      documentId: values.documentId,
      position: values.position,
      phone: values.phone === '' ? null : values.phone,
      email: values.email === '' ? null : values.email,
      isActive: values.isActive,
      projectIds: values.projectIds,
    }

    try {
      await save.mutateAsync({ ...payload, id: worker?.id })
      message.success(worker ? 'Trabajador actualizado' : 'Trabajador creado')
      onClose()
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  return (
    <Modal
      open={open}
      title={worker ? 'Editar trabajador' : 'Nuevo trabajador'}
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
          <Col xs={24} md={12}>
            <FormField label="Nombre" name="name" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField
              label="Cedula"
              name="documentId"
              rules={[{ required: true, message: 'Requerido' }]}
            >
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Cargo" name="position" rules={[{ required: true, message: 'Requerido' }]}>
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24} md={12}>
            <FormField label="Telefono" name="phone">
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24}>
            <FormField
              label="Email"
              name="email"
              rules={[{ type: 'email', message: 'Email invalido' }]}
            >
              <AppInput />
            </FormField>
          </Col>
          <Col xs={24}>
            <FormField
              label="Proyectos"
              name="projectIds"
              rules={[{ required: true, message: 'Selecciona al menos un proyecto' }]}
              extra="Se asignaran automaticamente todos los documentos de cada proyecto."
            >
              <Select
                mode="multiple"
                loading={loadingProjects}
                placeholder="Selecciona proyectos"
                options={activeProjects.map((p) => ({
                  value: p.id,
                  label: p.code ? `${p.name} (${p.code})` : p.name,
                }))}
                showSearch={{ optionFilterProp: 'label' }}
              />
            </FormField>
          </Col>

          {worker && (
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
