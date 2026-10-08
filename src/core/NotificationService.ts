// ═══════════════════════════════════════════════════════════
// NOTIFICATION SERVICE — Part 16
// Real-Time Notification & Collaboration Foundation
// ═══════════════════════════════════════════════════════════

import {
  Notification,
  NotificationPreference,
  NotificationDelivery,
  NotificationTemplate,
  notifications,
  notificationPreferences,
  notificationDeliveries,
  notificationTemplates,
  notificationCategories,
  getTemplateByCode,
  getCategoryByCode,
  getPreferenceByUserAndCategory,
  renderTemplate,
} from '../data/notificationData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// SEND NOTIFICATION
// ═══════════════════════════════════════════════════════════

export interface SendNotificationInput {
  user_id: string;
  category_code: string;
  title: string;
  body: string;
  entity_type?: string;
  entity_id?: string;
  link?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
  event_id?: string;
  variables?: Record<string, any>;
}

/**
 * Send a notification to a user
 */
export function sendNotification(input: SendNotificationInput): Notification {
  const correlation = getCurrentCorrelation();

  // Get category
  const category = getCategoryByCode(input.category_code);
  if (!category) {
    throw new Error(`Notification category not found: ${input.category_code}`);
  }

  // Check if category is mandatory (cannot be muted)
  const isMandatory = category.mandatory;

  // Get user preferences
  const preference = getPreferenceByUserAndCategory(input.user_id, input.category_code);

  // Determine channels to use
  let channels: string[];
  if (isMandatory) {
    // Mandatory categories use all default channels
    channels = category.default_channels;
  } else if (preference) {
    // Use user preferences
    channels = preference.channels_json;
  } else {
    // Use default channels
    channels = category.default_channels;
  }

  // Check quiet hours (unless critical or mandatory)
  if (preference?.quiet_hours_json?.enabled && input.priority !== 'critical' && !isMandatory) {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const quietStart = preference.quiet_hours_json.start;
    const quietEnd = preference.quiet_hours_json.end;

    // Simple quiet hours check (would need more sophisticated logic for overnight ranges)
    if (currentTime >= quietStart && currentTime <= quietEnd) {
      // Defer to digest or skip in-app
      channels = channels.filter(ch => ch !== 'in_app');
    }
  }

  // Create notification
  const notification: Notification = {
    id: `ntf-${Date.now()}`,
    user_id: input.user_id,
    category: input.category_code,
    title: input.title,
    body: input.body,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    link: input.link,
    priority: input.priority || 'normal',
    created_at: new Date().toISOString(),
    event_id: input.event_id,
  };

  notifications.push(notification);

  // Create deliveries for each channel
  for (const channel of channels) {
    const delivery: NotificationDelivery = {
      id: `del-${Date.now()}-${channel}`,
      notification_id: notification.id,
      channel,
      provider: getProviderForChannel(channel),
      status: 'queued',
      attempts: 0,
      at: new Date().toISOString(),
    };
    notificationDeliveries.push(delivery);

    // Simulate delivery (in production, this would be async)
    simulateDelivery(delivery);
  }

  // Audit log
  writeAuditEntry({
    userId: 'system',
    userName: 'Notification Service',
    userEmail: '',
    action: 'CREATE',
    entityType: 'Notification',
    entityId: notification.id,
    entityName: `${input.category_code}: ${input.title}`,
    after: notification,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'notification.sent',
    company_id: 'company-001',
    actor_id: input.user_id,
    payload: {
      notification_id: notification.id,
      category: input.category_code,
      channels,
    },
  });

  return notification;
}

/**
 * Get provider for a channel
 */
function getProviderForChannel(channel: string): string {
  const providers: Record<string, string> = {
    in_app: 'internal',
    email: 'sendgrid',
    sms: 'twilio',
    whatsapp: 'twilio',
    push: 'firebase',
  };
  return providers[channel] || 'unknown';
}

/**
 * Simulate delivery (in production, this would call actual providers)
 */
function simulateDelivery(delivery: NotificationDelivery): void {
  // Simulate async delivery
  setTimeout(() => {
    delivery.status = 'delivered';
    delivery.attempts = 1;
    delivery.provider_ref = `ref-${Date.now()}`;
    delivery.at = new Date().toISOString();
  }, 100);
}

// ═══════════════════════════════════════════════════════════
// SEND TEMPLATE NOTIFICATION
// ═══════════════════════════════════════════════════════════

export interface SendTemplateNotificationInput {
  user_id: string;
  template_code: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';
  variables: Record<string, any>;
  entity_type?: string;
  entity_id?: string;
  link?: string;
  priority?: 'low' | 'normal' | 'high' | 'critical';
}

/**
 * Send a notification using a template
 */
export function sendTemplateNotification(input: SendTemplateNotificationInput): Notification {
  // Get template
  const template = getTemplateByCode(input.template_code, input.channel);
  if (!template) {
    throw new Error(`Template not found: ${input.template_code} for channel ${input.channel}`);
  }

  // Render template
  const title = renderTemplate(template.subject, input.variables);
  const body = renderTemplate(template.body, input.variables);

  // Determine category from template code
  const categoryCode = template.code.split('_')[0];

  // Send notification
  return sendNotification({
    user_id: input.user_id,
    category_code: categoryCode,
    title,
    body,
    entity_type: input.entity_type,
    entity_id: input.entity_id,
    link: input.link,
    priority: input.priority,
    variables: input.variables,
  });
}

// ═══════════════════════════════════════════════════════════
// MARK AS READ
// ═══════════════════════════════════════════════════════════

/**
 * Mark a notification as read
 */
export function markNotificationAsRead(notificationId: string, userId: string): Notification {
  const notification = notifications.find(n => n.id === notificationId);

  if (!notification) {
    throw new Error(`Notification not found: ${notificationId}`);
  }

  if (notification.user_id !== userId) {
    throw new Error('Unauthorized: Cannot mark notification for another user');
  }

  notification.read_at = new Date().toISOString();

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'User',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'Notification',
    entityId: notification.id,
    entityName: `Marked as read: ${notification.title}`,
    before: { read_at: null },
    after: { read_at: notification.read_at },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  return notification;
}

/**
 * Mark all notifications as read for a user
 */
export function markAllNotificationsAsRead(userId: string): number {
  const unreadNotifications = notifications.filter(
    n => n.user_id === userId && !n.read_at
  );

  const now = new Date().toISOString();
  unreadNotifications.forEach(n => {
    n.read_at = now;
  });

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'User',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'Notification',
    entityId: 'all',
    entityName: `Marked ${unreadNotifications.length} notifications as read`,
    after: { count: unreadNotifications.length },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  return unreadNotifications.length;
}

// ═══════════════════════════════════════════════════════════
// ARCHIVE NOTIFICATION
// ═══════════════════════════════════════════════════════════

/**
 * Archive a notification
 */
export function archiveNotification(notificationId: string, userId: string): Notification {
  const notification = notifications.find(n => n.id === notificationId);

  if (!notification) {
    throw new Error(`Notification not found: ${notificationId}`);
  }

  if (notification.user_id !== userId) {
    throw new Error('Unauthorized: Cannot archive notification for another user');
  }

  notification.archived_at = new Date().toISOString();

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'User',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'Notification',
    entityId: notification.id,
    entityName: `Archived: ${notification.title}`,
    after: { archived_at: notification.archived_at },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  return notification;
}

// ═══════════════════════════════════════════════════════════
// PREFERENCE MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface UpdatePreferenceInput {
  user_id: string;
  category: string;
  channels?: string[];
  digest?: 'none' | 'hourly' | 'daily';
  quiet_hours?: {
    start: string;
    end: string;
    enabled: boolean;
  };
}

/**
 * Update notification preferences
 */
export function updatePreference(input: UpdatePreferenceInput): NotificationPreference {
  const correlation = getCurrentCorrelation();

  // Check if category is mandatory
  const category = getCategoryByCode(input.category);
  if (!category) {
    throw new Error(`Category not found: ${input.category}`);
  }

  if (category.mandatory) {
    // Cannot change channels for mandatory categories
    throw new Error(`Cannot modify preferences for mandatory category: ${input.category}`);
  }

  // Find existing preference
  let preference = notificationPreferences.find(
    p => p.user_id === input.user_id && p.category === input.category
  );

  if (preference) {
    // Update existing
    const before = { ...preference };

    if (input.channels) {
      preference.channels_json = input.channels;
    }
    if (input.digest) {
      preference.digest = input.digest;
    }
    if (input.quiet_hours) {
      preference.quiet_hours_json = input.quiet_hours;
    }

    // Audit log
    writeAuditEntry({
      userId: input.user_id,
      userName: 'User',
      userEmail: '',
      action: 'UPDATE',
      entityType: 'NotificationPreference',
      entityId: preference.id,
      entityName: `Updated preferences for ${input.category}`,
      before,
      after: preference,
      correlationId: correlation?.correlation_id || '',
    });
  } else {
    // Create new
    preference = {
      id: `pref-${Date.now()}`,
      user_id: input.user_id,
      category: input.category,
      channels_json: input.channels || category.default_channels,
      digest: input.digest || 'none',
      quiet_hours_json: input.quiet_hours,
    };

    notificationPreferences.push(preference);

    // Audit log
    writeAuditEntry({
      userId: input.user_id,
      userName: 'User',
      userEmail: '',
      action: 'CREATE',
      entityType: 'NotificationPreference',
      entityId: preference.id,
      entityName: `Created preferences for ${input.category}`,
      after: preference,
      correlationId: correlation?.correlation_id || '',
    });
  }

  return preference;
}

// ═══════════════════════════════════════════════════════════
// BROADCAST NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

export interface BroadcastInput {
  category_code: string;
  title: string;
  body: string;
  target_users: string[];
  priority?: 'low' | 'normal' | 'high' | 'critical';
  link?: string;
}

/**
 * Broadcast a notification to multiple users
 */
export function broadcastNotification(input: BroadcastInput): Notification[] {
  const sentNotifications: Notification[] = [];

  for (const userId of input.target_users) {
    const notification = sendNotification({
      user_id: userId,
      category_code: input.category_code,
      title: input.title,
      body: input.body,
      link: input.link,
      priority: input.priority,
    });
    sentNotifications.push(notification);
  }

  // Audit log
  writeAuditEntry({
    userId: 'system',
    userName: 'Broadcast Service',
    userEmail: '',
    action: 'CREATE',
    entityType: 'Broadcast',
    entityId: `broadcast-${Date.now()}`,
    entityName: `Broadcast: ${input.title} to ${input.target_users.length} users`,
    after: { count: sentNotifications.length },
    correlationId: getCurrentCorrelation()?.correlation_id || '',
  });

  return sentNotifications;
}

// ═══════════════════════════════════════════════════════════
// DIGEST GENERATION
// ═══════════════════════════════════════════════════════════

export interface Digest {
  user_id: string;
  period: 'hourly' | 'daily';
  notifications: Notification[];
  generated_at: string;
}

/**
 * Generate digest for users with digest preference
 */
export function generateDigest(period: 'hourly' | 'daily'): Digest[] {
  const digests: Digest[] = [];

  // Find users with digest preference
  const usersWithDigest = new Set(
    notificationPreferences
      .filter(p => p.digest === period)
      .map(p => p.user_id)
  );

  for (const userId of usersWithDigest) {
    // Get notifications since last digest
    const cutoff = period === 'hourly'
      ? new Date(Date.now() - 60 * 60 * 1000)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const recentNotifications = notifications.filter(
      n => n.user_id === userId &&
           new Date(n.created_at) > cutoff &&
           !n.read_at
    );

    if (recentNotifications.length > 0) {
      digests.push({
        user_id: userId,
        period,
        notifications: recentNotifications,
        generated_at: new Date().toISOString(),
      });

      // In production, this would send digest email
      console.log(`[DIGEST] Generated ${period} digest for user ${userId} with ${recentNotifications.length} notifications`);
    }
  }

  return digests;
}

// ═══════════════════════════════════════════════════════════
// TEMPLATE MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface CreateTemplateInput {
  code: string;
  module: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';
  locale: string;
  subject: string;
  body: string;
  variables: string[];
  is_mandatory_category?: boolean;
}

/**
 * Create a new notification template
 */
export function createTemplate(input: CreateTemplateInput): NotificationTemplate {
  const correlation = getCurrentCorrelation();

  // Check for duplicate
  const existing = notificationTemplates.find(
    t => t.code === input.code && t.channel === input.channel && t.locale === input.locale
  );
  if (existing) {
    throw new Error(`Template already exists: ${input.code} for channel ${input.channel} and locale ${input.locale}`);
  }

  const template: NotificationTemplate = {
    id: `tpl-${Date.now()}`,
    code: input.code,
    module: input.module,
    channel: input.channel,
    locale: input.locale,
    subject: input.subject,
    body: input.body,
    variables_json: input.variables,
    version: '1.0.0',
    is_mandatory_category: input.is_mandatory_category || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  notificationTemplates.push(template);

  // Audit log
  writeAuditEntry({
    userId: 'system',
    userName: 'Template Manager',
    userEmail: '',
    action: 'CREATE',
    entityType: 'NotificationTemplate',
    entityId: template.id,
    entityName: `Created template: ${template.code}`,
    after: template,
    correlationId: correlation?.correlation_id || '',
  });

  return template;
}

/**
 * Preview a template with sample variables
 */
export function previewTemplate(templateId: string, sampleVariables: Record<string, any>): {
  subject: string;
  body: string;
} {
  const template = notificationTemplates.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return {
    subject: renderTemplate(template.subject, sampleVariables),
    body: renderTemplate(template.body, sampleVariables),
  };
}

// ═══════════════════════════════════════════════════════════
// STATISTICS
// ═══════════════════════════════════════════════════════════

export interface NotificationStats {
  total: number;
  unread: number;
  byCategory: Record<string, number>;
  byPriority: Record<string, number>;
  byChannel: Record<string, number>;
}

/**
 * Get notification statistics for a user
 */
export function getNotificationStats(userId: string): NotificationStats {
  const userNotifications = notifications.filter(n => n.user_id === userId);

  const stats: NotificationStats = {
    total: userNotifications.length,
    unread: userNotifications.filter(n => !n.read_at).length,
    byCategory: {},
    byPriority: {},
    byChannel: {},
  };

  // Count by category
  for (const n of userNotifications) {
    stats.byCategory[n.category] = (stats.byCategory[n.category] || 0) + 1;
  }

  // Count by priority
  for (const n of userNotifications) {
    stats.byPriority[n.priority] = (stats.byPriority[n.priority] || 0) + 1;
  }

  // Count by channel (from deliveries)
  const userDeliveries = notificationDeliveries.filter(d =>
    userNotifications.some(n => n.id === d.notification_id)
  );
  for (const d of userDeliveries) {
    stats.byChannel[d.channel] = (stats.byChannel[d.channel] || 0) + 1;
  }

  return stats;
}
