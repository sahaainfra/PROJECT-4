// ═══════════════════════════════════════════════════════════
// AUDIT SERVICE — Part 07
// Tamper-evident audit log with hash chaining
// ═══════════════════════════════════════════════════════════

import { auditLog, type AuditLogEntry } from '../data/auditSecurityData';

// ═══════════════════════════════════════════════════════════
// HASH CHAIN IMPLEMENTATION
// ═══════════════════════════════════════════════════════════

/**
 * Simple hash function for demonstration
 * In production, use SHA-256 via Web Crypto API or server-side
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16).padStart(12, '0');
}

/**
 * Generate hash for an audit entry
 */
function generateEntryHash(entry: Omit<AuditLogEntry, 'hash' | 'previousHash'>, previousHash: string): string {
  const hashInput = JSON.stringify({
    id: entry.id,
    timestamp: entry.timestamp,
    userId: entry.userId,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId,
    previousHash,
  });
  return simpleHash(hashInput);
}

// ═══════════════════════════════════════════════════════════
// AUDIT WRITER
// ═══════════════════════════════════════════════════════════

export interface AuditWriteInput {
  userId: string;
  userName: string;
  userEmail: string;
  action: AuditLogEntry['action'];
  entityType: string;
  entityId: string;
  entityName?: string;
  before?: any;
  after?: any;
  changedFields?: string[];
  reason?: string;
  reasonCode?: string;
  correlationId: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  projectId?: string;
  siteId?: string;
  departmentId?: string;
  workflowInstanceId?: string;
}

/**
 * Write an audit log entry with hash chaining
 * This is the core audit writer used by service hooks
 */
export function writeAuditEntry(input: AuditWriteInput): AuditLogEntry {
  const previousEntry = auditLog.length > 0 ? auditLog[auditLog.length - 1] : null;
  const previousHash = previousEntry ? previousEntry.hash : '000000000000';
  
  const entry: AuditLogEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    timestamp: new Date().toISOString(),
    userId: input.userId,
    userName: input.userName,
    userEmail: input.userEmail,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    entityName: input.entityName,
    before: input.before,
    after: input.after,
    changedFields: input.changedFields,
    reason: input.reason,
    reasonCode: input.reasonCode,
    correlationId: input.correlationId,
    sessionId: input.sessionId,
    ipAddress: input.ipAddress,
    userAgent: input.userAgent,
    projectId: input.projectId,
    siteId: input.siteId,
    departmentId: input.departmentId,
    workflowInstanceId: input.workflowInstanceId,
    hash: '', // Will be calculated
    previousHash,
  };
  
  // Calculate hash
  entry.hash = generateEntryHash(entry, previousHash);
  
  // Append to audit log (in production, this would be a DB INSERT)
  auditLog.push(entry);
  
  // Log to console for demonstration
  console.log('[AUDIT]', {
    id: entry.id,
    action: entry.action,
    entity: `${entry.entityType}#${entry.entityId}`,
    user: entry.userName,
    hash: entry.hash,
    previousHash: entry.previousHash,
  });
  
  return entry;
}

// ═══════════════════════════════════════════════════════════
// HASH CHAIN VERIFICATION
// ═══════════════════════════════════════════════════════════

export interface VerificationResult {
  isValid: boolean;
  totalEntries: number;
  verifiedEntries: number;
  brokenLinks: Array<{
    entryId: string;
    expectedHash: string;
    actualHash: string;
    position: number;
  }>;
  verifiedAt: string;
}

/**
 * Verify the integrity of the audit log hash chain
 * This is run nightly and can be triggered manually
 */
export function verifyHashChain(): VerificationResult {
  const result: VerificationResult = {
    isValid: true,
    totalEntries: auditLog.length,
    verifiedEntries: 0,
    brokenLinks: [],
    verifiedAt: new Date().toISOString(),
  };
  
  let previousHash = '000000000000';
  
  for (let i = 0; i < auditLog.length; i++) {
    const entry = auditLog[i];
    
    // Check previous hash link
    if (entry.previousHash !== previousHash) {
      result.isValid = false;
      result.brokenLinks.push({
        entryId: entry.id,
        expectedHash: previousHash,
        actualHash: entry.previousHash,
        position: i,
      });
    }
    
    // Verify entry hash
    const expectedHash = generateEntryHash(entry, entry.previousHash);
    if (entry.hash !== expectedHash) {
      result.isValid = false;
      result.brokenLinks.push({
        entryId: entry.id,
        expectedHash: expectedHash,
        actualHash: entry.hash,
        position: i,
      });
    }
    
    previousHash = entry.hash;
    result.verifiedEntries++;
  }
  
  console.log('[AUDIT VERIFY]', {
    isValid: result.isValid,
    totalEntries: result.totalEntries,
    verifiedEntries: result.verifiedEntries,
    brokenLinks: result.brokenLinks.length,
  });
  
  return result;
}

// ═══════════════════════════════════════════════════════════
// AUDIT QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export interface AuditQuery {
  userId?: string;
  entityType?: string;
  entityId?: string;
  action?: AuditLogEntry['action'];
  projectId?: string;
  siteId?: string;
  startDate?: string;
  endDate?: string;
  correlationId?: string;
}

/**
 * Query audit logs with filters
 */
export function queryAuditLogs(query: AuditQuery): AuditLogEntry[] {
  return auditLog.filter(entry => {
    if (query.userId && entry.userId !== query.userId) return false;
    if (query.entityType && entry.entityType !== query.entityType) return false;
    if (query.entityId && entry.entityId !== query.entityId) return false;
    if (query.action && entry.action !== query.action) return false;
    if (query.projectId && entry.projectId !== query.projectId) return false;
    if (query.siteId && entry.siteId !== query.siteId) return false;
    if (query.correlationId && entry.correlationId !== query.correlationId) return false;
    
    if (query.startDate || query.endDate) {
      const timestamp = new Date(entry.timestamp).getTime();
      if (query.startDate && timestamp < new Date(query.startDate).getTime()) return false;
      if (query.endDate && timestamp > new Date(query.endDate).getTime()) return false;
    }
    
    return true;
  });
}

/**
 * Get audit trail for a specific entity (record timeline)
 */
export function getEntityAuditTrail(entityType: string, entityId: string): AuditLogEntry[] {
  return queryAuditLogs({ entityType, entityId })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Get audit logs by correlation ID (transaction trail)
 */
export function getCorrelationTrail(correlationId: string): AuditLogEntry[] {
  return queryAuditLogs({ correlationId })
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

// ═══════════════════════════════════════════════════════════
// REASON FRAMEWORK
// ═══════════════════════════════════════════════════════════

export interface ReasonRequirement {
  action: AuditLogEntry['action'];
  entityType: string;
  mandatory: boolean;
  minLength?: number;
}

const reasonRequirements: ReasonRequirement[] = [
  { action: 'APPROVE', entityType: '*', mandatory: true, minLength: 10 },
  { action: 'REJECT', entityType: '*', mandatory: true, minLength: 10 },
  { action: 'CANCEL', entityType: '*', mandatory: true, minLength: 10 },
  { action: 'DELETE', entityType: '*', mandatory: true, minLength: 10 },
  { action: 'UPDATE', entityType: 'Project', mandatory: false },
  { action: 'UPDATE', entityType: 'PurchaseOrder', mandatory: false },
];

/**
 * Check if a reason is required for an action
 */
export function isReasonRequired(action: AuditLogEntry['action'], entityType: string): boolean {
  const requirement = reasonRequirements.find(
    r => r.action === action && (r.entityType === entityType || r.entityType === '*')
  );
  return requirement?.mandatory || false;
}

/**
 * Validate a reason string
 */
export function validateReason(reason: string, action: AuditLogEntry['action'], entityType: string): { valid: boolean; error?: string } {
  const requirement = reasonRequirements.find(
    r => r.action === action && (r.entityType === entityType || r.entityType === '*')
  );
  
  if (!requirement?.mandatory) {
    return { valid: true };
  }
  
  if (!reason || reason.trim().length === 0) {
    return { valid: false, error: 'Reason is required' };
  }
  
  if (requirement.minLength && reason.trim().length < requirement.minLength) {
    return { valid: false, error: `Reason must be at least ${requirement.minLength} characters` };
  }
  
  return { valid: true };
}

// ═══════════════════════════════════════════════════════════
// SENSITIVE READ AUDITING
// ═══════════════════════════════════════════════════════════

/**
 * Log a sensitive data read (salary, bank details, etc.)
 */
export function auditSensitiveRead(
  userId: string,
  userName: string,
  userEmail: string,
  entityType: string,
  entityId: string,
  fieldsAccessed: string[],
  correlationId: string,
  sessionId?: string,
  ipAddress?: string
): AuditLogEntry {
  return writeAuditEntry({
    userId,
    userName,
    userEmail,
    action: 'VIEW',
    entityType,
    entityId,
    changedFields: fieldsAccessed,
    correlationId,
    sessionId,
    ipAddress,
  });
}

// ═══════════════════════════════════════════════════════════
// INTEGRATION WITH SERVICE HOOKS
// ═══════════════════════════════════════════════════════════

/**
 * Integration point for Part 04 service hooks
 * This would be called by the audit() hook in ServiceHooks.ts
 */
export function auditFromServiceHook(
  ctx: any,
  action: AuditLogEntry['action'],
  entityType: string,
  entityId: string,
  entityName?: string,
  before?: any,
  after?: any,
  reason?: string
): AuditLogEntry {
  return writeAuditEntry({
    userId: ctx.userId,
    userName: ctx.userName,
    userEmail: ctx.userEmail,
    action,
    entityType,
    entityId,
    entityName,
    before,
    after,
    changedFields: before && after ? Object.keys(after).filter(k => before[k] !== after[k]) : undefined,
    reason,
    correlationId: ctx.correlationId,
    sessionId: ctx.sessionId,
    ipAddress: ctx.deviceInfo?.ipAddress,
    userAgent: ctx.deviceInfo?.userAgent,
    projectId: ctx.activeProjectId,
    siteId: ctx.activeSiteId,
  });
}
