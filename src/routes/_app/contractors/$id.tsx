import {
  ArrowLeftOutlined,
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Alert, Card, Col, Descriptions, Flex, List, Row, Skeleton } from 'antd'
import { useState } from 'react'
import { AppAvatar, AppButton, PageTitle, StatusTag } from '#/components/atoms'
import { EmptyState } from '#/components/molecules'
import { ContractorFormModal, DocumentChecklist } from '#/components/organisms'
import { useContractor } from '#/hooks/useContractors'
import { session, useSession } from '#/lib/session'

export const Route = createFileRoute('/_app/contractors/$id')({
  beforeLoad: ({ params }) => {
    const user = session.getUser()
    if (user?.role === 'CONTRACTOR_USER' && user.contractorId !== params.id) {
      throw redirect({ to: '/' })
    }
  },
  head: () => ({ meta: [{ title: 'Contratista · Gestion de Contratistas' }] }),
  component: ContractorDetailPage,
})

function ContractorDetailPage() {
  const { id } = Route.useParams()
  const { user } = useSession()
  const navigate = useNavigate()
  const { data: contractor, isLoading, error } = useContractor(id)
  const [editing, setEditing] = useState(false)

  if (!user) return null
  if (error) return <Alert type="error" showIcon title={error.message} />

  const isContractorUser = user.role === 'CONTRACTOR_USER'

  return (
    <>
      <PageTitle
        title={
          isLoading ? (
            <Skeleton.Input active />
          ) : (
            <Flex gap={12} align="center" wrap>
              {!isContractorUser && (
                <AppButton
                  type="text"
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate({ to: '/contractors' })}
                />
              )}
              {contractor?.name}
              {contractor && <StatusTag kind="contractor" status={contractor.status} />}
            </Flex>
          )
        }
        subtitle={contractor && `NIT ${contractor.taxId}`}
        extra={
          user.role === 'ADMIN' && (
            <AppButton icon={<EditOutlined />} onClick={() => setEditing(true)}>
              Editar
            </AppButton>
          )
        }
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <DocumentChecklist contractorId={id} role={user.role} />
        </Col>
        <Col xs={24} xl={8}>
          <Flex vertical gap={16}>
            <Card title="Informacion" loading={isLoading}>
              {contractor && (
                <Descriptions
                  column={1}
                  size="small"
                  items={[
                    { key: 'contact', label: <UserOutlined />, children: contractor.contactName ?? '-' },
                    { key: 'email', label: <MailOutlined />, children: contractor.email ?? '-' },
                    { key: 'phone', label: <PhoneOutlined />, children: contractor.phone ?? '-' },
                    { key: 'address', label: 'Direccion', children: contractor.address ?? '-' },
                  ]}
                />
              )}
            </Card>
            {!isContractorUser && (
              <Card title="Usuarios del contratista" loading={isLoading}>
                {contractor?.users?.length ? (
                  <List
                    dataSource={contractor.users}
                    renderItem={(u) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<AppAvatar name={u.name} />}
                          title={u.name}
                          description={u.email}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <EmptyState description="Sin usuarios asignados" />
                )}
              </Card>
            )}
          </Flex>
        </Col>
      </Row>

      <ContractorFormModal open={editing} contractor={contractor} onClose={() => setEditing(false)} />
    </>
  )
}
