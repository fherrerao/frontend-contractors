import { EditOutlined, RightOutlined } from '@ant-design/icons'
import { Flex, Progress, Space, Table, Tooltip, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { Contractor } from '#/lib/types'
import { AppAvatar, AppButton, StatusTag } from '../atoms'
import { EmptyState } from '../molecules'

interface ContractorsTableProps {
  data: Array<Contractor>
  loading?: boolean
  canEdit: boolean
  onOpen: (contractor: Contractor) => void
  onEdit: (contractor: Contractor) => void
}

export function ContractorsTable({ data, loading, canEdit, onOpen, onEdit }: ContractorsTableProps) {
  const columns: TableProps<Contractor>['columns'] = [
    {
      title: 'Contratista',
      key: 'name',
      render: (_, c) => (
        <Flex gap={12} align="center">
          <AppAvatar name={c.name} shape="square" />
          <Flex vertical style={{ minWidth: 0 }}>
            <Typography.Text strong ellipsis>
              {c.name}
            </Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              NIT {c.taxId}
            </Typography.Text>
          </Flex>
        </Flex>
      ),
    },
    {
      title: 'Contacto',
      key: 'contact',
      responsive: ['lg'],
      render: (_, c) => (
        <Flex vertical>
          <Typography.Text>{c.contactName ?? '-'}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {c.email ?? c.phone ?? ''}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Documentacion',
      key: 'docs',
      responsive: ['md'],
      width: 220,
      render: (_, c) => {
        const s = c.documentSummary
        if (!s) return null
        const percent = s.total ? Math.round((s.approved / s.total) * 100) : 0
        return (
          <Tooltip
            title={`${s.approved} aprobados · ${s.submitted} en revision · ${s.rejected} rechazados`}
          >
            <Flex vertical gap={2}>
              <Progress percent={percent} size="small" showInfo={false} />
              <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                {s.approved} de {s.total} aprobados
              </Typography.Text>
            </Flex>
          </Tooltip>
        )
      },
    },
    {
      title: 'Estado',
      dataIndex: 'status',
      width: 140,
      render: (status: Contractor['status']) => <StatusTag kind="contractor" status={status} />,
    },
    {
      key: 'actions',
      width: canEdit ? 100 : 56,
      align: 'right',
      render: (_, c) => (
        <Space onClick={(e) => e.stopPropagation()}>
          {canEdit && (
            <Tooltip title="Editar">
              <AppButton type="text" icon={<EditOutlined />} onClick={() => onEdit(c)} />
            </Tooltip>
          )}
          <AppButton type="text" icon={<RightOutlined />} onClick={() => onOpen(c)} />
        </Space>
      ),
    },
  ]

  return (
    <Table<Contractor>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: true }}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      onRow={(c) => ({ onClick: () => onOpen(c), style: { cursor: 'pointer' } })}
      locale={{ emptyText: <EmptyState description="No hay contratistas para mostrar" /> }}
    />
  )
}
