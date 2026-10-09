// ═══════════════════════════════════════════════════════════
// NOTIFICATION DATA MODEL — Part 16
// Real-Time Notification & Collaboration Foundation
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// NOTIFICATION TEMPLATES
// ═══════════════════════════════════════════════════════════

export interface NotificationTemplate {
  id: string;
  code: string;
  module: string;
  channel: 'in_app' | 'email' | 'sms' | 'whatsapp' | 'push';
  locale: string;
  subject: string;
  body: string;
  variables_json: string[];
  version: string;
  is_mandatory_category: boolean;
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION CATEGORIES
// ═══════════════════════════════════════════════════════════

export interface NotificationCategory {
  code: string;
  name: string;
  module: string;
  mandatory: boolean;
  default_channels: string[];
  description: string;
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

export interface Notification {
  id: string;
  user_id: string;
  category: string;
  title: string;
  body: string;
  entity_type?: string;
  entity_id?: string;
  link?: string;
  priority: 'low' | 'normal' | 'high' | 'critical';
  read_at?: string;
  archived_at?: string;
  created_at: string;
  event_id?: string;
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION PREFERENCES
// ═══════════════════════════════════════════════════════════

export interface NotificationPreference {
  id: string;
  user_id: string;
  category: string;
  channels_json: string[];
  digest: 'none' | 'hourly' | 'daily';
  quiet_hours_json?: {
    start: string;
    end: string;
    enabled: boolean;
  };
}

// ═══════════════════════════════════════════════════════════
// NOTIFICATION DELIVERIES
// ═══════════════════════════════════════════════════════════

export interface NotificationDelivery {
  id: string;
  notification_id: string;
  channel: string;
  provider: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed';
  attempts: number;
  provider_ref?: string;
  error?: string;
  at: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const notificationTemplates: NotificationTemplate[] = [
  {
    id: 'tpl-001',
    code: 'TASK_ASSIGNED',
    module: 'workflow',
    channel: 'in_app',
    locale: 'en',
    subject: 'New Task Assigned',
    body: 'You have been assigned a new task: {{task_name}} for {{entity_type}} {{entity_id}}.',
    variables_json: ['task_name', 'entity_type', 'entity_id'],
    version: '1.0.0',
    is_mandatory_category: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-002',
    code: 'APPROVAL_REQUIRED',
    module: 'workflow',
    channel: 'in_app',
    locale: 'en',
    subject: 'Approval Required',
    body: '{{entity_type}} {{entity_id}} requires your approval. Amount: {{amount}}.',
    variables_json: ['entity_type', 'entity_id', 'amount'],
    version: '1.0.0',
    is_mandatory_category: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-003',
    code: 'ESCALATION_ALERT',
    module: 'protocol',
    channel: 'in_app',
    locale: 'en',
    subject: 'Escalation Alert',
    body: 'A violation has been escalated to you: {{violation_type}} for {{entity_type}} {{entity_id}}.',
    variables_json: ['violation_type', 'entity_type', 'entity_id'],
    version: '1.0.0',
    is_mandatory_category: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-004',
    code: 'OVERDUE_REMINDER',
    module: 'accountability',
    channel: 'in_app',
    locale: 'en',
    subject: 'Overdue Item Reminder',
    body: 'You have {{count}} overdue item(s). Please review and take action.',
    variables_json: ['count'],
    version: '1.0.0',
    is_mandatory_category: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'tpl-005',
    code: 'SYSTEM_ALERT',
    module: 'system',
    channel: 'in_app',
    locale: 'en',
    subject: 'System Alert',
    body: '{{message}}',
    variables_json: ['message'],
    version: '1.0.0',
    is_mandatory_category: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

export const notificationCategories: NotificationCategory[] = [
  {
    code: 'TASK',
    name: 'Task Assignments',
    module: 'workflow',
    mandatory: false,
    default_channels: ['in_app', 'email'],
    description: 'Notifications for task assignments and updates',
  },
  {
    code: 'APPROVAL',
    name: 'Approval Requests',
    module: 'workflow',
    mandatory: false,
    default_channels: ['in_app', 'email'],
    description: 'Notifications for approval requests',
  },
  {
    code: 'ESCALATION',
    name: 'Escalations',
    module: 'protocol',
    mandatory: true,
    default_channels: ['in_app', 'email', 'sms'],
    description: 'Critical escalation notifications (cannot be muted)',
  },
  {
    code: 'OVERDUE',
    name: 'Overdue Items',
    module: 'accountability',
    mandatory: false,
    default_channels: ['in_app'],
    description: 'Reminders for overdue responsibilities',
  },
  {
    code: 'SYSTEM',
    name: 'System Alerts',
    module: 'system',
    mandatory: true,
    default_channels: ['in_app', 'email'],
    description: 'Critical system alerts (cannot be muted)',
  },
  {
    code: 'DIGEST',
    name: 'Daily Digest',
    module: 'system',
    mandatory: false,
    default_channels: ['email'],
    description: 'Daily summary of activities',
  },
];

export const notifications: Notification[] = [
  {
    id: 'ntf-001',
    user_id: 'user-010',
    category: 'APPROVAL',
    title: 'Approval Required',
    body: 'Purchase Order PO-2024-002 requires your approval. Amount: ₹5,00,000.',
    entity_type: 'PurchaseOrder',
    entity_id: 'PO-2024-002',
    link: '/procurement/orders/PO-2024-002',
    priority: 'high',
    created_at: '2024-01-16T10:00:00Z',
    event_id: 'evt-001',
  },
  {
    id: 'ntf-002',
    user_id: 'user-010',
    category: 'TASK',
    title: 'New Task Assigned',
    body: 'You have been assigned a new task: Review material requisition for project Riverside Tower.',
    entity_type: 'Task',
    entity_id: 'task-001',
    link: '/home/wf',
    priority: 'normal',
    read_at: '2024-01-16T10:30:00Z',
    created_at: '2024-01-16T09:00:00Z',
    event_id: 'evt-002',
  },
  {
    id: 'ntf-003',
    user_id: 'user-010',
    category: 'OVERDUE',
    title: 'Overdue Item Reminder',
    body: 'You have 2 overdue item(s). Please review and take action.',
    link: '/home/acc',
    priority: 'high',
    created_at: '2024-01-16T08:00:00Z',
    event_id: 'evt-003',
  },
  {
    id: 'ntf-004',
    user_id: 'user-011',
    category: 'APPROVAL',
    title: 'Approval Required',
    body: 'Purchase Requisition PR-2024-003 requires your approval.',
    entity_type: 'PurchaseRequisition',
    entity_id: 'PR-2024-003',
    link: '/procurement/requisitions/PR-2024-003',
    priority: 'normal',
    created_at: '2024-01-16T11:00:00Z',
    event_id: 'evt-004',
  },
  {
    id: 'ntf-005',
    user_id: 'user-017',
    category: 'ESCALATION',
    title: 'Escalation Alert',
    body: 'A violation has been escalated to you: Stock availability violation for Material Issue MI-2024-001.',
    entity_type: 'Violation',
    entity_id: 'viol-001',
    link: '/admin/protocol',
    priority: 'critical',
    created_at: '2024-01-16T11:30:00Z',
    event_id: 'evt-005',
  },
  {
    id: 'ntf-006',
    user_id: 'user-010',
    category: 'SYSTEM',
    title: 'System Maintenance',
    body: 'Scheduled maintenance will occur tonight from 11 PM to 2 AM.',
    priority: 'normal',
    read_at: '2024-01-16T12:00:00Z',
    created_at: '2024-01-16T07:00:00Z',
  },
];

export const notificationPreferences: NotificationPreference[] = [
  {
    id: 'pref-001',
    user_id: 'user-010',
    category: 'TASK',
    channels_json: ['in_app', 'email'],
    digest: 'none',
  },
  {
    id: 'pref-002',
    user_id: 'user-010',
    category: 'APPROVAL',
    channels_json: ['in_app', 'email'],
    digest: 'none',
  },
  {
    id: 'pref-003',
    user_id: 'user-010',
    category: 'ESCALATION',
    channels_json: ['in_app', 'email', 'sms'],
    digest: 'none',
  },
  {
    id: 'pref-004',
    user_id: 'user-010',
    category: 'OVERDUE',
    channels_json: ['in_app'],
    digest: 'daily',
    quiet_hours_json: {
      start: '22:00',
      end: '07:00',
      enabled: true,
    },
  },
  {
    id: 'pref-005',
    user_id: 'user-011',
    category: 'APPROVAL',
    channels_json: ['in_app', 'email'],
    digest: 'none',
  },
];

export const notificationDeliveries: NotificationDelivery[] = [
  {
    id: 'del-001',
    notification_id: 'ntf-001',
    channel: 'in_app',
    provider: 'internal',
    status: 'delivered',
    attempts: 1,
    at: '2024-01-16T10:00:01Z',
  },
  {
    id: 'del-002',
    notification_id: 'ntf-001',
    channel: 'email',
    provider: 'sendgrid',
    status: 'delivered',
    attempts: 1,
    provider_ref: 'msg-12345',
    at: '2024-01-16T10:00:02Z',
  },
  {
    id: 'del-003',
    notification_id: 'ntf-005',
    channel: 'in_app',
    provider: 'internal',
    status: 'delivered',
    attempts: 1,
    at: '2024-01-16T11:30:01Z',
  },
  {
    id: 'del-004',
    notification_id: 'ntf-005',
    channel: 'email',
    provider: 'sendgrid',
    status: 'delivered',
    attempts: 1,
    provider_ref: 'msg-12346',
    at: '2024-01-16T11:30:02Z',
  },
  {
    id: 'del-005',
    notification_id: 'ntf-005',
    channel: 'sms',
    provider: 'twilio',
    status: 'delivered',
    attempts: 1,
    provider_ref: 'sms-78901',
    at: '2024-01-16T11:30:03Z',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getNotificationsByUser(userId: string): Notification[] {
  return notifications.filter(n => n.user_id === userId);
}

export function getUnreadNotifications(userId: string): Notification[] {
  return notifications.filter(n => n.user_id === userId && !n.read_at);
}

export function getNotificationsByCategory(userId: string, category: string): Notification[] {
  return notifications.filter(n => n.user_id === userId && n.category === category);
}

export function getTemplateByCode(code: string, channel: string): NotificationTemplate | undefined {
  return notificationTemplates.find(t => t.code === code && t.channel === channel);
}

export function getCategoryByCode(code: string): NotificationCategory | undefined {
  return notificationCategories.find(c => c.code === code);
}

export function getPreferenceByUserAndCategory(userId: string, category: string): NotificationPreference | undefined {
  return notificationPreferences.find(p => p.user_id === userId && p.category === category);
}

export function getDeliveriesByNotification(notificationId: string): NotificationDelivery[] {
  return notificationDeliveries.filter(d => d.notification_id === notificationId);
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    low: 'var(--text-muted)',
    normal: 'var(--info-600)',
    high: 'var(--warning-600)',
    critical: 'var(--error-600)',
  };
  return colors[priority] || 'var(--text-muted)';
}

export function getDeliveryStatusColor(status: string): string {
  const colors: Record<string, string> = {
    queued: 'var(--text-muted)',
    sent: 'var(--info-600)',
    delivered: 'var(--success-600)',
    failed: 'var(--error-600)',
  };
  return colors[status] || 'var(--text-muted)';
}

export function renderTemplate(template: string, variables: Record<string, any>): string {
  let rendered = template;
  for (const [key, value] of Object.entries(variables)) {
    rendered = rendered.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
  }
  return rendered;
}
