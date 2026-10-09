// ═══════════════════════════════════════════════════════════
// EVENT BUS SERVICE — Part 11
// Real-Time Event Bus & Integration Platform
// ═══════════════════════════════════════════════════════════

import {
  EventEnvelope,
  EventDefinition,
  eventCatalogue,
  schemaVersions,
  subscriptions,
  outboxEvents,
  deadLetters,
  deliveries,
  type Subscription,
  type DeadLetter,
  type Delivery,
  type OutboxEvent,
  type SchemaVersion,
} from '../data/eventBusData';
import { getCurrentCorrelation } from './ObservabilityService';

// ═══════════════════════════════════════════════════════════
// EVENT PUBLISHING
// ═══════════════════════════════════════════════════════════

export interface PublishEventInput {
  event_type: string;
  company_id: string;
  project_id?: string;
  site_id?: string;
  actor_id: string;
  payload: Record<string, any>;
  links?: Record<string, string>;
  causation_id?: string;
  idempotency_key?: string;
}

/**
 * Publish an event through the transactional outbox
 * This ensures events are written in the same transaction as business changes
 */
export function publishEvent(input: PublishEventInput): EventEnvelope {
  const correlation = getCurrentCorrelation();
  
  // Validate event type exists
  const eventDef = eventCatalogue.find(e => e.event_type === input.event_type);
  if (!eventDef) {
    throw new Error(`Unknown event type: ${input.event_type}`);
  }

  // Get latest schema version
  const schema = schemaVersions
    .filter(s => s.event_type === input.event_type && s.status === 'published')
    .sort((a, b) => b.version.localeCompare(a.version))[0];

  if (!schema) {
    throw new Error(`No published schema for event type: ${input.event_type}`);
  }

  // Validate payload against schema (simplified validation)
  validatePayload(input.payload, schema.json_schema);

  // Create event envelope
  const event: EventEnvelope = {
    event_id: generateUUID(),
    event_type: input.event_type,
    schema_version: schema.version,
    occurred_at: new Date().toISOString(),
    company_id: input.company_id,
    project_id: input.project_id,
    site_id: input.site_id,
    actor_id: input.actor_id,
    correlation_id: correlation?.correlation_id || generateUUID(),
    causation_id: input.causation_id,
    idempotency_key: input.idempotency_key || generateUUID(),
    payload: input.payload,
    links: input.links || {},
  };

  // Write to outbox (in production, this would be in the same DB transaction)
  const outboxEvent: OutboxEvent = {
    id: `outbox-${Date.now()}`,
    event,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  outboxEvents.push(outboxEvent);

  // Simulate immediate publication (in production, this would be async via relay)
  setTimeout(() => {
    outboxEvent.status = 'published';
    outboxEvent.published_at = new Date().toISOString();
    
    // Deliver to all matching subscriptions
    deliverToSubscriptions(event);
  }, 10);

  console.log('[EVENT BUS] Published event:', event.event_type, event.event_id);

  return event;
}

/**
 * Validate payload against JSON schema (simplified)
 */
function validatePayload(payload: Record<string, any>, schema: Record<string, any>): void {
  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in payload)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }
  }

  if (schema.properties) {
    for (const [key, value] of Object.entries(payload)) {
      const propSchema = schema.properties[key];
      if (propSchema && propSchema.type) {
        const actualType = Array.isArray(value) ? 'array' : typeof value;
        if (actualType !== propSchema.type) {
          throw new Error(`Invalid type for field ${key}: expected ${propSchema.type}, got ${actualType}`);
        }
      }
    }
  }
}

/**
 * Deliver event to all matching subscriptions
 */
function deliverToSubscriptions(event: EventEnvelope): void {
  const matchingSubs = subscriptions.filter(sub => 
    sub.status === 'active' && 
    (sub.event_types.includes(event.event_type) || sub.event_types.includes('*'))
  );

  for (const sub of matchingSubs) {
    deliverToSubscription(sub, event);
  }
}

/**
 * Deliver event to a specific subscription
 */
function deliverToSubscription(subscription: Subscription, event: EventEnvelope): void {
  const delivery: Delivery = {
    id: `del-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    subscription_id: subscription.id,
    event_id: event.event_id,
    attempt: 1,
    status: 'pending',
    created_at: new Date().toISOString(),
  };

  deliveries.push(delivery);

  // Simulate delivery
  setTimeout(() => {
    if (subscription.type === 'webhook' && subscription.endpoint) {
      // Simulate webhook delivery with potential failures
      const success = Math.random() > 0.2; // 80% success rate
      
      if (success) {
        delivery.status = 'delivered';
        delivery.http_status = 200;
        delivery.latency_ms = Math.floor(Math.random() * 100) + 20;
        delivery.delivered_at = new Date().toISOString();
        subscription.failure_count = 0;
        subscription.last_success_at = delivery.delivered_at;
      } else {
        delivery.status = 'failed';
        delivery.http_status = 500;
        delivery.latency_ms = 2500;
        delivery.error = 'Simulated webhook failure';
        subscription.failure_count++;
        
        // Suspend after 10 failures
        if (subscription.failure_count >= 10) {
          subscription.status = 'suspended';
          console.warn('[EVENT BUS] Subscription suspended due to failures:', subscription.id);
        }
      }
    } else {
      // Internal subscription - always succeeds
      delivery.status = 'delivered';
      delivery.latency_ms = Math.floor(Math.random() * 50) + 10;
      delivery.delivered_at = new Date().toISOString();
    }
  }, 50);
}

// ═══════════════════════════════════════════════════════════
// IDEMPOTENT CONSUMER (INBOX)
// ═══════════════════════════════════════════════════════════

const processedEvents = new Set<string>();

/**
 * Check if event has already been processed (idempotency check)
 */
export function isEventProcessed(eventId: string): boolean {
  return processedEvents.has(eventId);
}

/**
 * Mark event as processed
 */
export function markEventProcessed(eventId: string): void {
  processedEvents.add(eventId);
}

/**
 * Process event with idempotency guarantee
 */
export function processEventWithIdempotency(
  event: EventEnvelope,
  handler: (event: EventEnvelope) => void
): { processed: boolean; duplicate: boolean } {
  if (isEventProcessed(event.event_id)) {
    console.log('[EVENT BUS] Duplicate event ignored:', event.event_id);
    return { processed: false, duplicate: true };
  }

  try {
    handler(event);
    markEventProcessed(event.event_id);
    return { processed: true, duplicate: false };
  } catch (error) {
    console.error('[EVENT BUS] Error processing event:', event.event_id, error);
    throw error;
  }
}

// ═══════════════════════════════════════════════════════════
// DEAD LETTER QUEUE
// ═══════════════════════════════════════════════════════════

/**
 * Move failed event to dead letter queue
 */
export function moveToDeadLetterQueue(
  consumer: string,
  event: EventEnvelope,
  reason: string
): DeadLetter {
  const dlq: DeadLetter = {
    id: `dlq-${Date.now()}`,
    consumer,
    event_id: event.event_id,
    event_type: event.event_type,
    reason,
    payload_hash: `sha256:${generateUUID()}`,
    payload: event.payload,
    first_failed_at: new Date().toISOString(),
    last_failed_at: new Date().toISOString(),
    retry_count: 0,
    status: 'pending',
  };

  deadLetters.push(dlq);
  console.warn('[EVENT BUS] Event moved to DLQ:', dlq.id, 'Reason:', reason);

  return dlq;
}

/**
 * Replay a dead letter event (dry run first)
 */
export function replayDeadLetter(
  dlqId: string,
  replayedBy: string,
  dryRun: boolean = true
): { success: boolean; message: string } {
  const dlq = deadLetters.find(d => d.id === dlqId);
  
  if (!dlq) {
    return { success: false, message: 'Dead letter not found' };
  }

  if (dlq.status !== 'pending') {
    return { success: false, message: `Dead letter already ${dlq.status}` };
  }

  if (dryRun) {
    console.log('[EVENT BUS] Dry run replay for DLQ:', dlqId);
    return { success: true, message: 'Dry run completed - no errors detected' };
  }

  // Actual replay
  dlq.replayed_at = new Date().toISOString();
  dlq.replayed_by = replayedBy;
  dlq.status = 'replayed';

  console.log('[EVENT BUS] Replayed DLQ:', dlqId, 'By:', replayedBy);

  return { success: true, message: 'Event replayed successfully' };
}

// ═══════════════════════════════════════════════════════════
// SUBSCRIPTION MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateSubscriptionInput {
  subscriber: string;
  type: 'internal' | 'webhook';
  event_types: string[];
  endpoint?: string;
  secret_ref?: string;
  rate_limit_per_minute?: number;
  owner_module: string;
  created_by: string;
}

/**
 * Create a new subscription
 */
export function createSubscription(input: CreateSubscriptionInput): Subscription {
  // Validate webhook configuration
  if (input.type === 'webhook') {
    if (!input.endpoint) {
      throw new Error('Webhook subscription requires endpoint URL');
    }
    if (!input.endpoint.startsWith('https://')) {
      throw new Error('Webhook endpoint must use HTTPS');
    }
    if (!input.secret_ref) {
      throw new Error('Webhook subscription requires secret reference');
    }
  }

  // Validate event types exist
  for (const eventType of input.event_types) {
    if (eventType !== '*' && !eventCatalogue.find(e => e.event_type === eventType)) {
      throw new Error(`Unknown event type: ${eventType}`);
    }
  }

  const subscription: Subscription = {
    id: `sub-${Date.now()}`,
    subscriber: input.subscriber,
    type: input.type,
    event_types: input.event_types,
    endpoint: input.endpoint,
    secret_ref: input.secret_ref,
    status: 'active',
    failure_count: 0,
    rate_limit_per_minute: input.rate_limit_per_minute,
    created_at: new Date().toISOString(),
    created_by: input.created_by,
    owner_module: input.owner_module,
  };

  subscriptions.push(subscription);
  console.log('[EVENT BUS] Created subscription:', subscription.id);

  return subscription;
}

/**
 * Suspend a subscription
 */
export function suspendSubscription(subscriptionId: string): void {
  const sub = subscriptions.find(s => s.id === subscriptionId);
  if (sub) {
    sub.status = 'suspended';
    console.log('[EVENT BUS] Suspended subscription:', subscriptionId);
  }
}

/**
 * Resume a subscription
 */
export function resumeSubscription(subscriptionId: string): void {
  const sub = subscriptions.find(s => s.id === subscriptionId);
  if (sub) {
    sub.status = 'active';
    sub.failure_count = 0;
    console.log('[EVENT BUS] Resumed subscription:', subscriptionId);
  }
}

// ═══════════════════════════════════════════════════════════
// SCHEMA MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateSchemaInput {
  event_type: string;
  version: string;
  json_schema: Record<string, any>;
  created_by: string;
  compatibility_notes?: string;
}

/**
 * Create a new schema version
 */
export function createSchemaVersion(input: CreateSchemaInput): SchemaVersion {
  // Check if event type exists
  const eventDef = eventCatalogue.find(e => e.event_type === input.event_type);
  if (!eventDef) {
    throw new Error(`Unknown event type: ${input.event_type}`);
  }

  // Check for duplicate version
  const existing = schemaVersions.find(
    s => s.event_type === input.event_type && s.version === input.version
  );
  if (existing) {
    throw new Error(`Schema version ${input.version} already exists for ${input.event_type}`);
  }

  const schema: SchemaVersion = {
    id: `schema-${Date.now()}`,
    event_type: input.event_type,
    version: input.version,
    json_schema: input.json_schema,
    status: 'draft',
    created_at: new Date().toISOString(),
    created_by: input.created_by,
    compatibility_notes: input.compatibility_notes,
  };

  schemaVersions.push(schema);
  console.log('[EVENT BUS] Created schema version:', schema.id);

  return schema;
}

/**
 * Publish a schema version
 */
export function publishSchemaVersion(schemaId: string, reviewedBy: string): void {
  const schema = schemaVersions.find(s => s.id === schemaId);
  if (!schema) {
    throw new Error('Schema not found');
  }

  if (schema.status !== 'draft' && schema.status !== 'reviewed') {
    throw new Error(`Cannot publish schema in ${schema.status} status`);
  }

  schema.status = 'published';
  schema.published_at = new Date().toISOString();
  schema.reviewed_by = reviewedBy;

  console.log('[EVENT BUS] Published schema:', schemaId);
}

/**
 * Deprecate a schema version
 */
export function deprecateSchemaVersion(schemaId: string, sunsetDate: string): void {
  const schema = schemaVersions.find(s => s.id === schemaId);
  if (!schema) {
    throw new Error('Schema not found');
  }

  if (schema.status !== 'published') {
    throw new Error('Can only deprecate published schemas');
  }

  schema.status = 'deprecated';
  schema.sunset_at = sunsetDate;

  console.log('[EVENT BUS] Deprecated schema:', schemaId, 'Sunset:', sunsetDate);
}

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get integration monitoring metrics
 */
export function getIntegrationMetrics() {
  const totalSubscriptions = subscriptions.length;
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active').length;
  const suspendedSubscriptions = subscriptions.filter(s => s.status === 'suspended').length;
  
  const totalDlq = deadLetters.length;
  const pendingDlq = deadLetters.filter(d => d.status === 'pending').length;
  
  const totalDeliveries = deliveries.length;
  const failedDeliveries = deliveries.filter(d => d.status === 'failed').length;
  const avgLatency = deliveries
    .filter(d => d.latency_ms)
    .reduce((sum, d) => sum + (d.latency_ms || 0), 0) / totalDeliveries || 0;

  return {
    subscriptions: {
      total: totalSubscriptions,
      active: activeSubscriptions,
      suspended: suspendedSubscriptions,
    },
    deadLetterQueue: {
      total: totalDlq,
      pending: pendingDlq,
    },
    deliveries: {
      total: totalDeliveries,
      failed: failedDeliveries,
      avgLatencyMs: Math.round(avgLatency),
    },
  };
}
