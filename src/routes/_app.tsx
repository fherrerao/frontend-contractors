import { Navigate, Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { DashboardTemplate } from '#/components/templates'
import { logout, refreshMe, requireAuth } from '#/lib/auth'
import { useSession } from '#/lib/session'

export const Route = createFileRoute('/_app')({
  beforeLoad: ({ location }) => requireAuth(location),
  component: AppLayout,
})

function AppLayout() {
  const { user } = useSession()
  const navigate = useNavigate()

  useEffect(() => {
    refreshMe().catch(() => {})
  }, [])

  if (!user) return <Navigate to="/login" />

  return (
    <DashboardTemplate
      user={user}
      onLogout={() => {
        logout()
        void navigate({ to: '/login' })
      }}
    >
      <Outlet />
    </DashboardTemplate>
  )
}
