import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  FieldTimeOutlined,
  MinusCircleOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { Tag } from 'antd'
import type { ReactNode } from 'react'
import { contractorStatusLabels, documentStatusLabels } from '#/lib/labels'
import type { ContractorStatus, DocumentStatus } from '#/lib/types'

const documentConfig: Record<DocumentStatus, { color: string; icon: ReactNode }> = {
  PENDING: { color: 'default', icon: <MinusCircleOutlined /> },
  SUBMITTED: { color: 'processing', icon: <SyncOutlined /> },
  APPROVED: { color: 'success', icon: <CheckCircleOutlined /> },
  REJECTED: { color: 'error', icon: <CloseCircleOutlined /> },
  EXPIRED: { color: 'warning', icon: <FieldTimeOutlined /> },
}

const contractorConfig: Record<ContractorStatus, { color: string; icon: ReactNode }> = {
  COMPLIANT: { color: 'success', icon: <CheckCircleOutlined /> },
  INCOMPLETE: { color: 'gold', icon: <ClockCircleOutlined /> },
  EXPIRED: { color: 'error', icon: <ExclamationCircleOutlined /> },
}

type StatusTagProps =
  | { kind: 'document'; status: DocumentStatus }
  | { kind: 'contractor'; status: ContractorStatus }

export function StatusTag(props: StatusTagProps) {
  const { color, icon } =
    props.kind === 'document' ? documentConfig[props.status] : contractorConfig[props.status]
  const label =
    props.kind === 'document'
      ? documentStatusLabels[props.status]
      : contractorStatusLabels[props.status]

  return (
    <Tag color={color} icon={icon} variant="filled" style={{ marginInlineEnd: 0 }}>
      {label}
    </Tag>
  )
}
