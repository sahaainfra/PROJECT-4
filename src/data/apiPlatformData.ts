// ═══════════════════════════════════════════════════════════
// API PLATFORM DATA MODEL — Part 18
// API, Integration & Developer Platform
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// API CLIENTS
// ═══════════════════════════════════════════════════════════

export interface ApiClient {
  id: string;
  name: string;
  owner_id: string;
  owner_name: string;
  type: 'confidential' | 'public' | 'api_key';
  scopes_json: string[];
  company_scope_json: string[];
  ip_allowlist: string[];
  status: 'REQUESTED' | 'SECURITY_REVIEW' | 'APPROVED' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
  expires_at?: string;
  created_at: string;
  updated_at: string;
  rate_limit_per_minute: number;
  daily_quota: number;
}

// ═══════════════════════════════════════════════════════════
// API CREDENTIALS
// ═══════════════════════════════════════════════════════════

export interface ApiCredential {
  id: string;
  client_id: string;
  secret_ref: string;
  created_at: string;
  rotated_at?: string;
  expires_at?: string;
  last_used_at?: string;
  status: 'active' | 'expired' | 'revoked';
}

// ═══════════════════════════════════════════════════════════
// API AUDIT LOG
// ═══════════════════════════════════════════════════════════

export interface ApiAuditLog {
  id: string;
  client_id: string;
  client_name: string;
  user_id?: string;
  user_name?: string;
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  status: number;
  latency_ms: number;
  records_touched: number;
  correlation_id: string;
  ip_address: string;
  user_agent: string;
  at: string;
  error_message?: string;
}

// ═══════════════════════════════════════════════════════════
// API VERSIONS
// ═══════════════════════════════════════════════════════════

export interface ApiVersion {
  id: string;
  api: string;
  version: string;
  status: 'BETA' | 'GA' | 'DEPRECATED' | 'RETIRED';
  released_at: string;
  sunset_at?: string;
  changelog: string;
  breaking_changes: boolean;
  deprecated_message?: string;
}

// ═══════════════════════════════════════════════════════════
// BULK JOBS
// ═══════════════════════════════════════════════════════════

export interface BulkJob {
  id: string;
  client_id: string;
  client_name: string;
  type: 'import' | 'export';
  template_code: string;
  status: 'PENDING' | 'VALIDATING' | 'PREVIEW' | 'IMPORTING' | 'COMPLETED' | 'FAILED';
  file_id?: string;
  file_name?: string;
  report_file_id?: string;
  total_records: number;
  processed_records: number;
  success_records: number;
  error_records: number;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  created_by: string;
  error_summary?: string;
}

// ═══════════════════════════════════════════════════════════
// API CATALOGUE
// ═══════════════════════════════════════════════════════════

export interface ApiEndpoint {
  id: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  version: string;
  summary: string;
  description: string;
  tags: string[];
  required_scopes: string[];
  rate_limit_group: string;
  idempotency_required: boolean;
  deprecated: boolean;
  deprecated_message?: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const apiClients: ApiClient[] = [
  {
    id: 'client-001',
    name: 'Partner Accounting System',
    owner_id: 'user-003',
    owner_name: 'Amit Verma',
    type: 'confidential',
    scopes_json: ['finance.read', 'finance.write', 'procurement.read'],
    company_scope_json: ['company-001'],
    ip_allowlist: ['192.168.1.0/24', '10.0.0.0/8'],
    status: 'ACTIVE',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    rate_limit_per_minute: 100,
    daily_quota: 10000,
  },
  {
    id: 'client-002',
    name: 'Mobile Field App',
    owner_id: 'user-004',
    owner_name: 'Suresh Patel',
    type: 'public',
    scopes_json: ['project.read', 'attendance.read', 'attendance.write'],
    company_scope_json: ['company-001'],
    ip_allowlist: [],
    status: 'ACTIVE',
    created_at: '2024-01-05T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    rate_limit_per_minute: 60,
    daily_quota: 5000,
  },
  {
    id: 'client-003',
    name: 'BI Analytics Platform',
    owner_id: 'user-005',
    owner_name: 'Vikram Mehta',
    type: 'api_key',
    scopes_json: ['reports.read', 'project.read', 'finance.read'],
    company_scope_json: ['company-001'],
    ip_allowlist: ['203.0.113.50'],
    status: 'ACTIVE',
    expires_at: '2024-12-31T23:59:59Z',
    created_at: '2024-01-10T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
    rate_limit_per_minute: 30,
    daily_quota: 2000,
  },
  {
    id: 'client-004',
    name: 'Vendor Portal Integration',
    owner_id: 'user-006',
    owner_name: 'Anita Desai',
    type: 'confidential',
    scopes_json: ['procurement.read', 'procurement.write'],
    company_scope_json: ['company-001'],
    ip_allowlist: [],
    status: 'SECURITY_REVIEW',
    created_at: '2024-01-14T00:00:00Z',
    updated_at: '2024-01-14T00:00:00Z',
    rate_limit_per_minute: 50,
    daily_quota: 3000,
  },
  {
    id: 'client-005',
    name: 'Legacy System Sync',
    owner_id: 'user-007',
    owner_name: 'Meena Joshi',
    type: 'api_key',
    scopes_json: ['hr.read', 'attendance.read'],
    company_scope_json: ['company-001'],
    ip_allowlist: ['198.51.100.0/24'],
    status: 'SUSPENDED',
    expires_at: '2024-06-30T23:59:59Z',
    created_at: '2023-06-01T00:00:00Z',
    updated_at: '2024-01-10T00:00:00Z',
    rate_limit_per_minute: 20,
    daily_quota: 1000,
  },
];

export const apiCredentials: ApiCredential[] = [
  {
    id: 'cred-001',
    client_id: 'client-001',
    secret_ref: 'vault://api/clients/client-001/secret',
    created_at: '2024-01-01T00:00:00Z',
    rotated_at: '2024-01-15T00:00:00Z',
    last_used_at: '2024-01-16T10:30:00Z',
    status: 'active',
  },
  {
    id: 'cred-002',
    client_id: 'client-002',
    secret_ref: 'vault://api/clients/client-002/secret',
    created_at: '2024-01-05T00:00:00Z',
    last_used_at: '2024-01-16T09:15:00Z',
    status: 'active',
  },
  {
    id: 'cred-003',
    client_id: 'client-003',
    secret_ref: 'vault://api/clients/client-003/key',
    created_at: '2024-01-10T00:00:00Z',
    expires_at: '2024-12-31T23:59:59Z',
    last_used_at: '2024-01-16T08:00:00Z',
    status: 'active',
  },
  {
    id: 'cred-004',
    client_id: 'client-005',
    secret_ref: 'vault://api/clients/client-005/key',
    created_at: '2023-06-01T00:00:00Z',
    expires_at: '2024-06-30T23:59:59Z',
    status: 'revoked',
  },
];

export const apiAuditLogs: ApiAuditLog[] = [
  {
    id: 'audit-001',
    client_id: 'client-001',
    client_name: 'Partner Accounting System',
    user_id: 'user-003',
    user_name: 'Amit Verma',
    route: '/api/v1/finance/invoices',
    method: 'GET',
    status: 200,
    latency_ms: 245,
    records_touched: 50,
    correlation_id: 'corr-api-001',
    ip_address: '192.168.1.100',
    user_agent: 'AccountingSync/1.0',
    at: '2024-01-16T10:30:00Z',
  },
  {
    id: 'audit-002',
    client_id: 'client-002',
    client_name: 'Mobile Field App',
    user_id: 'user-017',
    user_name: 'Suresh Kumar',
    route: '/api/v1/attendance/mark',
    method: 'POST',
    status: 201,
    latency_ms: 120,
    records_touched: 1,
    correlation_id: 'corr-api-002',
    ip_address: '10.0.0.50',
    user_agent: 'MobileApp/2.1',
    at: '2024-01-16T09:15:00Z',
  },
  {
    id: 'audit-003',
    client_id: 'client-003',
    client_name: 'BI Analytics Platform',
    route: '/api/v1/reports/project-summary',
    method: 'GET',
    status: 200,
    latency_ms: 1520,
    records_touched: 1000,
    correlation_id: 'corr-api-003',
    ip_address: '203.0.113.50',
    user_agent: 'BIConnector/3.0',
    at: '2024-01-16T08:00:00Z',
  },
  {
    id: 'audit-004',
    client_id: 'client-001',
    client_name: 'Partner Accounting System',
    user_id: 'user-003',
    user_name: 'Amit Verma',
    route: '/api/v1/procurement/purchase-orders',
    method: 'POST',
    status: 403,
    latency_ms: 45,
    records_touched: 0,
    correlation_id: 'corr-api-004',
    ip_address: '192.168.1.100',
    user_agent: 'AccountingSync/1.0',
    at: '2024-01-15T14:20:00Z',
    error_message: 'Insufficient scope: requires procurement.write',
  },
  {
    id: 'audit-005',
    client_id: 'client-005',
    client_name: 'Legacy System Sync',
    route: '/api/v1/hr/employees',
    method: 'GET',
    status: 401,
    latency_ms: 12,
    records_touched: 0,
    correlation_id: 'corr-api-005',
    ip_address: '198.51.100.25',
    user_agent: 'LegacySync/1.0',
    at: '2024-01-15T11:00:00Z',
    error_message: 'Client suspended',
  },
];

export const apiVersions: ApiVersion[] = [
  {
    id: 'ver-001',
    api: 'Core ERP API',
    version: 'v1',
    status: 'GA',
    released_at: '2023-01-01T00:00:00Z',
    changelog: 'Initial stable release with full ERP functionality',
    breaking_changes: false,
  },
  {
    id: 'ver-002',
    api: 'Core ERP API',
    version: 'v2',
    status: 'BETA',
    released_at: '2024-01-01T00:00:00Z',
    changelog: 'Enhanced pagination, improved error messages, new bulk operations',
    breaking_changes: false,
  },
  {
    id: 'ver-003',
    api: 'Finance API',
    version: 'v1',
    status: 'GA',
    released_at: '2023-03-01T00:00:00Z',
    changelog: 'Invoice management, payment processing, financial reports',
    breaking_changes: false,
  },
  {
    id: 'ver-004',
    api: 'Procurement API',
    version: 'v1',
    status: 'DEPRECATED',
    released_at: '2023-02-01T00:00:00Z',
    sunset_at: '2024-08-01T00:00:00Z',
    changelog: 'Purchase orders, requisitions, vendor management',
    breaking_changes: false,
    deprecated_message: 'Please migrate to v2 by 2024-08-01. New endpoints support enhanced workflow integration.',
  },
  {
    id: 'ver-005',
    api: 'Procurement API',
    version: 'v2',
    status: 'GA',
    released_at: '2024-01-10T00:00:00Z',
    changelog: 'Enhanced procurement workflow, approval chains, integration with inventory',
    breaking_changes: true,
  },
];

export const bulkJobs: BulkJob[] = [
  {
    id: 'job-001',
    client_id: 'client-001',
    client_name: 'Partner Accounting System',
    type: 'import',
    template_code: 'INVOICE_IMPORT',
    status: 'COMPLETED',
    file_id: 'file-001',
    file_name: 'invoices_jan2024.xlsx',
    report_file_id: 'report-001',
    total_records: 150,
    processed_records: 150,
    success_records: 145,
    error_records: 5,
    started_at: '2024-01-15T10:00:00Z',
    completed_at: '2024-01-15T10:05:00Z',
    created_at: '2024-01-15T09:55:00Z',
    created_by: 'user-003',
    error_summary: '5 records failed validation: invalid GSTIN format',
  },
  {
    id: 'job-002',
    client_id: 'client-003',
    client_name: 'BI Analytics Platform',
    type: 'export',
    template_code: 'PROJECT_DATA_EXPORT',
    status: 'COMPLETED',
    file_name: 'project_data_20240116.xlsx',
    report_file_id: 'report-002',
    total_records: 500,
    processed_records: 500,
    success_records: 500,
    error_records: 0,
    started_at: '2024-01-16T08:00:00Z',
    completed_at: '2024-01-16T08:02:00Z',
    created_at: '2024-01-16T07:55:00Z',
    created_by: 'user-005',
  },
  {
    id: 'job-003',
    client_id: 'client-002',
    client_name: 'Mobile Field App',
    type: 'import',
    template_code: 'ATTENDANCE_BULK_IMPORT',
    status: 'IMPORTING',
    file_id: 'file-003',
    file_name: 'attendance_batch_001.csv',
    total_records: 2000,
    processed_records: 1200,
    success_records: 1180,
    error_records: 20,
    started_at: '2024-01-16T11:00:00Z',
    created_at: '2024-01-16T10:55:00Z',
    created_by: 'user-004',
  },
  {
    id: 'job-004',
    client_id: 'client-001',
    client_name: 'Partner Accounting System',
    type: 'import',
    template_code: 'PAYMENT_IMPORT',
    status: 'FAILED',
    file_id: 'file-004',
    file_name: 'payments_jan2024.xlsx',
    report_file_id: 'report-004',
    total_records: 100,
    processed_records: 100,
    success_records: 0,
    error_records: 100,
    started_at: '2024-01-14T15:00:00Z',
    completed_at: '2024-01-14T15:01:00Z',
    created_at: '2024-01-14T14:55:00Z',
    created_by: 'user-003',
    error_summary: 'File format validation failed: missing required columns [payment_date, amount]',
  },
];

export const apiEndpoints: ApiEndpoint[] = [
  {
    id: 'ep-001',
    path: '/api/v1/projects',
    method: 'GET',
    version: 'v1',
    summary: 'List all projects',
    description: 'Retrieve a paginated list of projects with optional filtering',
    tags: ['projects'],
    required_scopes: ['project.read'],
    rate_limit_group: 'standard',
    idempotency_required: false,
    deprecated: false,
  },
  {
    id: 'ep-002',
    path: '/api/v1/projects/{id}',
    method: 'GET',
    version: 'v1',
    summary: 'Get project details',
    description: 'Retrieve detailed information about a specific project',
    tags: ['projects'],
    required_scopes: ['project.read'],
    rate_limit_group: 'standard',
    idempotency_required: false,
    deprecated: false,
  },
  {
    id: 'ep-003',
    path: '/api/v1/procurement/purchase-orders',
    method: 'POST',
    version: 'v1',
    summary: 'Create purchase order',
    description: 'Create a new purchase order with line items',
    tags: ['procurement'],
    required_scopes: ['procurement.write'],
    rate_limit_group: 'write',
    idempotency_required: true,
    deprecated: true,
    deprecated_message: 'Use /api/v2/procurement/purchase-orders instead',
  },
  {
    id: 'ep-004',
    path: '/api/v2/procurement/purchase-orders',
    method: 'POST',
    version: 'v2',
    summary: 'Create purchase order (v2)',
    description: 'Create a new purchase order with enhanced workflow integration',
    tags: ['procurement'],
    required_scopes: ['procurement.write'],
    rate_limit_group: 'write',
    idempotency_required: true,
    deprecated: false,
  },
  {
    id: 'ep-005',
    path: '/api/v1/finance/invoices',
    method: 'GET',
    version: 'v1',
    summary: 'List invoices',
    description: 'Retrieve invoices with filtering and pagination',
    tags: ['finance'],
    required_scopes: ['finance.read'],
    rate_limit_group: 'standard',
    idempotency_required: false,
    deprecated: false,
  },
  {
    id: 'ep-006',
    path: '/api/v1/attendance/mark',
    method: 'POST',
    version: 'v1',
    summary: 'Mark attendance',
    description: 'Mark attendance for an employee at a specific time',
    tags: ['hr', 'attendance'],
    required_scopes: ['attendance.write'],
    rate_limit_group: 'write',
    idempotency_required: true,
    deprecated: false,
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getClientById(id: string): ApiClient | undefined {
  return apiClients.find(c => c.id === id);
}

export function getClientsByStatus(status: string): ApiClient[] {
  return apiClients.filter(c => c.status === status);
}

export function getCredentialsByClient(clientId: string): ApiCredential[] {
  return apiCredentials.filter(c => c.client_id === clientId);
}

export function getAuditLogsByClient(clientId: string): ApiAuditLog[] {
  return apiAuditLogs.filter(l => l.client_id === clientId);
}

export function getVersionsByApi(api: string): ApiVersion[] {
  return apiVersions.filter(v => v.api === api);
}

export function getBulkJobsByClient(clientId: string): BulkJob[] {
  return bulkJobs.filter(j => j.client_id === clientId);
}

export function getEndpointsByVersion(version: string): ApiEndpoint[] {
  return apiEndpoints.filter(e => e.version === version);
}

export function getEndpointsByTag(tag: string): ApiEndpoint[] {
  return apiEndpoints.filter(e => e.tags.includes(tag));
}

export function getClientStatusColor(status: string): string {
  const colors: Record<string, string> = {
    REQUESTED: 'var(--info-600)',
    SECURITY_REVIEW: 'var(--warning-600)',
    APPROVED: 'var(--success-600)',
    ACTIVE: 'var(--success-600)',
    SUSPENDED: 'var(--error-600)',
    REVOKED: 'var(--text-muted)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getVersionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    BETA: 'var(--info-600)',
    GA: 'var(--success-600)',
    DEPRECATED: 'var(--warning-600)',
    RETIRED: 'var(--text-muted)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getBulkJobStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'var(--info-600)',
    VALIDATING: 'var(--warning-600)',
    PREVIEW: 'var(--info-600)',
    IMPORTING: 'var(--warning-600)',
    COMPLETED: 'var(--success-600)',
    FAILED: 'var(--error-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getHttpMethodColor(method: string): string {
  const colors: Record<string, string> = {
    GET: 'var(--info-600)',
    POST: 'var(--success-600)',
    PUT: 'var(--warning-600)',
    PATCH: 'var(--warning-600)',
    DELETE: 'var(--error-600)',
  };
  return colors[method] || 'var(--text-muted)';
}

export function getHttpStatusColor(status: number): string {
  if (status >= 200 && status < 300) return 'var(--success-600)';
  if (status >= 300 && status < 400) return 'var(--info-600)';
  if (status >= 400 && status < 500) return 'var(--warning-600)';
  if (status >= 500) return 'var(--error-600)';
  return 'var(--text-muted)';
}
