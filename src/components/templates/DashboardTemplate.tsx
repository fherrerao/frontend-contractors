import { Drawer, Grid, Layout } from 'antd'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { SessionUser } from '#/lib/types'
import { SIDER_BG } from '#/theme/theme'
import { AppHeader, SideMenu } from '../organisms'

const SIDER_WIDTH = 256
const SIDER_COLLAPSED_WIDTH = 80

interface DashboardTemplateProps {
  user: SessionUser
  onLogout: () => void
  children: ReactNode
}

export function DashboardTemplate({ user, onLogout, children }: DashboardTemplateProps) {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md
  const [collapsed, setCollapsed] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  useEffect(() => {
    if (!isMobile) setDrawerOpen(false)
  }, [isMobile])

  const siderWidth = isMobile ? 0 : collapsed ? SIDER_COLLAPSED_WIDTH : SIDER_WIDTH

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {!isMobile && (
        <Layout.Sider
          width={SIDER_WIDTH}
          collapsedWidth={SIDER_COLLAPSED_WIDTH}
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          breakpoint="lg"
          onBreakpoint={setCollapsed}
          trigger={null}
          style={{
            position: 'fixed',
            insetInlineStart: 0,
            top: 0,
            bottom: 0,
            height: '100vh',
            overflow: 'auto',
            zIndex: 20,
          }}
        >
          <SideMenu user={user} collapsed={collapsed} />
        </Layout.Sider>
      )}

      {isMobile && (
        <Drawer
          placement="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          size={SIDER_WIDTH}
          closable={false}
          styles={{ body: { padding: 0, background: SIDER_BG } }}
        >
          <SideMenu user={user} onNavigate={() => setDrawerOpen(false)} />
        </Drawer>
      )}

      <Layout style={{ marginInlineStart: siderWidth, transition: 'margin 0.2s' }}>
        <AppHeader
          user={user}
          isMobile={isMobile}
          collapsed={collapsed}
          onToggleMenu={() => (isMobile ? setDrawerOpen(true) : setCollapsed((c) => !c))}
          onLogout={onLogout}
        />
        <Layout.Content
          style={{
            padding: isMobile ? 16 : 24,
            width: '100%',
            maxWidth: 1440,
            margin: '0 auto',
          }}
        >
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
}
