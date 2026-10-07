import { EyeOutlined } from '@ant-design/icons'
import { Flex, Table, Typography } from 'antd'
import type { TableProps } from 'antd'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import type { ContractorDocument } from '#/lib/types'
import { AppButton } from '../atoms'
import { EmptyState } from '../molecules'

dayjs.extend(relativeTime)

interface ReviewQueueTableProps {
  data: Array<ContractorDocument>
  loading?: boolean
  onOpen: (document: ContractorDocument) => void
}

export function ReviewQueueTable({ data, loading, onOpen }: ReviewQueueTableProps) {
  const columns: TableProps<ContractorDocument>['columns'] = [
    {
      title: 'Documento',
      key: 'type',
      render: (_, d) => (
        <Flex vertical>
          <Typography.Text strong>{d.type.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }} ellipsis>
            {d.fileName}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Contratista',
      key: 'contractor',
      render: (_, d) => (
        <Flex vertical>
          <Typography.Text>{d.contractor?.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            NIT {d.contractor?.taxId}
          </Typography.Text>
        </Flex>
      ),
    },
    {
      title: 'Enviado por',
      key: 'uploadedBy',
      responsive: ['lg'],
      render: (_, d) => d.uploadedBy?.name ?? '-',
    },
    {
      title: 'Fecha',
      dataIndex: 'submittedAt',
      responsive: ['md'],
      width: 160,
      render: (value: string | null) =>
        value && (
          <Typography.Text title={dayjs(value).format('DD/MM/YYYY HH:mm')}>
            {dayjs(value).fromNow()}
          </Typography.Text>
        ),
    },
    {
      key: 'actions',
      align: 'right',
      width: 120,
      render: (_, d) => (
        <AppButton type="primary" icon={<EyeOutlined />} onClick={() => onOpen(d)}>
          Revisar
        </AppButton>
      ),
    },
  ]

  return (
    <Table<ContractorDocument>
      rowKey="id"
      columns={columns}
      dataSource={data}
      loading={loading}
      scroll={{ x: true }}
      pagination={{ pageSize: 15, hideOnSinglePage: true }}
      locale={{
        emptyText: <EmptyState description="No hay documentos pendientes de revision" />,
      }}
    />
  )
}
