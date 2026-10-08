// ═══════════════════════════════════════════════════════════
// REQUEST CONTEXT — Part 04
// Per-request context for all service operations
// ═══════════════════════════════════════════════════════════

export interface RequestContext {
  userId: string;
  userName: string;
  userEmail: string;
  companyId: string;
  companyName: string;
  activeProjectId?: string;
  activeProjectName?: string;
  activeSiteId?: string;
  activeSiteName?: string;
  roles: string[];
  permissions: string[];
  locale: string;
  timezone: string;
  correlationId: string;
  deviceInfo: {
    type: 'desktop' | 'tablet' | 'mobile';
    userAgent: string;
    ipAddress?: string;
  };
  timestamp: Date;
}

export interface AuditEntry {
  id: string;
  correlationId: string;
  userId: string;
  userName: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT' | 'SUBMIT' | 'CANCEL';
  entityType: string;
  entityId: string;
  entityName?: string;
  before?: any;
  after?: any;
  reason?: string;
  timestamp: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface EventOutboxEntry {
  id: string;
  correlationId: string;
  eventName: string;
  aggregateType: string;
  aggregateId: string;
  companyId: string;
  projectId?: string;
  siteId?: string;
  payload: any;
  createdAt: Date;
  publishedAt?: Date;
  attempts: number;
  lastError?: string;
  status: 'PENDING' | 'PUBLISHED' | 'FAILED' | 'DEAD_LETTER';
}

// Generate correlation ID
export function generateCorrelationId(): string {
  return `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Create request context from current session
export function createRequestContext(
  userId: string,
  userName: string,
  userEmail: string,
  companyId: string,
  companyName: string,
  roles: string[],
  permissions: string[]
): RequestContext {
  return {
    userId,
    userName,
    userEmail,
    companyId,
    companyName,
    roles,
    permissions,
    locale: 'en-IN',
    timezone: 'Asia/Kolkata',
    correlationId: generateCorrelationId(),
    deviceInfo: {
      type: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      userAgent: navigator.userAgent,
    },
    timestamp: new Date(),
  };
}

// Sample context for demo
export const sampleContext: RequestContext = {
  userId: 'user-001',
  userName: 'Rajesh Kumar',
  userEmail: 'rajesh.kumar@acme-infra.com',
  companyId: 'company-001',
  companyName: 'Acme Infrastructure Ltd',
  activeProjectId: 'project-001',
  activeProjectName: 'Riverside Tower - Phase II',
  activeSiteId: 'site-001',
  activeSiteName: 'Main Site',
  roles: ['PROJECT_MANAGER', 'APPROVER_L3'],
  permissions: [
    'procurement.pr.create',
    'procurement.pr.approve',
    'procurement.po.create',
    'procurement.po.approve',
    'inventory.grn.create',
    'inventory.stock.view',
    'project.view',
    'project.edit',
  ],
  locale: 'en-IN',
  timezone: 'Asia/Kolkata',
  correlationId: 'corr_demo_123456789',
  deviceInfo: {
    type: 'desktop',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  },
  timestamp: new Date(),
};
