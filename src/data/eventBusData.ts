// ═══════════════════════════════════════════════════════════
// EVENT BUS DATA MODEL — Part 11
// Real-Time Event Bus & Integration Platform
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// EVENT ENVELOPE
// ═══════════════════════════════════════════════════════════

export interface EventEnvelope {
  event_id: string;
  event_type: string;
  schema_version: string;
  occurred_at: string;
  company_id: string;
  project_id?: string;
  site_id?: string;
  actor_id: string;
  correlation_id: string;
  causation_id?: string;
  idempotency_key: string;
  payload: Record<string, any>;
  links: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════
// EVENT CATALOGUE
// ═══════════════════════════════════════════════════════════

export interface EventDefinition {
  event_type: string;
  description: string;
  module: string;
  entity: string;
  verb: string;
  current_version: string;
  payload_schema: Record<string, any>;
  created_at: string;
  owner_module: string;
}

export const eventCatalogue: EventDefinition[] = [
  {
    event_type: 'project.created',
    description: 'New project created',
    module: 'project',
    entity: 'project',
    verb: 'created',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        project_id: { type: 'string' },
        project_code: { type: 'string' },
        name: { type: 'string' },
        client_id: { type: 'string' },
      },
      required: ['project_id', 'project_code', 'name'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'project',
  },
  {
    event_type: 'boq.version_frozen',
    description: 'BOQ version frozen for execution',
    module: 'project',
    entity: 'boq',
    verb: 'version_frozen',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        boq_id: { type: 'string' },
        version: { type: 'string' },
        frozen_at: { type: 'string', format: 'date-time' },
      },
      required: ['boq_id', 'version'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'project',
  },
  {
    event_type: 'budget.approved',
    description: 'Project budget approved',
    module: 'finance',
    entity: 'budget',
    verb: 'approved',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        budget_id: { type: 'string' },
        project_id: { type: 'string' },
        approved_amount: { type: 'number' },
        approved_by: { type: 'string' },
      },
      required: ['budget_id', 'project_id', 'approved_amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'finance',
  },
  {
    event_type: 'procurement.po.approved',
    description: 'Purchase order approved',
    module: 'procurement',
    entity: 'purchase_order',
    verb: 'approved',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        po_id: { type: 'string' },
        po_number: { type: 'string' },
        vendor_id: { type: 'string' },
        total_amount: { type: 'number' },
        approved_by: { type: 'string' },
      },
      required: ['po_id', 'po_number', 'total_amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'procurement',
  },
  {
    event_type: 'stores.grn.posted',
    description: 'Goods receipt note posted',
    module: 'stores',
    entity: 'grn',
    verb: 'posted',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        grn_id: { type: 'string' },
        grn_number: { type: 'string' },
        po_id: { type: 'string' },
        received_date: { type: 'string', format: 'date' },
      },
      required: ['grn_id', 'grn_number', 'po_id'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'stores',
  },
  {
    event_type: 'stores.issue.created',
    description: 'Material issued from store',
    module: 'stores',
    entity: 'material_issue',
    verb: 'created',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        issue_id: { type: 'string' },
        issue_number: { type: 'string' },
        project_id: { type: 'string' },
        issued_to: { type: 'string' },
      },
      required: ['issue_id', 'issue_number', 'project_id'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'stores',
  },
  {
    event_type: 'project.dpr.submitted',
    description: 'Daily progress report submitted',
    module: 'project',
    entity: 'dpr',
    verb: 'submitted',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        dpr_id: { type: 'string' },
        project_id: { type: 'string' },
        report_date: { type: 'string', format: 'date' },
        submitted_by: { type: 'string' },
      },
      required: ['dpr_id', 'project_id', 'report_date'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'project',
  },
  {
    event_type: 'project.progress.approved',
    description: 'Progress measurement approved',
    module: 'project',
    entity: 'progress',
    verb: 'approved',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        progress_id: { type: 'string' },
        project_id: { type: 'string' },
        period: { type: 'string' },
        approved_percentage: { type: 'number' },
      },
      required: ['progress_id', 'project_id', 'approved_percentage'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'project',
  },
  {
    event_type: 'finance.mb.certified',
    description: 'Measurement book certified',
    module: 'finance',
    entity: 'measurement_book',
    verb: 'certified',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        mb_id: { type: 'string' },
        mb_number: { type: 'string' },
        certified_amount: { type: 'number' },
        certified_by: { type: 'string' },
      },
      required: ['mb_id', 'mb_number', 'certified_amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'finance',
  },
  {
    event_type: 'finance.bill.certified',
    description: 'Subcontractor bill certified',
    module: 'finance',
    entity: 'bill',
    verb: 'certified',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        bill_id: { type: 'string' },
        bill_number: { type: 'string' },
        subcontractor_id: { type: 'string' },
        certified_amount: { type: 'number' },
      },
      required: ['bill_id', 'bill_number', 'certified_amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'finance',
  },
  {
    event_type: 'finance.payment.posted',
    description: 'Payment posted to ledger',
    module: 'finance',
    entity: 'payment',
    verb: 'posted',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        payment_id: { type: 'string' },
        payment_number: { type: 'string' },
        amount: { type: 'number' },
        paid_to: { type: 'string' },
      },
      required: ['payment_id', 'payment_number', 'amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'finance',
  },
  {
    event_type: 'finance.receipt.posted',
    description: 'Receipt posted to ledger',
    module: 'finance',
    entity: 'receipt',
    verb: 'posted',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        receipt_id: { type: 'string' },
        receipt_number: { type: 'string' },
        amount: { type: 'number' },
        received_from: { type: 'string' },
      },
      required: ['receipt_id', 'receipt_number', 'amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'finance',
  },
  {
    event_type: 'hr.attendance.locked',
    description: 'Employee attendance locked for period',
    module: 'hr',
    entity: 'attendance',
    verb: 'locked',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        attendance_id: { type: 'string' },
        employee_id: { type: 'string' },
        period: { type: 'string' },
        locked_by: { type: 'string' },
      },
      required: ['attendance_id', 'employee_id', 'period'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'hr',
  },
  {
    event_type: 'hr.payroll.posted',
    description: 'Payroll posted for period',
    module: 'hr',
    entity: 'payroll',
    verb: 'posted',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        payroll_id: { type: 'string' },
        period: { type: 'string' },
        total_amount: { type: 'number' },
        employee_count: { type: 'integer' },
      },
      required: ['payroll_id', 'period', 'total_amount'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'hr',
  },
  {
    event_type: 'project.variation.approved',
    description: 'Variation order approved',
    module: 'project',
    entity: 'variation',
    verb: 'approved',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        variation_id: { type: 'string' },
        variation_number: { type: 'string' },
        project_id: { type: 'string' },
        approved_amount: { type: 'number' },
      },
      required: ['variation_id', 'variation_number', 'project_id'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'project',
  },
  {
    event_type: 'project.risk.escalated',
    description: 'Project risk escalated',
    module: 'project',
    entity: 'risk',
    verb: 'escalated',
    current_version: '1.0.0',
    payload_schema: {
      type: 'object',
      properties: {
        risk_id: { type: 'string' },
        project_id: { type: 'string' },
        severity: { type: 'string', enum: ['low', 'medium', 'high', 'critical'] },
        escalated_to: { type: 'string' },
      },
      required: ['risk_id', 'project_id', 'severity'],
    },
    created_at: '2024-01-01T00:00:00Z',
    owner_module: 'project',
  },
];

// ═══════════════════════════════════════════════════════════
// SCHEMA REGISTRY
// ═══════════════════════════════════════════════════════════

export interface SchemaVersion {
  id: string;
  event_type: string;
  version: string;
  json_schema: Record<string, any>;
  status: 'draft' | 'reviewed' | 'published' | 'deprecated' | 'retired';
  published_at?: string;
  sunset_at?: string;
  created_at: string;
  created_by: string;
  reviewed_by?: string;
  compatibility_notes?: string;
}

export const schemaVersions: SchemaVersion[] = [
  {
    id: 'schema-001',
    event_type: 'project.created',
    version: '1.0.0',
    json_schema: eventCatalogue[0].payload_schema,
    status: 'published',
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    created_by: 'user-001',
    reviewed_by: 'user-002',
  },
  {
    id: 'schema-002',
    event_type: 'procurement.po.approved',
    version: '1.0.0',
    json_schema: eventCatalogue[3].payload_schema,
    status: 'published',
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    created_by: 'user-001',
    reviewed_by: 'user-002',
  },
  {
    id: 'schema-003',
    event_type: 'stores.grn.posted',
    version: '1.0.0',
    json_schema: eventCatalogue[4].payload_schema,
    status: 'published',
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    created_by: 'user-001',
    reviewed_by: 'user-002',
  },
  {
    id: 'schema-004',
    event_type: 'finance.payment.posted',
    version: '1.0.0',
    json_schema: eventCatalogue[10].payload_schema,
    status: 'published',
    published_at: '2024-01-01T00:00:00Z',
    created_at: '2023-12-15T00:00:00Z',
    created_by: 'user-001',
    reviewed_by: 'user-002',
  },
  {
    id: 'schema-005',
    event_type: 'project.created',
    version: '1.1.0',
    json_schema: {
      ...eventCatalogue[0].payload_schema,
      properties: {
        ...eventCatalogue[0].payload_schema.properties,
        budget_id: { type: 'string' },
      },
    },
    status: 'draft',
    created_at: '2024-01-10T00:00:00Z',
    created_by: 'user-001',
    compatibility_notes: 'Added optional budget_id field - backward compatible',
  },
];

// ═══════════════════════════════════════════════════════════
// SUBSCRIPTIONS
// ═══════════════════════════════════════════════════════════

export interface Subscription {
  id: string;
  subscriber: string;
  type: 'internal' | 'webhook';
  event_types: string[];
  endpoint?: string;
  secret_ref?: string;
  status: 'active' | 'suspended' | 'disabled';
  failure_count: number;
  last_success_at?: string;
  rate_limit_per_minute?: number;
  created_at: string;
  created_by: string;
  owner_module: string;
}

export const subscriptions: Subscription[] = [
  {
    id: 'sub-001',
    subscriber: 'budget-commitment-service',
    type: 'internal',
    event_types: ['procurement.po.approved', 'stores.issue.created', 'finance.payment.posted'],
    status: 'active',
    failure_count: 0,
    last_success_at: '2024-01-15T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    owner_module: 'finance',
  },
  {
    id: 'sub-002',
    subscriber: 'project-control-engine',
    type: 'internal',
    event_types: ['project.dpr.submitted', 'project.progress.approved', 'stores.grn.posted'],
    status: 'active',
    failure_count: 0,
    last_success_at: '2024-01-15T12:05:00Z',
    created_at: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    owner_module: 'project',
  },
  {
    id: 'sub-003',
    subscriber: 'notification-service',
    type: 'internal',
    event_types: ['*'],
    status: 'active',
    failure_count: 0,
    last_success_at: '2024-01-15T12:10:00Z',
    created_at: '2024-01-01T00:00:00Z',
    created_by: 'user-001',
    owner_module: 'notification',
  },
  {
    id: 'sub-004',
    subscriber: 'client-portal-webhook',
    type: 'webhook',
    event_types: ['project.progress.approved', 'finance.bill.certified'],
    endpoint: 'https://client-portal.example.com/webhook/progress',
    secret_ref: 'vault://webhooks/client-portal',
    status: 'active',
    failure_count: 2,
    last_success_at: '2024-01-15T11:30:00Z',
    rate_limit_per_minute: 60,
    created_at: '2024-01-05T00:00:00Z',
    created_by: 'user-003',
    owner_module: 'integration',
  },
  {
    id: 'sub-005',
    subscriber: 'accounting-system-webhook',
    type: 'webhook',
    event_types: ['finance.payment.posted', 'finance.receipt.posted'],
    endpoint: 'https://accounting.example.com/api/events',
    secret_ref: 'vault://webhooks/accounting',
    status: 'suspended',
    failure_count: 15,
    last_success_at: '2024-01-10T08:00:00Z',
    rate_limit_per_minute: 30,
    created_at: '2024-01-02T00:00:00Z',
    created_by: 'user-003',
    owner_module: 'integration',
  },
];

// ═══════════════════════════════════════════════════════════
// DELIVERY TRACKING
// ═══════════════════════════════════════════════════════════

export interface Delivery {
  id: string;
  subscription_id: string;
  event_id: string;
  attempt: number;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  http_status?: number;
  latency_ms?: number;
  error?: string;
  created_at: string;
  delivered_at?: string;
}

export const deliveries: Delivery[] = [
  {
    id: 'del-001',
    subscription_id: 'sub-001',
    event_id: 'evt-001',
    attempt: 1,
    status: 'delivered',
    latency_ms: 45,
    created_at: '2024-01-15T12:00:00Z',
    delivered_at: '2024-01-15T12:00:00Z',
  },
  {
    id: 'del-002',
    subscription_id: 'sub-004',
    event_id: 'evt-002',
    attempt: 3,
    status: 'failed',
    http_status: 500,
    latency_ms: 2500,
    error: 'Internal server error at endpoint',
    created_at: '2024-01-15T11:30:00Z',
  },
  {
    id: 'del-003',
    subscription_id: 'sub-005',
    event_id: 'evt-003',
    attempt: 5,
    status: 'failed',
    http_status: 408,
    latency_ms: 30000,
    error: 'Request timeout',
    created_at: '2024-01-15T10:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════
// DEAD LETTER QUEUE
// ═══════════════════════════════════════════════════════════

export interface DeadLetter {
  id: string;
  consumer: string;
  event_id: string;
  event_type: string;
  reason: string;
  payload_hash: string;
  payload: Record<string, any>;
  first_failed_at: string;
  last_failed_at: string;
  retry_count: number;
  replayed_at?: string;
  replayed_by?: string;
  status: 'pending' | 'replayed' | 'discarded';
}

export const deadLetters: DeadLetter[] = [
  {
    id: 'dlq-001',
    consumer: 'accounting-system-webhook',
    event_id: 'evt-100',
    event_type: 'finance.payment.posted',
    reason: 'Endpoint returned 500 after 5 retries',
    payload_hash: 'sha256:abc123def456',
    payload: {
      payment_id: 'PAY-2024-001',
      amount: 250000,
      paid_to: 'vendor-001',
    },
    first_failed_at: '2024-01-10T08:00:00Z',
    last_failed_at: '2024-01-10T08:15:00Z',
    retry_count: 5,
    status: 'pending',
  },
  {
    id: 'dlq-002',
    consumer: 'client-portal-webhook',
    event_id: 'evt-101',
    event_type: 'project.progress.approved',
    reason: 'Invalid signature in webhook response',
    payload_hash: 'sha256:xyz789uvw012',
    payload: {
      progress_id: 'PROG-2024-001',
      approved_percentage: 65.5,
    },
    first_failed_at: '2024-01-12T14:00:00Z',
    last_failed_at: '2024-01-12T14:10:00Z',
    retry_count: 3,
    status: 'pending',
  },
  {
    id: 'dlq-003',
    consumer: 'budget-commitment-service',
    event_id: 'evt-102',
    event_type: 'stores.issue.created',
    reason: 'Schema validation failed - missing required field',
    payload_hash: 'sha256:mno345pqr678',
    payload: {
      issue_id: 'ISS-2024-001',
      // missing issue_number
    },
    first_failed_at: '2024-01-14T09:00:00Z',
    last_failed_at: '2024-01-14T09:00:00Z',
    retry_count: 1,
    status: 'pending',
  },
];

// ═══════════════════════════════════════════════════════════
// OUTBOX EVENTS
// ═══════════════════════════════════════════════════════════

export interface OutboxEvent {
  id: string;
  event: EventEnvelope;
  status: 'pending' | 'published' | 'failed';
  created_at: string;
  published_at?: string;
  error?: string;
}

export const outboxEvents: OutboxEvent[] = [
  {
    id: 'outbox-001',
    event: {
      event_id: 'evt-001',
      event_type: 'procurement.po.approved',
      schema_version: '1.0.0',
      occurred_at: '2024-01-15T12:00:00Z',
      company_id: 'company-001',
      project_id: 'project-001',
      actor_id: 'user-002',
      correlation_id: 'corr-001',
      idempotency_key: 'idemp-001',
      payload: {
        po_id: 'PO-2024-001',
        po_number: 'PO/2024/001',
        vendor_id: 'vendor-001',
        total_amount: 500000,
        approved_by: 'user-002',
      },
      links: {
        self: '/api/v1/procurement/purchase-orders/PO-2024-001',
      },
    },
    status: 'published',
    created_at: '2024-01-15T12:00:00Z',
    published_at: '2024-01-15T12:00:01Z',
  },
  {
    id: 'outbox-002',
    event: {
      event_id: 'evt-002',
      event_type: 'project.progress.approved',
      schema_version: '1.0.0',
      occurred_at: '2024-01-15T11:30:00Z',
      company_id: 'company-001',
      project_id: 'project-001',
      actor_id: 'user-003',
      correlation_id: 'corr-002',
      idempotency_key: 'idemp-002',
      payload: {
        progress_id: 'PROG-2024-001',
        project_id: 'project-001',
        period: '2024-01',
        approved_percentage: 65.5,
      },
      links: {
        self: '/api/v1/project/progress/PROG-2024-001',
      },
    },
    status: 'published',
    created_at: '2024-01-15T11:30:00Z',
    published_at: '2024-01-15T11:30:01Z',
  },
  {
    id: 'outbox-003',
    event: {
      event_id: 'evt-003',
      event_type: 'finance.payment.posted',
      schema_version: '1.0.0',
      occurred_at: '2024-01-15T10:00:00Z',
      company_id: 'company-001',
      actor_id: 'user-004',
      correlation_id: 'corr-003',
      idempotency_key: 'idemp-003',
      payload: {
        payment_id: 'PAY-2024-001',
        payment_number: 'PAY/2024/001',
        amount: 250000,
        paid_to: 'vendor-001',
      },
      links: {
        self: '/api/v1/finance/payments/PAY-2024-001',
      },
    },
    status: 'published',
    created_at: '2024-01-15T10:00:00Z',
    published_at: '2024-01-15T10:00:01Z',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getEventByType(eventType: string): EventDefinition | undefined {
  return eventCatalogue.find(e => e.event_type === eventType);
}

export function getEventsByModule(module: string): EventDefinition[] {
  return eventCatalogue.filter(e => e.module === module);
}

export function getSchemaVersions(eventType: string): SchemaVersion[] {
  return schemaVersions.filter(s => s.event_type === eventType);
}

export function getLatestSchema(eventType: string): SchemaVersion | undefined {
  return schemaVersions
    .filter(s => s.event_type === eventType && s.status === 'published')
    .sort((a, b) => b.version.localeCompare(a.version))[0];
}

export function getSubscriptionsByType(type: 'internal' | 'webhook'): Subscription[] {
  return subscriptions.filter(s => s.type === type);
}

export function getSubscriptionsForEvent(eventType: string): Subscription[] {
  return subscriptions.filter(s => 
    s.event_types.includes(eventType) || s.event_types.includes('*')
  );
}

export function getDeadLettersByConsumer(consumer: string): DeadLetter[] {
  return deadLetters.filter(d => d.consumer === consumer);
}

export function getDeliveriesBySubscription(subscriptionId: string): Delivery[] {
  return deliveries.filter(d => d.subscription_id === subscriptionId);
}

export function getSubscriptionStatusColor(status: Subscription['status']): string {
  const colors: Record<Subscription['status'], string> = {
    active: 'var(--success-600)',
    suspended: 'var(--warning-600)',
    disabled: 'var(--text-muted)',
  };
  return colors[status];
}

export function getDeliveryStatusColor(status: Delivery['status']): string {
  const colors: Record<Delivery['status'], string> = {
    pending: 'var(--info-600)',
    delivered: 'var(--success-600)',
    failed: 'var(--error-600)',
    retrying: 'var(--warning-600)',
  };
  return colors[status];
}

export function getSchemaStatusColor(status: SchemaVersion['status']): string {
  const colors: Record<SchemaVersion['status'], string> = {
    draft: 'var(--text-muted)',
    reviewed: 'var(--info-600)',
    published: 'var(--success-600)',
    deprecated: 'var(--warning-600)',
    retired: 'var(--text-muted)',
  };
  return colors[status];
}

export function getDLQStatusColor(status: DeadLetter['status']): string {
  const colors: Record<DeadLetter['status'], string> = {
    pending: 'var(--error-600)',
    replayed: 'var(--success-600)',
    discarded: 'var(--text-muted)',
  };
  return colors[status];
}
