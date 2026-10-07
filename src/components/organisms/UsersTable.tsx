import { EditOutlined } from '@ant-design/icons'
import { Badge, Flex, Table, Typography } from 'antd'
import type { TableProps } from 'antd'
import type { User } from '#/lib/types'
import { AppAvatar, AppButton, RoleTag } from '../atoms'

interface UsersTableProps {
  data: Array<User>
  loading?: boolean
  onEdit: (user: User) => void
}

export function UsersTable({ data, loading, onEdit }: UsersTableProps) {
  const columns: TableProps<User>['columns'] = [
    {
      title: 'Usuario',
      key: 'name',
      render: (_, u) => (
        <Flex gap={12} align="center">
          <AppAvatar name={u.name} />
          <Flex vertical style={{ minWidth: 0 }}>
            <Typography.Text strong>{u.name}</Typography.Text>
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {u.email}
            </Typography.Text>
          </Flex>
        </Flex>
      ),
    },
    { title: 'Rol', dataIndex: 'role', width: 140, render: (role: User['role']) => <RoleTag role={role} /> },
    {
      title: 'Contratista',
      key: 'contractor',
      responsive: ['md'],
      render: (_, u) => u.contractor?.name ?? <Typography.Text type="secondary">-</Typography.Text>,
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
    {
      key: 'actions',
      width: 60,
      align: 'right',
      render: (_, u) => <AppButton type="text" icon={<EditOutlined />} onClick={() => onEdit(u)} />,
    },
  ]

  return (
    <Table<User>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: true }}
      pagination={{ pageSize: 15, hideOnSinglePage: true }}
    />
  )
}
