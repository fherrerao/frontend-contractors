import { Tag } from 'antd'
import { roleLabels } from '#/lib/labels'
import type { Role } from '#/lib/types'

const colors: Record<Role, string> = {
  ADMIN: 'purple',
  APPROVER: 'blue',
  CONTRACTOR_USER: 'cyan',
}

export function RoleTag({ role }: { role: Role }) {
  return (
    <Tag color={colors[role]} variant="filled" style={{ marginInlineEnd: 0 }}>
      {roleLabels[role]}
    </Tag>
  )
}
