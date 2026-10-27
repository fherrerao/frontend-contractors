import {
  ArrowLeftOutlined,
  EditOutlined,
  PlusOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Alert, App, Card, Col, Descriptions, Flex, List, Row, Select, Skeleton, Tag, Typography } from 'antd'
import { useMemo, useState } from 'react'
import { AppButton, PageTitle, StatusTag } from '#/components/atoms'
import { EmptyState } from '#/components/molecules'
import { DocumentChecklist, ProjectFormModal } from '#/components/organisms'
import {
  useAssignWorker,
  useProject,
  useUnassignWorker,
} from '#/hooks/useProjects'
import { useWorkers } from '#/hooks/useWorkers'
import { session, useSession } from '#/lib/session'

export const Route = createFileRoute('/_app/contractors/$contractorId/projects/$projectId')({
  beforeLoad: ({ params }) => {
    const user = session.getUser()
    if (user?.role === 'CONTRACTOR_USER' && user.contractorId !== params.contractorId) {
      throw redirect({ to: '/' })
    }
  },
  head: () => ({ meta: [{ title: 'Proyecto · Gestion de Contratistas' }] }),
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { contractorId, projectId } = Route.useParams()
  const { user } = useSession()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const { data: project, isLoading, error } = useProject(projectId)
  const { data: workers = [] } = useWorkers(contractorId)
  const assign = useAssignWorker(projectId)
  const unassign = useUnassignWorker(projectId)
  const [editing, setEditing] = useState(false)
  const [workerToAssign, setWorkerToAssign] = useState<string | undefined>()

  const canManage = user?.role === 'ADMIN' || user?.role === 'APPROVER'
  const assignedIds = useMemo(
    () => new Set((project?.workers ?? []).map((w) => w.id)),
    [project?.workers],
  )
  const availableWorkers = workers.filter((w) => w.isActive && !assignedIds.has(w.id))

  const handleAssign = async () => {
    if (!workerToAssign) return
    try {
      await assign.mutateAsync(workerToAssign)
      message.success('Trabajador asignado')
      setWorkerToAssign(undefined)
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  const handleUnassign = async (workerId: string) => {
    try {
      await unassign.mutateAsync(workerId)
      message.success('Trabajador desasignado')
    } catch (e) {
      message.error((e as Error).message)
    }
  }

  if (!user) return null
  if (error) return <Alert type="error" showIcon title={error.message} />

  return (
    <>
      <PageTitle
        title={
          isLoading ? (
            <Skeleton.Input active />
          ) : (
            <Flex gap={12} align="center" wrap>
              <AppButton
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() =>
                  navigate({ to: '/contractors/$id', params: { id: contractorId } })
                }
              />
              {project?.name}
              {project && <StatusTag kind="contractor" status={project.status} />}
            </Flex>
          )
        }
        subtitle={
          project &&
          [project.code, project.contractor?.name].filter(Boolean).join(' · ')
        }
        extra={
          canManage && (
            <AppButton icon={<EditOutlined />} onClick={() => setEditing(true)}>
              Editar
            </AppButton>
          )
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <DocumentChecklist projectId={projectId} role={user.role} />
        </Col>
        <Col xs={24} xl={8}>
          <Flex vertical gap={16}>
            <Card title="Informacion" loading={isLoading}>
              {project && (
                <Descriptions
                  column={1}
                  size="small"
                  items={[
                    { key: 'code', label: 'Codigo', children: project.code ?? '-' },
                    {
                      key: 'description',
                      label: 'Descripcion',
                      children: project.description ?? '-',
                    },
                    {
                      key: 'active',
                      label: 'Estado',
                      children: project.isActive ? 'Activo' : 'Inactivo',
                    },
                  ]}
                />
              )}
            </Card>

            <Card
              title="Trabajadores asignados"
              loading={isLoading}
              extra={
                canManage &&
                availableWorkers.length > 0 && (
                  <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                    {availableWorkers.length} disponibles
                  </Typography.Text>
                )
              }
            >
              {canManage && (
                <Flex vertical gap={8} style={{ marginBottom: 16 }}>
                  <Select
                    placeholder="Seleccionar trabajador"
                    value={workerToAssign}
                    onChange={setWorkerToAssign}
                    options={availableWorkers.map((w) => ({
                      value: w.id,
                      label: `${w.name} (${w.documentId})`,
                    }))}
                    allowClear
                    showSearch={{ optionFilterProp: 'label' }}
                  />
                  <AppButton
                    type="primary"
                    icon={<PlusOutlined />}
                    disabled={!workerToAssign}
                    loading={assign.isPending}
                    onClick={handleAssign}
                    block
                  >
                    Asignar
                  </AppButton>
                </Flex>
              )}

              {project?.workers?.length ? (
                <List
                  dataSource={project.workers}
                  renderItem={(w) => (
                    <List.Item
                      actions={
                        canManage
                          ? [
                              <AppButton
                                key="remove"
                                type="text"
                                danger
                                icon={<UserDeleteOutlined />}
                                loading={unassign.isPending}
                                onClick={() => handleUnassign(w.id)}
                              />,
                            ]
                          : undefined
                      }
                    >
                      <List.Item.Meta
                        title={w.name}
                        description={
                          <Flex vertical gap={4}>
                            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                              {w.position} · CC {w.documentId}
                            </Typography.Text>
                            <Flex gap={4} wrap>
                              {(w.documents ?? []).map((d) => (
                                <Tag key={d.id}>{d.name}</Tag>
                              ))}
                            </Flex>
                          </Flex>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <EmptyState description="Sin trabajadores asignados" />
              )}
            </Card>
          </Flex>
        </Col>
      </Row>

      {project && (
        <ProjectFormModal
          open={editing}
          contractorId={contractorId}
          project={project}
          onClose={() => setEditing(false)}
        />
      )}
    </>
  )
}
