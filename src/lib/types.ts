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

export interface DocumentSummary {
  total: number
  approved: number
  submitted: number
  rejected: number
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
  projectCount?: number
  documentSummary?: DocumentSummary
  users?: Array<{ id: string; name: string; email: string; isActive: boolean }>
}

export interface DocumentRef {
  id: string
  name: string
}

export interface ProjectDocumentMeta {
  id: string
  name: string
  description: string | null
  required: boolean
  expires: boolean
  status?: DocumentStatus
}

export interface ProjectDocumentInput {
  id?: string
  name: string
  description?: string | null
  required?: boolean
  expires?: boolean
}

export interface Project {
  id: string
  name: string
  description: string | null
  code: string | null
  status: ContractorStatus
  isActive: boolean
  contractorId: string
  createdAt: string
  workerCount?: number
  documentSummary?: DocumentSummary
  documents?: Array<ProjectDocumentMeta>
  contractor?: { id: string; name: string; taxId: string }
  workers?: Array<
    Worker & {
      assignedAt?: string
      documents?: Array<DocumentRef>
    }
  >
}

export interface WorkerProjectAssignment {
  id: string
  name: string
  code: string | null
  isActive: boolean
  documents: Array<DocumentRef>
}

export interface Worker {
  id: string
  name: string
  documentId: string
  position: string
  phone: string | null
  email: string | null
  isActive: boolean
  contractorId: string
  createdAt: string
  projects?: Array<WorkerProjectAssignment>
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
  projectId: string
  name: string
  description: string | null
  required: boolean
  expires: boolean
  status: DocumentStatus
  fileName: string | null
  mimeType: string | null
  size: number | null
  expiresAt: string | null
  submittedAt: string | null
  uploadedBy: { id: string; name: string } | null
  reviews?: Array<DocumentReview>
  project?: { id: string; name: string; code: string | null }
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
    project: { id: string; name: string }
    contractor: { id: string; name: string }
  }>
}
