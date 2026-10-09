// ═══════════════════════════════════════════════════════════
// SOD ENGINE SERVICE — Part 09
// Segregation of Duties Rule Engine
// ═══════════════════════════════════════════════════════════

import {
  sodRules,
  sodViolations,
  sodExceptions,
  type SoDRule,
  type SoDViolation,
  type SoDException,
} from '../data/identitySodData';
import { getUserPermissionKeys } from './PermissionEngine';

// ═══════════════════════════════════════════════════════════
// SOD CHECK RESULT
// ═══════════════════════════════════════════════════════════

export interface SoDCheckResult {
  allowed: boolean;
  rule?: SoDRule;
  reason?: string;
  violationId?: string;
  exceptionAvailable?: boolean;
  exceptionId?: string;
}

// ═══════════════════════════════════════════════════════════
// PREVENTIVE SOD CHECK
// ═══════════════════════════════════════════════════════════

/**
 * Check if a user can perform an action without violating SoD rules
 * This is called before executing the action
 */
export function checkSoDPreventive(
  userId: string,
  action: string,
  recordType?: string,
  recordId?: string
): SoDCheckResult {
  // Get user's permissions
  const userPermissions = getUserPermissionKeys(userId);
  
  // Check each SoD rule
  for (const rule of sodRules) {
    if (rule.status !== 'active') continue;
    
    // Check if this rule applies to the current action
    const isActionA = rule.actionA === action;
    const isActionB = rule.actionB === action;
    
    if (!isActionA && !isActionB) continue;
    
    // Get the conflicting action
    const conflictingAction = isActionA ? rule.actionB : rule.actionA;
    
    // Check if user has the conflicting permission
    const hasConflictingPermission = userPermissions.includes(conflictingAction);
    
    if (!hasConflictingPermission) continue;
    
    // Check if there's an active exception for this user and rule
    const activeException = sodExceptions.find(
      e => e.userId === userId && 
           e.ruleId === rule.id && 
           e.status === 'approved' &&
           new Date(e.validTo) > new Date()
    );
    
    if (activeException) {
      // Exception exists - allow with tracking
      return {
        allowed: true,
        rule,
        reason: `Exception approved: ${activeException.compensatingControl}`,
        exceptionId: activeException.id,
      };
    }
    
    // No exception - check rule mode
    if (rule.mode === 'enforce') {
      // Block the action
      const violationId = `sod-viol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Record the violation
      const violation: SoDViolation = {
        id: violationId,
        ruleId: rule.id,
        ruleCode: rule.code,
        userId,
        userName: 'Current User', // Would be resolved from user context
        actionTaken: action,
        recordType: recordType || 'Unknown',
        recordId: recordId || 'Unknown',
        recordName: recordId || 'Unknown',
        detectedAt: new Date().toISOString(),
        status: 'blocked',
      };
      
      sodViolations.push(violation);
      
      return {
        allowed: false,
        rule,
        reason: `SoD violation: ${rule.name}. ${rule.description}`,
        violationId,
        exceptionAvailable: true,
      };
    } else {
      // Observe mode - allow but log
      const violationId = `sod-viol-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const violation: SoDViolation = {
        id: violationId,
        ruleId: rule.id,
        ruleCode: rule.code,
        userId,
        userName: 'Current User',
        actionTaken: action,
        recordType: recordType || 'Unknown',
        recordId: recordId || 'Unknown',
        recordName: recordId || 'Unknown',
        detectedAt: new Date().toISOString(),
        status: 'detective_finding',
      };
      
      sodViolations.push(violation);
      
      return {
        allowed: true,
        rule,
        reason: `SoD observation: ${rule.name} (monitoring mode)`,
        violationId,
        exceptionAvailable: true,
      };
    }
  }
  
  // No SoD rules violated
  return {
    allowed: true,
  };
}

// ═══════════════════════════════════════════════════════════
// DETECTIVE SOD SCAN
// ═══════════════════════════════════════════════════════════

/**
 * Scan historical transactions for SoD violations
 * This is run nightly to detect violations that may have been missed
 */
export function runSoDDetectiveScan(
  startDate: string,
  endDate: string
): SoDViolation[] {
  const newViolations: SoDViolation[] = [];
  
  // In a real implementation, this would:
  // 1. Query all transactions in the date range
  // 2. For each transaction, check if the actor had conflicting permissions
  // 3. Check if there was an active exception
  // 4. Record violations
  
  // For demonstration, we'll simulate a scan
  console.log(`[SOD SCAN] Running detective scan from ${startDate} to ${endDate}`);
  
  return newViolations;
}

// ═══════════════════════════════════════════════════════════
// SOD EXCEPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface SoDExceptionRequest {
  ruleId: string;
  userId: string;
  scope: {
    projectId?: string;
    projectName?: string;
    siteId?: string;
    siteName?: string;
  };
  reason: string;
  compensatingControl: string;
  validFrom: string;
  validTo: string;
  requestedBy: string;
}

/**
 * Request an SoD exception
 */
export function requestSoDException(request: SoDExceptionRequest): SoDException {
  const rule = sodRules.find(r => r.id === request.ruleId);
  
  if (!rule) {
    throw new Error(`SoD rule not found: ${request.ruleId}`);
  }
  
  // Validate exception duration (max 90 days)
  const fromDate = new Date(request.validFrom);
  const toDate = new Date(request.validTo);
  const durationDays = (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (durationDays > 90) {
    throw new Error('Exception duration cannot exceed 90 days');
  }
  
  const exception: SoDException = {
    id: `sod-exc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ruleId: request.ruleId,
    ruleCode: rule.code,
    userId: request.userId,
    userName: 'Requested User', // Would be resolved from user context
    scope: request.scope,
    reason: request.reason,
    compensatingControl: request.compensatingControl,
    validFrom: request.validFrom,
    validTo: request.validTo,
    status: 'requested',
    requestedAt: new Date().toISOString(),
    requestedBy: request.requestedBy,
  };
  
  sodExceptions.push(exception);
  
  console.log('[SOD EXCEPTION] Exception requested:', exception.id);
  
  return exception;
}

/**
 * Approve an SoD exception
 */
export function approveSoDException(
  exceptionId: string,
  approvedBy: string
): SoDException {
  const exception = sodExceptions.find(e => e.id === exceptionId);
  
  if (!exception) {
    throw new Error(`SoD exception not found: ${exceptionId}`);
  }
  
  if (exception.status !== 'requested') {
    throw new Error(`Exception is not in requested status: ${exception.status}`);
  }
  
  exception.status = 'approved';
  exception.approvedAt = new Date().toISOString();
  exception.approvedBy = approvedBy;
  
  console.log('[SOD EXCEPTION] Exception approved:', exceptionId);
  
  return exception;
}

/**
 * Revoke an SoD exception
 */
export function revokeSoDException(
  exceptionId: string,
  revokedBy: string,
  reason: string
): SoDException {
  const exception = sodExceptions.find(e => e.id === exceptionId);
  
  if (!exception) {
    throw new Error(`SoD exception not found: ${exceptionId}`);
  }
  
  exception.status = 'revoked';
  
  console.log('[SOD EXCEPTION] Exception revoked:', exceptionId, 'Reason:', reason);
  
  return exception;
}

// ═══════════════════════════════════════════════════════════
// SOD SIMULATION
// ═══════════════════════════════════════════════════════════

export interface SoDSimulationResult {
  userId: string;
  userName: string;
  blockedActions: Array<{
    action: string;
    ruleCode: string;
    ruleName: string;
    reason: string;
  }>;
  allowedActions: string[];
}

/**
 * Simulate SoD checks for a user without actually blocking anything
 */
export function simulateSoDForUser(userId: string): SoDSimulationResult {
  const userPermissions = getUserPermissionKeys(userId);
  const blockedActions: SoDSimulationResult['blockedActions'] = [];
  const allowedActions: string[] = [];
  
  for (const permission of userPermissions) {
    const result = checkSoDPreventive(userId, permission);
    
    if (result.allowed) {
      allowedActions.push(permission);
    } else if (result.rule) {
      blockedActions.push({
        action: permission,
        ruleCode: result.rule.code,
        ruleName: result.rule.name,
        reason: result.reason || 'SoD violation',
      });
    }
  }
  
  return {
    userId,
    userName: 'Simulated User', // Would be resolved from user context
    blockedActions,
    allowedActions,
  };
}

// ═══════════════════════════════════════════════════════════
// TOXIC ROLE COMBINATION CHECK
// ═══════════════════════════════════════════════════════════

export interface ToxicCombination {
  roleA: string;
  roleB: string;
  ruleCode: string;
  ruleName: string;
  severity: string;
}

/**
 * Check if assigning a role would create a toxic combination
 */
export function checkToxicRoleCombination(
  userId: string,
  newRoleId: string
): ToxicCombination[] {
  const toxicCombinations: ToxicCombination[] = [];
  
  // Get user's current roles and permissions
  const currentPermissions = getUserPermissionKeys(userId);
  
  // Get permissions for the new role
  // In a real implementation, this would look up the role's permissions
  
  // Check each SoD rule
  for (const rule of sodRules) {
    if (rule.status !== 'active') continue;
    
    // Check if user already has one action and new role would grant the other
    const hasActionA = currentPermissions.includes(rule.actionA);
    const hasActionB = currentPermissions.includes(rule.actionB);
    
    // If user has one action, check if new role would grant the conflicting action
    // This is a simplified check - real implementation would be more sophisticated
    
    if (hasActionA || hasActionB) {
      toxicCombinations.push({
        roleA: 'Current Role',
        roleB: 'New Role',
        ruleCode: rule.code,
        ruleName: rule.name,
        severity: rule.severity,
      });
    }
  }
  
  return toxicCombinations;
}

// ═══════════════════════════════════════════════════════════
// INTEGRATION WITH PERMISSION ENGINE
// ═══════════════════════════════════════════════════════════

/**
 * Enhanced permission check that includes SoD validation
 * This wraps the Part 06 permission check with SoD enforcement
 */
export function checkPermissionWithSoD(
  userId: string,
  permissionKey: string,
  resource?: {
    type?: string;
    id?: string;
  }
): {
  allowed: boolean;
  reason?: string;
  sodViolation?: SoDViolation;
  sodException?: SoDException;
} {
  // First, check basic permission (Part 06)
  // In a real implementation, this would call the Part 06 permission engine
  
  // Then, check SoD
  const sodResult = checkSoDPreventive(
    userId,
    permissionKey,
    resource?.type,
    resource?.id
  );
  
  if (!sodResult.allowed) {
    return {
      allowed: false,
      reason: sodResult.reason,
      sodViolation: sodResult.violationId ? {
        id: sodResult.violationId,
        ruleId: sodResult.rule?.id || '',
        ruleCode: sodResult.rule?.code || '',
        userId,
        userName: 'Current User',
        actionTaken: permissionKey,
        recordType: resource?.type || 'Unknown',
        recordId: resource?.id || 'Unknown',
        recordName: resource?.id || 'Unknown',
        detectedAt: new Date().toISOString(),
        status: 'blocked',
      } : undefined,
    };
  }
  
  return {
    allowed: true,
    reason: sodResult.reason,
    sodException: sodResult.exceptionId ? sodExceptions.find(e => e.id === sodResult.exceptionId) : undefined,
  };
}
