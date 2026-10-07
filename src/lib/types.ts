export type Role = 'ADMIN' | 'APPROVER' | 'CONTRACTOR_USER'
export type ContractorStatus = 'INCOMPLETE' | 'COMPLIANT' | 'EXPIRED'
export type DocumentStatus =
  | 'PENDING'
  | 'SUBMITTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'EXPIRED'
export type ReviewAction = 'APPROVED' | 'REJECTED'

export interface SessionUser {
  id: string
  email: string
  name: string
  role: Role
  contractorId: string | null
  contractor: { id: string; name: string; status: ContractorStatus } | null
}

export interface LoginResponse {
  accessToken: string
  user: SessionUser
}

export interface Contractor {
  id: string
  name: string
  taxId: string
  email: string | null
  phone: string | null
  address: string | null
  contactName: string | null
  status: ContractorStatus
  isActive: boolean
  createdAt: string
  documentSummary?: {
    total: number
    approved: number
    submitted: number
    rejected: number
  }
  users?: Array<{ id: string; name: string; email: string; isActive: boolean }>
}

export interface DocumentType {
  id: string
  name: string
  description: string | null
  required: boolean
  expires: boolean
  isActive: boolean
}

export interface DocumentReview {
  id: string
  action: ReviewAction
  comment: string | null
  fileName: string | null
  createdAt: string
  reviewer: { id: string; name: string }
}

export interface ContractorDocument {
  id: string
  contractorId: string
  typeId: string
  type: DocumentType
  status: DocumentStatus
  fileName: string | null
  mimeType: string | null
  size: number | null
  expiresAt: string | null
  submittedAt: string | null
  uploadedBy: { id: string; name: string } | null
  reviews?: Array<DocumentReview>
  contractor?: { id: string; name: string; taxId: string }
}

export interface User {
  id: string
  email: string
  name: string
  role: Role
  isActive: boolean
  contractorId: string | null
  contractor: { id: string; name: string } | null
  createdAt: string
}

export interface DashboardStats {
  contractors: Partial<Record<ContractorStatus, number>>
  documents: Partial<Record<DocumentStatus, number>>
  expiringSoon: Array<{
    id: string
    expiresAt: string
    type: { name: string }
    contractor: { id: string; name: string }
  }>
}
