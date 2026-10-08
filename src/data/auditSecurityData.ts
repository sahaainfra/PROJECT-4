// ═══════════════════════════════════════════════════════════
// AUDIT & SECURITY DATA MODEL — Part 07
// Tamper-evident audit log with hash chaining
// ═══════════════════════════════════════════════════════════

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userEmail: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'SUBMIT' | 'CANCEL' | 'LOGIN' | 'LOGOUT' | 'EXPORT' | 'VIEW';
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
  hash: string;
  previousHash: string;
}

export interface LoginHistoryEntry {
  id: string;
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  deviceId: string;
  result: 'SUCCESS' | 'FAIL' | 'LOCKED';
  method: 'PASSWORD' | 'SSO' | 'OTP';
  geoHint?: string;
  location?: string;
}

export interface Session {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ipAddress: string;
  location?: string;
  createdAt: string;
  lastSeenAt: string;
  isActive: boolean;
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
}

export interface SecurityEvent {
  id: string;
  type: 'BRUTE_FORCE' | 'PERMISSION_DENIED_SPIKE' | 'PRIVILEGED_CHANGE' | 'EXPORT_BULK' | 'IMPOSSIBLE_TRAVEL' | 'TOKEN_REUSE' | 'HASH_CHAIN_BREAK' | 'AUDIT_WRITE_FAILURE';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  userId?: string;
  userName?: string;
  timestamp: string;
  ipAddress?: string;
  details: any;
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'FALSE_POSITIVE';
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  resolutionNotes?: string;
}

export interface ReasonCode {
  code: string;
  module: string;
  description: string;
  isSystem: boolean;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const reasonCodes: ReasonCode[] = [
  { code: 'CORRECTION', module: 'GENERAL', description: 'Correction of error', isSystem: true },
  { code: 'POLICY_CHANGE', module: 'GENERAL', description: 'Policy or procedure change', isSystem: true },
  { code: 'CUSTOMER_REQUEST', module: 'GENERAL', description: 'Customer/client request', isSystem: true },
  { code: 'REGULATORY', module: 'GENERAL', description: 'Regulatory compliance requirement', isSystem: true },
  { code: 'SYSTEM_ERROR', module: 'GENERAL', description: 'System error or malfunction', isSystem: true },
  { code: 'APPROVAL_GRANTED', module: 'WORKFLOW', description: 'Approval granted after review', isSystem: true },
  { code: 'APPROVAL_REJECTED', module: 'WORKFLOW', description: 'Approval rejected with justification', isSystem: true },
  { code: 'BUDGET_ADJUSTMENT', module: 'FINANCE', description: 'Budget adjustment approved', isSystem: false },
  { code: 'SCOPE_CHANGE', module: 'PROJECT', description: 'Project scope change', isSystem: false },
  { code: 'VARIATION_ORDER', module: 'PROJECT', description: 'Variation order issued', isSystem: false },
];

export const auditLog: AuditLogEntry[] = [
  {
    id: 'audit-001',
    timestamp: '2024-01-15T10:30:00Z',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    action: 'CREATE',
    entityType: 'PurchaseOrder',
    entityId: 'PO-2024-0142',
    entityName: 'PO-2024-0142',
    before: null,
    after: { status: 'DRAFT', vendor: 'Steel India Pvt Ltd', amount: 2450000 },
    changedFields: ['status', 'vendor', 'amount'],
    correlationId: 'corr_1705312200000_abc123',
    sessionId: 'sess-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    projectId: 'project-001',
    hash: 'a1b2c3d4e5f6',
    previousHash: '000000000000',
  },
  {
    id: 'audit-002',
    timestamp: '2024-01-15T10:45:00Z',
    userId: 'user-002',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@acme-infra.com',
    action: 'APPROVE',
    entityType: 'PurchaseOrder',
    entityId: 'PO-2024-0142',
    entityName: 'PO-2024-0142',
    before: { status: 'DRAFT' },
    after: { status: 'APPROVED' },
    changedFields: ['status'],
    reason: 'Reviewed and approved. Vendor rates are competitive.',
    reasonCode: 'APPROVAL_GRANTED',
    correlationId: 'corr_1705313100000_def456',
    sessionId: 'sess-002',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    projectId: 'project-001',
    workflowInstanceId: 'wf-001',
    hash: 'b2c3d4e5f6g7',
    previousHash: 'a1b2c3d4e5f6',
  },
  {
    id: 'audit-003',
    timestamp: '2024-01-15T11:00:00Z',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    userEmail: 'suresh.kumar@acme-infra.com',
    action: 'CREATE',
    entityType: 'GRN',
    entityId: 'GRN-0089',
    entityName: 'GRN-0089',
    before: null,
    after: { poNumber: 'PO-2024-0142', material: 'TMT Bar 12mm', quantity: 25, unit: 'MT' },
    changedFields: ['poNumber', 'material', 'quantity', 'unit'],
    correlationId: 'corr_1705314000000_ghi789',
    sessionId: 'sess-003',
    ipAddress: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Linux; Android 11)',
    projectId: 'project-001',
    siteId: 'site-001',
    hash: 'c3d4e5f6g7h8',
    previousHash: 'b2c3d4e5f6g7',
  },
  {
    id: 'audit-004',
    timestamp: '2024-01-15T11:15:00Z',
    userId: 'user-010',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    action: 'UPDATE',
    entityType: 'Project',
    entityId: 'project-001',
    entityName: 'Riverside Tower - Phase II',
    before: { progress: 60 },
    after: { progress: 62.4 },
    changedFields: ['progress'],
    reason: 'Updated based on site inspection report',
    reasonCode: 'CORRECTION',
    correlationId: 'corr_1705314900000_jkl012',
    sessionId: 'sess-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    projectId: 'project-001',
    hash: 'd4e5f6g7h8i9',
    previousHash: 'c3d4e5f6g7h8',
  },
  {
    id: 'audit-005',
    timestamp: '2024-01-15T09:00:00Z',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    action: 'LOGIN',
    entityType: 'User',
    entityId: 'user-001',
    entityName: 'Rajesh Kumar',
    correlationId: 'corr_1705308000000_mno345',
    sessionId: 'sess-001',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    hash: 'e5f6g7h8i9j0',
    previousHash: 'd4e5f6g7h8i9',
  },
];

export const loginHistory: LoginHistoryEntry[] = [
  {
    id: 'login-001',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    timestamp: '2024-01-15T09:00:00Z',
    ipAddress: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    deviceId: 'device-001',
    result: 'SUCCESS',
    method: 'PASSWORD',
    location: 'Mumbai, India',
  },
  {
    id: 'login-002',
    userId: 'user-002',
    userName: 'Priya Sharma',
    timestamp: '2024-01-15T09:15:00Z',
    ipAddress: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    deviceId: 'device-002',
    result: 'SUCCESS',
    method: 'SSO',
    location: 'Pune, India',
  },
  {
    id: 'login-003',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    timestamp: '2024-01-15T08:30:00Z',
    ipAddress: '10.0.0.50',
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B)',
    deviceId: 'device-003',
    result: 'SUCCESS',
    method: 'OTP',
    location: 'Pune Site, India',
  },
  {
    id: 'login-004',
    userId: 'user-099',
    userName: 'Unknown User',
    timestamp: '2024-01-15T03:45:00Z',
    ipAddress: '203.0.113.50',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    deviceId: 'device-unknown',
    result: 'FAIL',
    method: 'PASSWORD',
    geoHint: 'Suspicious location',
  },
];

export const sessions: Session[] = [
  {
    id: 'sess-001',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    deviceId: 'device-001',
    deviceName: 'Work Laptop - Windows',
    deviceType: 'desktop',
    browser: 'Chrome 120',
    os: 'Windows 11',
    ipAddress: '192.168.1.100',
    location: 'Mumbai, India',
    createdAt: '2024-01-15T09:00:00Z',
    lastSeenAt: '2024-01-15T11:30:00Z',
    isActive: true,
  },
  {
    id: 'sess-002',
    userId: 'user-002',
    userName: 'Priya Sharma',
    deviceId: 'device-002',
    deviceName: 'MacBook Pro',
    deviceType: 'desktop',
    browser: 'Safari 17',
    os: 'macOS Sonoma',
    ipAddress: '192.168.1.101',
    location: 'Pune, India',
    createdAt: '2024-01-15T09:15:00Z',
    lastSeenAt: '2024-01-15T11:25:00Z',
    isActive: true,
  },
  {
    id: 'sess-003',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    deviceId: 'device-003',
    deviceName: 'Samsung Galaxy S21',
    deviceType: 'mobile',
    browser: 'Chrome Mobile 120',
    os: 'Android 11',
    ipAddress: '10.0.0.50',
    location: 'Pune Site, India',
    createdAt: '2024-01-15T08:30:00Z',
    lastSeenAt: '2024-01-15T11:20:00Z',
    isActive: true,
  },
  {
    id: 'sess-004',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    deviceId: 'device-004',
    deviceName: 'iPhone 14',
    deviceType: 'mobile',
    browser: 'Safari Mobile 17',
    os: 'iOS 17',
    ipAddress: '192.168.1.150',
    location: 'Mumbai, India',
    createdAt: '2024-01-14T18:00:00Z',
    lastSeenAt: '2024-01-14T20:30:00Z',
    isActive: false,
    revokedAt: '2024-01-15T08:00:00Z',
    revokedBy: 'user-001',
    revokeReason: 'Device lost',
  },
];

export const securityEvents: SecurityEvent[] = [
  {
    id: 'sec-001',
    type: 'BRUTE_FORCE',
    severity: 'HIGH',
    userId: 'user-099',
    userName: 'Unknown User',
    timestamp: '2024-01-15T03:45:00Z',
    ipAddress: '203.0.113.50',
    details: {
      failedAttempts: 5,
      timeWindow: '10 minutes',
      targetAccount: 'admin@acme-infra.com',
    },
    status: 'RESOLVED',
    acknowledgedAt: '2024-01-15T04:00:00Z',
    acknowledgedBy: 'user-001',
    resolvedAt: '2024-01-15T04:15:00Z',
    resolvedBy: 'user-001',
    resolutionNotes: 'IP blocked. No successful login attempts.',
  },
  {
    id: 'sec-002',
    type: 'PERMISSION_DENIED_SPIKE',
    severity: 'MEDIUM',
    userId: 'user-018',
    userName: 'Mohan Das',
    timestamp: '2024-01-15T10:00:00Z',
    ipAddress: '192.168.1.103',
    details: {
      deniedActions: 8,
      timeWindow: '5 minutes',
      actions: ['procurement.po.approve', 'finance.payment.create'],
    },
    status: 'ACKNOWLEDGED',
    acknowledgedAt: '2024-01-15T10:30:00Z',
    acknowledgedBy: 'user-001',
  },
  {
    id: 'sec-003',
    type: 'PRIVILEGED_CHANGE',
    severity: 'HIGH',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    timestamp: '2024-01-15T11:00:00Z',
    ipAddress: '192.168.1.100',
    details: {
      changeType: 'ROLE_ASSIGNMENT',
      targetUser: 'user-020',
      roleAssigned: 'SUPER_ADMIN',
    },
    status: 'OPEN',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getAuditLogsByEntity(entityType: string, entityId: string): AuditLogEntry[] {
  return auditLog.filter(entry => entry.entityType === entityType && entry.entityId === entityId);
}

export function getAuditLogsByUser(userId: string): AuditLogEntry[] {
  return auditLog.filter(entry => entry.userId === userId);
}

export function getAuditLogsByDateRange(startDate: string, endDate: string): AuditLogEntry[] {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  return auditLog.filter(entry => {
    const timestamp = new Date(entry.timestamp).getTime();
    return timestamp >= start && timestamp <= end;
  });
}

export function getActiveSessions(userId: string): Session[] {
  return sessions.filter(s => s.userId === userId && s.isActive);
}

export function getOpenSecurityEvents(): SecurityEvent[] {
  return securityEvents.filter(e => e.status === 'OPEN' || e.status === 'ACKNOWLEDGED');
}

export function getSecurityEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
  return securityEvents.filter(e => e.type === type);
}

export function formatAuditAction(action: AuditLogEntry['action']): string {
  const labels: Record<AuditLogEntry['action'], string> = {
    CREATE: 'Created',
    UPDATE: 'Updated',
    DELETE: 'Deleted',
    APPROVE: 'Approved',
    REJECT: 'Rejected',
    SUBMIT: 'Submitted',
    CANCEL: 'Cancelled',
    LOGIN: 'Logged In',
    LOGOUT: 'Logged Out',
    EXPORT: 'Exported',
    VIEW: 'Viewed',
  };
  return labels[action];
}

export function getSecurityEventColor(severity: SecurityEvent['severity']): string {
  const colors: Record<SecurityEvent['severity'], string> = {
    LOW: 'var(--info-600)',
    MEDIUM: 'var(--warning-600)',
    HIGH: 'var(--error-600)',
    CRITICAL: 'var(--error-700)',
  };
  return colors[severity];
}

export function getSecurityEventIcon(type: SecurityEvent['type']): string {
  const icons: Record<SecurityEvent['type'], string> = {
    BRUTE_FORCE: '🔒',
    PERMISSION_DENIED_SPIKE: '🚫',
    PRIVILEGED_CHANGE: '⚠️',
    EXPORT_BULK: '📤',
    IMPOSSIBLE_TRAVEL: '🌍',
    TOKEN_REUSE: '🔄',
    HASH_CHAIN_BREAK: '⛓️‍💥',
    AUDIT_WRITE_FAILURE: '❌',
  };
  return icons[type];
}
