import { PlusOutlined } from '@ant-design/icons'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card, Flex, Segmented } from 'antd'
import { useCallback, useState } from 'react'
import { AppButton, PageTitle } from '#/components/atoms'
import { SearchBar } from '#/components/molecules'
import { ContractorFormModal, ContractorsTable } from '#/components/organisms'
import { useContractors } from '#/hooks/useContractors'
import { requireRole } from '#/lib/auth'
import { contractorStatusLabels } from '#/lib/labels'
import { useSession } from '#/lib/session'
import type { Contractor, ContractorStatus } from '#/lib/types'

export const Route = createFileRoute('/_app/contractors/')({
  beforeLoad: () => requireRole('ADMIN', 'APPROVER'),
  head: () => ({ meta: [{ title: 'Contratistas · Gestion de Contratistas' }] }),
  component: ContractorsPage,
})

function ContractorsPage() {
  const { user } = useSession()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ContractorStatus | 'ALL'>('ALL')
  const [editing, setEditing] = useState<Contractor | null | undefined>(undefined)
  const { data = [], isLoading } = useContractors({
    search: search || undefined,
    status: status === 'ALL' ? undefined : status,
  })
  const isAdmin = user?.role === 'ADMIN'
  const onSearch = useCallback((value: string) => setSearch(value), [])

  return (
    <>
      <PageTitle
        title="Contratistas"
        subtitle="Consulta el estado de cumplimiento documental de cada contratista"
        extra={
          isAdmin && (
            <AppButton type="primary" icon={<PlusOutlined />} onClick={() => setEditing(null)}>
              Nuevo contratista
            </AppButton>
          )
        }
      />
      <Card styles={{ body: { padding: 0 } }}>
        <Flex gap={12} wrap justify="space-between" style={{ padding: 16 }}>
          <SearchBar placeholder="Buscar por nombre o NIT" onSearch={onSearch} />
          <Segmented
            value={status}
            onChange={(v) => setStatus(v as ContractorStatus | 'ALL')}
            options={[
              { value: 'ALL', label: 'Todos' },
              ...(Object.keys(contractorStatusLabels) as Array<ContractorStatus>).map((s) => ({
                value: s,
                label: contractorStatusLabels[s],
              })),
            ]}
          />
        </Flex>
        <ContractorsTable
          data={data}
          loading={isLoading}
          canEdit={isAdmin}
          onOpen={(c) => navigate({ to: '/contractors/$id', params: { id: c.id } })}
          onEdit={setEditing}
        />
      </Card>
      <ContractorFormModal
        open={editing !== undefined}
        contractor={editing}
        onClose={() => setEditing(undefined)}
      />
    </>
  )
}
