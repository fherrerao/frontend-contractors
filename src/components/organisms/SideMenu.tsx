import {
  AuditOutlined,
  DashboardOutlined,
  ShopOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useLocation, useNavigate } from '@tanstack/react-router'
import { Badge, Flex, Menu } from 'antd'
import type { MenuProps } from 'antd'
import { usePendingCount } from '#/hooks/useDocuments'
import type { SessionUser } from '#/lib/types'
import { AppLogo } from '../atoms'

interface SideMenuProps {
  user: SessionUser
  collapsed?: boolean
  onNavigate?: () => void
}

type MenuItem = NonNullable<MenuProps['items']>[number] & { key: string }

export function SideMenu({ user, collapsed, onNavigate }: SideMenuProps) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const canReview = user.role === 'APPROVER' || user.role === 'ADMIN'
  const { data: pendingCount = 0 } = usePendingCount(canReview)

  const items: Array<MenuItem> = [
    { key: '/', icon: <DashboardOutlined />, label: 'Dashboard' },
  ]

  if (user.role === 'CONTRACTOR_USER' && user.contractorId) {
    items.push({
      key: `/contractors/${user.contractorId}`,
      icon: <ShopOutlined />,
      label: 'Mi empresa',
    })
  } else {
    items.push({ key: '/contractors', icon: <TeamOutlined />, label: 'Contratistas' })
  }

  if (canReview) {
    items.push({
      key: '/reviews',
      icon: <AuditOutlined />,
      label: (
        <Flex justify="space-between" align="center">
          <span>Revisiones</span>
          {!collapsed && <Badge count={pendingCount} size="small" />}
        </Flex>
      ),
    })
  }

  if (user.role === 'ADMIN') {
    const adminItems: Array<MenuItem> = [
      { key: '/admin/users', icon: <UserOutlined />, label: 'Usuarios' },
    ]
    if (collapsed) {
      items.push({ key: 'admin-divider', type: 'divider' }, ...adminItems)
    } else {
      items.push({ key: 'admin', type: 'group', label: 'Administracion', children: adminItems })
    }
  }

  const allKeys = items.flatMap((item) =>
    'children' in item && item.children
      ? item.children.map((c) => String(c?.key))
      : [item.key],
  ).filter((key) => key.startsWith('/'))
  const selected = allKeys
    .filter((key) => key === '/' ? pathname === '/' : pathname.startsWith(key))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <Flex vertical style={{ height: '100%' }}>
      <Flex
        align="center"
        justify={collapsed ? 'center' : 'flex-start'}
        style={{ height: 64, padding: collapsed ? 0 : '0 24px', flexShrink: 0 }}
      >
        <AppLogo collapsed={collapsed} inverse />
      </Flex>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={selected ? [selected] : []}
        items={items}
        onClick={({ key }) => {
          void navigate({ to: key })
          onNavigate?.()
        }}
        style={{ borderInlineEnd: 'none', flex: 1, paddingTop: 8 }}
      />
    </Flex>
  )
}
