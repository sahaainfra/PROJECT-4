// ═══════════════════════════════════════════════════════════
// ACCOUNTABILITY DATA MODEL — Part 15
// Accountability, Responsibility Assignment & Action Ledger
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// ACTION LEDGER
// ═══════════════════════════════════════════════════════════

export interface ActionLedgerEntry {
  ledger_id: string;
  entity_type: string;
  entity_id: string;
  doc_no: string;
  project_id?: string;
  site_id?: string;
  department_id?: string;
  action: 'CREATED' | 'SUBMITTED' | 'VERIFIED' | 'REVIEWED' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'MODIFIED' | 'EXECUTED' | 'RECORDED' | 'RECONCILED' | 'CLOSED' | 'CANCELLED' | 'REVERSED' | 'EXCEPTION_REQUESTED' | 'EXCEPTION_APPROVED';
  actor_id: string;
  actor_role: string;
  on_behalf_of?: string;
  at: string;
  device_id?: string;
  lat?: number;
  lng?: number;
  reason_code?: string;
  narrative?: string;
  audit_id?: string;
  workflow_task_id?: string;
  protocol_evaluation_id?: string;
}

// ═══════════════════════════════════════════════════════════
// RACI ASSIGNMENTS
// ═══════════════════════════════════════════════════════════

export interface RaciAssignment {
  id: string;
  scope_type: 'company' | 'department' | 'project' | 'site' | 'wbs_node' | 'process';
  scope_id: string;
  process_code: string;
  responsible_user_id: string;
  accountable_user_id: string;
  consulted_json: string[];
  informed_json: string[];
  from: string;
  to?: string;
  assigned_by: string;
  assigned_at: string;
  status: 'DRAFT' | 'APPROVED' | 'EFFECTIVE' | 'EXPIRED';
}

// ═══════════════════════════════════════════════════════════
// PROCESS CATALOGUE
// ═══════════════════════════════════════════════════════════

export interface ProcessCatalogue {
  process_code: string;
  module: string;
  description: string;
  requires_raci: boolean;
  requires_independent_accountability: boolean;
}

// ═══════════════════════════════════════════════════════════
// COMPLIANCE SCORES
// ═══════════════════════════════════════════════════════════

export interface ComplianceScore {
  id: string;
  subject_type: 'user' | 'role' | 'site' | 'project' | 'department';
  subject_id: string;
  period: string;
  score: number;
  components_json: {
    on_time_completion: number;
    protocol_compliance: number;
    documentation_quality: number;
    exception_rate: number;
    violation_count: number;
  };
  calculated_at: string;
  appeal_note?: string;
  appeal_status?: 'SUBMITTED' | 'REVIEWED' | 'ACCEPTED' | 'REJECTED';
  appeal_reviewed_by?: string;
  appeal_reviewed_at?: string;
}

// ═══════════════════════════════════════════════════════════
// RESPONSIBILITY ITEMS (VIEW)
// ═══════════════════════════════════════════════════════════

export interface ResponsibilityItem {
  id: string;
  user_id: string;
  item_type: 'task' | 'approval' | 'exception' | 'violation' | 'overdue_record';
  entity_type: string;
  entity_id: string;
  doc_no: string;
  description: string;
  due_at?: string;
  status: 'pending' | 'in_progress' | 'overdue' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project_id?: string;
  site_id?: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const actionLedger: ActionLedgerEntry[] = [
  {
    ledger_id: 'ledger-001',
    entity_type: 'PurchaseOrder',
    entity_id: 'PO-2024-001',
    doc_no: 'PO/2024/001',
    project_id: 'project-001',
    action: 'CREATED',
    actor_id: 'user-011',
    actor_role: 'PROCUREMENT_OFFICER',
    at: '2024-01-10T09:00:00Z',
    device_id: 'device-001',
    narrative: 'Purchase order created for steel materials',
    audit_id: 'audit-001',
  },
  {
    ledger_id: 'ledger-002',
    entity_type: 'PurchaseOrder',
    entity_id: 'PO-2024-001',
    doc_no: 'PO/2024/001',
    project_id: 'project-001',
    action: 'SUBMITTED',
    actor_id: 'user-011',
    actor_role: 'PROCUREMENT_OFFICER',
    at: '2024-01-10T09:30:00Z',
    device_id: 'device-001',
    narrative: 'Submitted for approval',
    workflow_task_id: 'task-001',
    audit_id: 'audit-002',
  },
  {
    ledger_id: 'ledger-003',
    entity_type: 'PurchaseOrder',
    entity_id: 'PO-2024-001',
    doc_no: 'PO/2024/001',
    project_id: 'project-001',
    action: 'APPROVED',
    actor_id: 'user-010',
    actor_role: 'PROJECT_MANAGER',
    at: '2024-01-12T14:00:00Z',
    device_id: 'device-002',
    reason_code: 'APPROVAL_GRANTED',
    narrative: 'Approved within budget and project requirements',
    workflow_task_id: 'task-002',
    protocol_evaluation_id: 'eval-001',
    audit_id: 'audit-003',
  },
  {
    ledger_id: 'ledger-004',
    entity_type: 'MaterialIssue',
    entity_id: 'MI-2024-001',
    doc_no: 'MI/2024/001',
    project_id: 'project-001',
    site_id: 'site-001',
    action: 'CREATED',
    actor_id: 'user-017',
    actor_role: 'STORE_KEEPER',
    at: '2024-01-15T11:00:00Z',
    device_id: 'device-003',
    narrative: 'Material issued for foundation work',
    audit_id: 'audit-004',
  },
  {
    ledger_id: 'ledger-005',
    entity_type: 'MaterialIssue',
    entity_id: 'MI-2024-001',
    doc_no: 'MI/2024/001',
    project_id: 'project-001',
    site_id: 'site-001',
    action: 'EXCEPTION_REQUESTED',
    actor_id: 'user-017',
    actor_role: 'STORE_KEEPER',
    at: '2024-01-15T11:30:00Z',
    device_id: 'device-003',
    reason_code: 'EMERGENCY_SITE',
    narrative: 'Excess material required due to site conditions',
    protocol_evaluation_id: 'eval-002',
    audit_id: 'audit-005',
  },
];

export const raciAssignments: RaciAssignment[] = [
  {
    id: 'raci-001',
    scope_type: 'project',
    scope_id: 'project-001',
    process_code: 'PO_APPROVAL',
    responsible_user_id: 'user-011',
    accountable_user_id: 'user-010',
    consulted_json: ['user-005'],
    informed_json: ['user-002'],
    from: '2024-01-01T00:00:00Z',
    assigned_by: 'user-001',
    assigned_at: '2023-12-28T00:00:00Z',
    status: 'EFFECTIVE',
  },
  {
    id: 'raci-002',
    scope_type: 'project',
    scope_id: 'project-001',
    process_code: 'MATERIAL_ISSUE',
    responsible_user_id: 'user-017',
    accountable_user_id: 'user-010',
    consulted_json: [],
    informed_json: ['user-011'],
    from: '2024-01-01T00:00:00Z',
    assigned_by: 'user-001',
    assigned_at: '2023-12-28T00:00:00Z',
    status: 'EFFECTIVE',
  },
  {
    id: 'raci-003',
    scope_type: 'project',
    scope_id: 'project-002',
    process_code: 'BILL_CERTIFICATION',
    responsible_user_id: 'user-016',
    accountable_user_id: 'user-017',
    consulted_json: ['user-010'],
    informed_json: ['user-005'],
    from: '2024-01-01T00:00:00Z',
    assigned_by: 'user-001',
    assigned_at: '2023-12-28T00:00:00Z',
    status: 'EFFECTIVE',
  },
  {
    id: 'raci-004',
    scope_type: 'department',
    scope_id: 'dept-002',
    process_code: 'PAYMENT_APPROVAL',
    responsible_user_id: 'user-015',
    accountable_user_id: 'user-002',
    consulted_json: ['user-010'],
    informed_json: ['user-001'],
    from: '2024-01-01T00:00:00Z',
    assigned_by: 'user-001',
    assigned_at: '2023-12-28T00:00:00Z',
    status: 'EFFECTIVE',
  },
];

export const processCatalogue: ProcessCatalogue[] = [
  {
    process_code: 'PO_APPROVAL',
    module: 'procurement',
    description: 'Purchase Order Approval',
    requires_raci: true,
    requires_independent_accountability: false,
  },
  {
    process_code: 'MATERIAL_ISSUE',
    module: 'inventory',
    description: 'Material Issue from Store',
    requires_raci: true,
    requires_independent_accountability: true,
  },
  {
    process_code: 'BILL_CERTIFICATION',
    module: 'finance',
    description: 'Subcontractor Bill Certification',
    requires_raci: true,
    requires_independent_accountability: true,
  },
  {
    process_code: 'PAYMENT_APPROVAL',
    module: 'finance',
    description: 'Payment Approval',
    requires_raci: true,
    requires_independent_accountability: true,
  },
  {
    process_code: 'DPR_SUBMISSION',
    module: 'project',
    description: 'Daily Progress Report Submission',
    requires_raci: true,
    requires_independent_accountability: false,
  },
  {
    process_code: 'GRN_POSTING',
    module: 'inventory',
    description: 'Goods Receipt Note Posting',
    requires_raci: true,
    requires_independent_accountability: false,
  },
];

export const complianceScores: ComplianceScore[] = [
  {
    id: 'score-001',
    subject_type: 'user',
    subject_id: 'user-010',
    period: '2024-01',
    score: 92,
    components_json: {
      on_time_completion: 95,
      protocol_compliance: 90,
      documentation_quality: 88,
      exception_rate: 95,
      violation_count: 100,
    },
    calculated_at: '2024-01-31T23:59:59Z',
  },
  {
    id: 'score-002',
    subject_type: 'user',
    subject_id: 'user-011',
    period: '2024-01',
    score: 88,
    components_json: {
      on_time_completion: 90,
      protocol_compliance: 85,
      documentation_quality: 92,
      exception_rate: 88,
      violation_count: 95,
    },
    calculated_at: '2024-01-31T23:59:59Z',
  },
  {
    id: 'score-003',
    subject_type: 'user',
    subject_id: 'user-017',
    period: '2024-01',
    score: 85,
    components_json: {
      on_time_completion: 88,
      protocol_compliance: 80,
      documentation_quality: 85,
      exception_rate: 82,
      violation_count: 90,
    },
    calculated_at: '2024-01-31T23:59:59Z',
    appeal_note: 'Exception was approved due to emergency site conditions',
    appeal_status: 'REVIEWED',
    appeal_reviewed_by: 'user-001',
    appeal_reviewed_at: '2024-02-05T10:00:00Z',
  },
  {
    id: 'score-004',
    subject_type: 'project',
    subject_id: 'project-001',
    period: '2024-01',
    score: 90,
    components_json: {
      on_time_completion: 92,
      protocol_compliance: 88,
      documentation_quality: 90,
      exception_rate: 90,
      violation_count: 95,
    },
    calculated_at: '2024-01-31T23:59:59Z',
  },
];

export const responsibilityItems: ResponsibilityItem[] = [
  {
    id: 'resp-001',
    user_id: 'user-010',
    item_type: 'approval',
    entity_type: 'PurchaseOrder',
    entity_id: 'PO-2024-002',
    doc_no: 'PO/2024/002',
    description: 'Approve purchase order for cement materials',
    due_at: '2024-01-20T17:00:00Z',
    status: 'pending',
    priority: 'high',
    project_id: 'project-001',
  },
  {
    id: 'resp-002',
    user_id: 'user-010',
    item_type: 'exception',
    entity_type: 'Exception',
    entity_id: 'exc-001',
    doc_no: 'EXC-2024-001',
    description: 'Regularise emergency material excess',
    due_at: '2024-01-22T17:00:00Z',
    status: 'pending',
    priority: 'critical',
    project_id: 'project-001',
    site_id: 'site-001',
  },
  {
    id: 'resp-003',
    user_id: 'user-011',
    item_type: 'task',
    entity_type: 'PurchaseRequisition',
    entity_id: 'PR-2024-003',
    doc_no: 'PR/2024/003',
    description: 'Complete purchase requisition for steel bars',
    due_at: '2024-01-18T17:00:00Z',
    status: 'in_progress',
    priority: 'medium',
    project_id: 'project-001',
  },
  {
    id: 'resp-004',
    user_id: 'user-017',
    item_type: 'violation',
    entity_type: 'Violation',
    entity_id: 'viol-001',
    doc_no: 'VIOL-2024-001',
    description: 'Resolve stock availability violation',
    due_at: '2024-01-19T17:00:00Z',
    status: 'overdue',
    priority: 'high',
    project_id: 'project-001',
    site_id: 'site-001',
  },
  {
    id: 'resp-005',
    user_id: 'user-012',
    item_type: 'overdue_record',
    entity_type: 'Bill',
    entity_id: 'BILL-2024-003',
    doc_no: 'BILL/2024/003',
    description: 'Bill pending certification for 15 days',
    due_at: '2024-01-10T17:00:00Z',
    status: 'overdue',
    priority: 'critical',
    project_id: 'project-002',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getActionLedgerByEntity(entityType: string, entityId: string): ActionLedgerEntry[] {
  return actionLedger.filter(entry => entry.entity_type === entityType && entry.entity_id === entityId);
}

export function getActionLedgerByUser(userId: string): ActionLedgerEntry[] {
  return actionLedger.filter(entry => entry.actor_id === userId);
}

export function getRaciAssignmentsByScope(scopeType: string, scopeId: string): RaciAssignment[] {
  return raciAssignments.filter(
    raci => raci.scope_type === scopeType && 
            raci.scope_id === scopeId && 
            raci.status === 'EFFECTIVE'
  );
}

export function getRaciByProcess(scopeType: string, scopeId: string, processCode: string): RaciAssignment | undefined {
  return raciAssignments.find(
    raci => raci.scope_type === scopeType && 
            raci.scope_id === scopeId && 
            raci.process_code === processCode &&
            raci.status === 'EFFECTIVE'
  );
}

export function getProcessByCode(processCode: string): ProcessCatalogue | undefined {
  return processCatalogue.find(p => p.process_code === processCode);
}

export function getComplianceScoreBySubject(subjectType: string, subjectId: string, period: string): ComplianceScore | undefined {
  return complianceScores.find(
    score => score.subject_type === subjectType && 
             score.subject_id === subjectId && 
             score.period === period
  );
}

export function getResponsibilityItemsByUser(userId: string): ResponsibilityItem[] {
  return responsibilityItems.filter(item => item.user_id === userId);
}

export function getOverdueItemsByUser(userId: string): ResponsibilityItem[] {
  const now = new Date();
  return responsibilityItems.filter(
    item => item.user_id === userId && 
            item.due_at && 
            new Date(item.due_at) < now && 
            item.status !== 'completed'
  );
}

export function getActionColor(action: ActionLedgerEntry['action']): string {
  const colors: Record<ActionLedgerEntry['action'], string> = {
    CREATED: 'var(--info-600)',
    SUBMITTED: 'var(--info-600)',
    VERIFIED: 'var(--success-600)',
    REVIEWED: 'var(--info-600)',
    APPROVED: 'var(--success-600)',
    REJECTED: 'var(--error-600)',
    RETURNED: 'var(--warning-600)',
    MODIFIED: 'var(--warning-600)',
    EXECUTED: 'var(--success-600)',
    RECORDED: 'var(--success-600)',
    RECONCILED: 'var(--success-600)',
    CLOSED: 'var(--text-muted)',
    CANCELLED: 'var(--error-600)',
    REVERSED: 'var(--error-600)',
    EXCEPTION_REQUESTED: 'var(--warning-600)',
    EXCEPTION_APPROVED: 'var(--warning-600)',
  };
  return colors[action] || 'var(--text-muted)';
}

export function getResponsibilityStatusColor(status: ResponsibilityItem['status']): string {
  const colors: Record<ResponsibilityItem['status'], string> = {
    pending: 'var(--info-600)',
    in_progress: 'var(--warning-600)',
    overdue: 'var(--error-600)',
    completed: 'var(--success-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getPriorityColor(priority: ResponsibilityItem['priority']): string {
  const colors: Record<ResponsibilityItem['priority'], string> = {
    low: 'var(--text-muted)',
    medium: 'var(--info-600)',
    high: 'var(--warning-600)',
    critical: 'var(--error-600)',
  };
  return colors[priority] || 'var(--text-muted)';
}

export function getScoreColor(score: number): string {
  if (score >= 90) return 'var(--success-600)';
  if (score >= 75) return 'var(--warning-600)';
  return 'var(--error-600)';
}

export function getRaciRoleColor(role: 'R' | 'A' | 'C' | 'I'): string {
  const colors: Record<string, string> = {
    R: 'var(--brand-600)',
    A: 'var(--error-600)',
    C: 'var(--info-600)',
    I: 'var(--text-muted)',
  };
  return colors[role] || 'var(--text-muted)';
}
