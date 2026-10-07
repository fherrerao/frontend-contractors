import {
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FileDoneOutlined,
  RightOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, Col, List, Row, Typography } from 'antd'
import dayjs from 'dayjs'
import { AppButton, PageTitle, StatusTag } from '#/components/atoms'
import { EmptyState, StatCard } from '#/components/molecules'
import { useDashboardStats } from '#/hooks/useAdmin'
import { useSession } from '#/lib/session'

export const Route = createFileRoute('/_app/')({
  head: () => ({ meta: [{ title: 'Dashboard · Gestion de Contratistas' }] }),
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useSession()
  const navigate = useNavigate()
  const { data, isLoading } = useDashboardStats()
  if (!user) return null

  const c = data?.contractors ?? {}
  const d = data?.documents ?? {}
  const isContractor = user.role === 'CONTRACTOR_USER'
  const totalContractors = (c.COMPLIANT ?? 0) + (c.INCOMPLETE ?? 0) + (c.EXPIRED ?? 0)

  const cards = isContractor
    ? [
        { title: 'Aprobados', value: d.APPROVED ?? 0, icon: <CheckCircleOutlined />, color: '#16a34a' },
        { title: 'En revision', value: d.SUBMITTED ?? 0, icon: <ClockCircleOutlined />, color: '#2563eb' },
        { title: 'Pendientes por subir', value: d.PENDING ?? 0, icon: <FileDoneOutlined />, color: '#d97706' },
        {
          title: 'Rechazados / vencidos',
          value: (d.REJECTED ?? 0) + (d.EXPIRED ?? 0),
          icon: <CloseCircleOutlined />,
          color: '#dc2626',
        },
      ]
    : [
        {
          title: 'Contratistas',
          value: totalContractors,
          icon: <TeamOutlined />,
          color: '#4f46e5',
          onClick: () => navigate({ to: '/contractors' }),
        },
        { title: 'Habilitados', value: c.COMPLIANT ?? 0, icon: <CheckCircleOutlined />, color: '#16a34a' },
        {
          title: 'Incompletos / vencidos',
          value: (c.INCOMPLETE ?? 0) + (c.EXPIRED ?? 0),
          icon: <ExclamationCircleOutlined />,
          color: '#d97706',
        },
        {
          title: 'Documentos por revisar',
          value: d.SUBMITTED ?? 0,
          icon: <AuditOutlined />,
          color: '#2563eb',
          onClick: () => navigate({ to: '/reviews' }),
        },
      ]

  return (
    <>
      <PageTitle
        title="Dashboard"
        subtitle={
          isContractor
            ? `Resumen de la documentacion de ${user.contractor?.name ?? 'tu empresa'}`
            : 'Resumen general del cumplimiento de contratistas'
        }
        extra={
          isContractor &&
          user.contractorId && (
            <AppButton
              type="primary"
              icon={<RightOutlined />}
              iconPlacement="end"
              onClick={() =>
                navigate({ to: '/contractors/$id', params: { id: user.contractorId! } })
              }
            >
              Gestionar documentos
            </AppButton>
          )
        }
      />

      <Row gutter={[16, 16]}>
        {cards.map((card) => (
          <Col key={card.title} xs={24} sm={12} xl={6}>
            <StatCard {...card} loading={isLoading} />
          </Col>
        ))}

        {isContractor && user.contractor && (
          <Col xs={24} lg={8}>
            <Card title="Estado de tu empresa" style={{ height: '100%' }}>
              <Typography.Paragraph>
                <StatusTag kind="contractor" status={user.contractor.status} />
              </Typography.Paragraph>
              <Typography.Text type="secondary">
                Tu empresa queda habilitada cuando todos los documentos obligatorios estan
                aprobados y vigentes.
              </Typography.Text>
            </Card>
          </Col>
        )}

        <Col xs={24} lg={isContractor ? 16 : 24}>
          <Card title="Proximos a vencer (30 dias)" loading={isLoading}>
            {data?.expiringSoon.length ? (
              <List
                dataSource={data.expiringSoon}
                renderItem={(item) => (
                  <List.Item
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      navigate({ to: '/contractors/$id', params: { id: item.contractor.id } })
                    }
                    extra={
                      <Typography.Text type="warning">
                        {dayjs(item.expiresAt).format('DD MMM YYYY')}
                      </Typography.Text>
                    }
                  >
                    <List.Item.Meta
                      title={item.type.name}
                      description={isContractor ? undefined : item.contractor.name}
                    />
                  </List.Item>
                )}
              />
            ) : (
              <EmptyState description="No hay documentos por vencer en los proximos 30 dias" />
            )}
          </Card>
        </Col>
      </Row>
    </>
  )
}
