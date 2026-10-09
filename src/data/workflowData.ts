// ═══════════════════════════════════════════════════════════
// WORKFLOW DATA MODEL — Part 12
// Workflow & Approval Engine
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// WORKFLOW DEFINITIONS
// ═══════════════════════════════════════════════════════════

export interface WorkflowDefinition {
  id: string;
  code: string;
  doc_type: string;
  name: string;
  version: string;
  is_active: boolean;
  effective_from: string;
  created_by: string;
  created_at: string;
  description: string;
}

export interface WorkflowStep {
  id: string;
  definition_id: string;
  seq: number;
  name: string;
  type: 'sequential' | 'parallel_all' | 'parallel_any' | 'quorum';
  quorum_n?: number;
  approver_rule_type: 'role' | 'user' | 'position' | 'project_role' | 'department_head' | 'reporting_manager' | 'dynamic';
  approver_rule_value: string;
  sla_hours: number;
  escalate_to_rule?: string;
  can_edit_fields?: string[];
  allow_return_to?: number[];
  mandatory_comment: boolean;
  mandatory_documents: string[];
}

export interface WorkflowCondition {
  id: string;
  definition_id?: string;
  step_id?: string;
  expression: string;
  action: 'include' | 'skip' | 'route_to';
  route_to_step?: number;
}

// ═══════════════════════════════════════════════════════════
// WORKFLOW INSTANCES
// ═══════════════════════════════════════════════════════════

export interface WorkflowInstance {
  id: string;
  doc_type: string;
  doc_id: string;
  doc_number: string;
  definition_id: string;
  definition_version: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'CANCELLED' | 'RECALLED';
  current_step_seq: number;
  submitted_by: string;
  submitted_by_name: string;
  submitted_at: string;
  completed_at?: string;
  amount_snapshot: number;
  context_json: Record<string, any>;
  project_id?: string;
  project_name?: string;
  site_id?: string;
  site_name?: string;
}

export interface WorkflowTask {
  id: string;
  instance_id: string;
  step_seq: number;
  step_name: string;
  assignee_user_id: string;
  assignee_name: string;
  original_assignee_id?: string;
  delegated_from?: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned' | 'skipped' | 'expired';
  acted_at?: string;
  comment?: string;
  reason_code?: string;
  due_at: string;
  escalated_at?: string;
  created_at: string;
}

export interface WorkflowActionLog {
  id: string;
  instance_id: string;
  task_id?: string;
  action: 'submitted' | 'approved' | 'rejected' | 'returned' | 'recalled' | 'cancelled' | 'reassigned' | 'delegated' | 'escalated';
  actor_id: string;
  actor_name: string;
  on_behalf_of?: string;
  comment?: string;
  reason?: string;
  at: string;
  ip?: string;
}

// ═══════════════════════════════════════════════════════════
// DELEGATIONS
// ═══════════════════════════════════════════════════════════

export interface WorkflowDelegation {
  id: string;
  delegator_id: string;
  delegator_name: string;
  delegate_id: string;
  delegate_name: string;
  doc_types: string[];
  scope: 'all' | 'project' | 'department';
  scope_id?: string;
  scope_name?: string;
  from_date: string;
  to_date: string;
  reason: string;
  approved_by?: string;
  approved_at?: string;
  status: 'pending' | 'approved' | 'active' | 'expired' | 'revoked';
  created_at: string;
}

// ═══════════════════════════════════════════════════════════
// SLA CALENDARS
// ═══════════════════════════════════════════════════════════

export interface SLACalendar {
  id: string;
  company_id: string;
  name: string;
  working_days: number[]; // 0 = Sunday, 6 = Saturday
  holidays: string[]; // ISO date strings
  working_hours_start: string; // HH:mm
  working_hours_end: string; // HH:mm
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const workflowDefinitions: WorkflowDefinition[] = [
  {
    id: 'wf-def-001',
    code: 'PR_APPROVAL',
    doc_type: 'purchase_requisition',
    name: 'Purchase Requisition Approval',
    version: '1.0.0',
    is_active: true,
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    description: 'Standard PR approval flow with amount-based routing',
  },
  {
    id: 'wf-def-002',
    code: 'PO_APPROVAL',
    doc_type: 'purchase_order',
    name: 'Purchase Order Approval',
    version: '1.0.0',
    is_active: true,
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    description: 'PO approval with multi-level authority based on amount bands',
  },
  {
    id: 'wf-def-003',
    code: 'BILL_APPROVAL',
    doc_type: 'subcontractor_bill',
    name: 'Subcontractor Bill Approval',
    version: '1.0.0',
    is_active: true,
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    description: 'Bill certification and approval flow',
  },
  {
    id: 'wf-def-004',
    code: 'LEAVE_APPROVAL',
    doc_type: 'leave_application',
    name: 'Leave Application Approval',
    version: '1.0.0',
    is_active: true,
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    description: 'Leave approval with HR escalation for long leaves',
  },
  {
    id: 'wf-def-005',
    code: 'BUDGET_REVISION',
    doc_type: 'budget_revision',
    name: 'Budget Revision Approval',
    version: '1.0.0',
    is_active: true,
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    description: 'Budget revision approval with CFO sign-off',
  },
];

export const workflowSteps: WorkflowStep[] = [
  // PR Approval Steps
  {
    id: 'step-001',
    definition_id: 'wf-def-001',
    seq: 1,
    name: 'Procurement Review',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'PROCUREMENT_OFFICER',
    sla_hours: 24,
    escalate_to_rule: 'PROCUREMENT_MANAGER',
    mandatory_comment: false,
    mandatory_documents: [],
  },
  {
    id: 'step-002',
    definition_id: 'wf-def-001',
    seq: 2,
    name: 'Project Manager Approval',
    type: 'sequential',
    approver_rule_type: 'project_role',
    approver_rule_value: 'PROJECT_MANAGER',
    sla_hours: 48,
    escalate_to_rule: 'PROJECT_DIRECTOR',
    mandatory_comment: true,
    mandatory_documents: [],
  },
  {
    id: 'step-003',
    definition_id: 'wf-def-001',
    seq: 3,
    name: 'Management Approval',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'MANAGEMENT',
    sla_hours: 72,
    escalate_to_rule: 'CFO',
    mandatory_comment: true,
    mandatory_documents: [],
  },
  // PO Approval Steps
  {
    id: 'step-004',
    definition_id: 'wf-def-002',
    seq: 1,
    name: 'Procurement Manager',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'PROCUREMENT_MANAGER',
    sla_hours: 24,
    mandatory_comment: false,
    mandatory_documents: [],
  },
  {
    id: 'step-005',
    definition_id: 'wf-def-002',
    seq: 2,
    name: 'Project/Commercial Manager',
    type: 'parallel_any',
    approver_rule_type: 'project_role',
    approver_rule_value: 'PROJECT_MANAGER,COMMERCIAL_MANAGER',
    sla_hours: 48,
    mandatory_comment: true,
    mandatory_documents: [],
  },
  {
    id: 'step-006',
    definition_id: 'wf-def-002',
    seq: 3,
    name: 'Finance/Management',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'FINANCE_MANAGER,MANAGEMENT',
    sla_hours: 72,
    mandatory_comment: true,
    mandatory_documents: ['comparison_statement'],
  },
  // Bill Approval Steps
  {
    id: 'step-007',
    definition_id: 'wf-def-003',
    seq: 1,
    name: 'QS Verification',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'QS_ENGINEER',
    sla_hours: 48,
    mandatory_comment: true,
    mandatory_documents: ['measurement_book'],
  },
  {
    id: 'step-008',
    definition_id: 'wf-def-003',
    seq: 2,
    name: 'Commercial Manager',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'COMMERCIAL_MANAGER',
    sla_hours: 72,
    mandatory_comment: true,
    mandatory_documents: [],
  },
  {
    id: 'step-009',
    definition_id: 'wf-def-003',
    seq: 3,
    name: 'Finance Approval',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'FINANCE_MANAGER',
    sla_hours: 48,
    mandatory_comment: true,
    mandatory_documents: [],
  },
  {
    id: 'step-010',
    definition_id: 'wf-def-003',
    seq: 4,
    name: 'Authorised Signatory',
    type: 'sequential',
    approver_rule_type: 'role',
    approver_rule_value: 'AUTHORISED_SIGNATORY',
    sla_hours: 24,
    mandatory_comment: true,
    mandatory_documents: [],
  },
];

export const workflowConditions: WorkflowCondition[] = [
  {
    id: 'cond-001',
    definition_id: 'wf-def-001',
    expression: 'amount < 500000',
    action: 'skip',
    route_to_step: 3, // Skip Management approval for small amounts
  },
  {
    id: 'cond-002',
    definition_id: 'wf-def-002',
    expression: 'amount < 1000000',
    action: 'skip',
    route_to_step: 3, // Skip Finance/Management for small POs
  },
  {
    id: 'cond-003',
    definition_id: 'wf-def-004',
    expression: 'leave_days > 7',
    action: 'include',
    route_to_step: 2, // Include HR approval for long leaves
  },
];

export const workflowInstances: WorkflowInstance[] = [
  {
    id: 'wf-inst-001',
    doc_type: 'purchase_requisition',
    doc_id: 'PR-2024-001',
    doc_number: 'PR/2024/001',
    definition_id: 'wf-def-001',
    definition_version: '1.0.0',
    status: 'IN_PROGRESS',
    current_step_seq: 2,
    submitted_by: 'user-010',
    submitted_by_name: 'Rajesh Kumar',
    submitted_at: '2024-01-15T09:00:00Z',
    amount_snapshot: 750000,
    context_json: {
      project_id: 'project-001',
      vendor_id: 'vendor-001',
      material_category: 'steel',
    },
    project_id: 'project-001',
    project_name: 'Riverside Tower - Phase II',
  },
  {
    id: 'wf-inst-002',
    doc_type: 'purchase_order',
    doc_id: 'PO-2024-001',
    doc_number: 'PO/2024/001',
    definition_id: 'wf-def-002',
    definition_version: '1.0.0',
    status: 'APPROVED',
    current_step_seq: 3,
    submitted_by: 'user-011',
    submitted_by_name: 'Priya Sharma',
    submitted_at: '2024-01-14T10:00:00Z',
    completed_at: '2024-01-15T14:00:00Z',
    amount_snapshot: 2500000,
    context_json: {
      project_id: 'project-001',
      vendor_id: 'vendor-002',
    },
    project_id: 'project-001',
    project_name: 'Riverside Tower - Phase II',
  },
  {
    id: 'wf-inst-003',
    doc_type: 'subcontractor_bill',
    doc_id: 'BILL-2024-001',
    doc_number: 'BILL/2024/001',
    definition_id: 'wf-def-003',
    definition_version: '1.0.0',
    status: 'IN_PROGRESS',
    current_step_seq: 2,
    submitted_by: 'user-012',
    submitted_by_name: 'Amit Verma',
    submitted_at: '2024-01-15T11:00:00Z',
    amount_snapshot: 1250000,
    context_json: {
      project_id: 'project-002',
      subcontractor_id: 'sub-001',
    },
    project_id: 'project-002',
    project_name: 'Green Valley Residences',
  },
  {
    id: 'wf-inst-004',
    doc_type: 'leave_application',
    doc_id: 'LEAVE-2024-001',
    doc_number: 'LEAVE/2024/001',
    definition_id: 'wf-def-004',
    definition_version: '1.0.0',
    status: 'RETURNED',
    current_step_seq: 1,
    submitted_by: 'user-013',
    submitted_by_name: 'Suresh Patel',
    submitted_at: '2024-01-10T09:00:00Z',
    amount_snapshot: 0,
    context_json: {
      leave_type: 'casual',
      leave_days: 5,
      from_date: '2024-01-20',
      to_date: '2024-01-24',
    },
  },
];

export const workflowTasks: WorkflowTask[] = [
  {
    id: 'task-001',
    instance_id: 'wf-inst-001',
    step_seq: 1,
    step_name: 'Procurement Review',
    assignee_user_id: 'user-014',
    assignee_name: 'Vikram Mehta',
    status: 'approved',
    acted_at: '2024-01-15T10:30:00Z',
    comment: 'Verified material requirements and vendor quotes',
    due_at: '2024-01-16T09:00:00Z',
    created_at: '2024-01-15T09:00:00Z',
  },
  {
    id: 'task-002',
    instance_id: 'wf-inst-001',
    step_seq: 2,
    step_name: 'Project Manager Approval',
    assignee_user_id: 'user-010',
    assignee_name: 'Rajesh Kumar',
    status: 'pending',
    due_at: '2024-01-17T09:00:00Z',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: 'task-003',
    instance_id: 'wf-inst-002',
    step_seq: 1,
    step_name: 'Procurement Manager',
    assignee_user_id: 'user-014',
    assignee_name: 'Vikram Mehta',
    status: 'approved',
    acted_at: '2024-01-14T11:00:00Z',
    comment: 'Approved',
    due_at: '2024-01-15T10:00:00Z',
    created_at: '2024-01-14T10:00:00Z',
  },
  {
    id: 'task-004',
    instance_id: 'wf-inst-002',
    step_seq: 2,
    step_name: 'Project/Commercial Manager',
    assignee_user_id: 'user-010',
    assignee_name: 'Rajesh Kumar',
    status: 'approved',
    acted_at: '2024-01-14T14:00:00Z',
    comment: 'Within budget, approved',
    due_at: '2024-01-16T10:00:00Z',
    created_at: '2024-01-14T11:00:00Z',
  },
  {
    id: 'task-005',
    instance_id: 'wf-inst-002',
    step_seq: 3,
    step_name: 'Finance/Management',
    assignee_user_id: 'user-015',
    assignee_name: 'Suresh Kumar',
    status: 'approved',
    acted_at: '2024-01-15T14:00:00Z',
    comment: 'Final approval granted',
    due_at: '2024-01-17T10:00:00Z',
    created_at: '2024-01-14T14:00:00Z',
  },
  {
    id: 'task-006',
    instance_id: 'wf-inst-003',
    step_seq: 1,
    step_name: 'QS Verification',
    assignee_user_id: 'user-016',
    assignee_name: 'Mohan Das',
    status: 'approved',
    acted_at: '2024-01-15T14:00:00Z',
    comment: 'Measurements verified on site',
    due_at: '2024-01-17T11:00:00Z',
    created_at: '2024-01-15T11:00:00Z',
  },
  {
    id: 'task-007',
    instance_id: 'wf-inst-003',
    step_seq: 2,
    step_name: 'Commercial Manager',
    assignee_user_id: 'user-017',
    assignee_name: 'Anil Sharma',
    status: 'pending',
    due_at: '2024-01-18T11:00:00Z',
    created_at: '2024-01-15T14:00:00Z',
  },
  {
    id: 'task-008',
    instance_id: 'wf-inst-004',
    step_seq: 1,
    step_name: 'Reporting Manager',
    assignee_user_id: 'user-018',
    assignee_name: 'Vijay Patil',
    status: 'returned',
    acted_at: '2024-01-11T10:00:00Z',
    comment: 'Please attach medical certificate for sick leave',
    reason_code: 'MISSING_DOCUMENT',
    due_at: '2024-01-12T09:00:00Z',
    created_at: '2024-01-10T09:00:00Z',
  },
];

export const workflowActionLogs: WorkflowActionLog[] = [
  {
    id: 'log-001',
    instance_id: 'wf-inst-001',
    task_id: 'task-001',
    action: 'submitted',
    actor_id: 'user-010',
    actor_name: 'Rajesh Kumar',
    at: '2024-01-15T09:00:00Z',
    ip: '192.168.1.100',
  },
  {
    id: 'log-002',
    instance_id: 'wf-inst-001',
    task_id: 'task-001',
    action: 'approved',
    actor_id: 'user-014',
    actor_name: 'Vikram Mehta',
    comment: 'Verified material requirements and vendor quotes',
    at: '2024-01-15T10:30:00Z',
    ip: '192.168.1.101',
  },
  {
    id: 'log-003',
    instance_id: 'wf-inst-002',
    action: 'submitted',
    actor_id: 'user-011',
    actor_name: 'Priya Sharma',
    at: '2024-01-14T10:00:00Z',
    ip: '192.168.1.102',
  },
  {
    id: 'log-004',
    instance_id: 'wf-inst-002',
    task_id: 'task-005',
    action: 'approved',
    actor_id: 'user-015',
    actor_name: 'Suresh Kumar',
    comment: 'Final approval granted',
    at: '2024-01-15T14:00:00Z',
    ip: '192.168.1.103',
  },
  {
    id: 'log-005',
    instance_id: 'wf-inst-004',
    task_id: 'task-008',
    action: 'returned',
    actor_id: 'user-018',
    actor_name: 'Vijay Patil',
    comment: 'Please attach medical certificate for sick leave',
    reason: 'Missing required document',
    at: '2024-01-11T10:00:00Z',
    ip: '192.168.1.104',
  },
];

export const workflowDelegations: WorkflowDelegation[] = [
  {
    id: 'deleg-001',
    delegator_id: 'user-010',
    delegator_name: 'Rajesh Kumar',
    delegate_id: 'user-011',
    delegate_name: 'Priya Sharma',
    doc_types: ['purchase_requisition', 'purchase_order'],
    scope: 'project',
    scope_id: 'project-001',
    scope_name: 'Riverside Tower - Phase II',
    from_date: '2024-01-20',
    to_date: '2024-01-25',
    reason: 'Official tour - client meeting',
    approved_by: 'user-001',
    approved_at: '2024-01-18T10:00:00Z',
    status: 'approved',
    created_at: '2024-01-17T09:00:00Z',
  },
  {
    id: 'deleg-002',
    delegator_id: 'user-014',
    delegator_name: 'Vikram Mehta',
    delegate_id: 'user-015',
    delegate_name: 'Suresh Kumar',
    doc_types: ['*'],
    scope: 'all',
    from_date: '2024-02-01',
    to_date: '2024-02-05',
    reason: 'Annual leave',
    status: 'pending',
    created_at: '2024-01-20T09:00:00Z',
  },
];

export const slaCalendars: SLACalendar[] = [
  {
    id: 'cal-001',
    company_id: 'company-001',
    name: 'Standard Working Calendar',
    working_days: [1, 2, 3, 4, 5, 6], // Monday to Saturday
    holidays: ['2024-01-26', '2024-03-25', '2024-05-01'], // Republic Day, Holi, Labour Day
    working_hours_start: '09:00',
    working_hours_end: '18:00',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getDefinitionById(id: string): WorkflowDefinition | undefined {
  return workflowDefinitions.find(d => d.id === id);
}

export function getDefinitionByCode(code: string): WorkflowDefinition | undefined {
  return workflowDefinitions.find(d => d.code === code);
}

export function getStepsByDefinition(definitionId: string): WorkflowStep[] {
  return workflowSteps
    .filter(s => s.definition_id === definitionId)
    .sort((a, b) => a.seq - b.seq);
}

export function getConditionsByDefinition(definitionId: string): WorkflowCondition[] {
  return workflowConditions.filter(c => c.definition_id === definitionId);
}

export function getInstanceById(id: string): WorkflowInstance | undefined {
  return workflowInstances.find(i => i.id === id);
}

export function getInstancesByDocType(docType: string): WorkflowInstance[] {
  return workflowInstances.filter(i => i.doc_type === docType);
}

export function getTasksByInstance(instanceId: string): WorkflowTask[] {
  return workflowTasks
    .filter(t => t.instance_id === instanceId)
    .sort((a, b) => a.step_seq - b.step_seq);
}

export function getPendingTasksForUser(userId: string): WorkflowTask[] {
  return workflowTasks.filter(t => t.assignee_user_id === userId && t.status === 'pending');
}

export function getActionLogsByInstance(instanceId: string): WorkflowActionLog[] {
  return workflowActionLogs
    .filter(l => l.instance_id === instanceId)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
}

export function getActiveDelegationsForUser(userId: string): WorkflowDelegation[] {
  const now = new Date();
  return workflowDelegations.filter(d => 
    d.delegate_id === userId && 
    d.status === 'approved' &&
    new Date(d.from_date) <= now &&
    new Date(d.to_date) >= now
  );
}

export function getInstanceStatusColor(status: WorkflowInstance['status']): string {
  const colors: Record<WorkflowInstance['status'], string> = {
    DRAFT: 'var(--text-muted)',
    IN_PROGRESS: 'var(--warning-600)',
    APPROVED: 'var(--success-600)',
    REJECTED: 'var(--error-600)',
    RETURNED: 'var(--info-600)',
    CANCELLED: 'var(--text-muted)',
    RECALLED: 'var(--text-muted)',
  };
  return colors[status];
}

export function getTaskStatusColor(status: WorkflowTask['status']): string {
  const colors: Record<WorkflowTask['status'], string> = {
    pending: 'var(--warning-600)',
    approved: 'var(--success-600)',
    rejected: 'var(--error-600)',
    returned: 'var(--info-600)',
    skipped: 'var(--text-muted)',
    expired: 'var(--error-700)',
  };
  return colors[status];
}

export function getDelegationStatusColor(status: WorkflowDelegation['status']): string {
  const colors: Record<WorkflowDelegation['status'], string> = {
    pending: 'var(--warning-600)',
    approved: 'var(--success-600)',
    active: 'var(--info-600)',
    expired: 'var(--text-muted)',
    revoked: 'var(--error-600)',
  };
  return colors[status];
}
