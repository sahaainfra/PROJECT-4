// ═══════════════════════════════════════════════════════════
// IDENTITY & SOD DATA — Part 09
// Security, Identity & Segregation of Duties
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// SOD RULES
// ═══════════════════════════════════════════════════════════

export interface SoDRule {
  id: string;
  code: string;
  name: string;
  description: string;
  actionA: string;
  actionB: string;
  scope: 'same_record' | 'record_chain' | 'period';
  severity: 'critical' | 'high' | 'medium' | 'low';
  mode: 'observe' | 'enforce';
  status: 'draft' | 'approved' | 'active' | 'retired';
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

export const sodRules: SoDRule[] = [
  {
    id: 'sod-rule-001',
    code: 'PR_CREATE_APPROVE',
    name: 'PR Creator ≠ PR Approver',
    description: 'User who creates a purchase requisition cannot approve it',
    actionA: 'procurement.pr.create',
    actionB: 'procurement.pr.approve',
    scope: 'same_record',
    severity: 'high',
    mode: 'enforce',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    approvedAt: '2024-01-02T10:00:00Z',
    approvedBy: 'user-001',
  },
  {
    id: 'sod-rule-002',
    code: 'PO_CREATE_APPROVE',
    name: 'PO Creator ≠ PO Approver',
    description: 'User who creates a purchase order cannot approve it',
    actionA: 'procurement.po.create',
    actionB: 'procurement.po.approve',
    scope: 'same_record',
    severity: 'critical',
    mode: 'enforce',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    approvedAt: '2024-01-02T10:00:00Z',
    approvedBy: 'user-001',
  },
  {
    id: 'sod-rule-003',
    code: 'PURCHASER_RECEIVER',
    name: 'Purchaser ≠ Goods Receiver',
    description: 'User with procurement authority cannot have stock custody',
    actionA: 'procurement.po.create',
    actionB: 'inventory.grn.create',
    scope: 'record_chain',
    severity: 'high',
    mode: 'enforce',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    approvedAt: '2024-01-02T10:00:00Z',
    approvedBy: 'user-001',
  },
  {
    id: 'sod-rule-004',
    code: 'BILL_CREATE_CERTIFY',
    name: 'Bill Creator ≠ Bill Certifier',
    description: 'User who creates a subcontractor bill cannot certify it',
    actionA: 'finance.bill.create',
    actionB: 'finance.bill.certify',
    scope: 'same_record',
    severity: 'critical',
    mode: 'enforce',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    approvedAt: '2024-01-02T10:00:00Z',
    approvedBy: 'user-001',
  },
  {
    id: 'sod-rule-005',
    code: 'PAYMENT_MAKE_APPROVE',
    name: 'Payment Maker ≠ Payment Approver',
    description: 'User who creates a payment cannot approve it',
    actionA: 'finance.payment.create',
    actionB: 'finance.payment.approve',
    scope: 'same_record',
    severity: 'critical',
    mode: 'enforce',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    approvedAt: '2024-01-02T10:00:00Z',
    approvedBy: 'user-001',
  },
  {
    id: 'sod-rule-006',
    code: 'VENDOR_CREATE_VERIFY',
    name: 'Vendor Master Creator ≠ Bank Verifier',
    description: 'User who creates vendor master cannot verify bank details',
    actionA: 'procurement.vendor.create',
    actionB: 'procurement.vendor.verify_bank',
    scope: 'same_record',
    severity: 'high',
    mode: 'observe',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    approvedAt: '2024-01-02T10:00:00Z',
    approvedBy: 'user-001',
  },
];

// ═══════════════════════════════════════════════════════════
// SOD VIOLATIONS
// ═══════════════════════════════════════════════════════════

export interface SoDViolation {
  id: string;
  ruleId: string;
  ruleCode: string;
  userId: string;
  userName: string;
  actionTaken: string;
  recordType: string;
  recordId: string;
  recordName: string;
  detectedAt: string;
  status: 'blocked' | 'allowed_exception' | 'detective_finding';
  exceptionId?: string;
  compensatingControl?: string;
}

export const sodViolations: SoDViolation[] = [
  {
    id: 'sod-viol-001',
    ruleId: 'sod-rule-002',
    ruleCode: 'PO_CREATE_APPROVE',
    userId: 'user-010',
    userName: 'Rajesh Kumar',
    actionTaken: 'procurement.po.approve',
    recordType: 'PurchaseOrder',
    recordId: 'PO-2024-0142',
    recordName: 'PO-2024-0142',
    detectedAt: '2024-01-15T10:45:00Z',
    status: 'blocked',
  },
  {
    id: 'sod-viol-002',
    ruleId: 'sod-rule-004',
    ruleCode: 'BILL_CREATE_CERTIFY',
    userId: 'user-012',
    userName: 'Priya Sharma',
    actionTaken: 'finance.bill.certify',
    recordType: 'SubcontractorBill',
    recordId: 'BILL-2024-0034',
    recordName: 'BILL-2024-0034',
    detectedAt: '2024-01-15T11:30:00Z',
    status: 'allowed_exception',
    exceptionId: 'sod-exc-001',
    compensatingControl: 'Post-facto review by CFO',
  },
  {
    id: 'sod-viol-003',
    ruleId: 'sod-rule-003',
    ruleCode: 'PURCHASER_RECEIVER',
    userId: 'user-011',
    userName: 'Vikram Mehta',
    actionTaken: 'inventory.grn.create',
    recordType: 'GRN',
    recordId: 'GRN-0089',
    recordName: 'GRN-0089',
    detectedAt: '2024-01-15T11:00:00Z',
    status: 'detective_finding',
  },
];

// ═══════════════════════════════════════════════════════════
// SOD EXCEPTIONS
// ═══════════════════════════════════════════════════════════

export interface SoDException {
  id: string;
  ruleId: string;
  ruleCode: string;
  userId: string;
  userName: string;
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
  status: 'requested' | 'approved' | 'expired' | 'revoked';
  requestedAt: string;
  requestedBy: string;
  approvedAt?: string;
  approvedBy?: string;
  reviewTaskId?: string;
}

export const sodExceptions: SoDException[] = [
  {
    id: 'sod-exc-001',
    ruleId: 'sod-rule-004',
    ruleCode: 'BILL_CREATE_CERTIFY',
    userId: 'user-012',
    userName: 'Priya Sharma',
    scope: {
      projectId: 'project-001',
      projectName: 'Riverside Tower - Phase II',
    },
    reason: 'Small site with limited staff - single person handling both roles',
    compensatingControl: 'Monthly post-facto review by CFO with detailed transaction log',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-06-30T23:59:59Z',
    status: 'approved',
    requestedAt: '2023-12-28T09:00:00Z',
    requestedBy: 'user-010',
    approvedAt: '2023-12-29T14:00:00Z',
    approvedBy: 'user-002',
    reviewTaskId: 'task-001',
  },
  {
    id: 'sod-exc-002',
    ruleId: 'sod-rule-003',
    ruleCode: 'PURCHASER_RECEIVER',
    userId: 'user-011',
    userName: 'Vikram Mehta',
    scope: {
      projectId: 'project-002',
      projectName: 'Green Valley Residences',
      siteId: 'site-003',
      siteName: 'Main Site - Powai',
    },
    reason: 'Temporary coverage during store keeper leave',
    compensatingControl: 'Dual verification by project manager for all GRNs',
    validFrom: '2024-01-10T00:00:00Z',
    validTo: '2024-01-20T23:59:59Z',
    status: 'approved',
    requestedAt: '2024-01-09T08:00:00Z',
    requestedBy: 'user-013',
    approvedAt: '2024-01-09T10:00:00Z',
    approvedBy: 'user-010',
    reviewTaskId: 'task-002',
  },
  {
    id: 'sod-exc-003',
    ruleId: 'sod-rule-006',
    ruleCode: 'VENDOR_CREATE_VERIFY',
    userId: 'user-018',
    userName: 'Mohan Das',
    scope: {
      projectId: 'project-001',
      projectName: 'Riverside Tower - Phase II',
    },
    reason: 'New vendor onboarding urgent requirement',
    compensatingControl: 'Finance team to verify bank details within 24 hours',
    validFrom: '2024-01-15T00:00:00Z',
    validTo: '2024-01-22T23:59:59Z',
    status: 'requested',
    requestedAt: '2024-01-15T09:00:00Z',
    requestedBy: 'user-018',
  },
];

// ═══════════════════════════════════════════════════════════
// ABAC POLICIES
// ═══════════════════════════════════════════════════════════

export interface ABACPolicy {
  id: string;
  code: string;
  name: string;
  description: string;
  resourceType: string;
  expression: string;
  effect: 'allow' | 'deny';
  priority: number;
  status: 'draft' | 'active' | 'inactive';
  createdAt: string;
  createdBy: string;
}

export const abacPolicies: ABACPolicy[] = [
  {
    id: 'abac-001',
    code: 'PROJECT_SCOPE_ACCESS',
    name: 'Project Scope Access',
    description: 'Users can only access projects they are allocated to',
    resourceType: 'project',
    expression: 'user.allocatedProjects.includes(resource.projectId)',
    effect: 'allow',
    priority: 100,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'abac-002',
    code: 'SITE_SCOPE_ACCESS',
    name: 'Site Scope Access',
    description: 'Users can only access sites they are allocated to',
    resourceType: 'site',
    expression: 'user.allocatedSites.includes(resource.siteId)',
    effect: 'allow',
    priority: 100,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'abac-003',
    code: 'AMOUNT_AUTHORITY_LIMIT',
    name: 'Amount Authority Limit',
    description: 'Approvers can only approve amounts within their authority limit',
    resourceType: 'approval',
    expression: 'resource.amount <= user.authorityLimit',
    effect: 'allow',
    priority: 200,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-001',
  },
  {
    id: 'abac-004',
    code: 'SENSITIVE_FIELD_MASKING',
    name: 'Sensitive Field Masking',
    description: 'Mask sensitive fields (salary, bank) for non-HR users',
    resourceType: 'employee',
    expression: '!user.roles.includes("HR_MANAGER") && field in ["salary", "bankAccount"]',
    effect: 'deny',
    priority: 300,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'user-001',
  },
];

// ═══════════════════════════════════════════════════════════
// ACCESS REVIEW CAMPAIGNS
// ═══════════════════════════════════════════════════════════

export interface AccessReviewCampaign {
  id: string;
  name: string;
  description: string;
  scope: 'company' | 'project' | 'department';
  scopeId: string;
  scopeName: string;
  startDate: string;
  dueDate: string;
  status: 'open' | 'in_review' | 'closed';
  totalGrants: number;
  reviewedGrants: number;
  approvedGrants: number;
  revokedGrants: number;
  pendingGrants: number;
  createdBy: string;
  createdAt: string;
}

export const accessReviewCampaigns: AccessReviewCampaign[] = [
  {
    id: 'campaign-001',
    name: 'Q1 2024 Access Review - Riverside Tower',
    description: 'Quarterly access review for Riverside Tower project team',
    scope: 'project',
    scopeId: 'project-001',
    scopeName: 'Riverside Tower - Phase II',
    startDate: '2024-01-01T00:00:00Z',
    dueDate: '2024-01-31T23:59:59Z',
    status: 'in_review',
    totalGrants: 45,
    reviewedGrants: 32,
    approvedGrants: 30,
    revokedGrants: 2,
    pendingGrants: 13,
    createdBy: 'user-001',
    createdAt: '2023-12-28T09:00:00Z',
  },
  {
    id: 'campaign-002',
    name: 'Q1 2024 Access Review - Finance Department',
    description: 'Quarterly access review for Finance department',
    scope: 'department',
    scopeId: 'dept-002',
    scopeName: 'Finance',
    startDate: '2024-01-05T00:00:00Z',
    dueDate: '2024-02-05T23:59:59Z',
    status: 'open',
    totalGrants: 28,
    reviewedGrants: 0,
    approvedGrants: 0,
    revokedGrants: 0,
    pendingGrants: 28,
    createdBy: 'user-002',
    createdAt: '2024-01-03T10:00:00Z',
  },
  {
    id: 'campaign-003',
    name: 'Q4 2023 Access Review - All Projects',
    description: 'Q4 2023 quarterly access review - completed',
    scope: 'company',
    scopeId: 'company-001',
    scopeName: 'Acme Infrastructure Ltd',
    startDate: '2023-10-01T00:00:00Z',
    dueDate: '2023-10-31T23:59:59Z',
    status: 'closed',
    totalGrants: 186,
    reviewedGrants: 186,
    approvedGrants: 178,
    revokedGrants: 8,
    pendingGrants: 0,
    createdBy: 'user-001',
    createdAt: '2023-09-28T09:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// ACCESS REVIEW ITEMS
// ═══════════════════════════════════════════════════════════

export interface AccessReviewItem {
  id: string;
  campaignId: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleId: string;
  roleName: string;
  scopeType: string;
  scopeName: string;
  grantedAt: string;
  lastUsedAt: string;
  status: 'pending' | 'approved' | 'revoked' | 'expired';
  reviewerId?: string;
  reviewerName?: string;
  reviewedAt?: string;
  decision?: string;
  comments?: string;
}

export const accessReviewItems: AccessReviewItem[] = [
  {
    id: 'review-item-001',
    campaignId: 'campaign-001',
    userId: 'user-010',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    roleId: 'role-004',
    roleName: 'Project Manager',
    scopeType: 'project',
    scopeName: 'Riverside Tower - Phase II',
    grantedAt: '2023-04-01T00:00:00Z',
    lastUsedAt: '2024-01-15T10:30:00Z',
    status: 'approved',
    reviewerId: 'user-002',
    reviewerName: 'Priya Sharma',
    reviewedAt: '2024-01-10T14:00:00Z',
    decision: 'Keep - Active project manager, regularly using system',
  },
  {
    id: 'review-item-002',
    campaignId: 'campaign-001',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    userEmail: 'suresh.kumar@acme-infra.com',
    roleId: 'role-010',
    roleName: 'Site Engineer',
    scopeType: 'site',
    scopeName: 'Main Construction Site',
    grantedAt: '2023-04-01T00:00:00Z',
    lastUsedAt: '2024-01-15T07:30:00Z',
    status: 'approved',
    reviewerId: 'user-010',
    reviewerName: 'Rajesh Kumar',
    reviewedAt: '2024-01-12T09:00:00Z',
    decision: 'Keep - Active site engineer',
  },
  {
    id: 'review-item-003',
    campaignId: 'campaign-001',
    userId: 'user-019',
    userName: 'Anil Sharma',
    userEmail: 'anil.sharma@acme-infra.com',
    roleId: 'role-010',
    roleName: 'Site Engineer',
    scopeType: 'site',
    scopeName: 'Main Site - Powai',
    grantedAt: '2023-06-15T00:00:00Z',
    lastUsedAt: '2024-01-14T17:30:00Z',
    status: 'pending',
  },
  {
    id: 'review-item-004',
    campaignId: 'campaign-001',
    userId: 'user-099',
    userName: 'Former Employee',
    userEmail: 'former@acme-infra.com',
    roleId: 'role-010',
    roleName: 'Site Engineer',
    scopeType: 'site',
    scopeName: 'Main Construction Site',
    grantedAt: '2023-01-01T00:00:00Z',
    lastUsedAt: '2023-09-30T18:00:00Z',
    status: 'revoked',
    reviewerId: 'user-010',
    reviewerName: 'Rajesh Kumar',
    reviewedAt: '2024-01-11T10:00:00Z',
    decision: 'Revoke - Employee left organization',
  },
];

// ═══════════════════════════════════════════════════════════
// PRIVILEGED SESSIONS
// ═══════════════════════════════════════════════════════════

export interface PrivilegedSession {
  id: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  approvedById: string;
  approvedByName: string;
  reason: string;
  justification: string;
  startedAt: string;
  endedAt?: string;
  duration?: number; // in minutes
  actionsCount: number;
  status: 'active' | 'completed' | 'expired';
  sessionRecording?: string;
}

export const privilegedSessions: PrivilegedSession[] = [
  {
    id: 'priv-sess-001',
    adminId: 'user-001',
    adminName: 'Rajesh Kumar',
    adminEmail: 'rajesh.kumar@acme-infra.com',
    approvedById: 'user-002',
    approvedByName: 'Priya Sharma',
    reason: 'Emergency access - Production database issue',
    justification: 'Critical production issue requiring immediate DBA access to resolve customer-impacting problem',
    startedAt: '2024-01-15T02:30:00Z',
    endedAt: '2024-01-15T03:15:00Z',
    duration: 45,
    actionsCount: 12,
    status: 'completed',
    sessionRecording: 'recording-001.mp4',
  },
  {
    id: 'priv-sess-002',
    adminId: 'user-001',
    adminName: 'Rajesh Kumar',
    adminEmail: 'rajesh.kumar@acme-infra.com',
    approvedById: 'user-002',
    approvedByName: 'Priya Sharma',
    reason: 'User access restoration',
    justification: 'Restore access for key user locked out due to MFA device loss',
    startedAt: '2024-01-14T14:00:00Z',
    endedAt: '2024-01-14T14:20:00Z',
    duration: 20,
    actionsCount: 5,
    status: 'completed',
    sessionRecording: 'recording-002.mp4',
  },
  {
    id: 'priv-sess-003',
    adminId: 'user-002',
    adminName: 'Priya Sharma',
    adminEmail: 'priya.sharma@acme-infra.com',
    approvedById: 'user-001',
    approvedByName: 'Rajesh Kumar',
    reason: 'Security incident investigation',
    justification: 'Investigate suspicious login attempts and potential security breach',
    startedAt: '2024-01-15T09:00:00Z',
    actionsCount: 8,
    status: 'active',
  },
];

// ═══════════════════════════════════════════════════════════
// DEVICES
// ═══════════════════════════════════════════════════════════

export interface Device {
  id: string;
  userId: string;
  userName: string;
  deviceName: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  platform: string;
  browser: string;
  trustLevel: 'trusted' | 'managed' | 'untrusted';
  mfaEnabled: boolean;
  registeredAt: string;
  lastSeenAt: string;
  status: 'active' | 'revoked';
  revokedAt?: string;
  revokedBy?: string;
  revokeReason?: string;
}

export const devices: Device[] = [
  {
    id: 'device-001',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    deviceName: 'Work Laptop - Windows',
    deviceType: 'desktop',
    platform: 'Windows 11',
    browser: 'Chrome 120',
    trustLevel: 'managed',
    mfaEnabled: true,
    registeredAt: '2023-01-01T00:00:00Z',
    lastSeenAt: '2024-01-15T11:30:00Z',
    status: 'active',
  },
  {
    id: 'device-002',
    userId: 'user-002',
    userName: 'Priya Sharma',
    deviceName: 'MacBook Pro',
    deviceType: 'desktop',
    platform: 'macOS Sonoma',
    browser: 'Safari 17',
    trustLevel: 'managed',
    mfaEnabled: true,
    registeredAt: '2023-01-01T00:00:00Z',
    lastSeenAt: '2024-01-15T11:25:00Z',
    status: 'active',
  },
  {
    id: 'device-003',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    deviceName: 'Samsung Galaxy S21',
    deviceType: 'mobile',
    platform: 'Android 11',
    browser: 'Chrome Mobile 120',
    trustLevel: 'trusted',
    mfaEnabled: true,
    registeredAt: '2023-04-01T00:00:00Z',
    lastSeenAt: '2024-01-15T11:20:00Z',
    status: 'active',
  },
  {
    id: 'device-004',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    deviceName: 'iPhone 14',
    deviceType: 'mobile',
    platform: 'iOS 17',
    browser: 'Safari Mobile 17',
    trustLevel: 'trusted',
    mfaEnabled: true,
    registeredAt: '2023-06-01T00:00:00Z',
    lastSeenAt: '2024-01-14T20:30:00Z',
    status: 'revoked',
    revokedAt: '2024-01-15T08:00:00Z',
    revokedBy: 'user-001',
    revokeReason: 'Device lost',
  },
];

// ═══════════════════════════════════════════════════════════
// MFA METHODS
// ═══════════════════════════════════════════════════════════

export interface MFAMethod {
  id: string;
  userId: string;
  userName: string;
  type: 'totp' | 'webauthn' | 'sms' | 'email';
  label: string;
  enabled: boolean;
  enrolledAt: string;
  lastUsedAt?: string;
  isDefault: boolean;
}

export const mfaMethods: MFAMethod[] = [
  {
    id: 'mfa-001',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    type: 'totp',
    label: 'Google Authenticator',
    enabled: true,
    enrolledAt: '2023-01-15T10:00:00Z',
    lastUsedAt: '2024-01-15T09:00:00Z',
    isDefault: true,
  },
  {
    id: 'mfa-002',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    type: 'webauthn',
    label: 'YubiKey 5',
    enabled: true,
    enrolledAt: '2023-06-01T14:00:00Z',
    lastUsedAt: '2024-01-14T08:30:00Z',
    isDefault: false,
  },
  {
    id: 'mfa-003',
    userId: 'user-002',
    userName: 'Priya Sharma',
    type: 'totp',
    label: 'Microsoft Authenticator',
    enabled: true,
    enrolledAt: '2023-02-01T09:00:00Z',
    lastUsedAt: '2024-01-15T09:15:00Z',
    isDefault: true,
  },
  {
    id: 'mfa-004',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    type: 'sms',
    label: '+91-9876543210',
    enabled: true,
    enrolledAt: '2023-04-01T08:00:00Z',
    lastUsedAt: '2024-01-15T08:30:00Z',
    isDefault: true,
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getSoDRuleById(id: string): SoDRule | undefined {
  return sodRules.find(r => r.id === id);
}

export function getSoDRuleByCode(code: string): SoDRule | undefined {
  return sodRules.find(r => r.code === code);
}

export function getViolationsByRule(ruleId: string): SoDViolation[] {
  return sodViolations.filter(v => v.ruleId === ruleId);
}

export function getViolationsByUser(userId: string): SoDViolation[] {
  return sodViolations.filter(v => v.userId === userId);
}

export function getActiveExceptions(): SoDException[] {
  return sodExceptions.filter(e => e.status === 'approved');
}

export function getExceptionsByUser(userId: string): SoDException[] {
  return sodExceptions.filter(e => e.userId === userId);
}

export function getExceptionsByRule(ruleId: string): SoDException[] {
  return sodExceptions.filter(e => e.ruleId === ruleId);
}

export function getViolationsByStatus(status: SoDViolation['status']): SoDViolation[] {
  return sodViolations.filter(v => v.status === status);
}

export function getExceptionsByStatus(status: SoDException['status']): SoDException[] {
  return sodExceptions.filter(e => e.status === status);
}

export function getCampaignById(id: string): AccessReviewCampaign | undefined {
  return accessReviewCampaigns.find(c => c.id === id);
}

export function getCampaignItems(campaignId: string): AccessReviewItem[] {
  return accessReviewItems.filter(i => i.campaignId === campaignId);
}

export function getDevicesByUser(userId: string): Device[] {
  return devices.filter(d => d.userId === userId);
}

export function getActiveDevices(userId: string): Device[] {
  return devices.filter(d => d.userId === userId && d.status === 'active');
}

export function getMFAMethodsByUser(userId: string): MFAMethod[] {
  return mfaMethods.filter(m => m.userId === userId);
}

export function getDefaultMFAMethod(userId: string): MFAMethod | undefined {
  return mfaMethods.find(m => m.userId === userId && m.isDefault);
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: 'var(--error-700)',
    high: 'var(--error-600)',
    medium: 'var(--warning-600)',
    low: 'var(--info-600)',
  };
  return colors[severity] || 'var(--text-muted)';
}

export function getSoDModeColor(mode: string): string {
  const colors: Record<string, string> = {
    enforce: 'var(--error-600)',
    observe: 'var(--warning-600)',
  };
  return colors[mode] || 'var(--text-muted)';
}

export function getViolationStatusColor(status: string): string {
  const colors: Record<string, string> = {
    blocked: 'var(--error-600)',
    allowed_exception: 'var(--warning-600)',
    detective_finding: 'var(--info-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getExceptionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    requested: 'var(--info-600)',
    approved: 'var(--success-600)',
    expired: 'var(--text-muted)',
    revoked: 'var(--error-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getCampaignStatusColor(status: string): string {
  const colors: Record<string, string> = {
    open: 'var(--info-600)',
    in_review: 'var(--warning-600)',
    closed: 'var(--success-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getReviewItemStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'var(--warning-600)',
    approved: 'var(--success-600)',
    revoked: 'var(--error-600)',
    expired: 'var(--text-muted)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getDeviceTrustColor(trustLevel: string): string {
  const colors: Record<string, string> = {
    trusted: 'var(--success-600)',
    managed: 'var(--info-600)',
    untrusted: 'var(--warning-600)',
  };
  return colors[trustLevel] || 'var(--text-muted)';
}
