import { EditOutlined } from '@ant-design/icons'
import { Badge, Flex, Table, Tag, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { Worker } from '#/lib/types'
import { AppButton } from '../atoms'
import { EmptyState } from '../molecules'

interface WorkersTableProps {
  data: Array<Worker>
  loading?: boolean
  canManage?: boolean
  onEdit?: (worker: Worker) => void
}

export function WorkersTable({ data, loading, canManage, onEdit }: WorkersTableProps) {
  const columns: TableProps<Worker>['columns'] = [
    {
      title: 'Trabajador',
      key: 'name',
      render: (_, w) => (
        <Flex vertical>
          <Typography.Text strong>{w.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            CC {w.documentId}
          </Typography.Text>
        </Flex>
      ),
    },
    { title: 'Cargo', dataIndex: 'position', responsive: ['sm'] },
    {
      title: 'Contacto',
      key: 'contact',
      responsive: ['md'],
      render: (_, w) => (
        <Flex vertical>
          <Typography.Text>{w.phone ?? '-'}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {w.email ?? '-'}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Proyectos / Documentos',
      key: 'projects',
      responsive: ['lg'],
      render: (_, w) =>
        w.projects?.length ? (
          <Flex vertical gap={8}>
            {w.projects.map((p) => (
              <Flex key={p.id} vertical gap={4}>
                <Typography.Text strong style={{ fontSize: 13 }}>
                  {p.name}
                </Typography.Text>
                <Flex gap={4} wrap>
                  {p.documents?.length ? (
                    p.documents.map((d) => (
                      <Tag key={d.id} style={{ marginInlineEnd: 0 }}>
                        {d.name}
                      </Tag>
                    ))
                  ) : (
                    <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                      Sin documentos
                    </Typography.Text>
                  )}
                </Flex>
              </Flex>
            ))}
          </Flex>
        ) : (
          <Typography.Text type="secondary">Sin asignar</Typography.Text>
        ),
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      width: 110,
      responsive: ['sm'],
      render: (active: boolean) => (
        <Badge status={active ? 'success' : 'default'} text={active ? 'Activo' : 'Inactivo'} />
      ),
    },
    ...(canManage && onEdit
      ? [
          {
            key: 'actions',
            width: 60,
            align: 'right' as const,
            render: (_: unknown, w: Worker) => (
              <AppButton type="text" icon={<EditOutlined />} onClick={() => onEdit(w)} />
            ),
          },
        ]
      : []),
  ]

  return (
    <Table<Worker>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: true }}
      pagination={{ pageSize: 10, hideOnSinglePage: true }}
      locale={{ emptyText: <EmptyState description="No hay trabajadores registrados" /> }}
    />
  )
}
