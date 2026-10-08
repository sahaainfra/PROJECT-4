// ═══════════════════════════════════════════════════════════
// PROTOCOL DATA MODEL — Part 14
// Protocol & Control Engine
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// CONTROL POINTS
// ═══════════════════════════════════════════════════════════

export interface ControlPoint {
  cp_code: string;
  module: string;
  stage: 'PLAN' | 'AUTHORIZE' | 'EXECUTE' | 'RECORD' | 'VERIFY' | 'APPROVE' | 'MONITOR' | 'RECONCILE' | 'CLOSE';
  trigger: string;
  check_type: string;
  enforcement: 'BLOCK' | 'EXCEPTION' | 'WARN' | 'MONITOR';
  config_json: Record<string, any>;
  threshold_key?: string;
  evidence_rule_code?: string;
  escalation_ladder_code?: string;
  owner_role: string;
  description: string;
  version: string;
  is_active: boolean;
}

export interface ControlPointMode {
  id: string;
  cp_code: string;
  scope_type: 'company' | 'project' | 'module';
  scope_id?: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
  effective_from: string;
  approved_by?: string;
}

// ═══════════════════════════════════════════════════════════
// THRESHOLDS
// ═══════════════════════════════════════════════════════════

export interface Threshold {
  id: string;
  key: string;
  scope_type: 'company' | 'project' | 'module';
  scope_id?: string;
  material_group?: string;
  category?: string;
  value: number;
  unit: string;
  effective_from: string;
  effective_to?: string;
  approved_by?: string;
}

// ═══════════════════════════════════════════════════════════
// EVIDENCE RULES
// ═══════════════════════════════════════════════════════════

export interface EvidenceRule {
  code: string;
  transaction_type: string;
  required_items: EvidenceItem[];
}

export interface EvidenceItem {
  type: 'photo' | 'document' | 'field' | 'signature' | 'gps';
  doc_type?: string;
  min_count: number;
  condition?: string;
}

// ═══════════════════════════════════════════════════════════
// REASON CODES
// ═══════════════════════════════════════════════════════════

export interface ReasonCode {
  code: string;
  module: string;
  category: 'cancel' | 'reverse' | 'modify' | 'excess' | 'deviation' | 'backdate' | 'override' | 'waiver' | 'reject' | 'shortclose';
  description: string;
  requires_narrative_min_chars: number;
  is_active: boolean;
}

// ═══════════════════════════════════════════════════════════
// EXCEPTION MATRIX
// ═══════════════════════════════════════════════════════════

export interface ExceptionMatrix {
  id: string;
  exception_type: string;
  severity_band_rule_json: {
    pct?: number;
    abs_amount?: number;
    abs_qty?: number;
    days?: number;
  };
  approver_chain_definition_code: string;
}

// ═══════════════════════════════════════════════════════════
// EVALUATIONS
// ═══════════════════════════════════════════════════════════

export interface Evaluation {
  evaluation_id: string;
  cp_code: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
  actor_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  result: 'PASS' | 'WARN' | 'EXCEPTION_REQUIRED' | 'BLOCK';
  failures_json: any[];
  exception_id?: string;
  at: string;
  correlation_id: string;
}

// ═══════════════════════════════════════════════════════════
// EXCEPTIONS
// ═══════════════════════════════════════════════════════════

export interface Exception {
  exception_no: string;
  type: string;
  cp_code: string;
  entity_type: string;
  entity_id: string;
  project_id?: string;
  site_id?: string;
  requested_by: string;
  deviation_value: number;
  deviation_unit: string;
  cost_impact?: number;
  time_impact_days?: number;
  reason_code: string;
  narrative: string;
  evidence_doc_ids: string[];
  validity_type: 'one_time' | 'until_date' | 'qty_cap' | 'amount_cap';
  cap_value: number;
  consumed_value: number;
  valid_to?: string;
  is_emergency: boolean;
  regularise_by?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'CONSUMED' | 'EXPIRED' | 'REJECTED' | 'RETURNED' | 'EXECUTED_PENDING_REGULARISATION' | 'REGULARISED' | 'ESCALATED';
  workflow_instance_id?: string;
}

// ═══════════════════════════════════════════════════════════
// CONTROL CYCLES
// ═══════════════════════════════════════════════════════════

export interface ControlCycle {
  cycle_id: string;
  activity_type: string;
  root_entity_type: string;
  root_entity_id: string;
  project_id?: string;
  site_id?: string;
  responsible_id: string;
  stage_status_json: Record<string, {
    status: 'pending' | 'in_progress' | 'completed' | 'skipped';
    entity_ref?: string;
    at?: string;
    by?: string;
  }>;
  current_stage: string;
  is_closed: boolean;
}

// ═══════════════════════════════════════════════════════════
// VIOLATIONS
// ═══════════════════════════════════════════════════════════

export interface Violation {
  violation_id: string;
  cp_code: string;
  evaluation_id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  actor_id: string;
  project_id?: string;
  site_id?: string;
  department_id?: string;
  status: 'open' | 'acknowledged' | 'resolved' | 'escalated';
  resolved_by?: string;
  resolution_note?: string;
}

// ═══════════════════════════════════════════════════════════
// ESCALATIONS
// ═══════════════════════════════════════════════════════════

export interface Escalation {
  id: string;
  violation_id?: string;
  exception_id?: string;
  level: 'L0' | 'L1' | 'L2' | 'L3';
  recipient_ids: string[];
  raised_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const controlPoints: ControlPoint[] = [
  {
    cp_code: 'CP-PRT-01',
    module: 'protocol',
    stage: 'APPROVE',
    trigger: 'protocol.config.change',
    check_type: 'MAKER_CHECKER',
    enforcement: 'BLOCK',
    config_json: { requires_dual_approval: true },
    owner_role: 'MANAGEMENT',
    description: 'Any change to control points, thresholds, modes, reason codes or exception matrix is maker-checker',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-PRT-02',
    module: 'protocol',
    stage: 'VERIFY',
    trigger: 'protocol.mode.change',
    check_type: 'OBSERVE_DURATION',
    enforcement: 'EXCEPTION',
    config_json: { min_observe_days: 14, requires_impact_review: true },
    threshold_key: 'OBSERVE_DURATION_THRESHOLD',
    owner_role: 'MANAGEMENT',
    description: 'Switching a CP to ENFORCE requires ≥ 14 days of OBSERVE data and a signed impact review',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-PRT-03',
    module: 'protocol',
    stage: 'MONITOR',
    trigger: 'protocol.exception.expiry',
    check_type: 'TIME_WINDOW',
    enforcement: 'MONITOR',
    config_json: { warning_hours_before: 4 },
    escalation_ladder_code: 'LADDER_EXCEPTION_EXPIRY',
    owner_role: 'PROTOCOL_OFFICER',
    description: 'Exceptions nearing expiry/cap and emergencies nearing regularisation deadline',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-PRT-04',
    module: 'protocol',
    stage: 'CLOSE',
    trigger: 'protocol.violation.close',
    check_type: 'DOCUMENT_REQUIRED',
    enforcement: 'BLOCK',
    config_json: { required_fields: ['resolution_note', 'evidence'] },
    evidence_rule_code: 'VIOLATION_RESOLUTION',
    owner_role: 'PROTOCOL_OFFICER',
    description: 'Violations cannot be closed without resolution note and evidence',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-PROC-01',
    module: 'procurement',
    stage: 'PLAN',
    trigger: 'procurement.pr.create',
    check_type: 'PLAN_EXISTS',
    enforcement: 'BLOCK',
    config_json: { requires_project_allocation: true },
    owner_role: 'PROCUREMENT_MANAGER',
    description: 'PR requires project allocation',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-PROC-02',
    module: 'procurement',
    stage: 'AUTHORIZE',
    trigger: 'procurement.po.approve',
    check_type: 'THRESHOLD',
    enforcement: 'BLOCK',
    config_json: { check_authority_limit: true },
    threshold_key: 'PO_APPROVAL_LIMIT',
    owner_role: 'PROCUREMENT_MANAGER',
    description: 'PO requires approval within authority limit',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-INV-01',
    module: 'inventory',
    stage: 'EXECUTE',
    trigger: 'inventory.issue.create',
    check_type: 'STOCK_AVAILABLE',
    enforcement: 'BLOCK',
    config_json: { check_stock_balance: true },
    owner_role: 'STORE_KEEPER',
    description: 'Material issue requires sufficient stock',
    version: '1.0.0',
    is_active: true,
  },
  {
    cp_code: 'CP-FIN-01',
    module: 'finance',
    stage: 'AUTHORIZE',
    trigger: 'finance.bill.approve',
    check_type: 'CERTIFICATION_VALID',
    enforcement: 'BLOCK',
    config_json: { requires_qs_certification: true },
    owner_role: 'FINANCE_MANAGER',
    description: 'Bill approval requires valid QS certification',
    version: '1.0.0',
    is_active: true,
  },
];

export const controlPointModes: ControlPointMode[] = [
  {
    id: 'mode-001',
    cp_code: 'CP-PRT-01',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'mode-002',
    cp_code: 'CP-PRT-02',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'mode-003',
    cp_code: 'CP-PRT-03',
    scope_type: 'company',
    mode: 'OBSERVE',
    effective_from: '2024-01-15T00:00:00Z',
  },
  {
    id: 'mode-004',
    cp_code: 'CP-PRT-04',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'mode-005',
    cp_code: 'CP-PROC-01',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'mode-006',
    cp_code: 'CP-PROC-02',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'mode-007',
    cp_code: 'CP-INV-01',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'mode-008',
    cp_code: 'CP-FIN-01',
    scope_type: 'company',
    mode: 'ENFORCE',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
];

export const thresholds: Threshold[] = [
  {
    id: 'thresh-001',
    key: 'PO_APPROVAL_LIMIT',
    scope_type: 'company',
    value: 5000000,
    unit: 'INR',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-002',
  },
  {
    id: 'thresh-002',
    key: 'OBSERVE_DURATION_THRESHOLD',
    scope_type: 'company',
    value: 14,
    unit: 'DAYS',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-001',
  },
  {
    id: 'thresh-003',
    key: 'MATERIAL_WASTAGE_LIMIT',
    scope_type: 'project',
    scope_id: 'project-001',
    material_group: 'cement',
    value: 5,
    unit: 'PERCENT',
    effective_from: '2024-01-01T00:00:00Z',
    approved_by: 'user-010',
  },
];

export const evidenceRules: EvidenceRule[] = [
  {
    code: 'VIOLATION_RESOLUTION',
    transaction_type: 'violation_resolution',
    required_items: [
      { type: 'document', doc_type: 'resolution_note', min_count: 1 },
      { type: 'photo', min_count: 1, condition: 'site_related' },
    ],
  },
  {
    code: 'EXCEPTION_EVIDENCE',
    transaction_type: 'exception_request',
    required_items: [
      { type: 'document', doc_type: 'justification', min_count: 1 },
      { type: 'signature', min_count: 1 },
    ],
  },
];

export const reasonCodes: ReasonCode[] = [
  {
    code: 'EMERGENCY_SITE',
    module: 'inventory',
    category: 'deviation',
    description: 'Emergency site requirement',
    requires_narrative_min_chars: 50,
    is_active: true,
  },
  {
    code: 'VARIATION_ORDER',
    module: 'project',
    category: 'modify',
    description: 'Approved variation order',
    requires_narrative_min_chars: 30,
    is_active: true,
  },
  {
    code: 'CLIENT_REQUEST',
    module: 'procurement',
    category: 'excess',
    description: 'Client requested additional quantity',
    requires_narrative_min_chars: 30,
    is_active: true,
  },
  {
    code: 'SYSTEM_ERROR',
    module: 'finance',
    category: 'reverse',
    description: 'System error requiring reversal',
    requires_narrative_min_chars: 50,
    is_active: true,
  },
  {
    code: 'REGULATORY_CHANGE',
    module: 'protocol',
    category: 'override',
    description: 'Regulatory compliance requirement',
    requires_narrative_min_chars: 50,
    is_active: true,
  },
];

export const exceptionMatrix: ExceptionMatrix[] = [
  {
    id: 'matrix-001',
    exception_type: 'MATERIAL_EXCESS',
    severity_band_rule_json: { pct: 10 },
    approver_chain_definition_code: 'PM_APPROVAL',
  },
  {
    id: 'matrix-002',
    exception_type: 'MATERIAL_EXCESS',
    severity_band_rule_json: { pct: 25 },
    approver_chain_definition_code: 'COMMERCIAL_MANAGER_APPROVAL',
  },
  {
    id: 'matrix-003',
    exception_type: 'MATERIAL_EXCESS',
    severity_band_rule_json: { pct: 50 },
    approver_chain_definition_code: 'MANAGEMENT_APPROVAL',
  },
  {
    id: 'matrix-004',
    exception_type: 'BUDGET_OVERRUN',
    severity_band_rule_json: { abs_amount: 500000 },
    approver_chain_definition_code: 'CFO_APPROVAL',
  },
];

export const evaluations: Evaluation[] = [
  {
    evaluation_id: 'eval-001',
    cp_code: 'CP-PROC-02',
    mode: 'ENFORCE',
    actor_id: 'user-010',
    entity_type: 'PurchaseOrder',
    entity_id: 'PO-2024-001',
    action: 'approve',
    result: 'PASS',
    failures_json: [],
    at: '2024-01-15T10:30:00Z',
    correlation_id: 'corr-001',
  },
  {
    evaluation_id: 'eval-002',
    cp_code: 'CP-INV-01',
    mode: 'ENFORCE',
    actor_id: 'user-017',
    entity_type: 'MaterialIssue',
    entity_id: 'MI-2024-001',
    action: 'create',
    result: 'BLOCK',
    failures_json: [{ check: 'STOCK_AVAILABLE', message: 'Insufficient stock: required 100, available 50' }],
    at: '2024-01-15T11:00:00Z',
    correlation_id: 'corr-002',
  },
  {
    evaluation_id: 'eval-003',
    cp_code: 'CP-PRT-03',
    mode: 'OBSERVE',
    actor_id: 'system',
    entity_type: 'Exception',
    entity_id: 'exc-001',
    action: 'monitor_expiry',
    result: 'WARN',
    failures_json: [{ check: 'TIME_WINDOW', message: 'Exception expires in 3 hours' }],
    at: '2024-01-15T12:00:00Z',
    correlation_id: 'corr-003',
  },
];

export const exceptions: Exception[] = [
  {
    exception_no: 'EXC-2024-001',
    type: 'MATERIAL_EXCESS',
    cp_code: 'CP-INV-01',
    entity_type: 'MaterialIssue',
    entity_id: 'MI-2024-002',
    project_id: 'project-001',
    site_id: 'site-001',
    requested_by: 'user-017',
    deviation_value: 25,
    deviation_unit: 'MT',
    cost_impact: 125000,
    reason_code: 'EMERGENCY_SITE',
    narrative: 'Emergency requirement for foundation work due to unexpected site conditions. Approved by site engineer and project manager.',
    evidence_doc_ids: ['doc-001', 'doc-002'],
    validity_type: 'one_time',
    cap_value: 25,
    consumed_value: 0,
    is_emergency: true,
    regularise_by: 'user-010',
    status: 'APPROVED',
    workflow_instance_id: 'wf-inst-005',
  },
  {
    exception_no: 'EXC-2024-002',
    type: 'BUDGET_OVERRUN',
    cp_code: 'CP-FIN-01',
    entity_type: 'Bill',
    entity_id: 'BILL-2024-002',
    project_id: 'project-002',
    requested_by: 'user-012',
    deviation_value: 750000,
    deviation_unit: 'INR',
    cost_impact: 750000,
    reason_code: 'VARIATION_ORDER',
    narrative: 'Additional work required due to client-requested design changes. Variation order VO-2024-003 approved.',
    evidence_doc_ids: ['doc-003', 'doc-004', 'doc-005'],
    validity_type: 'amount_cap',
    cap_value: 750000,
    consumed_value: 0,
    is_emergency: false,
    status: 'SUBMITTED',
  },
];

export const controlCycles: ControlCycle[] = [
  {
    cycle_id: 'cycle-001',
    activity_type: 'procurement',
    root_entity_type: 'PurchaseOrder',
    root_entity_id: 'PO-2024-001',
    project_id: 'project-001',
    responsible_id: 'user-010',
    stage_status_json: {
      PLAN: { status: 'completed', entity_ref: 'PR-2024-001', at: '2024-01-10T09:00:00Z', by: 'user-011' },
      AUTHORIZE: { status: 'completed', entity_ref: 'PO-2024-001', at: '2024-01-12T14:00:00Z', by: 'user-010' },
      EXECUTE: { status: 'completed', entity_ref: 'PO-2024-001', at: '2024-01-13T10:00:00Z', by: 'user-014' },
      RECORD: { status: 'completed', entity_ref: 'GRN-2024-001', at: '2024-01-15T11:00:00Z', by: 'user-017' },
      VERIFY: { status: 'in_progress' },
      ANALYZE: { status: 'pending' },
      CONTROL: { status: 'pending' },
      CLOSE: { status: 'pending' },
    },
    current_stage: 'VERIFY',
    is_closed: false,
  },
];

export const violations: Violation[] = [
  {
    violation_id: 'viol-001',
    cp_code: 'CP-INV-01',
    evaluation_id: 'eval-002',
    severity: 'high',
    actor_id: 'user-017',
    project_id: 'project-001',
    site_id: 'site-001',
    status: 'open',
  },
  {
    violation_id: 'viol-002',
    cp_code: 'CP-FIN-01',
    evaluation_id: 'eval-004',
    severity: 'medium',
    actor_id: 'user-012',
    project_id: 'project-002',
    status: 'acknowledged',
  },
];

export const escalations: Escalation[] = [
  {
    id: 'esc-001',
    violation_id: 'viol-001',
    level: 'L1',
    recipient_ids: ['user-010'],
    raised_at: '2024-01-15T11:30:00Z',
  },
  {
    id: 'esc-002',
    exception_id: 'exc-001',
    level: 'L2',
    recipient_ids: ['user-002'],
    raised_at: '2024-01-15T12:30:00Z',
    acknowledged_at: '2024-01-15T13:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getControlPointByCode(code: string): ControlPoint | undefined {
  return controlPoints.find(cp => cp.cp_code === code);
}

export function getControlPointsByModule(module: string): ControlPoint[] {
  return controlPoints.filter(cp => cp.module === module);
}

export function getActiveMode(cpCode: string, scopeType?: string, scopeId?: string): ControlPointMode | undefined {
  const modes = controlPointModes.filter(m => m.cp_code === cpCode);
  
  // Find most specific mode (scope_id match > scope_type match > default)
  if (scopeId) {
    const scopedMode = modes.find(m => m.scope_id === scopeId);
    if (scopedMode) return scopedMode;
  }
  
  if (scopeType) {
    const typeMode = modes.find(m => m.scope_type === scopeType && !m.scope_id);
    if (typeMode) return typeMode;
  }
  
  return modes.find(m => m.scope_type === 'company' && !m.scope_id);
}

export function getThresholdByKey(key: string, scopeType?: string, scopeId?: string): Threshold | undefined {
  const thresholds_list = thresholds.filter(t => t.key === key);
  
  if (scopeId) {
    const scopedThreshold = thresholds_list.find(t => t.scope_id === scopeId);
    if (scopedThreshold) return scopedThreshold;
  }
  
  if (scopeType) {
    const typeThreshold = thresholds_list.find(t => t.scope_type === scopeType && !t.scope_id);
    if (typeThreshold) return typeThreshold;
  }
  
  return thresholds_list.find(t => t.scope_type === 'company' && !t.scope_id);
}

export function getReasonCodeByCode(code: string): ReasonCode | undefined {
  return reasonCodes.find(rc => rc.code === code);
}

export function getReasonCodesByCategory(category: string): ReasonCode[] {
  return reasonCodes.filter(rc => rc.category === category && rc.is_active);
}

export function getEvaluationsByEntity(entityType: string, entityId: string): Evaluation[] {
  return evaluations.filter(e => e.entity_type === entityType && e.entity_id === entityId);
}

export function getExceptionsByStatus(status: string): Exception[] {
  return exceptions.filter(e => e.status === status);
}

export function getViolationsByStatus(status: string): Violation[] {
  return violations.filter(v => v.status === status);
}

export function getControlCycleByEntity(entityType: string, entityId: string): ControlCycle | undefined {
  return controlCycles.find(c => c.root_entity_type === entityType && c.root_entity_id === entityId);
}

export function getEscalationsByViolation(violationId: string): Escalation[] {
  return escalations.filter(e => e.violation_id === violationId);
}

export function getEscalationsByException(exceptionId: string): Escalation[] {
  return escalations.filter(e => e.exception_id === exceptionId);
}

export function getModeColor(mode: string): string {
  const colors: Record<string, string> = {
    OFF: 'var(--text-muted)',
    OBSERVE: 'var(--info-600)',
    WARN: 'var(--warning-600)',
    ENFORCE: 'var(--error-600)',
  };
  return colors[mode] || 'var(--text-muted)';
}

export function getResultColor(result: string): string {
  const colors: Record<string, string> = {
    PASS: 'var(--success-600)',
    WARN: 'var(--warning-600)',
    EXCEPTION_REQUIRED: 'var(--info-600)',
    BLOCK: 'var(--error-600)',
  };
  return colors[result] || 'var(--text-muted)';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    low: 'var(--info-600)',
    medium: 'var(--warning-600)',
    high: 'var(--error-600)',
    critical: 'var(--error-700)',
  };
  return colors[severity] || 'var(--text-muted)';
}

export function getEscalationLevelColor(level: string): string {
  const colors: Record<string, string> = {
    L0: 'var(--text-muted)',
    L1: 'var(--info-600)',
    L2: 'var(--warning-600)',
    L3: 'var(--error-600)',
  };
  return colors[level] || 'var(--text-muted)';
}
