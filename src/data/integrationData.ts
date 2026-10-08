// ═══════════════════════════════════════════════════════════
// INTEGRATION DATA MODEL — Part 17
// Integration Architecture
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// CONNECTORS
// ═══════════════════════════════════════════════════════════

export interface IntegrationConnector {
  id: string;
  code: string;
  type: 'email' | 'sms' | 'whatsapp' | 'bank' | 'gst' | 'maps' | 'ocr' | 'bi' | 'ai' | 'storage' | 'biometric' | 'erp';
  provider: string;
  config_json: Record<string, any>;
  secret_ref: string;
  status: 'active' | 'inactive' | 'error';
  health: 'healthy' | 'degraded' | 'down';
  last_checked: string;
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════════════════════════

export interface IntegrationEndpoint {
  id: string;
  connector_code: string;
  name: string;
  direction: 'outbound' | 'inbound';
  url: string;
  auth_type: 'api_key' | 'oauth2' | 'basic' | 'none';
  rate_limit: number;
  is_active: boolean;
}

// ═══════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════

export interface IntegrationMessage {
  id: string;
  connector_code: string;
  direction: 'outbound' | 'inbound';
  correlation_id: string;
  entity_type?: string;
  entity_id?: string;
  request_redacted: Record<string, any>;
  response_redacted?: Record<string, any>;
  status: 'pending' | 'sent' | 'delivered' | 'failed';
  attempts: number;
  error?: string;
  at: string;
}

// ═══════════════════════════════════════════════════════════
// WEBHOOKS
// ═══════════════════════════════════════════════════════════

export interface IntegrationWebhook {
  id: string;
  event_name: string;
  target_url: string;
  secret_ref: string;
  is_active: boolean;
  created_at: string;
  last_triggered?: string;
}

// ═══════════════════════════════════════════════════════════
// API CLIENTS
// ═══════════════════════════════════════════════════════════

export interface IntegrationApiClient {
  id: string;
  client_id: string;
  name: string;
  scopes: string[];
  key_hash: string;
  ip_allowlist: string[];
  rate_limit: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
  last_used?: string;
}

// ═══════════════════════════════════════════════════════════
// DEAD LETTERS
// ═══════════════════════════════════════════════════════════

export interface IntegrationDeadLetter {
  id: string;
  message_id: string;
  reason: string;
  at: string;
  resolved: boolean;
  resolved_at?: string;
  resolved_by?: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const integrationConnectors: IntegrationConnector[] = [
  {
    id: 'intg-001',
    code: 'EMAIL_SENDGRID',
    type: 'email',
    provider: 'SendGrid',
    config_json: {
      from_email: 'noreply@acme-infra.com',
      from_name: 'Acme Infrastructure',
    },
    secret_ref: 'vault://integrations/sendgrid/api-key',
    status: 'active',
    health: 'healthy',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-002',
    code: 'SMS_TWILIO',
    type: 'sms',
    provider: 'Twilio',
    config_json: {
      from_number: '+919876543210',
      dlt_template_id: '123456',
    },
    secret_ref: 'vault://integrations/twilio/credentials',
    status: 'active',
    health: 'healthy',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-003',
    code: 'WHATSAPP_BUSINESS',
    type: 'whatsapp',
    provider: 'Twilio WhatsApp',
    config_json: {
      business_account_id: 'BA123456',
    },
    secret_ref: 'vault://integrations/whatsapp/credentials',
    status: 'active',
    health: 'healthy',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-004',
    code: 'BANK_HDFC',
    type: 'bank',
    provider: 'HDFC Bank',
    config_json: {
      account_number: 'XXXX1234',
      ifsc: 'HDFC0001234',
      payment_file_format: 'HDFC_NEFT',
    },
    secret_ref: 'vault://integrations/hdfc/credentials',
    status: 'active',
    health: 'healthy',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-005',
    code: 'GST_IRN',
    type: 'gst',
    provider: 'ClearTax GST',
    config_json: {
      gstin: '27AAACA1234F1Z5',
      environment: 'production',
    },
    secret_ref: 'vault://integrations/cleartax/credentials',
    status: 'active',
    health: 'healthy',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-006',
    code: 'MAPS_GOOGLE',
    type: 'maps',
    provider: 'Google Maps',
    config_json: {
      api_type: 'geocoding,distance_matrix',
    },
    secret_ref: 'vault://integrations/google-maps/api-key',
    status: 'active',
    health: 'healthy',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-007',
    code: 'OCR_AWS_TEXTRACT',
    type: 'ocr',
    provider: 'AWS Textract',
    config_json: {
      region: 'ap-south-1',
      features: 'FORMS,TABLES',
    },
    secret_ref: 'vault://integrations/aws-textract/credentials',
    status: 'active',
    health: 'degraded',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 'intg-008',
    code: 'ERP_TALLY',
    type: 'erp',
    provider: 'Tally ERP 9',
    config_json: {
      company_name: 'Acme Infrastructure Ltd',
      sync_frequency: 'hourly',
    },
    secret_ref: 'vault://integrations/tally/credentials',
    status: 'inactive',
    health: 'down',
    last_checked: '2024-01-16T12:00:00Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
];

export const integrationEndpoints: IntegrationEndpoint[] = [
  {
    id: 'ep-001',
    connector_code: 'EMAIL_SENDGRID',
    name: 'Send Email',
    direction: 'outbound',
    url: 'https://api.sendgrid.com/v3/mail/send',
    auth_type: 'api_key',
    rate_limit: 100,
    is_active: true,
  },
  {
    id: 'ep-002',
    connector_code: 'SMS_TWILIO',
    name: 'Send SMS',
    direction: 'outbound',
    url: 'https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json',
    auth_type: 'basic',
    rate_limit: 50,
    is_active: true,
  },
  {
    id: 'ep-003',
    connector_code: 'BANK_HDFC',
    name: 'Payment File Upload',
    direction: 'outbound',
    url: 'https://netbanking.hdfcbank.com/corp/api/payment/upload',
    auth_type: 'api_key',
    rate_limit: 10,
    is_active: true,
  },
  {
    id: 'ep-004',
    connector_code: 'GST_IRN',
    name: 'Generate IRN',
    direction: 'outbound',
    url: 'https://gsp.clear GST.com/api/einvoice/v1.01/Invoice',
    auth_type: 'oauth2',
    rate_limit: 30,
    is_active: true,
  },
  {
    id: 'ep-005',
    connector_code: 'MAPS_GOOGLE',
    name: 'Geocode Address',
    direction: 'outbound',
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    auth_type: 'api_key',
    rate_limit: 1000,
    is_active: true,
  },
];

export const integrationMessages: IntegrationMessage[] = [
  {
    id: 'msg-001',
    connector_code: 'EMAIL_SENDGRID',
    direction: 'outbound',
    correlation_id: 'corr-001',
    entity_type: 'Notification',
    entity_id: 'ntf-001',
    request_redacted: {
      to: 'user@example.com',
      subject: '[REDACTED]',
      body: '[REDACTED]',
    },
    response_redacted: {
      status: 'sent',
      message_id: 'sendgrid-msg-123',
    },
    status: 'delivered',
    attempts: 1,
    at: '2024-01-16T10:00:00Z',
  },
  {
    id: 'msg-002',
    connector_code: 'SMS_TWILIO',
    direction: 'outbound',
    correlation_id: 'corr-002',
    entity_type: 'Notification',
    entity_id: 'ntf-005',
    request_redacted: {
      to: '+919876543210',
      body: '[REDACTED]',
    },
    response_redacted: {
      status: 'sent',
      sid: 'twilio-sid-456',
    },
    status: 'delivered',
    attempts: 1,
    at: '2024-01-16T11:30:00Z',
  },
  {
    id: 'msg-003',
    connector_code: 'BANK_HDFC',
    direction: 'outbound',
    correlation_id: 'corr-003',
    entity_type: 'PaymentBatch',
    entity_id: 'batch-001',
    request_redacted: {
      file_name: 'payment_20240116.txt',
      transaction_count: 15,
      total_amount: 2500000,
    },
    status: 'sent',
    attempts: 1,
    at: '2024-01-16T14:00:00Z',
  },
  {
    id: 'msg-004',
    connector_code: 'GST_IRN',
    direction: 'outbound',
    correlation_id: 'corr-004',
    entity_type: 'Invoice',
    entity_id: 'inv-001',
    request_redacted: {
      invoice_number: 'INV-2024-001',
      taxable_value: 100000,
      gst_amount: 18000,
    },
    response_redacted: {
      irn: 'IRN123456789',
      ack_no: 'ACK987654',
    },
    status: 'delivered',
    attempts: 1,
    at: '2024-01-16T15:00:00Z',
  },
  {
    id: 'msg-005',
    connector_code: 'OCR_AWS_TEXTRACT',
    direction: 'outbound',
    correlation_id: 'corr-005',
    entity_type: 'Document',
    entity_id: 'doc-001',
    request_redacted: {
      file_name: 'invoice_scan.pdf',
      file_size: 2048000,
    },
    status: 'failed',
    attempts: 3,
    error: 'Service temporarily unavailable',
    at: '2024-01-16T16:00:00Z',
  },
];

export const integrationWebhooks: IntegrationWebhook[] = [
  {
    id: 'wh-001',
    event_name: 'payment.received',
    target_url: 'https://partner-system.example.com/webhooks/payment',
    secret_ref: 'vault://webhooks/partner-system/secret',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_triggered: '2024-01-16T14:30:00Z',
  },
  {
    id: 'wh-002',
    event_name: 'invoice.generated',
    target_url: 'https://accounting-system.example.com/api/invoices',
    secret_ref: 'vault://webhooks/accounting-system/secret',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_triggered: '2024-01-16T15:00:00Z',
  },
  {
    id: 'wh-003',
    event_name: 'grn.posted',
    target_url: 'https://inventory-system.example.com/webhooks/grn',
    secret_ref: 'vault://webhooks/inventory-system/secret',
    is_active: false,
    created_at: '2024-01-01T00:00:00Z',
  },
];

export const integrationApiClients: IntegrationApiClient[] = [
  {
    id: 'client-001',
    client_id: 'partner-system-001',
    name: 'Partner System Integration',
    scopes: ['payment.read', 'invoice.read'],
    key_hash: 'sha256:abc123def456',
    ip_allowlist: ['203.0.113.0/24'],
    rate_limit: 100,
    expires_at: '2025-01-01T00:00:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_used: '2024-01-16T14:30:00Z',
  },
  {
    id: 'client-002',
    client_id: 'accounting-system-001',
    name: 'Accounting System',
    scopes: ['invoice.write', 'payment.write'],
    key_hash: 'sha256:xyz789uvw012',
    ip_allowlist: ['198.51.100.0/24'],
    rate_limit: 50,
    expires_at: '2025-01-01T00:00:00Z',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    last_used: '2024-01-16T15:00:00Z',
  },
];

export const integrationDeadLetters: IntegrationDeadLetter[] = [
  {
    id: 'dlq-001',
    message_id: 'msg-005',
    reason: 'Service temporarily unavailable after 3 retries',
    at: '2024-01-16T16:05:00Z',
    resolved: false,
  },
  {
    id: 'dlq-002',
    message_id: 'msg-006',
    reason: 'Invalid API key',
    at: '2024-01-15T10:00:00Z',
    resolved: true,
    resolved_at: '2024-01-15T11:00:00Z',
    resolved_by: 'user-001',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getConnectorByCode(code: string): IntegrationConnector | undefined {
  return integrationConnectors.find(c => c.code === code);
}

export function getConnectorsByType(type: string): IntegrationConnector[] {
  return integrationConnectors.filter(c => c.type === type);
}

export function getEndpointsByConnector(connectorCode: string): IntegrationEndpoint[] {
  return integrationEndpoints.filter(e => e.connector_code === connectorCode);
}

export function getMessagesByConnector(connectorCode: string): IntegrationMessage[] {
  return integrationMessages.filter(m => m.connector_code === connectorCode);
}

export function getFailedMessages(): IntegrationMessage[] {
  return integrationMessages.filter(m => m.status === 'failed');
}

export function getUnresolvedDeadLetters(): IntegrationDeadLetter[] {
  return integrationDeadLetters.filter(dl => !dl.resolved);
}

export function getConnectorStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'var(--success-600)',
    inactive: 'var(--text-muted)',
    error: 'var(--error-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getConnectorHealthColor(health: string): string {
  const colors: Record<string, string> = {
    healthy: 'var(--success-600)',
    degraded: 'var(--warning-600)',
    down: 'var(--error-600)',
  };
  return colors[health] || 'var(--text-muted)';
}

export function getMessageStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: 'var(--info-600)',
    sent: 'var(--warning-600)',
    delivered: 'var(--success-600)',
    failed: 'var(--error-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function getConnectorTypeIcon(type: string): string {
  const icons: Record<string, string> = {
    email: '📧',
    sms: '💬',
    whatsapp: '📱',
    bank: '🏦',
    gst: '📋',
    maps: '🗺️',
    ocr: '📄',
    bi: '📊',
    ai: '🤖',
    storage: '💾',
    biometric: '🔐',
    erp: '🔗',
  };
  return icons[type] || '🔌';
}
