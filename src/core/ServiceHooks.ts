// ═══════════════════════════════════════════════════════════
// SERVICE HOOKS — Part 04
// Shared service hooks for all business operations
// ═══════════════════════════════════════════════════════════

import { RequestContext, AuditEntry, EventOutboxEntry, generateCorrelationId } from './RequestContext';

// ═══════════════════════════════════════════════════════════
// AUTHORIZATION HOOK
// ═══════════════════════════════════════════════════════════

export interface AuthorizationResult {
  allowed: boolean;
  reason?: string;
  missingPermissions?: string[];
}

export function authorize(
  ctx: RequestContext,
  permissionKey: string,
  resource?: { type: string; id: string; ownerId?: string }
): AuthorizationResult {
  // Check if user has the required permission
  const hasPermission = ctx.permissions.includes(permissionKey);
  
  if (!hasPermission) {
    return {
      allowed: false,
      reason: `User does not have permission: ${permissionKey}`,
      missingPermissions: [permissionKey],
    };
  }

  // TODO: Part 06 will add resource-level authorization (ABAC)
  // For now, permission-based check is sufficient
  
  return { allowed: true };
}

// ═══════════════════════════════════════════════════════════
// VALIDATION HOOK
// ═══════════════════════════════════════════════════════════

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validate(
  schema: Record<string, any>,
  input: Record<string, any>
): ValidationResult {
  const errors: ValidationError[] = [];

  // Simple validation logic - Part 06 will integrate with a proper schema validator
  for (const [field, rules] of Object.entries(schema)) {
    const value = input[field];

    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        message: `${field} is required`,
        code: 'REQUIRED',
      });
    }

    if (rules.type && value !== undefined && value !== null) {
      const actualType = Array.isArray(value) ? 'array' : typeof value;
      if (actualType !== rules.type) {
        errors.push({
          field,
          message: `${field} must be of type ${rules.type}`,
          code: 'TYPE_MISMATCH',
        });
      }
    }

    if (rules.minLength && typeof value === 'string' && value.length < rules.minLength) {
      errors.push({
        field,
        message: `${field} must be at least ${rules.minLength} characters`,
        code: 'MIN_LENGTH',
      });
    }

    if (rules.maxLength && typeof value === 'string' && value.length > rules.maxLength) {
      errors.push({
        field,
        message: `${field} must be at most ${rules.maxLength} characters`,
        code: 'MAX_LENGTH',
      });
    }

    if (rules.min !== undefined && typeof value === 'number' && value < rules.min) {
      errors.push({
        field,
        message: `${field} must be at least ${rules.min}`,
        code: 'MIN_VALUE',
      });
    }

    if (rules.max !== undefined && typeof value === 'number' && value > rules.max) {
      errors.push({
        field,
        message: `${field} must be at most ${rules.max}`,
        code: 'MAX_VALUE',
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ═══════════════════════════════════════════════════════════
// AUDIT HOOK
// ═══════════════════════════════════════════════════════════

const auditLog: AuditEntry[] = [];

export function audit(
  ctx: RequestContext,
  action: AuditEntry['action'],
  entityType: string,
  entityId: string,
  entityName?: string,
  before?: any,
  after?: any,
  reason?: string
): AuditEntry {
  const entry: AuditEntry = {
    id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    correlationId: ctx.correlationId,
    userId: ctx.userId,
    userName: ctx.userName,
    action,
    entityType,
    entityId,
    entityName,
    before,
    after,
    reason,
    timestamp: new Date(),
    userAgent: ctx.deviceInfo.userAgent,
  };

  auditLog.push(entry);
  
  // TODO: Part 07 will persist to database
  console.log('[AUDIT]', entry);
  
  return entry;
}

export function getAuditLog(): AuditEntry[] {
  return [...auditLog];
}

// ═══════════════════════════════════════════════════════════
// EVENT EMIT HOOK (OUTBOX PATTERN)
// ═══════════════════════════════════════════════════════════

const eventOutbox: EventOutboxEntry[] = [];

export function emit(
  ctx: RequestContext,
  eventName: string,
  aggregateType: string,
  aggregateId: string,
  payload: any
): EventOutboxEntry {
  const entry: EventOutboxEntry = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    correlationId: ctx.correlationId,
    eventName,
    aggregateType,
    aggregateId,
    companyId: ctx.companyId,
    projectId: ctx.activeProjectId,
    siteId: ctx.activeSiteId,
    payload,
    createdAt: new Date(),
    attempts: 0,
    status: 'PENDING',
  };

  eventOutbox.push(entry);
  
  // TODO: Part 11 will implement outbox relay worker
  console.log('[EVENT]', entry);
  
  return entry;
}

export function getEventOutbox(): EventOutboxEntry[] {
  return [...eventOutbox];
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION HOOK
// ═══════════════════════════════════════════════════════════

export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  userId?: string;
  timestamp: Date;
  read: boolean;
}

const notifications: Notification[] = [];

export function notify(
  ctx: RequestContext,
  type: Notification['type'],
  title: string,
  message: string,
  userId?: string
): Notification {
  const notification: Notification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    userId: userId || ctx.userId,
    timestamp: new Date(),
    read: false,
  };

  notifications.push(notification);
  
  // TODO: Part 16 will implement notification delivery (email, SMS, in-app)
  console.log('[NOTIFY]', notification);
  
  return notification;
}

export function getNotifications(): Notification[] {
  return [...notifications];
}

// ═══════════════════════════════════════════════════════════
// ATTACHMENT HOOK
// ═══════════════════════════════════════════════════════════

export interface Attachment {
  id: string;
  entityType: string;
  entityId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
}

const attachments: Attachment[] = [];

export async function attach(
  ctx: RequestContext,
  entityType: string,
  entityId: string,
  file: File
): Promise<Attachment> {
  // TODO: Part 10 will implement file upload to storage service
  const attachment: Attachment = {
    id: `att_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    entityType,
    entityId,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type,
    uploadedBy: ctx.userId,
    uploadedAt: new Date(),
    url: `https://storage.example.com/${entityType}/${entityId}/${file.name}`,
  };

  attachments.push(attachment);
  
  console.log('[ATTACH]', attachment);
  
  return attachment;
}

export function getAttachments(entityType: string, entityId: string): Attachment[] {
  return attachments.filter(a => a.entityType === entityType && a.entityId === entityId);
}

// ═══════════════════════════════════════════════════════════
// NUMBERING SERVICE
// ═══════════════════════════════════════════════════════════

interface NumberSeries {
  docType: string;
  prefix: string;
  fy: string;
  nextValue: number;
  padding: number;
}

const numberSeries: Record<string, NumberSeries> = {
  'PR': { docType: 'PR', prefix: 'PR', fy: '2024-25', nextValue: 89, padding: 4 },
  'PO': { docType: 'PO', prefix: 'PO', fy: '2024-25', nextValue: 142, padding: 4 },
  'GRN': { docType: 'GRN', prefix: 'GRN', fy: '2024-25', nextValue: 89, padding: 4 },
  'INV': { docType: 'INV', prefix: 'INV', fy: '2024-25', nextValue: 34, padding: 4 },
};

export function nextNumber(ctx: RequestContext, docType: string): string {
  const series = numberSeries[docType];
  
  if (!series) {
    throw new Error(`Number series not found for document type: ${docType}`);
  }

  // Format: PREFIX-FY-NUMBER (e.g., PR-2024-25-0089)
  const number = String(series.nextValue).padStart(series.padding, '0');
  const formattedNumber = `${series.prefix}-${series.fy}-${number}`;
  
  // Increment for next call
  series.nextValue++;
  
  // TODO: Part 04 will persist to database with row lock for concurrency
  console.log('[NUMBER]', { docType, generated: formattedNumber, nextValue: series.nextValue });
  
  return formattedNumber;
}

export function previewNumber(docType: string): string {
  const series = numberSeries[docType];
  
  if (!series) {
    throw new Error(`Number series not found for document type: ${docType}`);
  }

  const number = String(series.nextValue).padStart(series.padding, '0');
  return `${series.prefix}-${series.fy}-${number}`;
}

// ═══════════════════════════════════════════════════════════
// TRANSACTION HELPER
// ═══════════════════════════════════════════════════════════

export async function withTransaction<T>(
  ctx: RequestContext,
  operation: () => Promise<T>
): Promise<T> {
  // TODO: Part 04 will implement actual database transaction
  // For now, just execute the operation
  try {
    const result = await operation();
    return result;
  } catch (error) {
    // Transaction rollback would happen here
    console.error('[TRANSACTION] Rollback due to error:', error);
    throw error;
  }
}
