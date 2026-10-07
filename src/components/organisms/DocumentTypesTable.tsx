import { EditOutlined } from '@ant-design/icons'
import { Badge, Flex, Table, Tag, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { DocumentType } from '#/lib/types'
import { AppButton } from '../atoms'

interface DocumentTypesTableProps {
  data: Array<DocumentType>
  loading?: boolean
  onEdit: (type: DocumentType) => void
}

export function DocumentTypesTable({ data, loading, onEdit }: DocumentTypesTableProps) {
  const columns: TableProps<DocumentType>['columns'] = [
    {
      title: 'Documento',
      key: 'name',
      render: (_, t) => (
        <Flex vertical>
          <Typography.Text strong>{t.name}</Typography.Text>
          {t.description && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {t.description}
            </Typography.Text>
          )}
        </Flex>
      ),
    },
    {
      title: 'Caracteristicas',
      key: 'flags',
      responsive: ['sm'],
      render: (_, t) => (
        <Flex gap={4} wrap>
          {t.required ? <Tag color="red">Obligatorio</Tag> : <Tag>Opcional</Tag>}
          {t.expires && <Tag color="orange">Vence</Tag>}
        </Flex>
      ),
    },
    {
      title: 'Estado',
      dataIndex: 'isActive',
      width: 110,
      responsive: ['md'],
      render: (active: boolean) => (
        <Badge status={active ? 'success' : 'default'} text={active ? 'Activo' : 'Inactivo'} />
      ),
    },
    {
      key: 'actions',
      width: 60,
      align: 'right',
      render: (_, t) => <AppButton type="text" icon={<EditOutlined />} onClick={() => onEdit(t)} />,
    },
  ]

  return (
    <Table<DocumentType>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: true }}
      pagination={false}
    />
  )
}
