// ═══════════════════════════════════════════════════════════
// INTEGRATION SERVICE — Part 17
// Integration Architecture
// ═══════════════════════════════════════════════════════════

import {
  IntegrationConnector,
  IntegrationMessage,
  IntegrationDeadLetter,
  IntegrationWebhook,
  IntegrationApiClient,
  integrationConnectors,
  integrationMessages,
  integrationDeadLetters,
  integrationWebhooks,
  integrationApiClients,
  getConnectorByCode,
  getMessagesByConnector,
} from '../data/integrationData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// CONNECTOR MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateConnectorInput {
  code: string;
  type: IntegrationConnector['type'];
  provider: string;
  config: Record<string, any>;
  secret_ref: string;
  created_by: string;
}

/**
 * Create a new integration connector
 */
export function createConnector(input: CreateConnectorInput): IntegrationConnector {
  const correlation = getCurrentCorrelation();

  // Check for duplicate code
  const existing = integrationConnectors.find(c => c.code === input.code);
  if (existing) {
    throw new Error(`Connector with code ${input.code} already exists`);
  }

  const connector: IntegrationConnector = {
    id: `intg-${Date.now()}`,
    code: input.code,
    type: input.type,
    provider: input.provider,
    config_json: input.config,
    secret_ref: input.secret_ref,
    status: 'inactive',
    health: 'down',
    last_checked: new Date().toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  integrationConnectors.push(connector);

  // Audit log
  writeAuditEntry({
    userId: input.created_by,
    userName: 'Integration Admin',
    userEmail: '',
    action: 'CREATE',
    entityType: 'IntegrationConnector',
    entityId: connector.id,
    entityName: `Created connector: ${connector.code}`,
    after: { ...connector, secret_ref: '[REDACTED]' },
    correlationId: correlation?.correlation_id || '',
  });

  return connector;
}

/**
 * Update connector configuration
 */
export function updateConnector(
  connectorId: string,
  updates: Partial<IntegrationConnector>,
  updated_by: string
): IntegrationConnector {
  const correlation = getCurrentCorrelation();

  const connector = integrationConnectors.find(c => c.id === connectorId);
  if (!connector) {
    throw new Error(`Connector not found: ${connectorId}`);
  }

  const before = { ...connector };

  // Update fields
  if (updates.config_json) connector.config_json = updates.config_json;
  if (updates.secret_ref) connector.secret_ref = updates.secret_ref;
  if (updates.status) connector.status = updates.status;
  connector.updated_at = new Date().toISOString();

  // Audit log
  writeAuditEntry({
    userId: updated_by,
    userName: 'Integration Admin',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'IntegrationConnector',
    entityId: connector.id,
    entityName: `Updated connector: ${connector.code}`,
    before: { ...before, secret_ref: '[REDACTED]' },
    after: { ...connector, secret_ref: '[REDACTED]' },
    correlationId: correlation?.correlation_id || '',
  });

  return connector;
}

/**
 * Test connector connectivity
 */
export function testConnector(connectorCode: string): { success: boolean; message: string; latency_ms: number } {
  const connector = getConnectorByCode(connectorCode);
  if (!connector) {
    throw new Error(`Connector not found: ${connectorCode}`);
  }

  // Simulate connectivity test
  const startTime = Date.now();
  
  // In production, this would actually call the provider API
  const success = Math.random() > 0.2; // 80% success rate for demo
  const latency_ms = Date.now() - startTime + Math.floor(Math.random() * 100);

  // Update health status
  connector.health = success ? 'healthy' : 'degraded';
  connector.last_checked = new Date().toISOString();

  return {
    success,
    message: success ? 'Connection successful' : 'Connection failed - check credentials',
    latency_ms,
  };
}

// ═══════════════════════════════════════════════════════════
// MESSAGE SENDING
// ═══════════════════════════════════════════════════════════

export interface SendMessageInput {
  connector_code: string;
  entity_type?: string;
  entity_id?: string;
  payload: Record<string, any>;
  correlation_id: string;
}

/**
 * Send a message through an integration connector
 */
export function sendMessage(input: SendMessageInput): IntegrationMessage {
  const connector = getConnectorByCode(input.connector_code);
  if (!connector) {
    throw new Error(`Connector not found: ${input.connector_code}`);
  }

  if (connector.status !== 'active') {
    throw new Error(`Connector is not active: ${input.connector_code}`);
  }

  const message: IntegrationMessage = {
    id: `msg-${Date.now()}`,
    connector_code: input.connector_code,
    direction: 'outbound',
    correlation_id: input.correlation_id,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    request_redacted: redactSensitiveData(input.payload, input.connector_code),
    status: 'pending',
    attempts: 0,
    at: new Date().toISOString(),
  };

  integrationMessages.push(message);

  // Attempt to send with retries
  sendMessageWithRetry(message, connector);

  return message;
}

/**
 * Send message with retry logic
 */
function sendMessageWithRetry(message: IntegrationMessage, connector: IntegrationConnector, maxRetries = 3): void {
  const attempt = () => {
    message.attempts++;

    // Simulate API call
    const success = Math.random() > 0.3; // 70% success rate for demo

    if (success) {
      message.status = 'delivered';
      message.response_redacted = {
        status: 'success',
        provider_ref: `${connector.code}-ref-${Date.now()}`,
      };

      // Update connector health
      connector.health = 'healthy';
      connector.last_checked = new Date().toISOString();

      // Publish event
      publishEvent({
        event_type: 'intg.message.delivered',
        company_id: 'company-001',
        actor_id: 'system',
        payload: {
          message_id: message.id,
          connector_code: message.connector_code,
        },
      });
    } else {
      if (message.attempts < maxRetries) {
        // Retry with exponential backoff
        setTimeout(() => attempt(), Math.pow(2, message.attempts) * 1000);
      } else {
        // Max retries reached - move to dead letter queue
        message.status = 'failed';
        message.error = 'Max retries exceeded';

        // Update connector health
        connector.health = 'degraded';
        connector.last_checked = new Date().toISOString();

        // Add to dead letter queue
        addToDeadLetterQueue(message, 'Max retries exceeded');

        // Publish event
        publishEvent({
          event_type: 'intg.message.failed',
          company_id: 'company-001',
          actor_id: 'system',
          payload: {
            message_id: message.id,
            connector_code: message.connector_code,
            error: message.error,
          },
        });
      }
    }
  };

  // Start first attempt
  setTimeout(attempt, 100);
}

/**
 * Redact sensitive data from message payload
 */
function redactSensitiveData(payload: Record<string, any>, connectorCode: string): Record<string, any> {
  const redacted = { ...payload };

  // Redact common sensitive fields
  const sensitiveFields = ['password', 'api_key', 'secret', 'token', 'credit_card', 'ssn', 'pan', 'aadhaar'];
  
  for (const key of Object.keys(redacted)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
      redacted[key] = '[REDACTED]';
    }
  }

  // Connector-specific redaction
  if (connectorCode.includes('EMAIL')) {
    if (redacted.body) redacted.body = '[REDACTED]';
    if (redacted.subject) redacted.subject = '[REDACTED]';
  }

  if (connectorCode.includes('SMS') || connectorCode.includes('WHATSAPP')) {
    if (redacted.body) redacted.body = '[REDACTED]';
  }

  if (connectorCode.includes('BANK')) {
    if (redacted.account_number) redacted.account_number = '[REDACTED]';
    if (redacted.ifsc) redacted.ifsc = '[REDACTED]';
  }

  return redacted;
}

// ═══════════════════════════════════════════════════════════
// DEAD LETTER QUEUE
// ═══════════════════════════════════════════════════════════

/**
 * Add failed message to dead letter queue
 */
function addToDeadLetterQueue(message: IntegrationMessage, reason: string): IntegrationDeadLetter {
  const deadLetter: IntegrationDeadLetter = {
    id: `dlq-${Date.now()}`,
    message_id: message.id,
    reason,
    at: new Date().toISOString(),
    resolved: false,
  };

  integrationDeadLetters.push(deadLetter);

  return deadLetter;
}

/**
 * Replay a dead letter message
 */
export function replayDeadLetter(deadLetterId: string, replayed_by: string): IntegrationMessage {
  const correlation = getCurrentCorrelation();

  const deadLetter = integrationDeadLetters.find(dl => dl.id === deadLetterId);
  if (!deadLetter) {
    throw new Error(`Dead letter not found: ${deadLetterId}`);
  }

  if (deadLetter.resolved) {
    throw new Error(`Dead letter already resolved: ${deadLetterId}`);
  }

  const message = integrationMessages.find(m => m.id === deadLetter.message_id);
  if (!message) {
    throw new Error(`Message not found: ${deadLetter.message_id}`);
  }

  // Reset message for retry
  message.status = 'pending';
  message.attempts = 0;
  message.error = undefined;

  // Mark dead letter as resolved
  deadLetter.resolved = true;
  deadLetter.resolved_at = new Date().toISOString();
  deadLetter.resolved_by = replayed_by;

  // Retry sending
  const connector = getConnectorByCode(message.connector_code);
  if (connector) {
    sendMessageWithRetry(message, connector);
  }

  // Audit log
  writeAuditEntry({
    userId: replayed_by,
    userName: 'Integration Admin',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'IntegrationDeadLetter',
    entityId: deadLetter.id,
    entityName: `Replayed dead letter: ${deadLetter.id}`,
    before: { resolved: false },
    after: { resolved: true },
    correlationId: correlation?.correlation_id || '',
  });

  return message;
}

// ═══════════════════════════════════════════════════════════
// WEBHOOK MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateWebhookInput {
  event_name: string;
  target_url: string;
  secret_ref: string;
  created_by: string;
}

/**
 * Create a new webhook
 */
export function createWebhook(input: CreateWebhookInput): IntegrationWebhook {
  const correlation = getCurrentCorrelation();

  // Validate URL is HTTPS
  if (!input.target_url.startsWith('https://')) {
    throw new Error('Webhook URL must use HTTPS');
  }

  const webhook: IntegrationWebhook = {
    id: `wh-${Date.now()}`,
    event_name: input.event_name,
    target_url: input.target_url,
    secret_ref: input.secret_ref,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  integrationWebhooks.push(webhook);

  // Audit log
  writeAuditEntry({
    userId: input.created_by,
    userName: 'Integration Admin',
    userEmail: '',
    action: 'CREATE',
    entityType: 'IntegrationWebhook',
    entityId: webhook.id,
    entityName: `Created webhook: ${webhook.event_name}`,
    after: { ...webhook, secret_ref: '[REDACTED]' },
    correlationId: correlation?.correlation_id || '',
  });

  return webhook;
}

/**
 * Trigger webhook for an event
 */
export function triggerWebhook(eventName: string, payload: Record<string, any>): void {
  const activeWebhooks = integrationWebhooks.filter(
    w => w.event_name === eventName && w.is_active
  );

  for (const webhook of activeWebhooks) {
    // Simulate webhook delivery
    setTimeout(() => {
      webhook.last_triggered = new Date().toISOString();
      
      // In production, this would make an HTTP POST to the target URL
      console.log(`[WEBHOOK] Triggered ${webhook.event_name} to ${webhook.target_url}`);
    }, 100);
  }
}

// ═══════════════════════════════════════════════════════════
// API CLIENT MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateApiClientInput {
  name: string;
  scopes: string[];
  ip_allowlist: string[];
  rate_limit: number;
  expires_at?: string;
  created_by: string;
}

/**
 * Create a new API client
 */
export function createApiClient(input: CreateApiClientInput): { client: IntegrationApiClient; api_key: string } {
  const correlation = getCurrentCorrelation();

  // Generate API key (in production, this would be a secure random string)
  const apiKey = `ak_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
  
  // Hash the API key (in production, use bcrypt or similar)
  // For browser compatibility, use btoa instead of Buffer
  const keyHash = `sha256:${btoa(apiKey)}`;

  const client: IntegrationApiClient = {
    id: `client-${Date.now()}`,
    client_id: `client-${Date.now()}`,
    name: input.name,
    scopes: input.scopes,
    key_hash: keyHash,
    ip_allowlist: input.ip_allowlist,
    rate_limit: input.rate_limit,
    expires_at: input.expires_at,
    is_active: true,
    created_at: new Date().toISOString(),
  };

  integrationApiClients.push(client);

  // Audit log
  writeAuditEntry({
    userId: input.created_by,
    userName: 'Integration Admin',
    userEmail: '',
    action: 'CREATE',
    entityType: 'IntegrationApiClient',
    entityId: client.id,
    entityName: `Created API client: ${client.name}`,
    after: { ...client, key_hash: '[REDACTED]' },
    correlationId: correlation?.correlation_id || '',
  });

  return { client, api_key: apiKey };
}

/**
 * Validate API client credentials
 */
export function validateApiClient(apiKey: string, ipAddress: string): { valid: boolean; client?: IntegrationApiClient; reason?: string } {
  // Hash the provided API key
  // For browser compatibility, use btoa instead of Buffer
  const keyHash = `sha256:${btoa(apiKey)}`;

  // Find client by key hash
  const client = integrationApiClients.find(c => c.key_hash === keyHash);
  if (!client) {
    return { valid: false, reason: 'Invalid API key' };
  }

  // Check if client is active
  if (!client.is_active) {
    return { valid: false, client, reason: 'API client is inactive' };
  }

  // Check expiration
  if (client.expires_at && new Date(client.expires_at) < new Date()) {
    return { valid: false, client, reason: 'API client has expired' };
  }

  // Check IP allowlist
  if (client.ip_allowlist.length > 0 && !client.ip_allowlist.includes(ipAddress)) {
    return { valid: false, client, reason: 'IP address not in allowlist' };
  }

  // Update last used
  client.last_used = new Date().toISOString();

  return { valid: true, client };
}

// ═══════════════════════════════════════════════════════════
// HEALTH CHECKS
// ═══════════════════════════════════════════════════════════

export interface ConnectorHealth {
  connector_code: string;
  type: string;
  provider: string;
  status: string;
  health: string;
  last_checked: string;
  message_count_24h: number;
  failure_rate_24h: number;
}

/**
 * Get health status for all connectors
 */
export function getConnectorHealth(): ConnectorHealth[] {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return integrationConnectors.map(connector => {
    const messages = getMessagesByConnector(connector.code);
    const recentMessages = messages.filter(m => new Date(m.at) > twentyFourHoursAgo);
    const failedMessages = recentMessages.filter(m => m.status === 'failed');

    return {
      connector_code: connector.code,
      type: connector.type,
      provider: connector.provider,
      status: connector.status,
      health: connector.health,
      last_checked: connector.last_checked,
      message_count_24h: recentMessages.length,
      failure_rate_24h: recentMessages.length > 0 
        ? (failedMessages.length / recentMessages.length) * 100 
        : 0,
    };
  });
}

// ═══════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════

export interface IntegrationStats {
  total_connectors: number;
  active_connectors: number;
  healthy_connectors: number;
  total_messages_24h: number;
  failed_messages_24h: number;
  unresolved_dead_letters: number;
  active_webhooks: number;
  active_api_clients: number;
}

/**
 * Get integration statistics
 */
export function getIntegrationStats(): IntegrationStats {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentMessages = integrationMessages.filter(m => new Date(m.at) > twentyFourHoursAgo);

  return {
    total_connectors: integrationConnectors.length,
    active_connectors: integrationConnectors.filter(c => c.status === 'active').length,
    healthy_connectors: integrationConnectors.filter(c => c.health === 'healthy').length,
    total_messages_24h: recentMessages.length,
    failed_messages_24h: recentMessages.filter(m => m.status === 'failed').length,
    unresolved_dead_letters: integrationDeadLetters.filter(dl => !dl.resolved).length,
    active_webhooks: integrationWebhooks.filter(w => w.is_active).length,
    active_api_clients: integrationApiClients.filter(c => c.is_active).length,
  };
}
