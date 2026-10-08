// ═══════════════════════════════════════════════════════════
// SECURITY DATA MODEL — Part 08
// Secure-by-Design Foundation
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// ROUTE REGISTRY
// ═══════════════════════════════════════════════════════════

export interface RouteRegistryEntry {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  pathPattern: string;
  apiVersion: string;
  permissionKey: string;
  scopeRule: 'company' | 'project' | 'site' | 'department' | 'resource_owner' | 'public';
  schemaRef?: string;
  rateLimitGroup: string;
  idempotencyRequired: boolean;
  auditEvent?: string;
  ownerModule: string;
  registeredAt: string;
  status: 'active' | 'deprecated' | 'blocked';
}

export const routeRegistry: RouteRegistryEntry[] = [
  {
    id: 'route-001',
    method: 'GET',
    pathPattern: '/api/v1/projects',
    apiVersion: 'v1',
    permissionKey: 'project.view',
    scopeRule: 'project',
    schemaRef: 'ProjectListSchema',
    rateLimitGroup: 'api',
    idempotencyRequired: false,
    auditEvent: 'project.list',
    ownerModule: 'projects',
    registeredAt: '2024-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'route-002',
    method: 'POST',
    pathPattern: '/api/v1/projects',
    apiVersion: 'v1',
    permissionKey: 'project.create',
    scopeRule: 'company',
    schemaRef: 'ProjectCreateSchema',
    rateLimitGroup: 'api',
    idempotencyRequired: true,
    auditEvent: 'project.create',
    ownerModule: 'projects',
    registeredAt: '2024-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'route-003',
    method: 'POST',
    pathPattern: '/api/v1/purchase-orders',
    apiVersion: 'v1',
    permissionKey: 'procurement.po.create',
    scopeRule: 'project',
    schemaRef: 'PurchaseOrderCreateSchema',
    rateLimitGroup: 'api',
    idempotencyRequired: true,
    auditEvent: 'procurement.po.create',
    ownerModule: 'procurement',
    registeredAt: '2024-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'route-004',
    method: 'POST',
    pathPattern: '/api/v1/purchase-orders/:id/approve',
    apiVersion: 'v1',
    permissionKey: 'procurement.po.approve',
    scopeRule: 'project',
    schemaRef: 'ApprovalSchema',
    rateLimitGroup: 'api',
    idempotencyRequired: true,
    auditEvent: 'procurement.po.approve',
    ownerModule: 'procurement',
    registeredAt: '2024-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'route-005',
    method: 'POST',
    pathPattern: '/api/v1/auth/login',
    apiVersion: 'v1',
    permissionKey: 'auth.login',
    scopeRule: 'public',
    schemaRef: 'LoginSchema',
    rateLimitGroup: 'login',
    idempotencyRequired: false,
    auditEvent: 'auth.login',
    ownerModule: 'auth',
    registeredAt: '2024-01-01T00:00:00Z',
    status: 'active',
  },
  {
    id: 'route-006',
    method: 'POST',
    pathPattern: '/api/v1/auth/mfa/verify',
    apiVersion: 'v1',
    permissionKey: 'auth.mfa.verify',
    scopeRule: 'public',
    schemaRef: 'MFAVerifySchema',
    rateLimitGroup: 'otp',
    idempotencyRequired: false,
    auditEvent: 'auth.mfa.verify',
    ownerModule: 'auth',
    registeredAt: '2024-01-01T00:00:00Z',
    status: 'active',
  },
];

// ═══════════════════════════════════════════════════════════
// PIPELINE POLICIES
// ═══════════════════════════════════════════════════════════

export interface PipelinePolicy {
  id: string;
  gate: 'sast' | 'dast' | 'secrets' | 'dependency' | 'container' | 'licence' | 'sbom' | 'security_tests' | 'unit' | 'integration' | 'regression';
  environment: 'development' | 'staging' | 'production';
  blockThreshold: 'critical' | 'high' | 'medium' | 'low' | 'none';
  exceptionRequires: 'ciso' | 'ciso_management' | 'security_lead';
  approvedBy?: string;
  effectiveFrom: string;
}

export const pipelinePolicies: PipelinePolicy[] = [
  {
    id: 'policy-001',
    gate: 'secrets',
    environment: 'production',
    blockThreshold: 'critical',
    exceptionRequires: 'ciso_management',
    approvedBy: 'CISO',
    effectiveFrom: '2024-01-01T00:00:00Z',
  },
  {
    id: 'policy-002',
    gate: 'dependency',
    environment: 'production',
    blockThreshold: 'high',
    exceptionRequires: 'ciso',
    approvedBy: 'Security Lead',
    effectiveFrom: '2024-01-01T00:00:00Z',
  },
  {
    id: 'policy-003',
    gate: 'sast',
    environment: 'production',
    blockThreshold: 'critical',
    exceptionRequires: 'ciso',
    approvedBy: 'Security Lead',
    effectiveFrom: '2024-01-01T00:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// PIPELINE RUNS
// ═══════════════════════════════════════════════════════════

export interface PipelineRun {
  id: string;
  buildRef: string;
  commitSha: string;
  gate: string;
  result: 'pass' | 'fail' | 'waived';
  findingsBySeverity: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  reportDocumentId?: string;
  at: string;
}

export const pipelineRuns: PipelineRun[] = [
  {
    id: 'run-001',
    buildRef: 'build-1234',
    commitSha: 'abc123def456',
    gate: 'secrets',
    result: 'pass',
    findingsBySeverity: { critical: 0, high: 0, medium: 0, low: 0 },
    at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'run-002',
    buildRef: 'build-1234',
    commitSha: 'abc123def456',
    gate: 'dependency',
    result: 'pass',
    findingsBySeverity: { critical: 0, high: 0, medium: 2, low: 5 },
    at: '2024-01-15T10:05:00Z',
  },
  {
    id: 'run-003',
    buildRef: 'build-1235',
    commitSha: 'def456ghi789',
    gate: 'sast',
    result: 'fail',
    findingsBySeverity: { critical: 1, high: 2, medium: 3, low: 8 },
    reportDocumentId: 'doc-sast-1235',
    at: '2024-01-15T11:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// RISK ACCEPTANCES
// ═══════════════════════════════════════════════════════════

export interface RiskAcceptance {
  id: string;
  findingRef: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  justification: string;
  compensatingControls: string;
  approvedBy: string;
  expiresAt: string;
  status: 'active' | 'expired' | 'revoked';
  requestedAt: string;
  approvedAt: string;
}

export const riskAcceptances: RiskAcceptance[] = [
  {
    id: 'risk-001',
    findingRef: 'CVE-2024-1234',
    severity: 'medium',
    justification: 'Library not exposed to external input; mitigation planned for Q2',
    compensatingControls: 'Input validation at API layer; WAF rules in place',
    approvedBy: 'CISO',
    expiresAt: '2024-06-30T23:59:59Z',
    status: 'active',
    requestedAt: '2024-01-10T09:00:00Z',
    approvedAt: '2024-01-10T14:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// DEPENDENCIES
// ═══════════════════════════════════════════════════════════

export interface Dependency {
  id: string;
  ecosystem: 'npm' | 'pypi' | 'maven' | 'nuget' | 'go' | 'rubygems';
  package: string;
  version: string;
  sourceRegistry: string;
  licenceSpdx: string;
  openAdvisories: number;
  addedBy: string;
  reviewedBy?: string;
  status: 'approved' | 'blocked' | 'deprecated';
  addedAt: string;
  reviewedAt?: string;
}

export const dependencies: Dependency[] = [
  {
    id: 'dep-001',
    ecosystem: 'npm',
    package: 'react',
    version: '18.2.0',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 0,
    addedBy: 'dev-team',
    reviewedBy: 'Security Lead',
    status: 'approved',
    addedAt: '2024-01-01T00:00:00Z',
    reviewedAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 'dep-002',
    ecosystem: 'npm',
    package: 'express',
    version: '4.18.2',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 0,
    addedBy: 'dev-team',
    reviewedBy: 'Security Lead',
    status: 'approved',
    addedAt: '2024-01-01T00:00:00Z',
    reviewedAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 'dep-003',
    ecosystem: 'npm',
    package: 'vulnerable-package',
    version: '1.0.0',
    sourceRegistry: 'https://registry.npmjs.org',
    licenceSpdx: 'MIT',
    openAdvisories: 2,
    addedBy: 'dev-team',
    status: 'blocked',
    addedAt: '2024-01-05T00:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// SECURITY POLICIES
// ═══════════════════════════════════════════════════════════

export interface SecurityPolicy {
  id: string;
  passwordMinLength: number;
  passwordComplexity: 'low' | 'medium' | 'high';
  passwordHistoryCount: number;
  lockoutThreshold: number;
  lockoutMinutes: number;
  sessionIdleMinutes: number;
  sessionAbsoluteHours: number;
  maxConcurrentSessionsPrivileged: number;
  mfaRequiredRoles: string[];
  effectiveFrom: string;
  approvedBy: string;
}

export const securityPolicies: SecurityPolicy[] = [
  {
    id: 'policy-sec-001',
    passwordMinLength: 12,
    passwordComplexity: 'high',
    passwordHistoryCount: 5,
    lockoutThreshold: 5,
    lockoutMinutes: 30,
    sessionIdleMinutes: 30,
    sessionAbsoluteHours: 24,
    maxConcurrentSessionsPrivileged: 2,
    mfaRequiredRoles: ['SUPER_ADMIN', 'ACCOUNTS_MANAGER', 'APPROVER_L3'],
    effectiveFrom: '2024-01-01T00:00:00Z',
    approvedBy: 'CISO',
  },
];

// ═══════════════════════════════════════════════════════════
// RATE LIMIT POLICIES
// ═══════════════════════════════════════════════════════════

export interface RateLimitPolicy {
  id: string;
  group: 'login' | 'otp' | 'reset' | 'api' | 'upload' | 'messaging' | 'search' | 'report' | 'import' | 'export' | 'socket';
  role?: string;
  limit: number;
  windowSeconds: number;
  burst: number;
  action: 'throttle' | 'block' | 'challenge';
}

export const rateLimitPolicies: RateLimitPolicy[] = [
  {
    id: 'rate-001',
    group: 'login',
    limit: 5,
    windowSeconds: 300,
    burst: 2,
    action: 'block',
  },
  {
    id: 'rate-002',
    group: 'otp',
    limit: 3,
    windowSeconds: 60,
    burst: 1,
    action: 'block',
  },
  {
    id: 'rate-003',
    group: 'api',
    limit: 100,
    windowSeconds: 60,
    burst: 20,
    action: 'throttle',
  },
  {
    id: 'rate-004',
    group: 'upload',
    limit: 10,
    windowSeconds: 60,
    burst: 5,
    action: 'throttle',
  },
];

// ═══════════════════════════════════════════════════════════
// UPLOAD POLICIES
// ═══════════════════════════════════════════════════════════

export interface UploadPolicy {
  id: string;
  context: 'document' | 'avatar' | 'attachment' | 'import';
  allowedMime: string[];
  magicByteCheck: boolean;
  maxBytes: number;
  scanRequired: boolean;
  storageClass: 'private' | 'public';
}

export const uploadPolicies: UploadPolicy[] = [
  {
    id: 'upload-001',
    context: 'document',
    allowedMime: ['application/pdf', 'image/png', 'image/jpeg'],
    magicByteCheck: true,
    maxBytes: 10485760, // 10 MB
    scanRequired: true,
    storageClass: 'private',
  },
  {
    id: 'upload-002',
    context: 'avatar',
    allowedMime: ['image/png', 'image/jpeg'],
    magicByteCheck: true,
    maxBytes: 1048576, // 1 MB
    scanRequired: false,
    storageClass: 'public',
  },
];

// ═══════════════════════════════════════════════════════════
// LEGACY FINDINGS
// ═══════════════════════════════════════════════════════════

export interface LegacyFinding {
  id: string;
  type: 'string_sql' | 'missing_authz' | 'hardcoded_secret' | 'tls_verification_disabled' | 'wildcard_cors' | 'unsafe_upload' | 'verbose_errors' | 'client_only_authz';
  location: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  remediationPlan: string;
  flagCode?: string;
  status: 'open' | 'planned' | 'fixed_behind_flag' | 'verified' | 'closed';
  discoveredAt: string;
  plannedFixDate?: string;
  fixedAt?: string;
}

export const legacyFindings: LegacyFinding[] = [
  {
    id: 'finding-001',
    type: 'string_sql',
    location: 'server/services/legacyReport.js:45',
    severity: 'high',
    remediationPlan: 'Migrate to parameterized queries',
    flagCode: 'ff.legacy.report',
    status: 'planned',
    discoveredAt: '2024-01-01T00:00:00Z',
    plannedFixDate: '2024-03-01T00:00:00Z',
  },
  {
    id: 'finding-002',
    type: 'missing_authz',
    location: 'server/routes/inventory.js:78',
    severity: 'critical',
    remediationPlan: 'Add server-side authorization check',
    flagCode: 'ff.legacy.inventory',
    status: 'fixed_behind_flag',
    discoveredAt: '2024-01-01T00:00:00Z',
    fixedAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'finding-003',
    type: 'verbose_errors',
    location: 'server/middleware/errorHandler.js:23',
    severity: 'medium',
    remediationPlan: 'Return generic error messages with correlation IDs',
    status: 'open',
    discoveredAt: '2024-01-01T00:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// SECRET REFERENCES
// ═══════════════════════════════════════════════════════════

export interface SecretRef {
  id: string;
  name: string;
  environment: 'development' | 'staging' | 'production';
  vaultPath: string;
  owner: string;
  rotationDays: number;
  lastRotatedAt: string;
  nextRotationAt: string;
}

export const secretRefs: SecretRef[] = [
  {
    id: 'secret-001',
    name: 'DATABASE_URL',
    environment: 'production',
    vaultPath: 'secret/data/erp/prod/database',
    owner: 'Platform Team',
    rotationDays: 90,
    lastRotatedAt: '2024-01-01T00:00:00Z',
    nextRotationAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'secret-002',
    name: 'JWT_SECRET',
    environment: 'production',
    vaultPath: 'secret/data/erp/prod/jwt',
    owner: 'Security Team',
    rotationDays: 30,
    lastRotatedAt: '2024-01-10T00:00:00Z',
    nextRotationAt: '2024-02-10T00:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getRouteByPath(method: string, path: string): RouteRegistryEntry | undefined {
  return routeRegistry.find(r => r.method === method && r.pathPattern === path);
}

export function getUnregisteredRoutes(): string[] {
  // In a real implementation, this would compare registered routes vs actual routes
  return [];
}

export function getBlockedBuilds(): PipelineRun[] {
  return pipelineRuns.filter(run => run.result === 'fail');
}

export function getExpiringRiskAcceptances(daysUntilExpiry: number = 30): RiskAcceptance[] {
  const now = new Date();
  const expiryThreshold = new Date(now.getTime() + daysUntilExpiry * 24 * 60 * 60 * 1000);
  
  return riskAcceptances.filter(ra => {
    const expiresAt = new Date(ra.expiresAt);
    return ra.status === 'active' && expiresAt <= expiryThreshold;
  });
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

export function getPipelineResultColor(result: string): string {
  const colors: Record<string, string> = {
    pass: 'var(--success-600)',
    fail: 'var(--error-600)',
    waived: 'var(--warning-600)',
  };
  return colors[result] || 'var(--text-muted)';
}
