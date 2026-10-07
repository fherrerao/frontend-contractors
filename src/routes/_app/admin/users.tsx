import { PlusOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { Card } from 'antd'
import { useState } from 'react'
import { AppButton, PageTitle } from '#/components/atoms'
import { UserFormModal, UsersTable } from '#/components/organisms'
import { useUsers } from '#/hooks/useAdmin'
import { requireRole } from '#/lib/auth'
import type { User } from '#/lib/types'

export const Route = createFileRoute('/_app/admin/users')({
  beforeLoad: () => requireRole('ADMIN'),
  head: () => ({ meta: [{ title: 'Usuarios · Gestion de Contratistas' }] }),
  component: UsersPage,
})

function UsersPage() {
  const { data = [], isLoading } = useUsers()
  const [editing, setEditing] = useState<User | null | undefined>(undefined)

  return (
    <>
      <PageTitle
        title="Usuarios"
        subtitle="Administra el acceso de administradores, aprobadores y contratistas"
        extra={
          <AppButton type="primary" icon={<PlusOutlined />} onClick={() => setEditing(null)}>
            Nuevo usuario
          </AppButton>
        }
      />
      <Card styles={{ body: { padding: 0 } }}>
        <UsersTable data={data} loading={isLoading} onEdit={setEditing} />
      </Card>
      <UserFormModal
        open={editing !== undefined}
        user={editing}
        onClose={() => setEditing(undefined)}
      />
    </>
  )
}
