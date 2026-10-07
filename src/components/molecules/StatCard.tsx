import { Card, Flex, Skeleton, Typography } from 'antd'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  color: string
  hint?: ReactNode
  loading?: boolean
  onClick?: () => void
}

export function StatCard({ title, value, icon, color, hint, loading, onClick }: StatCardProps) {
  return (
    <Card
      hoverable={!!onClick}
      onClick={onClick}
      styles={{ body: { padding: 20 } }}
      style={{ height: '100%' }}
    >
      <Flex justify="space-between" align="flex-start" gap={12}>
        <div style={{ minWidth: 0 }}>
          <Typography.Text type="secondary">{title}</Typography.Text>
          {loading ? (
            <Skeleton.Input active size="small" style={{ marginTop: 8, display: 'block' }} />
          ) : (
            <Typography.Title level={2} style={{ margin: '4px 0 0' }}>
              {value}
            </Typography.Title>
          )}
          {hint && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {hint}
            </Typography.Text>
          )}
        </div>
        <Flex
          align="center"
          justify="center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: `${color}1a`,
            color,
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {icon}
        </Flex>
      </Flex>
    </Card>
  )
}
