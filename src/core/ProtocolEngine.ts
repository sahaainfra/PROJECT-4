// ═══════════════════════════════════════════════════════════
// PROTOCOL ENGINE SERVICE — Part 14
// Protocol & Control Engine
// ═══════════════════════════════════════════════════════════

import {
  ControlPoint,
  ControlPointMode,
  Evaluation,
  Exception,
  Violation,
  ControlCycle,
  controlPoints,
  controlPointModes,
  evaluations,
  exceptions,
  violations,
  controlCycles,
  getControlPointByCode,
  getActiveMode,
  getThresholdByKey,
  getEvaluationsByEntity,
  getControlCycleByEntity,
} from '../data/protocolData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// PROTOCOL CHECK API
// ═══════════════════════════════════════════════════════════

export interface ProtocolCheckInput {
  cp_code: string;
  actor_id: string;
  entity_type: string;
  entity_id: string;
  action: string;
  payload?: Record<string, any>;
  scope_type?: string;
  scope_id?: string;
}

export interface ProtocolCheckResult {
  evaluation_id: string;
  cp_code: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
  result: 'PASS' | 'WARN' | 'EXCEPTION_REQUIRED' | 'BLOCK';
  failures: Array<{
    check: string;
    message: string;
    threshold?: any;
    actual?: any;
  }>;
  exception_required?: boolean;
  guidance?: string;
  at: string;
  correlation_id: string;
}

/**
 * Main protocol check API - called from services inside transactions
 */
export function protocolCheck(input: ProtocolCheckInput): ProtocolCheckResult {
  const correlation = getCurrentCorrelation();
  const cp = getControlPointByCode(input.cp_code);
  
  if (!cp) {
    throw new Error(`Control point not found: ${input.cp_code}`);
  }

  // Get active mode for this control point
  const mode = getActiveMode(input.cp_code, input.scope_type, input.scope_id);
  const modeValue = mode?.mode || 'OFF';

  // If mode is OFF, skip evaluation
  if (modeValue === 'OFF') {
    return {
      evaluation_id: `eval-${Date.now()}`,
      cp_code: input.cp_code,
      mode: 'OFF',
      result: 'PASS',
      failures: [],
      at: new Date().toISOString(),
      correlation_id: correlation?.correlation_id || '',
    };
  }

  // Execute check based on check_type
  const failures = executeCheck(cp, input);
  
  // Determine result based on mode and failures
  let result: ProtocolCheckResult['result'];
  let exception_required = false;
  let guidance = '';

  if (failures.length === 0) {
    result = 'PASS';
  } else if (modeValue === 'OBSERVE') {
    result = 'WARN';
    guidance = 'Control point is in OBSERVE mode - violations are logged but not enforced';
  } else if (modeValue === 'WARN') {
    result = 'WARN';
    guidance = 'Warning: Control point violation detected';
  } else if (cp.enforcement === 'EXCEPTION') {
    result = 'EXCEPTION_REQUIRED';
    exception_required = true;
    guidance = 'Exception required to proceed';
  } else if (cp.enforcement === 'BLOCK') {
    result = 'BLOCK';
    guidance = 'Action blocked by control point';
  } else {
    result = 'WARN';
    guidance = 'Control point violation detected';
  }

  // Create evaluation record
  const evaluation: Evaluation = {
    evaluation_id: `eval-${Date.now()}`,
    cp_code: input.cp_code,
    mode: modeValue,
    actor_id: input.actor_id,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    action: input.action,
    result,
    failures_json: failures,
    at: new Date().toISOString(),
    correlation_id: correlation?.correlation_id || '',
  };

  evaluations.push(evaluation);

  // If BLOCK or EXCEPTION_REQUIRED in ENFORCE mode, create violation
  if ((result === 'BLOCK' || result === 'EXCEPTION_REQUIRED') && modeValue === 'ENFORCE') {
    const violation: Violation = {
      violation_id: `viol-${Date.now()}`,
      cp_code: input.cp_code,
      evaluation_id: evaluation.evaluation_id,
      severity: cp.enforcement === 'BLOCK' ? 'high' : 'medium',
      actor_id: input.actor_id,
      project_id: input.payload?.project_id,
      site_id: input.payload?.site_id,
      status: 'open',
    };
    violations.push(violation);

    // Publish event
    publishEvent({
      event_type: 'protocol.violation.raised',
      company_id: 'company-001',
      project_id: input.payload?.project_id,
      actor_id: input.actor_id,
      payload: {
        violation_id: violation.violation_id,
        cp_code: input.cp_code,
        severity: violation.severity,
      },
    });
  }

  // Audit log
  writeAuditEntry({
    userId: input.actor_id,
    userName: 'Protocol Check',
    userEmail: '',
    action: 'VIEW',
    entityType: 'ProtocolEvaluation',
    entityId: evaluation.evaluation_id,
    entityName: `Protocol check: ${input.cp_code}`,
    after: evaluation,
    correlationId: correlation?.correlation_id || '',
  });

  return {
    evaluation_id: evaluation.evaluation_id,
    cp_code: input.cp_code,
    mode: modeValue,
    result,
    failures,
    exception_required,
    guidance,
    at: evaluation.at,
    correlation_id: evaluation.correlation_id,
  };
}

/**
 * Execute check based on check_type
 */
function executeCheck(cp: ControlPoint, input: ProtocolCheckInput): Array<{ check: string; message: string; threshold?: any; actual?: any }> {
  const failures: Array<{ check: string; message: string; threshold?: any; actual?: any }> = [];

  switch (cp.check_type) {
    case 'PLAN_EXISTS':
      if (!input.payload?.project_allocation) {
        failures.push({
          check: 'PLAN_EXISTS',
          message: 'Project allocation required',
        });
      }
      break;

    case 'THRESHOLD':
      if (cp.threshold_key && input.payload) {
        const threshold = getThresholdByKey(cp.threshold_key, input.scope_type, input.scope_id);
        if (threshold && input.payload.amount > threshold.value) {
          failures.push({
            check: 'THRESHOLD',
            message: `Amount exceeds threshold: ${input.payload.amount} > ${threshold.value} ${threshold.unit}`,
            threshold: threshold.value,
            actual: input.payload.amount,
          });
        }
      }
      break;

    case 'STOCK_AVAILABLE':
      if (input.payload?.required_qty && input.payload?.available_qty) {
        if (input.payload.required_qty > input.payload.available_qty) {
          failures.push({
            check: 'STOCK_AVAILABLE',
            message: `Insufficient stock: required ${input.payload.required_qty}, available ${input.payload.available_qty}`,
            threshold: input.payload.available_qty,
            actual: input.payload.required_qty,
          });
        }
      }
      break;

    case 'CERTIFICATION_VALID':
      if (!input.payload?.certification_valid) {
        failures.push({
          check: 'CERTIFICATION_VALID',
          message: 'Valid certification required',
        });
      }
      break;

    case 'MAKER_CHECKER':
      if (cp.config_json?.requires_dual_approval && !input.payload?.dual_approval) {
        failures.push({
          check: 'MAKER_CHECKER',
          message: 'Dual approval required',
        });
      }
      break;

    case 'OBSERVE_DURATION':
      if (cp.threshold_key && input.payload) {
        const threshold = getThresholdByKey(cp.threshold_key);
        if (threshold && input.payload.observe_days < threshold.value) {
          failures.push({
            check: 'OBSERVE_DURATION',
            message: `Insufficient observe duration: ${input.payload.observe_days} < ${threshold.value} days`,
            threshold: threshold.value,
            actual: input.payload.observe_days,
          });
        }
      }
      break;

    case 'TIME_WINDOW':
      if (input.payload?.expires_at) {
        const expiresAt = new Date(input.payload.expires_at);
        const now = new Date();
        const hoursUntilExpiry = (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60);
        const warningHours = cp.config_json?.warning_hours_before || 4;
        
        if (hoursUntilExpiry < warningHours) {
          failures.push({
            check: 'TIME_WINDOW',
            message: `Exception expires in ${hoursUntilExpiry.toFixed(1)} hours`,
            threshold: warningHours,
            actual: hoursUntilExpiry,
          });
        }
      }
      break;

    case 'DOCUMENT_REQUIRED':
      if (cp.config_json?.required_fields) {
        for (const field of cp.config_json.required_fields) {
          if (!input.payload?.[field]) {
            failures.push({
              check: 'DOCUMENT_REQUIRED',
              message: `Required field missing: ${field}`,
            });
          }
        }
      }
      break;

    case 'CUSTOM':
      // Custom checks would be implemented here
      break;
  }

  return failures;
}

// ═══════════════════════════════════════════════════════════
// GATE STATUS API
// ═══════════════════════════════════════════════════════════

export interface GateStatusInput {
  entity_type: string;
  action: string;
  payload?: Record<string, any>;
  scope_type?: string;
  scope_id?: string;
}

export interface GateStatusResult {
  checks: Array<{
    cp_code: string;
    description: string;
    stage: string;
    mode: string;
    status: 'PASS' | 'WARN' | 'BLOCK' | 'EXCEPTION_REQUIRED';
    guidance?: string;
  }>;
  overall_status: 'PASS' | 'WARN' | 'BLOCK';
}

/**
 * Gate status API - shows what will block an action before it's attempted
 */
export function getGateStatus(input: GateStatusInput): GateStatusResult {
  // Find all control points for this entity type and action
  const relevantCPs = controlPoints.filter(cp => {
    // Match by trigger pattern
    const triggerParts = cp.trigger.split('.');
    const entityType = triggerParts[0];
    const action = triggerParts[triggerParts.length - 1];
    
    return entityType === input.entity_type.toLowerCase() && action === input.action;
  });

  const checks = relevantCPs.map(cp => {
    const mode = getActiveMode(cp.cp_code, input.scope_type, input.scope_id);
    const modeValue = mode?.mode || 'OFF';

    // Simulate check
    const failures = executeCheck(cp, {
      cp_code: cp.cp_code,
      actor_id: 'preview',
      entity_type: input.entity_type,
      entity_id: 'preview',
      action: input.action,
      payload: input.payload,
      scope_type: input.scope_type,
      scope_id: input.scope_id,
    });

    let status: GateStatusResult['checks'][0]['status'];
    let guidance = '';

    if (failures.length === 0) {
      status = 'PASS';
    } else if (modeValue === 'OBSERVE') {
      status = 'WARN';
      guidance = 'OBSERVE mode - violations logged but not enforced';
    } else if (modeValue === 'WARN') {
      status = 'WARN';
      guidance = failures[0]?.message || 'Warning detected';
    } else if (cp.enforcement === 'EXCEPTION') {
      status = 'EXCEPTION_REQUIRED';
      guidance = 'Exception required to proceed';
    } else if (cp.enforcement === 'BLOCK') {
      status = 'BLOCK';
      guidance = failures[0]?.message || 'Action blocked';
    } else {
      status = 'WARN';
      guidance = failures[0]?.message || 'Check warning';
    }

    return {
      cp_code: cp.cp_code,
      description: cp.description,
      stage: cp.stage,
      mode: modeValue,
      status,
      guidance,
    };
  });

  // Determine overall status
  let overall_status: GateStatusResult['overall_status'] = 'PASS';
  if (checks.some(c => c.status === 'BLOCK')) {
    overall_status = 'BLOCK';
  } else if (checks.some(c => c.status === 'WARN' || c.status === 'EXCEPTION_REQUIRED')) {
    overall_status = 'WARN';
  }

  return {
    checks,
    overall_status,
  };
}

// ═══════════════════════════════════════════════════════════
// EXCEPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface RequestExceptionInput {
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
  is_emergency: boolean;
  regularise_by?: string;
}

/**
 * Request an exception for a control point violation
 */
export function requestException(input: RequestExceptionInput): Exception {
  const correlation = getCurrentCorrelation();

  const exception: Exception = {
    exception_no: `EXC-${Date.now()}`,
    type: input.type,
    cp_code: input.cp_code,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    project_id: input.project_id,
    site_id: input.site_id,
    requested_by: input.requested_by,
    deviation_value: input.deviation_value,
    deviation_unit: input.deviation_unit,
    cost_impact: input.cost_impact,
    time_impact_days: input.time_impact_days,
    reason_code: input.reason_code,
    narrative: input.narrative,
    evidence_doc_ids: input.evidence_doc_ids,
    validity_type: input.validity_type,
    cap_value: input.cap_value,
    consumed_value: 0,
    is_emergency: input.is_emergency,
    regularise_by: input.regularise_by,
    status: input.is_emergency ? 'EXECUTED_PENDING_REGULARISATION' : 'SUBMITTED',
  };

  exceptions.push(exception);

  // Create workflow instance for approval (if not emergency)
  if (!input.is_emergency) {
    // Would create workflow instance here
    exception.workflow_instance_id = `wf-inst-${Date.now()}`;
  }

  // Publish event
  publishEvent({
    event_type: 'protocol.exception.requested',
    company_id: 'company-001',
    project_id: input.project_id,
    actor_id: input.requested_by,
    payload: {
      exception_no: exception.exception_no,
      type: exception.type,
      cp_code: exception.cp_code,
      is_emergency: exception.is_emergency,
    },
  });

  // Audit log
  writeAuditEntry({
    userId: input.requested_by,
    userName: 'Exception Request',
    userEmail: '',
    action: 'CREATE',
    entityType: 'ProtocolException',
    entityId: exception.exception_no,
    entityName: `Exception: ${exception.exception_no}`,
    after: exception,
    correlationId: correlation?.correlation_id || '',
  });

  return exception;
}

/**
 * Consume exception (use it for a transaction)
 */
export function consumeException(exceptionNo: string, consumedValue: number): Exception {
  const exception = exceptions.find(e => e.exception_no === exceptionNo);
  
  if (!exception) {
    throw new Error(`Exception not found: ${exceptionNo}`);
  }

  if (exception.status !== 'APPROVED') {
    throw new Error(`Exception not approved: ${exception.status}`);
  }

  // Check cap
  const newConsumed = exception.consumed_value + consumedValue;
  if (newConsumed > exception.cap_value) {
    throw new Error(`Consumption exceeds cap: ${newConsumed} > ${exception.cap_value}`);
  }

  exception.consumed_value = newConsumed;

  // If cap reached, mark as consumed
  if (newConsumed === exception.cap_value) {
    exception.status = 'CONSUMED';
  }

  // Publish event
  publishEvent({
    event_type: 'protocol.exception.consumed',
    company_id: 'company-001',
    project_id: exception.project_id,
    actor_id: exception.requested_by,
    payload: {
      exception_no: exception.exception_no,
      consumed_value: consumedValue,
      total_consumed: exception.consumed_value,
      cap_value: exception.cap_value,
    },
  });

  return exception;
}

/**
 * Regularise emergency exception
 */
export function regulariseException(exceptionNo: string, regularised_by: string): Exception {
  const exception = exceptions.find(e => e.exception_no === exceptionNo);
  
  if (!exception) {
    throw new Error(`Exception not found: ${exceptionNo}`);
  }

  if (exception.status !== 'EXECUTED_PENDING_REGULARISATION') {
    throw new Error(`Exception not pending regularisation: ${exception.status}`);
  }

  exception.status = 'REGULARISED';

  // Publish event
  publishEvent({
    event_type: 'protocol.emergency.regularised',
    company_id: 'company-001',
    project_id: exception.project_id,
    actor_id: regularised_by,
    payload: {
      exception_no: exception.exception_no,
    },
  });

  // Audit log
  writeAuditEntry({
    userId: regularised_by,
    userName: 'Exception Regularisation',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ProtocolException',
    entityId: exception.exception_no,
    entityName: `Regularised: ${exception.exception_no}`,
    before: { status: 'EXECUTED_PENDING_REGULARISATION' },
    after: { status: 'REGULARISED' },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  return exception;
}

// ═══════════════════════════════════════════════════════════
// CONTROL CYCLE TRACKING
// ═══════════════════════════════════════════════════════════

export interface UpdateCycleInput {
  activity_type: string;
  root_entity_type: string;
  root_entity_id: string;
  project_id?: string;
  site_id?: string;
  responsible_id: string;
  stage: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  entity_ref?: string;
}

/**
 * Update control cycle stage
 */
export function updateControlCycle(input: UpdateCycleInput): ControlCycle {
  const correlation = getCurrentCorrelation();

  // Find or create cycle
  let cycle = getControlCycleByEntity(input.root_entity_type, input.root_entity_id);

  if (!cycle) {
    cycle = {
      cycle_id: `cycle-${Date.now()}`,
      activity_type: input.activity_type,
      root_entity_type: input.root_entity_type,
      root_entity_id: input.root_entity_id,
      project_id: input.project_id,
      site_id: input.site_id,
      responsible_id: input.responsible_id,
      stage_status_json: {
        PLAN: { status: 'pending' },
        AUTHORIZE: { status: 'pending' },
        EXECUTE: { status: 'pending' },
        RECORD: { status: 'pending' },
        VERIFY: { status: 'pending' },
        APPROVE: { status: 'pending' },
        MONITOR: { status: 'pending' },
        RECONCILE: { status: 'pending' },
        CLOSE: { status: 'pending' },
      },
      current_stage: input.stage,
      is_closed: false,
    };
    controlCycles.push(cycle);
  }

  // Update stage
  if (cycle.stage_status_json[input.stage]) {
    cycle.stage_status_json[input.stage] = {
      status: input.status,
      entity_ref: input.entity_ref,
      at: new Date().toISOString(),
      by: input.responsible_id,
    };
  }

  cycle.current_stage = input.stage;

  // Check if closed
  const allStages = Object.values(cycle.stage_status_json);
  cycle.is_closed = allStages.every(s => s.status === 'completed' || s.status === 'skipped');

  // Publish event
  publishEvent({
    event_type: 'protocol.cycle.stage_changed',
    company_id: 'company-001',
    project_id: input.project_id,
    actor_id: input.responsible_id,
    payload: {
      cycle_id: cycle.cycle_id,
      stage: input.stage,
      status: input.status,
    },
  });

  // Audit log
  writeAuditEntry({
    userId: input.responsible_id,
    userName: 'Cycle Update',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ControlCycle',
    entityId: cycle.cycle_id,
    entityName: `Cycle: ${input.root_entity_type} ${input.root_entity_id}`,
    after: { stage: input.stage, status: input.status },
    correlationId: correlation?.correlation_id || '',
  });

  return cycle;
}

// ═══════════════════════════════════════════════════════════
// VIOLATION MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface ResolveViolationInput {
  violation_id: string;
  resolved_by: string;
  resolution_note: string;
  evidence_doc_ids: string[];
}

/**
 * Resolve a violation
 */
export function resolveViolation(input: ResolveViolationInput): Violation {
  const correlation = getCurrentCorrelation();

  const violation = violations.find(v => v.violation_id === input.violation_id);
  
  if (!violation) {
    throw new Error(`Violation not found: ${input.violation_id}`);
  }

  // Check required evidence (CP-PRT-04)
  const cp = getControlPointByCode(violation.cp_code);
  if (cp?.check_type === 'DOCUMENT_REQUIRED') {
    if (!input.resolution_note || input.evidence_doc_ids.length === 0) {
      throw new Error('Resolution note and evidence required to close violation');
    }
  }

  violation.status = 'resolved';
  violation.resolved_by = input.resolved_by;
  violation.resolution_note = input.resolution_note;

  // Publish event
  publishEvent({
    event_type: 'protocol.violation.resolved',
    company_id: 'company-001',
    project_id: violation.project_id,
    actor_id: input.resolved_by,
    payload: {
      violation_id: violation.violation_id,
      cp_code: violation.cp_code,
    },
  });

  // Audit log
  writeAuditEntry({
    userId: input.resolved_by,
    userName: 'Violation Resolution',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ProtocolViolation',
    entityId: violation.violation_id,
    entityName: `Resolved: ${violation.violation_id}`,
    before: { status: violation.status },
    after: { status: 'resolved', resolution_note: input.resolution_note },
    correlationId: correlation?.correlation_id || '',
  });

  return violation;
}

// ═══════════════════════════════════════════════════════════
// MODE MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface ChangeModeInput {
  cp_code: string;
  scope_type: 'company' | 'project' | 'module';
  scope_id?: string;
  mode: 'OFF' | 'OBSERVE' | 'WARN' | 'ENFORCE';
  approved_by: string;
}

/**
 * Change control point mode (requires approval for ENFORCE)
 */
export function changeControlPointMode(input: ChangeModeInput): ControlPointMode {
  const correlation = getCurrentCorrelation();

  // CP-PRT-02: Check if switching to ENFORCE requires OBSERVE duration
  if (input.mode === 'ENFORCE') {
    const currentMode = getActiveMode(input.cp_code, input.scope_type, input.scope_id);
    if (currentMode && currentMode.mode === 'OBSERVE') {
      const observeStart = new Date(currentMode.effective_from);
      const now = new Date();
      const observeDays = (now.getTime() - observeStart.getTime()) / (1000 * 60 * 60 * 24);
      
      const threshold = getThresholdByKey('OBSERVE_DURATION_THRESHOLD');
      if (threshold && observeDays < threshold.value) {
        throw new Error(`Cannot switch to ENFORCE: requires ${threshold.value} days of OBSERVE, only ${observeDays.toFixed(1)} days completed`);
      }
    }
  }

  // Deactivate existing mode
  const existingMode = controlPointModes.find(
    m => m.cp_code === input.cp_code && 
         m.scope_type === input.scope_type && 
         m.scope_id === input.scope_id
  );

  if (existingMode) {
    existingMode.mode = 'OFF';
    existingMode.effective_from = new Date().toISOString();
  }

  // Create new mode
  const newMode: ControlPointMode = {
    id: `mode-${Date.now()}`,
    cp_code: input.cp_code,
    scope_type: input.scope_type,
    scope_id: input.scope_id,
    mode: input.mode,
    effective_from: new Date().toISOString(),
    approved_by: input.approved_by,
  };

  controlPointModes.push(newMode);

  // Publish event
  publishEvent({
    event_type: 'protocol.mode.changed',
    company_id: 'company-001',
    actor_id: input.approved_by,
    payload: {
      cp_code: input.cp_code,
      mode: input.mode,
      scope_type: input.scope_type,
      scope_id: input.scope_id,
    },
  });

  // Audit log (CP-PRT-01: maker-checker)
  writeAuditEntry({
    userId: input.approved_by,
    userName: 'Mode Change',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ControlPointMode',
    entityId: newMode.id,
    entityName: `Mode change: ${input.cp_code} → ${input.mode}`,
    before: existingMode ? { mode: existingMode.mode } : undefined,
    after: { mode: input.mode },
    correlationId: correlation?.correlation_id || '',
  });

  return newMode;
}

// ═══════════════════════════════════════════════════════════
// OBSERVE IMPACT REPORT
// ═══════════════════════════════════════════════════════════

export interface ObserveReportInput {
  module?: string;
  from_date: string;
  to_date: string;
}

export interface ObserveReportResult {
  total_evaluations: number;
  blocked_actions: number;
  warnings: number;
  exceptions_required: number;
  by_module: Record<string, {
    evaluations: number;
    blocked: number;
    warnings: number;
    exceptions: number;
  }>;
  by_cp: Record<string, {
    description: string;
    evaluations: number;
    blocked: number;
    warnings: number;
    exceptions: number;
  }>;
}

/**
 * Generate OBSERVE impact report
 */
export function generateObserveReport(input: ObserveReportInput): ObserveReportResult {
  const fromDate = new Date(input.from_date);
  const toDate = new Date(input.to_date);

  const relevantEvaluations = evaluations.filter(e => {
    const evalDate = new Date(e.at);
    return evalDate >= fromDate && evalDate <= toDate;
  });

  const report: ObserveReportResult = {
    total_evaluations: relevantEvaluations.length,
    blocked_actions: 0,
    warnings: 0,
    exceptions_required: 0,
    by_module: {},
    by_cp: {},
  };

  for (const eval_ of relevantEvaluations) {
    const cp = getControlPointByCode(eval_.cp_code);
    if (!cp) continue;

    // Filter by module if specified
    if (input.module && cp.module !== input.module) continue;

    // Count by result
    if (eval_.result === 'BLOCK') {
      report.blocked_actions++;
    } else if (eval_.result === 'WARN') {
      report.warnings++;
    } else if (eval_.result === 'EXCEPTION_REQUIRED') {
      report.exceptions_required++;
    }

    // Count by module
    if (!report.by_module[cp.module]) {
      report.by_module[cp.module] = {
        evaluations: 0,
        blocked: 0,
        warnings: 0,
        exceptions: 0,
      };
    }
    report.by_module[cp.module].evaluations++;
    if (eval_.result === 'BLOCK') report.by_module[cp.module].blocked++;
    if (eval_.result === 'WARN') report.by_module[cp.module].warnings++;
    if (eval_.result === 'EXCEPTION_REQUIRED') report.by_module[cp.module].exceptions++;

    // Count by CP
    if (!report.by_cp[eval_.cp_code]) {
      report.by_cp[eval_.cp_code] = {
        description: cp.description,
        evaluations: 0,
        blocked: 0,
        warnings: 0,
        exceptions: 0,
      };
    }
    report.by_cp[eval_.cp_code].evaluations++;
    if (eval_.result === 'BLOCK') report.by_cp[eval_.cp_code].blocked++;
    if (eval_.result === 'WARN') report.by_cp[eval_.cp_code].warnings++;
    if (eval_.result === 'EXCEPTION_REQUIRED') report.by_cp[eval_.cp_code].exceptions++;
  }

  return report;
}
