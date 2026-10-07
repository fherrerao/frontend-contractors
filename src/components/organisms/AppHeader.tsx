import { MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { Flex, Layout, Typography, theme } from 'antd'
import type { SessionUser } from '#/lib/types'
import { AppButton, AppLogo } from '../atoms'
import { UserMenu } from '../molecules'

interface AppHeaderProps {
  user: SessionUser
  isMobile: boolean
  collapsed: boolean
  onToggleMenu: () => void
  onLogout: () => void
}

export function AppHeader({ user, isMobile, collapsed, onToggleMenu, onLogout }: AppHeaderProps) {
  const { token } = theme.useToken()
  const toggleIcon = isMobile ? (
    <MenuOutlined />
  ) : collapsed ? (
    <MenuUnfoldOutlined />
  ) : (
    <MenuFoldOutlined />
  )

  return (
    <Layout.Header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: isMobile ? '0 16px' : '0 24px',
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <AppButton
        type="text"
        icon={toggleIcon}
        onClick={onToggleMenu}
        aria-label="Alternar menu"
        style={{ fontSize: 18 }}
      />
      {isMobile ? (
        <AppLogo />
      ) : (
        <Typography.Text type="secondary">
          Hola, <Typography.Text strong>{user.name.split(' ')[0]}</Typography.Text>
        </Typography.Text>
      )}
      <Flex style={{ marginLeft: 'auto' }}>
        <UserMenu user={user} onLogout={onLogout} />
      </Flex>
    </Layout.Header>
  )
}
