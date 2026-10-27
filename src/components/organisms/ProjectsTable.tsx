import { EditOutlined, RightOutlined } from '@ant-design/icons'
import { Badge, Flex, Progress, Table, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { Project } from '#/lib/types'
import { AppButton, StatusTag } from '../atoms'
import { EmptyState } from '../molecules'

interface ProjectsTableProps {
  data: Array<Project>
  loading?: boolean
  canManage?: boolean
  onOpen: (project: Project) => void
  onEdit?: (project: Project) => void
}

export function ProjectsTable({ data, loading, canManage, onOpen, onEdit }: ProjectsTableProps) {
  const columns: TableProps<Project>['columns'] = [
    {
      title: 'Proyecto',
      key: 'name',
      render: (_, p) => (
        <Flex vertical>
          <Typography.Text strong>{p.name}</Typography.Text>
          {(p.code || p.description) && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
              {[p.code, p.description].filter(Boolean).join(' · ')}
            </Typography.Text>
          )}
        </Flex>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 140,
      render: (status: Project['status']) => <StatusTag kind="contractor" status={status} />,
    },
    {
      title: 'Documentos',
      key: 'docs',
      width: 180,
      responsive: ['md'],
      render: (_, p) => {
        const summary = p.documentSummary
        if (!summary?.total) return <Typography.Text type="secondary">-</Typography.Text>
        const percent = Math.round((summary.approved / summary.total) * 100)
        return (
          <Flex vertical gap={4} style={{ minWidth: 120 }}>
            <Progress percent={percent} size="small" style={{ margin: 0 }} />
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {summary.approved}/{summary.total} aprobados
            </Typography.Text>
          </Flex>
        )
      },
    },
    {
      title: 'Trabajadores',
      dataIndex: 'workerCount',
      width: 120,
      responsive: ['lg'],
      render: (count: number | undefined) => count ?? 0,
    },
    {
      title: 'Activo',
      dataIndex: 'isActive',
      width: 100,
      responsive: ['sm'],
      render: (active: boolean) => (
        <Badge status={active ? 'success' : 'default'} text={active ? 'Activo' : 'Inactivo'} />
      ),
    },
    {
      key: 'actions',
      align: 'right',
      width: canManage ? 120 : 90,
      render: (_, p) => (
        <Flex gap={4} justify="end">
          {canManage && onEdit && (
            <AppButton type="text" icon={<EditOutlined />} onClick={() => onEdit(p)} />
          )}
          <AppButton type="link" icon={<RightOutlined />} iconPlacement="end" onClick={() => onOpen(p)}>
            Abrir
          </AppButton>
        </Flex>
      ),
    },
  ]

  return (
    <Table<Project>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: true }}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      locale={{ emptyText: <EmptyState description="No hay proyectos registrados" /> }}
    />
  )
}
