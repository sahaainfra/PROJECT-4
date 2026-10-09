// ═══════════════════════════════════════════════════════════
// ACCOUNTABILITY SERVICE — Part 15
// Accountability, Responsibility Assignment & Action Ledger
// ═══════════════════════════════════════════════════════════

import {
  ActionLedgerEntry,
  RaciAssignment,
  ComplianceScore,
  ResponsibilityItem,
  actionLedger,
  raciAssignments,
  complianceScores,
  responsibilityItems,
  getRaciByProcess,
  getProcessByCode,
  getComplianceScoreBySubject,
  getResponsibilityItemsByUser,
  getOverdueItemsByUser,
} from '../data/accountabilityData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';
import { protocolCheck } from './ProtocolEngine';

// ═══════════════════════════════════════════════════════════
// ACTION LEDGER WRITER
// ═══════════════════════════════════════════════════════════

export interface ActionLedgerInput {
  entity_type: string;
  entity_id: string;
  doc_no: string;
  project_id?: string;
  site_id?: string;
  department_id?: string;
  action: ActionLedgerEntry['action'];
  actor_id: string;
  actor_role: string;
  on_behalf_of?: string;
  device_id?: string;
  lat?: number;
  lng?: number;
  reason_code?: string;
  narrative?: string;
  audit_id?: string;
  workflow_task_id?: string;
  protocol_evaluation_id?: string;
}

/**
 * Write an entry to the action ledger (append-only)
 */
export function writeActionLedger(input: ActionLedgerInput): ActionLedgerEntry {
  const correlation = getCurrentCorrelation();

  const entry: ActionLedgerEntry = {
    ledger_id: `ledger-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    doc_no: input.doc_no,
    project_id: input.project_id,
    site_id: input.site_id,
    department_id: input.department_id,
    action: input.action,
    actor_id: input.actor_id,
    actor_role: input.actor_role,
    on_behalf_of: input.on_behalf_of,
    at: new Date().toISOString(),
    device_id: input.device_id,
    lat: input.lat,
    lng: input.lng,
    reason_code: input.reason_code,
    narrative: input.narrative,
    audit_id: input.audit_id,
    workflow_task_id: input.workflow_task_id,
    protocol_evaluation_id: input.protocol_evaluation_id,
  };

  // Append to ledger (INSERT-only)
  actionLedger.push(entry);

  // Audit log
  writeAuditEntry({
    userId: input.actor_id,
    userName: 'Action Ledger',
    userEmail: '',
    action: input.action as any,
    entityType: 'ActionLedger',
    entityId: entry.ledger_id,
    entityName: `${input.action} on ${input.entity_type} ${input.entity_id}`,
    after: entry,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'acc.action.recorded',
    company_id: 'company-001',
    project_id: input.project_id,
    actor_id: input.actor_id,
    payload: {
      ledger_id: entry.ledger_id,
      entity_type: input.entity_type,
      entity_id: input.entity_id,
      action: input.action,
    },
  });

  return entry;
}

// ═══════════════════════════════════════════════════════════
// RACI MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface RaciAssignmentInput {
  scope_type: RaciAssignment['scope_type'];
  scope_id: string;
  process_code: string;
  responsible_user_id: string;
  accountable_user_id: string;
  consulted_user_ids?: string[];
  informed_user_ids?: string[];
  from: string;
  to?: string;
  assigned_by: string;
}

/**
 * Create a RACI assignment
 */
export function createRaciAssignment(input: RaciAssignmentInput): RaciAssignment {
  const correlation = getCurrentCorrelation();

  // Validate process exists
  const process = getProcessByCode(input.process_code);
  if (!process) {
    throw new Error(`Process not found: ${input.process_code}`);
  }

  // Validate process requires RACI
  if (!process.requires_raci) {
    throw new Error(`Process ${input.process_code} does not require RACI assignment`);
  }

  // Check for independent accountability requirement
  if (process.requires_independent_accountability && 
      input.responsible_user_id === input.accountable_user_id) {
    throw new Error(`Process ${input.process_code} requires independent accountability (Responsible ≠ Accountable)`);
  }

  const assignment: RaciAssignment = {
    id: `raci-${Date.now()}`,
    scope_type: input.scope_type,
    scope_id: input.scope_id,
    process_code: input.process_code,
    responsible_user_id: input.responsible_user_id,
    accountable_user_id: input.accountable_user_id,
    consulted_json: input.consulted_user_ids || [],
    informed_json: input.informed_user_ids || [],
    from: input.from,
    to: input.to,
    assigned_by: input.assigned_by,
    assigned_at: new Date().toISOString(),
    status: 'DRAFT',
  };

  raciAssignments.push(assignment);

  // Audit log
  writeAuditEntry({
    userId: input.assigned_by,
    userName: 'RACI Assignment',
    userEmail: '',
    action: 'CREATE',
    entityType: 'RaciAssignment',
    entityId: assignment.id,
    entityName: `RACI for ${input.process_code}`,
    after: assignment,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'acc.raci.changed',
    company_id: 'company-001',
    project_id: input.scope_type === 'project' ? input.scope_id : undefined,
    actor_id: input.assigned_by,
    payload: {
      raci_id: assignment.id,
      process_code: input.process_code,
      scope_type: input.scope_type,
      scope_id: input.scope_id,
    },
  });

  return assignment;
}

/**
 * Approve and activate a RACI assignment (CP-ACC-02)
 */
export function approveRaciAssignment(raciId: string, approvedBy: string): RaciAssignment {
  const correlation = getCurrentCorrelation();

  const assignment = raciAssignments.find(r => r.id === raciId);
  if (!assignment) {
    throw new Error(`RACI assignment not found: ${raciId}`);
  }

  if (assignment.status !== 'DRAFT') {
    throw new Error(`RACI assignment is not in DRAFT status: ${assignment.status}`);
  }

  assignment.status = 'EFFECTIVE';

  // Audit log
  writeAuditEntry({
    userId: approvedBy,
    userName: 'RACI Approval',
    userEmail: '',
    action: 'APPROVE',
    entityType: 'RaciAssignment',
    entityId: assignment.id,
    entityName: `Approved RACI for ${assignment.process_code}`,
    before: { status: 'DRAFT' },
    after: { status: 'EFFECTIVE' },
    correlationId: correlation?.correlation_id || '',
  });

  return assignment;
}

/**
 * Check if RACI is assigned for a process (CP-ACC-01)
 */
export function checkRaciAssignment(
  scopeType: string,
  scopeId: string,
  processCode: string
): { assigned: boolean; raci?: RaciAssignment } {
  const raci = getRaciByProcess(scopeType, scopeId, processCode);
  
  return {
    assigned: !!raci,
    raci,
  };
}

// ═══════════════════════════════════════════════════════════
// COMPLIANCE SCORE ENGINE
// ═══════════════════════════════════════════════════════════

export interface ScoreComponents {
  on_time_completion: number;
  protocol_compliance: number;
  documentation_quality: number;
  exception_rate: number;
  violation_count: number;
}

/**
 * Calculate compliance score for a subject
 */
export function calculateComplianceScore(
  subjectType: ComplianceScore['subject_type'],
  subjectId: string,
  period: string
): ComplianceScore {
  const correlation = getCurrentCorrelation();

  // In production, this would query actual data
  // For now, generate sample components
  const components: ScoreComponents = {
    on_time_completion: Math.floor(Math.random() * 20) + 80, // 80-100
    protocol_compliance: Math.floor(Math.random() * 20) + 75, // 75-95
    documentation_quality: Math.floor(Math.random() * 20) + 80, // 80-100
    exception_rate: Math.floor(Math.random() * 20) + 75, // 75-95
    violation_count: Math.floor(Math.random() * 20) + 80, // 80-100
  };

  // Calculate overall score (weighted average)
  const score = Math.round(
    components.on_time_completion * 0.25 +
    components.protocol_compliance * 0.25 +
    components.documentation_quality * 0.20 +
    components.exception_rate * 0.15 +
    components.violation_count * 0.15
  );

  const complianceScore: ComplianceScore = {
    id: `score-${Date.now()}`,
    subject_type: subjectType,
    subject_id: subjectId,
    period,
    score,
    components_json: components,
    calculated_at: new Date().toISOString(),
  };

  complianceScores.push(complianceScore);

  // Audit log
  writeAuditEntry({
    userId: 'system',
    userName: 'Compliance Score Engine',
    userEmail: '',
    action: 'CREATE',
    entityType: 'ComplianceScore',
    entityId: complianceScore.id,
    entityName: `Score for ${subjectType} ${subjectId}`,
    after: complianceScore,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'acc.score.updated',
    company_id: 'company-001',
    actor_id: 'system',
    payload: {
      score_id: complianceScore.id,
      subject_type: subjectType,
      subject_id: subjectId,
      score,
    },
  });

  return complianceScore;
}

/**
 * Submit appeal for compliance score
 */
export function appealComplianceScore(
  scoreId: string,
  userId: string,
  appealNote: string
): ComplianceScore {
  const correlation = getCurrentCorrelation();

  const score = complianceScores.find(s => s.id === scoreId);
  if (!score) {
    throw new Error(`Compliance score not found: ${scoreId}`);
  }

  score.appeal_note = appealNote;
  score.appeal_status = 'SUBMITTED';

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'Score Appeal',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ComplianceScore',
    entityId: score.id,
    entityName: `Appeal for score ${score.score}`,
    before: { appeal_status: undefined },
    after: { appeal_status: 'SUBMITTED', appeal_note: appealNote },
    correlationId: correlation?.correlation_id || '',
  });

  return score;
}

/**
 * Review compliance score appeal
 */
export function reviewComplianceAppeal(
  scoreId: string,
  reviewerId: string,
  decision: 'ACCEPTED' | 'REJECTED'
): ComplianceScore {
  const correlation = getCurrentCorrelation();

  const score = complianceScores.find(s => s.id === scoreId);
  if (!score) {
    throw new Error(`Compliance score not found: ${scoreId}`);
  }

  if (score.appeal_status !== 'SUBMITTED') {
    throw new Error(`Appeal is not in SUBMITTED status: ${score.appeal_status}`);
  }

  score.appeal_status = decision;
  score.appeal_reviewed_by = reviewerId;
  score.appeal_reviewed_at = new Date().toISOString();

  // Audit log
  writeAuditEntry({
    userId: reviewerId,
    userName: 'Appeal Review',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ComplianceScore',
    entityId: score.id,
    entityName: `Appeal ${decision}`,
    before: { appeal_status: 'SUBMITTED' },
    after: { appeal_status: decision },
    correlationId: correlation?.correlation_id || '',
  });

  return score;
}

// ═══════════════════════════════════════════════════════════
// RESPONSIBILITY TRACKING
// ═══════════════════════════════════════════════════════════

/**
 * Get user's responsibilities
 */
export function getUserResponsibilities(userId: string): ResponsibilityItem[] {
  return getResponsibilityItemsByUser(userId);
}

/**
 * Get user's overdue items
 */
export function getUserOverdueItems(userId: string): ResponsibilityItem[] {
  return getOverdueItemsByUser(userId);
}

/**
 * Check for overdue responsibilities (CP-ACC-04)
 */
export function checkOverdueResponsibilities(userId: string): {
  hasOverdue: boolean;
  overdueCount: number;
  items: ResponsibilityItem[];
} {
  const overdueItems = getOverdueItemsByUser(userId);
  
  if (overdueItems.length > 0) {
    // Publish event
    publishEvent({
      event_type: 'acc.responsibility.overdue',
      company_id: 'company-001',
      actor_id: userId,
      payload: {
        user_id: userId,
        overdue_count: overdueItems.length,
        items: overdueItems.map(i => i.id),
      },
    });
  }

  return {
    hasOverdue: overdueItems.length > 0,
    overdueCount: overdueItems.length,
    items: overdueItems,
  };
}

// ═══════════════════════════════════════════════════════════
// PROTOCOL INTEGRATION
// ═══════════════════════════════════════════════════════════

/**
 * Check RACI before execution (CP-ACC-01)
 */
export function checkRaciBeforeExecution(
  scopeType: string,
  scopeId: string,
  processCode: string,
  actorId: string
): { allowed: boolean; reason?: string } {
  const raciCheck = checkRaciAssignment(scopeType, scopeId, processCode);

  if (!raciCheck.assigned) {
    // Call protocol check
    const protocolResult = protocolCheck({
      cp_code: 'CP-ACC-01',
      actor_id: actorId,
      entity_type: 'Process',
      entity_id: processCode,
      action: 'execute',
      payload: {
        scope_type: scopeType,
        scope_id: scopeId,
        process_code: processCode,
        raci_assigned: false,
      },
      scope_type: scopeType,
      scope_id: scopeId,
    });

    return {
      allowed: protocolResult.result !== 'BLOCK',
      reason: protocolResult.guidance || 'RACI not assigned for this process',
    };
  }

  return { allowed: true };
}

// ═══════════════════════════════════════════════════════════
// HANDOVER MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Check if user has open responsibilities (CP-ACC-03)
 */
export function checkOpenResponsibilities(userId: string): {
  hasOpen: boolean;
  openCount: number;
  items: ResponsibilityItem[];
} {
  const responsibilities = getResponsibilityItemsByUser(userId);
  const openItems = responsibilities.filter(r => r.status !== 'completed');

  return {
    hasOpen: openItems.length > 0,
    openCount: openItems.length,
    items: openItems,
  };
}

/**
 * Reassign responsibilities during handover
 */
export function reassignResponsibilities(
  fromUserId: string,
  toUserId: string,
  itemIds: string[]
): void {
  const correlation = getCurrentCorrelation();

  for (const itemId of itemIds) {
    const item = responsibilityItems.find(r => r.id === itemId);
    if (item && item.user_id === fromUserId) {
      item.user_id = toUserId;

      // Audit log
      writeAuditEntry({
        userId: fromUserId,
        userName: 'Handover',
        userEmail: '',
        action: 'UPDATE',
        entityType: 'ResponsibilityItem',
        entityId: item.id,
        entityName: `Reassigned ${item.description}`,
        before: { user_id: fromUserId },
        after: { user_id: toUserId },
        correlationId: correlation?.correlation_id || '',
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════
// REPORTING
// ═══════════════════════════════════════════════════════════

export interface AccountabilityReport {
  user_id: string;
  user_name: string;
  total_actions: number;
  approvals_given: number;
  exceptions_requested: number;
  exceptions_approved: number;
  violations_count: number;
  compliance_score: number;
  overdue_items: number;
  period: string;
}

/**
 * Generate accountability report for a user
 */
export function generateAccountabilityReport(
  userId: string,
  period: string
): AccountabilityReport {
  const userActions = actionLedger.filter(e => e.actor_id === userId);
  const userResponsibilities = getResponsibilityItemsByUser(userId);
  const userScore = getComplianceScoreBySubject('user', userId, period);

  return {
    user_id: userId,
    user_name: 'User Name', // Would be resolved from user service
    total_actions: userActions.length,
    approvals_given: userActions.filter(a => a.action === 'APPROVED').length,
    exceptions_requested: userActions.filter(a => a.action === 'EXCEPTION_REQUESTED').length,
    exceptions_approved: userActions.filter(a => a.action === 'EXCEPTION_APPROVED').length,
    violations_count: userResponsibilities.filter(r => r.item_type === 'violation').length,
    compliance_score: userScore?.score || 0,
    overdue_items: getOverdueItemsByUser(userId).length,
    period,
  };
}

/**
 * Generate RACI gap report
 */
export function generateRaciGapReport(scopeType: string, scopeId: string): {
  process_code: string;
  description: string;
  has_raci: boolean;
  responsible?: string;
  accountable?: string;
}[] {
  const gaps: any[] = [];

  // In production, this would check all processes for the scope
  // For now, return sample gaps
  const processes = ['PO_APPROVAL', 'MATERIAL_ISSUE', 'BILL_CERTIFICATION', 'DPR_SUBMISSION'];

  for (const processCode of processes) {
    const raci = getRaciByProcess(scopeType, scopeId, processCode);
    const process = getProcessByCode(processCode);

    gaps.push({
      process_code: processCode,
      description: process?.description || processCode,
      has_raci: !!raci,
      responsible: raci?.responsible_user_id,
      accountable: raci?.accountable_user_id,
    });
  }

  return gaps;
}
