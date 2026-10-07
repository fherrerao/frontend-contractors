import { PlusOutlined } from '@ant-design/icons'
import { createFileRoute } from '@tanstack/react-router'
import { Card } from 'antd'
import { useState } from 'react'
import { AppButton, PageTitle } from '#/components/atoms'
import { DocumentTypeFormModal, DocumentTypesTable } from '#/components/organisms'
import { useDocumentTypes } from '#/hooks/useAdmin'
import { requireRole } from '#/lib/auth'
import type { DocumentType } from '#/lib/types'

export const Route = createFileRoute('/_app/admin/document-types')({
  beforeLoad: () => requireRole('ADMIN'),
  head: () => ({ meta: [{ title: 'Tipos de documento · Gestion de Contratistas' }] }),
  component: DocumentTypesPage,
})

function DocumentTypesPage() {
  const { data = [], isLoading } = useDocumentTypes(true)
  const [editing, setEditing] = useState<DocumentType | null | undefined>(undefined)

  return (
    <>
      <PageTitle
        title="Tipos de documento"
        subtitle="Define que documentos debe entregar cada contratista"
        extra={
          <AppButton type="primary" icon={<PlusOutlined />} onClick={() => setEditing(null)}>
            Nuevo tipo
          </AppButton>
        }
      />
      <Card styles={{ body: { padding: 0 } }}>
        <DocumentTypesTable data={data} loading={isLoading} onEdit={setEditing} />
      </Card>
      <DocumentTypeFormModal
        open={editing !== undefined}
        documentType={editing}
        onClose={() => setEditing(undefined)}
      />
    </>
  )
}
