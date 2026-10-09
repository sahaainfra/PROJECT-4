// ═══════════════════════════════════════════════════════════
// OBSERVABILITY DATA — Part 10
// Observability, Performance & Reliability
// ═══════════════════════════════════════════════════════════

export interface SLO {
  id: string;
  code: string;
  journey: string;
  target_pct: number;
  window_days: number;
  current_pct: number;
  error_budget_remaining: number;
  owner_id: string;
  owner_name: string;
  status: 'healthy' | 'warning' | 'critical';
  last_updated: string;
}

export interface Incident {
  id: string;
  code: string;
  severity: 'SEV1' | 'SEV2' | 'SEV3' | 'SEV4';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'MITIGATED' | 'RESOLVED' | 'REVIEWED';
  title: string;
  summary: string;
  started_at: string;
  detected_by: string;
  owner_id: string;
  owner_name: string;
  root_cause?: string;
  actions?: string[];
  reviewed_at?: string;
  duration_minutes?: number;
}

export interface AlertRule {
  id: string;
  code: string;
  name: string;
  metric: string;
  condition: string;
  threshold: number;
  severity: 'critical' | 'warning' | 'info';
  runbook_url: string;
  owner_id: string;
  owner_name: string;
  status: 'active' | 'disabled';
  last_triggered?: string;
}

export interface CapacityRun {
  id: string;
  scenario: string;
  run_at: string;
  passed: boolean;
  volumes: {
    projects: number;
    boq_lines: number;
    stock_transactions: number;
    attendance_records: number;
    dpr_photos: number;
    concurrent_users: number;
  };
  results: {
    avg_response_ms: number;
    p95_response_ms: number;
    p99_response_ms: number;
    error_rate_pct: number;
    throughput_rps: number;
  };
  notes?: string;
}

export interface HealthCheck {
  id: string;
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  response_time_ms: number;
  last_checked: string;
  details?: string;
}

export interface Metric {
  id: string;
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  value: number;
  labels: Record<string, string>;
  timestamp: string;
}

export interface SlowQuery {
  id: string;
  query_fingerprint: string;
  query_text: string;
  duration_ms: number;
  called_at: string;
  database: string;
  rows_examined: number;
  rows_returned: number;
  index_used: boolean;
}

export interface QueueJob {
  id: string;
  queue_name: string;
  job_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'dead_letter';
  created_at: string;
  started_at?: string;
  completed_at?: string;
  duration_ms?: number;
  retries: number;
  error?: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const slos: SLO[] = [
  {
    id: 'slo-001',
    code: 'SLO-LOGIN',
    journey: 'User Login',
    target_pct: 99.9,
    window_days: 30,
    current_pct: 99.95,
    error_budget_remaining: 43.2,
    owner_id: 'user-001',
    owner_name: 'Rajesh Kumar',
    status: 'healthy',
    last_updated: '2024-01-16T12:00:00Z',
  },
  {
    id: 'slo-002',
    code: 'SLO-DASHBOARD',
    journey: 'Dashboard Load',
    target_pct: 99.5,
    window_days: 30,
    current_pct: 99.2,
    error_budget_remaining: -60.0,
    owner_id: 'user-002',
    owner_name: 'Priya Sharma',
    status: 'critical',
    last_updated: '2024-01-16T12:00:00Z',
  },
  {
    id: 'slo-003',
    code: 'SLO-POSTING',
    journey: 'Transaction Posting',
    target_pct: 99.95,
    window_days: 30,
    current_pct: 99.98,
    error_budget_remaining: 86.4,
    owner_id: 'user-003',
    owner_name: 'Amit Verma',
    status: 'healthy',
    last_updated: '2024-01-16T12:00:00Z',
  },
  {
    id: 'slo-004',
    code: 'SLO-UPLOAD',
    journey: 'Document Upload',
    target_pct: 99.0,
    window_days: 30,
    current_pct: 99.1,
    error_budget_remaining: 27.0,
    owner_id: 'user-004',
    owner_name: 'Suresh Patel',
    status: 'healthy',
    last_updated: '2024-01-16T12:00:00Z',
  },
  {
    id: 'slo-005',
    code: 'SLO-REPORT',
    journey: 'Report Generation',
    target_pct: 98.0,
    window_days: 30,
    current_pct: 97.5,
    error_budget_remaining: -10.0,
    owner_id: 'user-005',
    owner_name: 'Vikram Mehta',
    status: 'warning',
    last_updated: '2024-01-16T12:00:00Z',
  },
];

export const incidents: Incident[] = [
  {
    id: 'inc-001',
    code: 'INC-2024-001',
    severity: 'SEV2',
    status: 'RESOLVED',
    title: 'Dashboard Load Time Degradation',
    summary: 'Dashboard load times exceeded 5s threshold for 15% of requests',
    started_at: '2024-01-15T09:30:00Z',
    detected_by: 'SLO Burn Rate Alert',
    owner_id: 'user-002',
    owner_name: 'Priya Sharma',
    root_cause: 'Missing database index on project_summary table',
    actions: [
      'Added composite index on (company_id, project_id, updated_at)',
      'Implemented query result caching with 5min TTL',
      'Added monitoring for dashboard query performance',
    ],
    reviewed_at: '2024-01-15T14:00:00Z',
    duration_minutes: 270,
  },
  {
    id: 'inc-002',
    code: 'INC-2024-002',
    severity: 'SEV3',
    status: 'MITIGATED',
    title: 'Email Notification Delays',
    summary: 'Email notifications delayed by 10-15 minutes due to queue backlog',
    started_at: '2024-01-16T08:15:00Z',
    detected_by: 'Queue Depth Alert',
    owner_id: 'user-003',
    owner_name: 'Amit Verma',
    root_cause: 'Email service provider rate limiting',
    actions: [
      'Increased worker concurrency from 5 to 15',
      'Implemented retry backoff strategy',
      'Added fallback to secondary email provider',
    ],
    duration_minutes: 45,
  },
  {
    id: 'inc-003',
    code: 'INC-2024-003',
    severity: 'SEV1',
    status: 'OPEN',
    title: 'Payment Processing Failures',
    summary: '15% of payment transactions failing with timeout errors',
    started_at: '2024-01-16T11:45:00Z',
    detected_by: 'Error Rate Alert',
    owner_id: 'user-001',
    owner_name: 'Rajesh Kumar',
    duration_minutes: 15,
  },
];

export const alertRules: AlertRule[] = [
  {
    id: 'alert-001',
    code: 'ALERT-SLO-BURN',
    name: 'SLO Burn Rate > 2x',
    metric: 'slo_burn_rate',
    condition: 'burn_rate > 2.0 for 5m',
    threshold: 2.0,
    severity: 'critical',
    runbook_url: 'https://wiki.acme-infra.com/runbooks/slo-burn',
    owner_id: 'user-001',
    owner_name: 'Rajesh Kumar',
    status: 'active',
    last_triggered: '2024-01-16T08:30:00Z',
  },
  {
    id: 'alert-002',
    code: 'ALERT-ERROR-RATE',
    name: 'API Error Rate > 5%',
    metric: 'api_error_rate',
    condition: 'error_rate > 0.05 for 5m',
    threshold: 0.05,
    severity: 'critical',
    runbook_url: 'https://wiki.acme-infra.com/runbooks/api-errors',
    owner_id: 'user-002',
    owner_name: 'Priya Sharma',
    status: 'active',
    last_triggered: '2024-01-16T11:45:00Z',
  },
  {
    id: 'alert-003',
    code: 'ALERT-QUEUE-DEPTH',
    name: 'Queue Depth > 1000',
    metric: 'queue_depth',
    condition: 'depth > 1000 for 10m',
    threshold: 1000,
    severity: 'warning',
    runbook_url: 'https://wiki.acme-infra.com/runbooks/queue-depth',
    owner_id: 'user-003',
    owner_name: 'Amit Verma',
    status: 'active',
    last_triggered: '2024-01-16T08:15:00Z',
  },
  {
    id: 'alert-004',
    code: 'ALERT-SLOW-QUERY',
    name: 'Slow Query Count > 50/hour',
    metric: 'slow_query_count',
    condition: 'count > 50 for 1h',
    threshold: 50,
    severity: 'warning',
    runbook_url: 'https://wiki.acme-infra.com/runbooks/slow-queries',
    owner_id: 'user-004',
    owner_name: 'Suresh Patel',
    status: 'active',
  },
  {
    id: 'alert-005',
    code: 'ALERT-AUDIT-INTEGRITY',
    name: 'Audit Hash Chain Broken',
    metric: 'audit_integrity_check',
    condition: 'integrity_check == false',
    threshold: 0,
    severity: 'critical',
    runbook_url: 'https://wiki.acme-infra.com/runbooks/audit-integrity',
    owner_id: 'user-001',
    owner_name: 'Rajesh Kumar',
    status: 'active',
  },
];

export const capacityRuns: CapacityRun[] = [
  {
    id: 'cap-001',
    scenario: 'Peak Load - All Modules',
    run_at: '2024-01-14T02:00:00Z',
    passed: true,
    volumes: {
      projects: 500,
      boq_lines: 2000000,
      stock_transactions: 50000000,
      attendance_records: 20000000,
      dpr_photos: 5000000,
      concurrent_users: 1000,
    },
    results: {
      avg_response_ms: 245,
      p95_response_ms: 480,
      p99_response_ms: 890,
      error_rate_pct: 0.12,
      throughput_rps: 850,
    },
    notes: 'All performance targets met. Database connection pool optimized.',
  },
  {
    id: 'cap-002',
    scenario: 'Stress Test - 2x Peak',
    run_at: '2024-01-10T02:00:00Z',
    passed: false,
    volumes: {
      projects: 1000,
      boq_lines: 4000000,
      stock_transactions: 100000000,
      attendance_records: 40000000,
      dpr_photos: 10000000,
      concurrent_users: 2000,
    },
    results: {
      avg_response_ms: 1250,
      p95_response_ms: 3200,
      p99_response_ms: 5800,
      error_rate_pct: 2.8,
      throughput_rps: 420,
    },
    notes: 'Failed: P95 latency exceeded 3s target. Requires database sharding and read replica implementation.',
  },
];

export const healthChecks: HealthCheck[] = [
  {
    id: 'health-001',
    service: 'PostgreSQL Primary',
    status: 'healthy',
    response_time_ms: 12,
    last_checked: '2024-01-16T12:00:00Z',
    details: '5 active connections, 0 waiting',
  },
  {
    id: 'health-002',
    service: 'Redis Cache',
    status: 'healthy',
    response_time_ms: 3,
    last_checked: '2024-01-16T12:00:00Z',
    details: 'Memory usage: 45%, Hit rate: 94%',
  },
  {
    id: 'health-003',
    service: 'RabbitMQ',
    status: 'healthy',
    response_time_ms: 8,
    last_checked: '2024-01-16T12:00:00Z',
    details: '3 queues, 45 pending messages',
  },
  {
    id: 'health-004',
    service: 'MinIO Storage',
    status: 'healthy',
    response_time_ms: 25,
    last_checked: '2024-01-16T12:00:00Z',
    details: '2.3 TB used, 98% available',
  },
  {
    id: 'health-005',
    service: 'Email Gateway',
    status: 'degraded',
    response_time_ms: 1250,
    last_checked: '2024-01-16T12:00:00Z',
    details: 'High latency, fallback provider active',
  },
];

export const metrics: Metric[] = [
  {
    id: 'metric-001',
    name: 'http_requests_total',
    type: 'counter',
    value: 125847,
    labels: { method: 'GET', route: '/api/v1/projects', status: '200' },
    timestamp: '2024-01-16T12:00:00Z',
  },
  {
    id: 'metric-002',
    name: 'http_request_duration_seconds',
    type: 'histogram',
    value: 0.245,
    labels: { method: 'POST', route: '/api/v1/purchase-orders' },
    timestamp: '2024-01-16T12:00:00Z',
  },
  {
    id: 'metric-003',
    name: 'database_connections_active',
    type: 'gauge',
    value: 45,
    labels: { database: 'primary' },
    timestamp: '2024-01-16T12:00:00Z',
  },
  {
    id: 'metric-004',
    name: 'queue_messages_pending',
    type: 'gauge',
    value: 45,
    labels: { queue: 'notifications' },
    timestamp: '2024-01-16T12:00:00Z',
  },
];

export const slowQueries: SlowQuery[] = [
  {
    id: 'sq-001',
    query_fingerprint: 'SELECT * FROM stock_ledger WHERE project_id = ? AND material_id = ? ORDER BY transaction_date DESC',
    query_text: 'SELECT * FROM stock_ledger WHERE project_id = $1 AND material_id = $2 ORDER BY transaction_date DESC LIMIT 100',
    duration_ms: 2450,
    called_at: '2024-01-16T11:45:00Z',
    database: 'primary',
    rows_examined: 125000,
    rows_returned: 100,
    index_used: false,
  },
  {
    id: 'sq-002',
    query_fingerprint: 'SELECT COUNT(*) FROM attendance_records WHERE site_id = ? AND date BETWEEN ? AND ?',
    query_text: 'SELECT COUNT(*) FROM attendance_records WHERE site_id = $1 AND date BETWEEN $2 AND $3',
    duration_ms: 1850,
    called_at: '2024-01-16T11:30:00Z',
    database: 'primary',
    rows_examined: 85000,
    rows_returned: 1,
    index_used: false,
  },
  {
    id: 'sq-003',
    query_fingerprint: 'SELECT p.*, c.name as client_name FROM projects p JOIN clients c ON p.client_id = c.id WHERE p.company_id = ?',
    query_text: 'SELECT p.*, c.name as client_name FROM projects p JOIN clients c ON p.client_id = c.id WHERE p.company_id = $1 ORDER BY p.created_at DESC',
    duration_ms: 1250,
    called_at: '2024-01-16T11:15:00Z',
    database: 'primary',
    rows_examined: 45000,
    rows_returned: 50,
    index_used: true,
  },
];

export const queueJobs: QueueJob[] = [
  {
    id: 'job-001',
    queue_name: 'notifications',
    job_type: 'send_email',
    status: 'processing',
    created_at: '2024-01-16T11:55:00Z',
    started_at: '2024-01-16T11:55:05Z',
    retries: 0,
  },
  {
    id: 'job-002',
    queue_name: 'reports',
    job_type: 'generate_pdf',
    status: 'pending',
    created_at: '2024-01-16T11:50:00Z',
    retries: 0,
  },
  {
    id: 'job-003',
    queue_name: 'integrations',
    job_type: 'sync_government_api',
    status: 'failed',
    created_at: '2024-01-16T11:45:00Z',
    started_at: '2024-01-16T11:45:02Z',
    completed_at: '2024-01-16T11:45:15Z',
    duration_ms: 13000,
    retries: 3,
    error: 'Government API timeout after 10s',
  },
  {
    id: 'job-004',
    queue_name: 'audit',
    job_type: 'verify_hash_chain',
    status: 'completed',
    created_at: '2024-01-16T11:00:00Z',
    started_at: '2024-01-16T11:00:01Z',
    completed_at: '2024-01-16T11:00:45Z',
    duration_ms: 44000,
    retries: 0,
  },
  {
    id: 'job-005',
    queue_name: 'dead_letter',
    job_type: 'send_sms',
    status: 'dead_letter',
    created_at: '2024-01-16T10:30:00Z',
    retries: 5,
    error: 'SMS provider rejected: invalid phone number format',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getSLOStatusColor(status: SLO['status']): string {
  const colors: Record<SLO['status'], string> = {
    healthy: 'var(--success-600)',
    warning: 'var(--warning-600)',
    critical: 'var(--error-600)',
  };
  return colors[status];
}

export function getIncidentSeverityColor(severity: Incident['severity']): string {
  const colors: Record<Incident['severity'], string> = {
    SEV1: 'var(--error-700)',
    SEV2: 'var(--error-600)',
    SEV3: 'var(--warning-600)',
    SEV4: 'var(--info-600)',
  };
  return colors[severity];
}

export function getIncidentStatusColor(status: Incident['status']): string {
  const colors: Record<Incident['status'], string> = {
    OPEN: 'var(--error-600)',
    ACKNOWLEDGED: 'var(--warning-600)',
    MITIGATED: 'var(--info-600)',
    RESOLVED: 'var(--success-600)',
    REVIEWED: 'var(--text-muted)',
  };
  return colors[status];
}

export function getHealthStatusColor(status: HealthCheck['status']): string {
  const colors: Record<HealthCheck['status'], string> = {
    healthy: 'var(--success-600)',
    degraded: 'var(--warning-600)',
    unhealthy: 'var(--error-600)',
  };
  return colors[status];
}

export function getAlertSeverityColor(severity: AlertRule['severity']): string {
  const colors: Record<AlertRule['severity'], string> = {
    critical: 'var(--error-600)',
    warning: 'var(--warning-600)',
    info: 'var(--info-600)',
  };
  return colors[severity];
}

export function getJobStatusColor(status: QueueJob['status']): string {
  const colors: Record<QueueJob['status'], string> = {
    pending: 'var(--info-600)',
    processing: 'var(--warning-600)',
    completed: 'var(--success-600)',
    failed: 'var(--error-600)',
    dead_letter: 'var(--error-700)',
  };
  return colors[status];
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
}
