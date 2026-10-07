import { LogoutOutlined, MoonOutlined, SunOutlined } from '@ant-design/icons'
import { Dropdown, Flex, Grid, Typography } from 'antd'
import type { MenuProps } from 'antd'
import type { SessionUser } from '#/lib/types'
import { useThemeMode } from '#/theme/ThemeProvider'
import { AppAvatar, RoleTag } from '../atoms'

interface UserMenuProps {
  user: SessionUser
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const { mode, toggle } = useThemeMode()
  const screens = Grid.useBreakpoint()

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      disabled: true,
      label: (
        <Flex vertical gap={4} style={{ padding: '4px 0', cursor: 'default' }}>
          <Typography.Text strong>{user.name}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {user.email}
          </Typography.Text>
          {user.contractor && (
            <Typography.Text type="secondary" style={{ fontSize: 12 }}>
              {user.contractor.name}
            </Typography.Text>
          )}
        </Flex>
      ),
    },
    { type: 'divider' },
    {
      key: 'theme',
      icon: mode === 'dark' ? <SunOutlined /> : <MoonOutlined />,
      label: mode === 'dark' ? 'Modo claro' : 'Modo oscuro',
      onClick: toggle,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Cerrar sesion',
      danger: true,
      onClick: onLogout,
    },
  ]

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
      <Flex align="center" gap={10} style={{ cursor: 'pointer' }}>
        <AppAvatar name={user.name} />
        {screens.md && (
          <Flex vertical style={{ lineHeight: 1.2 }}>
            <Typography.Text strong style={{ fontSize: 13 }}>
              {user.name}
            </Typography.Text>
            <span>
              <RoleTag role={user.role} />
            </span>
          </Flex>
        )}
      </Flex>
    </Dropdown>
  )
}
