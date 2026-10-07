import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { AppButton } from '../atoms'

interface ReviewActionsProps {
  onApprove: () => void
  onReject: () => void
  loading?: boolean
  size?: 'small' | 'middle' | 'large'
}

export function ReviewActions({ onApprove, onReject, loading, size = 'middle' }: ReviewActionsProps) {
  return (
    <Space wrap>
      <AppButton
        type="primary"
        icon={<CheckOutlined />}
        onClick={onApprove}
        loading={loading}
        size={size}
        style={{ background: '#16a34a' }}
      >
        Aprobar
      </AppButton>
      <AppButton danger icon={<CloseOutlined />} onClick={onReject} disabled={loading} size={size}>
        Rechazar
      </AppButton>
    </Space>
  )
}
