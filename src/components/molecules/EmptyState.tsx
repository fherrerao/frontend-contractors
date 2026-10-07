import { Empty } from 'antd'
import type { ReactNode } from 'react'

interface EmptyStateProps {
  description: ReactNode
  action?: ReactNode
}

export function EmptyState({ description, action }: EmptyStateProps) {
  return (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={description} style={{ padding: 32 }}>
      {action}
    </Empty>
  )
}
