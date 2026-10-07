import type { ContractorStatus, DocumentStatus, Role } from './types'

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Administrador',
  APPROVER: 'Aprobador',
  CONTRACTOR_USER: 'Contratista',
}

export const contractorStatusLabels: Record<ContractorStatus, string> = {
  COMPLIANT: 'Habilitado',
  INCOMPLETE: 'Incompleto',
  EXPIRED: 'Vencido',
}

export const documentStatusLabels: Record<DocumentStatus, string> = {
  PENDING: 'Pendiente',
  SUBMITTED: 'En revision',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  EXPIRED: 'Vencido',
}
