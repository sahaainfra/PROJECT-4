// ═══════════════════════════════════════════════════════════
// API PLATFORM SERVICE — Part 18
// API, Integration & Developer Platform
// ═══════════════════════════════════════════════════════════

import {
  ApiClient,
  ApiCredential,
  ApiAuditLog,
  ApiVersion,
  BulkJob,
  apiClients,
  apiCredentials,
  apiAuditLogs,
  apiVersions,
  bulkJobs,
  getClientById,
  getCredentialsByClient,
} from '../data/apiPlatformData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';
import { protocolCheck } from './ProtocolEngine';

// ═══════════════════════════════════════════════════════════
// CLIENT MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface RegisterClientInput {
  name: string;
  owner_id: string;
  type: 'confidential' | 'public' | 'api_key';
  scopes: string[];
  company_scope: string[];
  ip_allowlist?: string[];
  rate_limit_per_minute: number;
  daily_quota: number;
  requested_by: string;
}

/**
 * Register a new API client (CP-API-01: requires approval)
 */
export function registerApiClient(input: RegisterClientInput): ApiClient {
  const correlation = getCurrentCorrelation();

  // Protocol check: CP-API-01 - New external client requires approval
  const protocolResult = protocolCheck({
    cp_code: 'CP-API-01',
    actor_id: input.requested_by,
    entity_type: 'ApiClient',
    entity_id: 'new',
    action: 'create',
    payload: {
      client_name: input.name,
      scopes: input.scopes,
      type: input.type,
    },
  });

  if (protocolResult.result === 'BLOCK') {
    const failureMessage = protocolResult.failures.length > 0 ? protocolResult.failures[0].message : 'Protocol check failed';
    throw new Error(`Protocol check failed: ${failureMessage}`);
  }

  const client: ApiClient = {
    id: `client-${Date.now()}`,
    name: input.name,
    owner_id: input.owner_id,
    owner_name: 'Owner Name', // Would be resolved from user service
    type: input.type,
    scopes_json: input.scopes,
    company_scope_json: input.company_scope,
    ip_allowlist: input.ip_allowlist || [],
    status: 'REQUESTED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rate_limit_per_minute: input.rate_limit_per_minute,
    daily_quota: input.daily_quota,
  };

  apiClients.push(client);

  // Audit log
  writeAuditEntry({
    userId: input.requested_by,
    userName: 'API Admin',
    userEmail: '',
    action: 'CREATE',
    entityType: 'ApiClient',
    entityId: client.id,
    entityName: `Registered API client: ${client.name}`,
    after: client,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'devapi.client.registered',
    company_id: 'company-001',
    actor_id: input.requested_by,
    payload: {
      client_id: client.id,
      client_name: client.name,
      status: client.status,
    },
  });

  return client;
}

/**
 * Approve API client after security review
 */
export function approveApiClient(clientId: string, approvedBy: string): ApiClient {
  const correlation = getCurrentCorrelation();

  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  if (client.status !== 'REQUESTED' && client.status !== 'SECURITY_REVIEW') {
    throw new Error(`Client cannot be approved from status: ${client.status}`);
  }

  const before = { ...client };
  client.status = 'APPROVED';
  client.updated_at = new Date().toISOString();

  // Create initial credential
  createCredential(clientId, approvedBy);

  // Audit log
  writeAuditEntry({
    userId: approvedBy,
    userName: 'Security Reviewer',
    userEmail: '',
    action: 'APPROVE',
    entityType: 'ApiClient',
    entityId: client.id,
    entityName: `Approved API client: ${client.name}`,
    before,
    after: client,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'devapi.client.approved',
    company_id: 'company-001',
    actor_id: approvedBy,
    payload: {
      client_id: client.id,
      client_name: client.name,
    },
  });

  return client;
}

/**
 * Suspend API client
 */
export function suspendApiClient(clientId: string, suspendedBy: string, reason: string): ApiClient {
  const correlation = getCurrentCorrelation();

  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  const before = { ...client };
  client.status = 'SUSPENDED';
  client.updated_at = new Date().toISOString();

  // Audit log
  writeAuditEntry({
    userId: suspendedBy,
    userName: 'API Admin',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ApiClient',
    entityId: client.id,
    entityName: `Suspended API client: ${client.name}`,
    before,
    after: client,
    reason,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'devapi.client.suspended',
    company_id: 'company-001',
    actor_id: suspendedBy,
    payload: {
      client_id: client.id,
      client_name: client.name,
      reason,
    },
  });

  return client;
}

// ═══════════════════════════════════════════════════════════
// CREDENTIAL MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Create API credential for a client
 */
export function createCredential(clientId: string, createdBy: string): ApiCredential {
  const correlation = getCurrentCorrelation();

  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  const credential: ApiCredential = {
    id: `cred-${Date.now()}`,
    client_id: clientId,
    secret_ref: `vault://api/clients/${clientId}/secret-${Date.now()}`,
    created_at: new Date().toISOString(),
    status: 'active',
  };

  apiCredentials.push(credential);

  // Audit log
  writeAuditEntry({
    userId: createdBy,
    userName: 'API Admin',
    userEmail: '',
    action: 'CREATE',
    entityType: 'ApiCredential',
    entityId: credential.id,
    entityName: `Created credential for client: ${client.name}`,
    after: { ...credential, secret_ref: '[REDACTED]' },
    correlationId: correlation?.correlation_id || '',
  });

  return credential;
}

/**
 * Rotate API credential
 */
export function rotateCredential(clientId: string, rotatedBy: string): ApiCredential {
  const correlation = getCurrentCorrelation();

  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  // Revoke existing credentials
  const existingCreds = getCredentialsByClient(clientId);
  existingCreds.forEach(cred => {
    if (cred.status === 'active') {
      cred.status = 'revoked';
    }
  });

  // Create new credential
  const newCredential = createCredential(clientId, rotatedBy);
  newCredential.rotated_at = new Date().toISOString();

  // Audit log
  writeAuditEntry({
    userId: rotatedBy,
    userName: 'API Admin',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ApiCredential',
    entityId: newCredential.id,
    entityName: `Rotated credential for client: ${client.name}`,
    after: { credential_id: newCredential.id, rotated_at: newCredential.rotated_at },
    correlationId: correlation?.correlation_id || '',
  });

  return newCredential;
}

// ═══════════════════════════════════════════════════════════
// API AUDIT LOGGING
// ═══════════════════════════════════════════════════════════

export interface LogApiCallInput {
  client_id: string;
  user_id?: string;
  route: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  status: number;
  latency_ms: number;
  records_touched: number;
  correlation_id: string;
  ip_address: string;
  user_agent: string;
  error_message?: string;
}

/**
 * Log an API call for audit and monitoring
 */
export function logApiCall(input: LogApiCallInput): ApiAuditLog {
  const client = getClientById(input.client_id);
  if (!client) {
    throw new Error(`Client not found: ${input.client_id}`);
  }

  const log: ApiAuditLog = {
    id: `audit-${Date.now()}`,
    client_id: input.client_id,
    client_name: client.name,
    user_id: input.user_id,
    user_name: input.user_id ? 'User Name' : undefined, // Would be resolved
    route: input.route,
    method: input.method,
    status: input.status,
    latency_ms: input.latency_ms,
    records_touched: input.records_touched,
    correlation_id: input.correlation_id,
    ip_address: input.ip_address,
    user_agent: input.user_agent,
    at: new Date().toISOString(),
    error_message: input.error_message,
  };

  apiAuditLogs.push(log);

  return log;
}

// ═══════════════════════════════════════════════════════════
// BULK JOB MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateBulkJobInput {
  client_id: string;
  type: 'import' | 'export';
  template_code: string;
  file_id?: string;
  file_name?: string;
  created_by: string;
}

/**
 * Create a bulk import/export job
 */
export function createBulkJob(input: CreateBulkJobInput): BulkJob {
  const correlation = getCurrentCorrelation();

  const client = getClientById(input.client_id);
  if (!client) {
    throw new Error(`Client not found: ${input.client_id}`);
  }

  const job: BulkJob = {
    id: `job-${Date.now()}`,
    client_id: input.client_id,
    client_name: client.name,
    type: input.type,
    template_code: input.template_code,
    status: 'PENDING',
    file_id: input.file_id,
    file_name: input.file_name,
    total_records: 0,
    processed_records: 0,
    success_records: 0,
    error_records: 0,
    created_at: new Date().toISOString(),
    created_by: input.created_by,
  };

  bulkJobs.push(job);

  // Audit log
  writeAuditEntry({
    userId: input.created_by,
    userName: 'API User',
    userEmail: '',
    action: 'CREATE',
    entityType: 'BulkJob',
    entityId: job.id,
    entityName: `Created bulk ${input.type} job: ${input.template_code}`,
    after: job,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'devapi.bulk.created',
    company_id: 'company-001',
    actor_id: input.created_by,
    payload: {
      job_id: job.id,
      type: job.type,
      template_code: job.template_code,
    },
  });

  // Simulate job processing
  simulateBulkJobProcessing(job.id);

  return job;
}

/**
 * Simulate bulk job processing (in production, this would be async)
 */
function simulateBulkJobProcessing(jobId: string): void {
  const job = bulkJobs.find(j => j.id === jobId);
  if (!job) return;

  // Simulate processing stages
  setTimeout(() => {
    job.status = 'VALIDATING';
    job.started_at = new Date().toISOString();
  }, 100);

  setTimeout(() => {
    job.status = job.type === 'import' ? 'IMPORTING' : 'COMPLETED';
    job.total_records = Math.floor(Math.random() * 1000) + 100;
    job.processed_records = Math.floor(job.total_records * 0.8);
    job.success_records = Math.floor(job.processed_records * 0.95);
    job.error_records = job.processed_records - job.success_records;
  }, 500);

  setTimeout(() => {
    job.status = 'COMPLETED';
    job.processed_records = job.total_records;
    job.completed_at = new Date().toISOString();

    // Publish event
    publishEvent({
      event_type: 'devapi.bulk.completed',
      company_id: 'company-001',
      actor_id: job.created_by,
      payload: {
        job_id: job.id,
        status: job.status,
        total_records: job.total_records,
        success_records: job.success_records,
        error_records: job.error_records,
      },
    });
  }, 1000);
}

// ═══════════════════════════════════════════════════════════
// API VERSION MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface DeprecateVersionInput {
  version_id: string;
  sunset_date: string;
  deprecated_message: string;
  deprecated_by: string;
}

/**
 * Deprecate an API version (CP-API-02: no breaking changes on GA)
 */
export function deprecateApiVersion(input: DeprecateVersionInput): ApiVersion {
  const correlation = getCurrentCorrelation();

  const version = apiVersions.find(v => v.id === input.version_id);
  if (!version) {
    throw new Error(`Version not found: ${input.version_id}`);
  }

  if (version.status !== 'GA') {
    throw new Error(`Only GA versions can be deprecated. Current status: ${version.status}`);
  }

  // Protocol check: CP-API-02 - No breaking changes on GA version
  const protocolResult = protocolCheck({
    cp_code: 'CP-API-02',
    actor_id: input.deprecated_by,
    entity_type: 'ApiVersion',
    entity_id: version.id,
    action: 'deprecate',
    payload: {
      api: version.api,
      version: version.version,
      breaking_changes: version.breaking_changes,
    },
  });

  if (protocolResult.result === 'BLOCK' && version.breaking_changes) {
    const failureMessage = protocolResult.failures.length > 0 ? protocolResult.failures[0].message : 'Breaking changes not allowed';
    throw new Error(`Cannot deprecate version with breaking changes: ${failureMessage}`);
  }

  const before = { ...version };
  version.status = 'DEPRECATED';
  version.sunset_at = input.sunset_date;
  version.deprecated_message = input.deprecated_message;

  // Audit log
  writeAuditEntry({
    userId: input.deprecated_by,
    userName: 'API Admin',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'ApiVersion',
    entityId: version.id,
    entityName: `Deprecated API version: ${version.api} ${version.version}`,
    before,
    after: version,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'devapi.version.deprecated',
    company_id: 'company-001',
    actor_id: input.deprecated_by,
    payload: {
      version_id: version.id,
      api: version.api,
      version: version.version,
      sunset_at: version.sunset_at,
    },
  });

  return version;
}

// ═══════════════════════════════════════════════════════════
// USAGE ANALYTICS
// ═══════════════════════════════════════════════════════════

export interface ClientUsageStats {
  client_id: string;
  client_name: string;
  total_calls_24h: number;
  error_rate_24h: number;
  avg_latency_ms: number;
  top_routes: Array<{ route: string; count: number }>;
  quota_usage_percent: number;
}

/**
 * Get usage statistics for an API client
 */
export function getClientUsageStats(clientId: string): ClientUsageStats {
  const client = getClientById(clientId);
  if (!client) {
    throw new Error(`Client not found: ${clientId}`);
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentLogs = apiAuditLogs.filter(
    l => l.client_id === clientId && new Date(l.at) > twentyFourHoursAgo
  );

  const totalCalls = recentLogs.length;
  const errorCalls = recentLogs.filter(l => l.status >= 400).length;
  const errorRate = totalCalls > 0 ? (errorCalls / totalCalls) * 100 : 0;
  const avgLatency = totalCalls > 0
    ? recentLogs.reduce((sum, l) => sum + l.latency_ms, 0) / totalCalls
    : 0;

  // Calculate top routes
  const routeCounts: Record<string, number> = {};
  recentLogs.forEach(l => {
    routeCounts[l.route] = (routeCounts[l.route] || 0) + 1;
  });
  const topRoutes = Object.entries(routeCounts)
    .map(([route, count]) => ({ route, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate quota usage
  const quotaUsagePercent = (totalCalls / client.daily_quota) * 100;

  return {
    client_id: clientId,
    client_name: client.name,
    total_calls_24h: totalCalls,
    error_rate_24h: errorRate,
    avg_latency_ms: avgLatency,
    top_routes: topRoutes,
    quota_usage_percent: quotaUsagePercent,
  };
}

// ═══════════════════════════════════════════════════════════
// ANOMALY DETECTION (CP-API-03)
// ═══════════════════════════════════════════════════════════

export interface AnomalyAlert {
  client_id: string;
  client_name: string;
  anomaly_type: 'error_spike' | 'scope_probing' | 'volume_anomaly';
  severity: 'low' | 'medium' | 'high';
  description: string;
  detected_at: string;
  details: Record<string, any>;
}

/**
 * Detect anomalous client behavior (CP-API-03)
 */
export function detectAnomalies(): AnomalyAlert[] {
  const alerts: AnomalyAlert[] = [];
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  // Check each active client
  apiClients.filter(c => c.status === 'ACTIVE').forEach(client => {
    const recentLogs = apiAuditLogs.filter(
      l => l.client_id === client.id && new Date(l.at) > oneHourAgo
    );

    // Error spike detection
    const errorCount = recentLogs.filter(l => l.status >= 400).length;
    const errorRate = recentLogs.length > 0 ? (errorCount / recentLogs.length) * 100 : 0;

    if (errorRate > 20 && errorCount > 10) {
      alerts.push({
        client_id: client.id,
        client_name: client.name,
        anomaly_type: 'error_spike',
        severity: errorRate > 50 ? 'high' : 'medium',
        description: `High error rate detected: ${errorRate.toFixed(1)}% (${errorCount} errors in last hour)`,
        detected_at: now.toISOString(),
        details: { error_rate: errorRate, error_count: errorCount, total_calls: recentLogs.length },
      });
    }

    // Scope probing detection (multiple 403 errors on different scopes)
    const forbiddenLogs = recentLogs.filter(l => l.status === 403);
    const uniqueRoutes = new Set(forbiddenLogs.map(l => l.route));

    if (forbiddenLogs.length > 5 && uniqueRoutes.size > 3) {
      alerts.push({
        client_id: client.id,
        client_name: client.name,
        anomaly_type: 'scope_probing',
        severity: 'high',
        description: `Possible scope probing detected: ${forbiddenLogs.length} forbidden requests across ${uniqueRoutes.size} routes`,
        detected_at: now.toISOString(),
        details: { forbidden_count: forbiddenLogs.length, unique_routes: uniqueRoutes.size },
      });
    }

    // Volume anomaly detection (sudden spike in API calls)
    const avgCallsPerHour = client.daily_quota / 24;
    if (recentLogs.length > avgCallsPerHour * 3) {
      alerts.push({
        client_id: client.id,
        client_name: client.name,
        anomaly_type: 'volume_anomaly',
        severity: 'medium',
        description: `Unusual volume detected: ${recentLogs.length} calls in last hour (expected ~${Math.round(avgCallsPerHour)})`,
        detected_at: now.toISOString(),
        details: { actual_calls: recentLogs.length, expected_calls: Math.round(avgCallsPerHour) },
      });
    }
  });

  return alerts;
}
