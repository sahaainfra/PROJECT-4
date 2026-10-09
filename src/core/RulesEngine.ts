// ═══════════════════════════════════════════════════════════
// RULES ENGINE SERVICE — Part 13
// Workflow Rules & Decision Tables
// ═══════════════════════════════════════════════════════════

import {
  DecisionTable,
  DecisionTableRow,
  AuthorityMatrix,
  StateMachine,
  Simulation,
  SimulationResult,
  EmergencyApproval,
  decisionTables,
  authorityMatrix,
  stateMachines,
  simulations,
  emergencyApprovals,
  getActiveDecisionTable,
  getAuthorityLimit,
  getStateMachineByDocType,
} from '../data/rulesData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// DECISION TABLE EVALUATION
// ═══════════════════════════════════════════════════════════

export interface DecisionTableContext {
  document_type: string;
  inputs: Record<string, any>;
}

export interface DecisionTableResult {
  matched: boolean;
  row?: DecisionTableRow;
  outputs?: Record<string, any>;
  reason?: string;
}

/**
 * Evaluate a decision table against input context
 */
export function evaluateDecisionTable(
  documentType: string,
  inputs: Record<string, any>
): DecisionTableResult {
  const table = getActiveDecisionTable(documentType);
  
  if (!table) {
    return {
      matched: false,
      reason: `No active decision table found for document type: ${documentType}`,
    };
  }

  // Sort rows by priority
  const sortedRows = [...table.rows].sort((a, b) => a.priority - b.priority);

  // Evaluate each row based on hit policy
  for (const row of sortedRows) {
    if (matchesRow(row, table.inputs, inputs)) {
      return {
        matched: true,
        row,
        outputs: row.outputs,
        reason: row.annotation,
      };
    }
  }

  return {
    matched: false,
    reason: 'No matching rule found in decision table',
  };
}

/**
 * Check if input values match a decision table row
 */
function matchesRow(
  row: DecisionTableRow,
  inputDefinitions: DecisionTable['inputs'],
  actualInputs: Record<string, any>
): boolean {
  for (const inputDef of inputDefinitions) {
    const ruleValue = row.inputs[inputDef.name];
    const actualValue = actualInputs[inputDef.name];

    if (ruleValue === undefined || ruleValue === 'any') {
      continue; // Wildcard match
    }

    if (!matchesCondition(ruleValue, actualValue, inputDef.type)) {
      return false;
    }
  }

  return true;
}

/**
 * Match a condition value against an actual value
 */
function matchesCondition(
  ruleValue: any,
  actualValue: any,
  type: string
): boolean {
  const ruleStr = String(ruleValue);

  // Handle range expressions like "500001-2000000"
  if (ruleStr.includes('-') && !ruleStr.includes(',')) {
    const [min, max] = ruleStr.split('-').map(Number);
    return actualValue >= min && actualValue <= max;
  }

  // Handle comparison operators
  if (ruleStr.startsWith('<=')) {
    return actualValue <= Number(ruleStr.substring(2));
  }
  if (ruleStr.startsWith('>=')) {
    return actualValue >= Number(ruleStr.substring(2));
  }
  if (ruleStr.startsWith('<')) {
    return actualValue < Number(ruleStr.substring(1));
  }
  if (ruleStr.startsWith('>')) {
    return actualValue > Number(ruleStr.substring(1));
  }

  // Handle comma-separated values (OR condition)
  if (ruleStr.includes(',')) {
    const values = ruleStr.split(',').map(v => v.trim());
    return values.includes(String(actualValue));
  }

  // Direct equality
  return String(actualValue) === ruleStr;
}

// ═══════════════════════════════════════════════════════════
// AUTHORITY MATRIX
// ═══════════════════════════════════════════════════════════

export interface AuthorityCheckResult {
  authorized: boolean;
  limit: number;
  amount: number;
  reason?: string;
}

/**
 * Check if a user has authority to approve a document
 */
export function checkAuthority(
  roleId: string,
  documentType: string,
  amount: number
): AuthorityCheckResult {
  const authority = getAuthorityLimit(roleId, documentType);

  if (!authority) {
    return {
      authorized: false,
      limit: 0,
      amount,
      reason: `No authority limit defined for role ${roleId} and document type ${documentType}`,
    };
  }

  const authorized = amount <= authority.max_amount;

  return {
    authorized,
    limit: authority.max_amount,
    amount,
    reason: authorized
      ? `Amount ${amount} is within authority limit ${authority.max_amount}`
      : `Amount ${amount} exceeds authority limit ${authority.max_amount}`,
  };
}

/**
 * Check cumulative authority (for split-order detection)
 */
export function checkCumulativeAuthority(
  roleId: string,
  documentType: string,
  vendorId: string,
  projectId: string,
  windowDays: number = 7
): { total: number; limit: number; authorized: boolean } {
  // In production, this would query historical documents
  // For now, return a simplified check
  const authority = getAuthorityLimit(roleId, documentType);
  
  if (!authority) {
    return { total: 0, limit: 0, authorized: false };
  }

  // Simulated cumulative check
  const simulatedTotal = 0; // Would query actual documents
  
  return {
    total: simulatedTotal,
    limit: authority.max_amount,
    authorized: simulatedTotal <= authority.max_amount,
  };
}

// ═══════════════════════════════════════════════════════════
// STATE MACHINE
// ═══════════════════════════════════════════════════════════

export interface TransitionCheckResult {
  allowed: boolean;
  transition?: any;
  reason?: string;
}

/**
 * Check if a state transition is allowed
 */
export function checkStateTransition(
  documentType: string,
  currentState: string,
  targetState: string,
  userRole: string
): TransitionCheckResult {
  const stateMachine = getStateMachineByDocType(documentType);

  if (!stateMachine) {
    return {
      allowed: false,
      reason: `No state machine found for document type: ${documentType}`,
    };
  }

  // Find valid transition
  const transition = stateMachine.transitions.find(
    t => t.from_state === currentState && t.to_state === targetState
  );

  if (!transition) {
    return {
      allowed: false,
      reason: `No valid transition from ${currentState} to ${targetState}`,
    };
  }

  // Check role permissions
  if (transition.allowed_roles && !transition.allowed_roles.includes(userRole)) {
    return {
      allowed: false,
      transition,
      reason: `User role ${userRole} not allowed for this transition`,
    };
  }

  return {
    allowed: true,
    transition,
  };
}

/**
 * Get available transitions from current state
 */
export function getAvailableTransitions(
  documentType: string,
  currentState: string,
  userRole: string
): any[] {
  const stateMachine = getStateMachineByDocType(documentType);

  if (!stateMachine) {
    return [];
  }

  return stateMachine.transitions.filter(t => {
    if (t.from_state !== currentState) return false;
    if (t.allowed_roles && !t.allowed_roles.includes(userRole)) return false;
    return true;
  });
}

// ═══════════════════════════════════════════════════════════
// SIMULATION
// ═══════════════════════════════════════════════════════════

export interface SimulationInput {
  table_id: string;
  period_from: string;
  period_to: string;
  run_by: string;
}

/**
 * Run a simulation of a decision table against historical documents
 */
export function runSimulation(input: SimulationInput): Simulation {
  const correlation = getCurrentCorrelation();

  // In production, this would query actual historical documents
  // For now, create a simulated result
  const simulation: Simulation = {
    id: `sim-${Date.now()}`,
    table_id: input.table_id,
    table_name: decisionTables.find(dt => dt.id === input.table_id)?.name || '',
    version: decisionTables.find(dt => dt.id === input.table_id)?.version || '',
    period_from: input.period_from,
    period_to: input.period_to,
    total_documents: 100,
    changed_routings: 15,
    unchanged_routings: 85,
    status: 'completed',
    run_by: input.run_by,
    run_at: new Date().toISOString(),
    completed_at: new Date().toISOString(),
    results: generateSimulationResults(input.table_id, 100, 15),
  };

  simulations.push(simulation);

  // Audit
  writeAuditEntry({
    userId: input.run_by,
    userName: 'Simulation User',
    userEmail: '',
    action: 'CREATE',
    entityType: 'Simulation',
    entityId: simulation.id,
    entityName: `Simulation for ${simulation.table_name}`,
    after: simulation,
    correlationId: correlation?.correlation_id || '',
  });

  return simulation;
}

/**
 * Generate simulated simulation results
 */
function generateSimulationResults(
  tableId: string,
  totalDocs: number,
  changedCount: number
): SimulationResult[] {
  const results: SimulationResult[] = [];

  for (let i = 0; i < totalDocs; i++) {
    const changed = i < changedCount;
    results.push({
      document_id: `doc-${i}`,
      document_number: `DOC-2024-${String(i).padStart(4, '0')}`,
      document_type: 'purchase_order',
      amount: Math.floor(Math.random() * 5000000) + 100000,
      old_routing: changed ? ['pm_only'] : ['pm_commercial'],
      new_routing: changed ? ['pm_commercial'] : ['pm_commercial'],
      changed,
      reason: changed ? 'Amount exceeds PM authority limit' : undefined,
    });
  }

  return results;
}

// ═══════════════════════════════════════════════════════════
// EMERGENCY APPROVALS
// ═══════════════════════════════════════════════════════════

export interface EmergencyApprovalInput {
  instance_id: string;
  document_type: string;
  document_number: string;
  reason: string;
  evidence_ids: string[];
  approved_by: string;
  regularise_by: string;
}

/**
 * Create an emergency approval
 */
export function createEmergencyApproval(input: EmergencyApprovalInput): EmergencyApproval {
  const correlation = getCurrentCorrelation();

  const emergency: EmergencyApproval = {
    id: `emerg-${Date.now()}`,
    instance_id: input.instance_id,
    document_type: input.document_type,
    document_number: input.document_number,
    reason: input.reason,
    evidence_ids: input.evidence_ids,
    approved_by: input.approved_by,
    approved_at: new Date().toISOString(),
    regularise_by: input.regularise_by,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  emergencyApprovals.push(emergency);

  // Audit
  writeAuditEntry({
    userId: input.approved_by,
    userName: 'Emergency Approver',
    userEmail: '',
    action: 'CREATE',
    entityType: 'EmergencyApproval',
    entityId: emergency.id,
    entityName: `Emergency approval for ${input.document_number}`,
    after: emergency,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'workflow.emergency.approved',
    company_id: 'company-001',
    actor_id: input.approved_by,
    payload: {
      emergency_id: emergency.id,
      instance_id: input.instance_id,
      document_number: input.document_number,
      reason: input.reason,
    },
  });

  return emergency;
}

/**
 * Regularise an emergency approval
 */
export function regulariseEmergencyApproval(
  emergencyId: string,
  regularised_by: string
): EmergencyApproval {
  const emergency = emergencyApprovals.find(e => e.id === emergencyId);

  if (!emergency) {
    throw new Error(`Emergency approval not found: ${emergencyId}`);
  }

  if (emergency.status !== 'pending') {
    throw new Error(`Emergency approval is not in pending status: ${emergency.status}`);
  }

  emergency.status = 'regularised';
  emergency.regularised_at = new Date().toISOString();

  // Audit
  writeAuditEntry({
    userId: regularised_by,
    userName: 'Regularisation User',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'EmergencyApproval',
    entityId: emergency.id,
    entityName: `Regularisation of ${emergency.document_number}`,
    before: { status: 'pending' },
    after: { status: 'regularised', regularised_at: emergency.regularised_at },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'workflow.emergency.regularised',
    company_id: 'company-001',
    actor_id: regularised_by,
    payload: {
      emergency_id: emergency.id,
      document_number: emergency.document_number,
    },
  });

  return emergency;
}

// ═══════════════════════════════════════════════════════════
// RULE VERSIONING
// ═══════════════════════════════════════════════════════════

export interface RuleVersionInput {
  table_id: string;
  new_version: string;
  changes: Partial<DecisionTable>;
  created_by: string;
}

/**
 * Create a new version of a decision table
 */
export function createRuleVersion(input: RuleVersionInput): DecisionTable {
  const originalTable = decisionTables.find(dt => dt.id === input.table_id);

  if (!originalTable) {
    throw new Error(`Decision table not found: ${input.table_id}`);
  }

  // Mark original as superseded
  originalTable.status = 'superseded';

  // Create new version
  const newTable: DecisionTable = {
    ...originalTable,
    id: `dt-${Date.now()}`,
    version: input.new_version,
    status: 'draft',
    ...input.changes,
    effective_from: new Date().toISOString(),
    created_by: input.created_by,
    created_at: new Date().toISOString(),
  };

  decisionTables.push(newTable);

  // Audit
  writeAuditEntry({
    userId: input.created_by,
    userName: 'Rule Creator',
    userEmail: '',
    action: 'CREATE',
    entityType: 'DecisionTable',
    entityId: newTable.id,
    entityName: `New version ${input.new_version} of ${newTable.name}`,
    after: newTable,
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  return newTable;
}

/**
 * Activate a decision table version
 */
export function activateRuleVersion(
  tableId: string,
  approved_by: string
): DecisionTable {
  const table = decisionTables.find(dt => dt.id === tableId);

  if (!table) {
    throw new Error(`Decision table not found: ${tableId}`);
  }

  if (table.status !== 'draft' && table.status !== 'simulated') {
    throw new Error(`Cannot activate table in ${table.status} status`);
  }

  // Deactivate other active versions for same document type
  decisionTables
    .filter(dt => dt.document_type === table.document_type && dt.status === 'active')
    .forEach(dt => {
      dt.status = 'superseded';
      dt.effective_to = new Date().toISOString();
    });

  // Activate this version
  table.status = 'active';
  table.approved_by = approved_by;
  table.approved_at = new Date().toISOString();

  // Audit
  writeAuditEntry({
    userId: approved_by,
    userName: 'Rule Approver',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'DecisionTable',
    entityId: table.id,
    entityName: `Activated ${table.name} v${table.version}`,
    before: { status: table.status },
    after: { status: 'active', approved_by, approved_at: table.approved_at },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'rules.version.activated',
    company_id: 'company-001',
    actor_id: approved_by,
    payload: {
      table_id: table.id,
      document_type: table.document_type,
      version: table.version,
    },
  });

  return table;
}

// ═══════════════════════════════════════════════════════════
// INTEGRATION WITH WORKFLOW ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * Get approval routing for a document
 */
export function getApprovalRouting(
  documentType: string,
  inputs: Record<string, any>
): {
  routing: string[];
  sla_hours: number;
  mandatory_docs: string[];
  reason?: string;
} {
  const result = evaluateDecisionTable(documentType, inputs);

  if (!result.matched || !result.outputs) {
    return {
      routing: [],
      sla_hours: 24,
      mandatory_docs: [],
      reason: result.reason,
    };
  }

  // Parse approval chain from outputs
  const approvalLevels = result.outputs.approval_levels || result.outputs.approval_chain;
  const routing = parseApprovalChain(approvalLevels);

  return {
    routing,
    sla_hours: result.outputs.sla_hours || 24,
    mandatory_docs: (result.outputs.mandatory_docs || 'none').split(','),
    reason: result.reason,
  };
}

/**
 * Parse approval chain string into role array
 */
function parseApprovalChain(chain: string): string[] {
  const chainMap: Record<string, string[]> = {
    pm_only: ['PROJECT_MANAGER'],
    pm_commercial: ['PROJECT_MANAGER', 'COMMERCIAL_MANAGER'],
    pm_commercial_finance: ['PROJECT_MANAGER', 'COMMERCIAL_MANAGER', 'FINANCE_MANAGER'],
    pm_commercial_finance_cfo: ['PROJECT_MANAGER', 'COMMERCIAL_MANAGER', 'FINANCE_MANAGER', 'MANAGEMENT'],
    qs_commercial: ['QS_ENGINEER', 'COMMERCIAL_MANAGER'],
    qs_commercial_finance: ['QS_ENGINEER', 'COMMERCIAL_MANAGER', 'FINANCE_MANAGER'],
    qs_commercial_finance_cfo: ['QS_ENGINEER', 'COMMERCIAL_MANAGER', 'FINANCE_MANAGER', 'MANAGEMENT'],
  };

  return chainMap[chain] || [chain];
}

/**
 * Validate approver authority and SoD
 */
export function validateApprover(
  approverRoleId: string,
  documentType: string,
  amount: number,
  creatorId: string,
  approverId: string
): { valid: boolean; reason?: string } {
  // Check authority limit
  const authority = checkAuthority(approverRoleId, documentType, amount);
  if (!authority.authorized) {
    return { valid: false, reason: authority.reason };
  }

  // Check SoD (approver cannot be creator)
  if (creatorId === approverId) {
    return { valid: false, reason: 'Approver cannot be the document creator (SoD violation)' };
  }

  return { valid: true };
}
