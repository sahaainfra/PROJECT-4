// ═══════════════════════════════════════════════════════════
// RULES ENGINE DATA MODEL — Part 13
// Workflow Rules & Decision Tables
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// DECISION TABLES
// ═══════════════════════════════════════════════════════════

export interface DecisionTable {
  id: string;
  code: string;
  document_type: string;
  name: string;
  description: string;
  version: string;
  status: 'draft' | 'simulated' | 'approved' | 'active' | 'superseded';
  hit_policy: 'first' | 'unique' | 'priority' | 'any' | 'collect';
  inputs: DecisionTableInput[];
  outputs: DecisionTableOutput[];
  rows: DecisionTableRow[];
  effective_from: string;
  effective_to?: string;
  created_by: string;
  created_at: string;
  approved_by?: string;
  approved_at?: string;
}

export interface DecisionTableInput {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum' | 'date';
  expression?: string;
  allowed_values?: string[];
  required: boolean;
}

export interface DecisionTableOutput {
  id: string;
  name: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'enum';
  allowed_values?: string[];
}

export interface DecisionTableRow {
  id: string;
  priority: number;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
  annotation?: string;
}

// ═══════════════════════════════════════════════════════════
// AUTHORITY MATRIX
// ═══════════════════════════════════════════════════════════

export interface AuthorityMatrix {
  id: string;
  company_id: string;
  project_id?: string;
  role_id: string;
  role_name: string;
  document_type: string;
  max_amount: number;
  currency: string;
  effective_from: string;
  effective_to?: string;
  created_by: string;
  created_at: string;
}

// ═══════════════════════════════════════════════════════════
// STATE MACHINES
// ═══════════════════════════════════════════════════════════

export interface StateMachine {
  id: string;
  document_type: string;
  name: string;
  version: string;
  states: State[];
  transitions: StateTransition[];
  initial_state: string;
  final_states: string[];
}

export interface State {
  id: string;
  name: string;
  label: string;
  type: 'initial' | 'intermediate' | 'final';
  color: string;
  description?: string;
}

export interface StateTransition {
  id: string;
  from_state: string;
  to_state: string;
  label: string;
  guard?: string;
  action?: string;
  requires_approval: boolean;
  allowed_roles?: string[];
}

// ═══════════════════════════════════════════════════════════
// SIMULATIONS
// ═══════════════════════════════════════════════════════════

export interface Simulation {
  id: string;
  table_id: string;
  table_name: string;
  version: string;
  period_from: string;
  period_to: string;
  total_documents: number;
  changed_routings: number;
  unchanged_routings: number;
  status: 'running' | 'completed' | 'failed';
  report_file_id?: string;
  run_by: string;
  run_at: string;
  completed_at?: string;
  results?: SimulationResult[];
}

export interface SimulationResult {
  document_id: string;
  document_number: string;
  document_type: string;
  amount: number;
  old_routing: string[];
  new_routing: string[];
  changed: boolean;
  reason?: string;
}

// ═══════════════════════════════════════════════════════════
// EMERGENCY APPROVALS
// ═══════════════════════════════════════════════════════════

export interface EmergencyApproval {
  id: string;
  instance_id: string;
  document_type: string;
  document_number: string;
  reason: string;
  evidence_ids: string[];
  approved_by: string;
  approved_at: string;
  regularise_by: string;
  regularised_at?: string;
  status: 'pending' | 'regularised' | 'overdue';
  created_at: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const decisionTables: DecisionTable[] = [
  {
    id: 'dt-001',
    code: 'PO_APPROVAL_ROUTING',
    document_type: 'purchase_order',
    name: 'Purchase Order Approval Routing',
    description: 'Determines approval levels based on PO amount and project',
    version: '1.0.0',
    status: 'active',
    hit_policy: 'first',
    inputs: [
      {
        id: 'input-001',
        name: 'amount',
        label: 'PO Amount',
        type: 'number',
        required: true,
      },
      {
        id: 'input-002',
        name: 'project_type',
        label: 'Project Type',
        type: 'enum',
        allowed_values: ['residential', 'commercial', 'infrastructure', 'industrial'],
        required: true,
      },
      {
        id: 'input-003',
        name: 'vendor_risk',
        label: 'Vendor Risk Level',
        type: 'enum',
        allowed_values: ['low', 'medium', 'high'],
        required: true,
      },
    ],
    outputs: [
      {
        id: 'output-001',
        name: 'approval_levels',
        label: 'Required Approval Levels',
        type: 'string',
        allowed_values: ['pm_only', 'pm_commercial', 'pm_commercial_finance', 'pm_commercial_finance_cfo'],
      },
      {
        id: 'output-002',
        name: 'sla_hours',
        label: 'SLA (Hours)',
        type: 'number',
      },
      {
        id: 'output-003',
        name: 'mandatory_docs',
        label: 'Mandatory Documents',
        type: 'string',
      },
    ],
    rows: [
      {
        id: 'row-001',
        priority: 1,
        inputs: { amount: '<=500000', project_type: 'any', vendor_risk: 'low' },
        outputs: { approval_levels: 'pm_only', sla_hours: 24, mandatory_docs: 'none' },
        annotation: 'Small POs - PM approval only',
      },
      {
        id: 'row-002',
        priority: 2,
        inputs: { amount: '500001-2000000', project_type: 'any', vendor_risk: 'low,medium' },
        outputs: { approval_levels: 'pm_commercial', sla_hours: 48, mandatory_docs: 'comparison_statement' },
        annotation: 'Medium POs - PM + Commercial Manager',
      },
      {
        id: 'row-003',
        priority: 3,
        inputs: { amount: '2000001-10000000', project_type: 'any', vendor_risk: 'any' },
        outputs: { approval_levels: 'pm_commercial_finance', sla_hours: 72, mandatory_docs: 'comparison_statement,technical_evaluation' },
        annotation: 'Large POs - PM + Commercial + Finance',
      },
      {
        id: 'row-004',
        priority: 4,
        inputs: { amount: '>10000000', project_type: 'any', vendor_risk: 'any' },
        outputs: { approval_levels: 'pm_commercial_finance_cfo', sla_hours: 96, mandatory_docs: 'comparison_statement,technical_evaluation,risk_assessment' },
        annotation: 'Very large POs - Full approval chain',
      },
      {
        id: 'row-005',
        priority: 5,
        inputs: { amount: 'any', project_type: 'any', vendor_risk: 'high' },
        outputs: { approval_levels: 'pm_commercial_finance_cfo', sla_hours: 96, mandatory_docs: 'comparison_statement,technical_evaluation,risk_assessment,due_diligence' },
        annotation: 'High-risk vendor - Enhanced approval',
      },
    ],
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    approved_by: 'user-002',
    approved_at: '2023-12-20T00:00:00Z',
  },
  {
    id: 'dt-002',
    code: 'BILL_APPROVAL_ROUTING',
    document_type: 'subcontractor_bill',
    name: 'Subcontractor Bill Approval Routing',
    description: 'Determines approval levels for subcontractor bills',
    version: '1.0.0',
    status: 'active',
    hit_policy: 'first',
    inputs: [
      {
        id: 'input-004',
        name: 'bill_amount',
        label: 'Bill Amount',
        type: 'number',
        required: true,
      },
      {
        id: 'input-005',
        name: 'variation_pct',
        label: 'Variation %',
        type: 'number',
        required: true,
      },
    ],
    outputs: [
      {
        id: 'output-004',
        name: 'approval_chain',
        label: 'Approval Chain',
        type: 'string',
      },
      {
        id: 'output-005',
        name: 'sla_hours',
        label: 'SLA (Hours)',
        type: 'number',
      },
    ],
    rows: [
      {
        id: 'row-006',
        priority: 1,
        inputs: { bill_amount: '<=1000000', variation_pct: '<=10' },
        outputs: { approval_chain: 'qs_commercial', sla_hours: 48 },
        annotation: 'Standard bills',
      },
      {
        id: 'row-007',
        priority: 2,
        inputs: { bill_amount: '1000001-5000000', variation_pct: '<=10' },
        outputs: { approval_chain: 'qs_commercial_finance', sla_hours: 72 },
        annotation: 'Medium bills',
      },
      {
        id: 'row-008',
        priority: 3,
        inputs: { bill_amount: '>5000000', variation_pct: 'any' },
        outputs: { approval_chain: 'qs_commercial_finance_cfo', sla_hours: 96 },
        annotation: 'Large bills',
      },
      {
        id: 'row-009',
        priority: 4,
        inputs: { bill_amount: 'any', variation_pct: '>10' },
        outputs: { approval_chain: 'qs_commercial_finance_cfo', sla_hours: 96 },
        annotation: 'High variation bills',
      },
    ],
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
    approved_by: 'user-002',
    approved_at: '2023-12-20T00:00:00Z',
  },
];

export const authorityMatrix: AuthorityMatrix[] = [
  {
    id: 'auth-001',
    company_id: 'company-001',
    role_id: 'role-004',
    role_name: 'Project Manager',
    document_type: 'purchase_order',
    max_amount: 500000,
    currency: 'INR',
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
  },
  {
    id: 'auth-002',
    company_id: 'company-001',
    role_id: 'role-005',
    role_name: 'Commercial Manager',
    document_type: 'purchase_order',
    max_amount: 2000000,
    currency: 'INR',
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
  },
  {
    id: 'auth-003',
    company_id: 'company-001',
    role_id: 'role-008',
    role_name: 'Finance Manager',
    document_type: 'purchase_order',
    max_amount: 10000000,
    currency: 'INR',
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
  },
  {
    id: 'auth-004',
    company_id: 'company-001',
    role_id: 'role-002',
    role_name: 'Management / CFO',
    document_type: 'purchase_order',
    max_amount: 100000000,
    currency: 'INR',
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
  },
  {
    id: 'auth-005',
    company_id: 'company-001',
    role_id: 'role-009',
    role_name: 'QS / Quantity Surveyor',
    document_type: 'subcontractor_bill',
    max_amount: 1000000,
    currency: 'INR',
    effective_from: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    created_at: '2023-12-15T00:00:00Z',
  },
];

export const stateMachines: StateMachine[] = [
  {
    id: 'sm-001',
    document_type: 'purchase_order',
    name: 'Purchase Order Lifecycle',
    version: '1.0.0',
    states: [
      { id: 'state-001', name: 'DRAFT', label: 'Draft', type: 'initial', color: 'var(--text-muted)', description: 'Initial draft state' },
      { id: 'state-002', name: 'SUBMITTED', label: 'Submitted', type: 'intermediate', color: 'var(--info-600)', description: 'Submitted for approval' },
      { id: 'state-003', name: 'UNDER_REVIEW', label: 'Under Review', type: 'intermediate', color: 'var(--warning-600)', description: 'Currently under review' },
      { id: 'state-004', name: 'APPROVED', label: 'Approved', type: 'intermediate', color: 'var(--success-600)', description: 'Approved and locked' },
      { id: 'state-005', name: 'REJECTED', label: 'Rejected', type: 'final', color: 'var(--error-600)', description: 'Rejected - terminal state' },
      { id: 'state-006', name: 'RETURNED', label: 'Returned', type: 'intermediate', color: 'var(--info-600)', description: 'Returned for correction' },
      { id: 'state-007', name: 'CANCELLED', label: 'Cancelled', type: 'final', color: 'var(--text-muted)', description: 'Cancelled - terminal state' },
    ],
    transitions: [
      { id: 'trans-001', from_state: 'DRAFT', to_state: 'SUBMITTED', label: 'Submit', requires_approval: false, allowed_roles: ['creator'] },
      { id: 'trans-002', from_state: 'SUBMITTED', to_state: 'UNDER_REVIEW', label: 'Start Review', requires_approval: false, allowed_roles: ['approver'] },
      { id: 'trans-003', from_state: 'UNDER_REVIEW', to_state: 'APPROVED', label: 'Approve', requires_approval: true, allowed_roles: ['approver'] },
      { id: 'trans-004', from_state: 'UNDER_REVIEW', to_state: 'REJECTED', label: 'Reject', requires_approval: true, allowed_roles: ['approver'] },
      { id: 'trans-005', from_state: 'UNDER_REVIEW', to_state: 'RETURNED', label: 'Return', requires_approval: true, allowed_roles: ['approver'] },
      { id: 'trans-006', from_state: 'RETURNED', to_state: 'SUBMITTED', label: 'Resubmit', requires_approval: false, allowed_roles: ['creator'] },
      { id: 'trans-007', from_state: 'DRAFT', to_state: 'CANCELLED', label: 'Cancel', requires_approval: false, allowed_roles: ['creator'] },
      { id: 'trans-008', from_state: 'SUBMITTED', to_state: 'CANCELLED', label: 'Cancel', requires_approval: true, allowed_roles: ['creator', 'approver'] },
    ],
    initial_state: 'DRAFT',
    final_states: ['APPROVED', 'REJECTED', 'CANCELLED'],
  },
];

export const simulations: Simulation[] = [
  {
    id: 'sim-001',
    table_id: 'dt-001',
    table_name: 'Purchase Order Approval Routing',
    version: '1.0.0',
    period_from: '2023-10-01T00:00:00Z',
    period_to: '2023-12-31T23:59:59Z',
    total_documents: 145,
    changed_routings: 12,
    unchanged_routings: 133,
    status: 'completed',
    report_file_id: 'report-001',
    run_by: 'user-001',
    run_at: '2024-01-10T10:00:00Z',
    completed_at: '2024-01-10T10:05:00Z',
    results: [
      {
        document_id: 'doc-001',
        document_number: 'PO-2023-142',
        document_type: 'purchase_order',
        amount: 750000,
        old_routing: ['pm_only'],
        new_routing: ['pm_commercial'],
        changed: true,
        reason: 'Amount exceeds PM authority limit',
      },
      {
        document_id: 'doc-002',
        document_number: 'PO-2023-143',
        document_type: 'purchase_order',
        amount: 250000,
        old_routing: ['pm_only'],
        new_routing: ['pm_only'],
        changed: false,
      },
    ],
  },
];

export const emergencyApprovals: EmergencyApproval[] = [
  {
    id: 'emerg-001',
    instance_id: 'wf-inst-005',
    document_type: 'purchase_order',
    document_number: 'PO-2024-EMERGENCY-001',
    reason: 'Site emergency - critical material required immediately',
    evidence_ids: ['evidence-001', 'evidence-002'],
    approved_by: 'user-010',
    approved_at: '2024-01-15T08:00:00Z',
    regularise_by: 'user-002',
    regularised_at: '2024-01-15T14:00:00Z',
    status: 'regularised',
    created_at: '2024-01-15T08:00:00Z',
  },
  {
    id: 'emerg-002',
    instance_id: 'wf-inst-006',
    document_type: 'purchase_order',
    document_number: 'PO-2024-EMERGENCY-002',
    reason: 'Equipment breakdown - urgent replacement needed',
    evidence_ids: ['evidence-003'],
    approved_by: 'user-011',
    approved_at: '2024-01-16T09:00:00Z',
    regularise_by: 'user-002',
    status: 'pending',
    created_at: '2024-01-16T09:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getDecisionTableById(id: string): DecisionTable | undefined {
  return decisionTables.find(dt => dt.id === id);
}

export function getDecisionTablesByDocType(docType: string): DecisionTable[] {
  return decisionTables.filter(dt => dt.document_type === docType);
}

export function getActiveDecisionTable(docType: string): DecisionTable | undefined {
  return decisionTables.find(dt => dt.document_type === docType && dt.status === 'active');
}

export function getAuthorityLimit(roleId: string, docType: string): AuthorityMatrix | undefined {
  return authorityMatrix.find(
    am => am.role_id === roleId && am.document_type === docType
  );
}

export function getStateMachineByDocType(docType: string): StateMachine | undefined {
  return stateMachines.find(sm => sm.document_type === docType);
}

export function getSimulationsByTable(tableId: string): Simulation[] {
  return simulations.filter(sim => sim.table_id === tableId);
}

export function getEmergencyApprovalsByStatus(status: EmergencyApproval['status']): EmergencyApproval[] {
  return emergencyApprovals.filter(ea => ea.status === status);
}

export function getDecisionTableStatusColor(status: DecisionTable['status']): string {
  const colors: Record<DecisionTable['status'], string> = {
    draft: 'var(--text-muted)',
    simulated: 'var(--info-600)',
    approved: 'var(--success-600)',
    active: 'var(--success-600)',
    superseded: 'var(--text-muted)',
  };
  return colors[status];
}

export function getSimulationStatusColor(status: Simulation['status']): string {
  const colors: Record<Simulation['status'], string> = {
    running: 'var(--info-600)',
    completed: 'var(--success-600)',
    failed: 'var(--error-600)',
  };
  return colors[status];
}

export function getEmergencyStatusColor(status: EmergencyApproval['status']): string {
  const colors: Record<EmergencyApproval['status'], string> = {
    pending: 'var(--warning-600)',
    regularised: 'var(--success-600)',
    overdue: 'var(--error-600)',
  };
  return colors[status];
}
