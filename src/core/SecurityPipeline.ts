// ═══════════════════════════════════════════════════════════
// ZERO-TRUST PIPELINE — Part 08
// Authenticate → Authorise → Validate → Execute → Audit
// ═══════════════════════════════════════════════════════════

import { getRouteByPath, type RouteRegistryEntry } from '../data/securityData';
import { can } from './PermissionEngine';
import { writeAuditEntry } from './AuditService';

// ═══════════════════════════════════════════════════════════
// PIPELINE CONTEXT
// ═══════════════════════════════════════════════════════════

export interface PipelineContext {
  requestId: string;
  correlationId: string;
  method: string;
  path: string;
  headers: Record<string, string>;
  query: Record<string, any>;
  body: any;
  params: Record<string, any>;
  
  // Pipeline state
  authenticated: boolean;
  authenticatedUser?: {
    userId: string;
    userName: string;
    userEmail: string;
    roles: string[];
    permissions: string[];
  };
  
  // Scope (derived from server-side session, never from client)
  scope?: {
    companyId: string;
    projectName?: string;
    siteName?: string;
  };
  
  // Authorization result
  authorized: boolean;
  authorizationReason?: string;
  
  // Validation result
  validated: boolean;
  validationErrors?: string[];
  
  // Rate limit
  rateLimited: boolean;
  rateLimitInfo?: {
    limit: number;
    remaining: number;
    resetAt: string;
  };
  
  // Execution
  executed: boolean;
  executionResult?: any;
  executionError?: Error;
  
  // Audit
  audited: boolean;
  auditEntryId?: string;
  
  // Timing
  startedAt: Date;
  completedAt?: Date;
}

// ═══════════════════════════════════════════════════════════
// PIPELINE STAGES
// ═══════════════════════════════════════════════════════════

/**
 * Stage 1: Authenticate
 * Verify token signature, issuer, audience, expiry, algorithm
 */
export async function authenticate(ctx: PipelineContext): Promise<PipelineContext> {
  const authHeader = ctx.headers['authorization'];
  
  if (!authHeader) {
    ctx.authenticated = false;
    return ctx;
  }
  
  // In production, this would verify JWT signature, check expiry, etc.
  // For demonstration, we'll simulate successful authentication
  
  // Extract user from token (simulated)
  const simulatedUser = {
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    roles: ['PROJECT_MANAGER', 'APPROVER_L3'],
    permissions: ['project.view', 'project.create', 'procurement.po.create', 'procurement.po.approve'],
  };
  
  ctx.authenticated = true;
  ctx.authenticatedUser = simulatedUser;
  
  return ctx;
}

/**
 * Stage 2: Derive Scope
 * Extract company/project/site from server-side session (never from client IDs)
 */
export async function deriveScope(ctx: PipelineContext): Promise<PipelineContext> {
  if (!ctx.authenticated || !ctx.authenticatedUser) {
    return ctx;
  }
  
  // In production, this would look up the user's session to get their active scope
  // For demonstration, we'll use default scope
  
  ctx.scope = {
    companyId: 'company-001',
    projectName: 'Riverside Tower - Phase II',
    siteName: 'Main Site',
  };
  
  return ctx;
}

/**
 * Stage 3: Authorize
 * Check if user has permission for this route with proper scope
 */
export async function authorize(ctx: PipelineContext): Promise<PipelineContext> {
  if (!ctx.authenticated || !ctx.authenticatedUser) {
    ctx.authorized = false;
    ctx.authorizationReason = 'Not authenticated';
    return ctx;
  }
  
  // Look up route in registry
  const route = getRouteByPath(ctx.method, ctx.path);
  
  if (!route) {
    ctx.authorized = false;
    ctx.authorizationReason = 'Route not registered';
    return ctx;
  }
  
  // Check permission with scope
  const permissionResult = can(ctx.authenticatedUser.userId, route.permissionKey, {
    type: route.scopeRule as any,
    id: ctx.scope?.companyId,
  });
  
  ctx.authorized = permissionResult.allowed;
  ctx.authorizationReason = permissionResult.reason;
  
  return ctx;
}

/**
 * Stage 4: Validate
 * Validate request against registered schema
 */
export async function validate(ctx: PipelineContext): Promise<PipelineContext> {
  const route = getRouteByPath(ctx.method, ctx.path);
  
  if (!route || !route.schemaRef) {
    ctx.validated = true; // No schema to validate against
    return ctx;
  }
  
  // In production, this would validate against the schema
  // For demonstration, we'll simulate validation
  
  const errors: string[] = [];
  
  // Example validation checks
  if (ctx.method === 'POST' && !ctx.body) {
    errors.push('Request body is required');
  }
  
  // Check for mass assignment (only allow fields in schema)
  // This is a simplified check
  
  ctx.validated = errors.length === 0;
  ctx.validationErrors = errors;
  
  return ctx;
}

/**
 * Stage 5: Rate Limit
 * Check if request exceeds rate limits
 */
export async function rateLimit(ctx: PipelineContext): Promise<PipelineContext> {
  const route = getRouteByPath(ctx.method, ctx.path);
  
  if (!route) {
    ctx.rateLimited = false;
    return ctx;
  }
  
  // In production, this would check Redis or similar for rate limit counters
  // For demonstration, we'll simulate rate limiting
  
  const limit = 100; // requests per minute
  const remaining = 95; // simulated
  const resetAt = new Date(Date.now() + 60000).toISOString();
  
  ctx.rateLimited = remaining <= 0;
  ctx.rateLimitInfo = {
    limit,
    remaining,
    resetAt,
  };
  
  return ctx;
}

/**
 * Stage 6: Execute
 * Execute the actual business logic
 */
export async function execute(
  ctx: PipelineContext,
  handler: (ctx: PipelineContext) => Promise<any>
): Promise<PipelineContext> {
  try {
    ctx.executionResult = await handler(ctx);
    ctx.executed = true;
  } catch (error) {
    ctx.executed = false;
    ctx.executionError = error as Error;
  }
  
  return ctx;
}

/**
 * Stage 7: Audit
 * Log the request with correlation ID
 */
export async function audit(ctx: PipelineContext): Promise<PipelineContext> {
  if (!ctx.authenticatedUser) {
    ctx.audited = false;
    return ctx;
  }
  
  const route = getRouteByPath(ctx.method, ctx.path);
  
  if (!route || !route.auditEvent) {
    ctx.audited = false;
    return ctx;
  }
  
  const auditEntry = writeAuditEntry({
    userId: ctx.authenticatedUser.userId,
    userName: ctx.authenticatedUser.userName,
    userEmail: ctx.authenticatedUser.userEmail,
    action: 'VIEW', // Simplified; would map to actual action
    entityType: route.ownerModule,
    entityId: ctx.params?.id || 'list',
    correlationId: ctx.correlationId,
    ipAddress: ctx.headers['x-forwarded-for'] || 'unknown',
    projectId: ctx.scope?.projectName,
    siteId: ctx.scope?.siteName,
  });
  
  ctx.audited = true;
  ctx.auditEntryId = auditEntry.id;
  
  return ctx;
}

// ═══════════════════════════════════════════════════════════
// PIPELINE ORCHESTRATOR
// ═══════════════════════════════════════════════════════════

/**
 * Execute the full zero-trust pipeline
 */
export async function executePipeline(
  request: {
    method: string;
    path: string;
    headers: Record<string, string>;
    query: Record<string, any>;
    body: any;
    params: Record<string, any>;
  },
  handler: (ctx: PipelineContext) => Promise<any>
): Promise<{
  success: boolean;
  statusCode: number;
  data?: any;
  error?: string;
  correlationId: string;
}> {
  const correlationId = `corr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  let ctx: PipelineContext = {
    requestId: `req_${Date.now()}`,
    correlationId,
    method: request.method,
    path: request.path,
    headers: request.headers,
    query: request.query,
    body: request.body,
    params: request.params,
    authenticated: false,
    authorized: false,
    validated: false,
    rateLimited: false,
    executed: false,
    audited: false,
    startedAt: new Date(),
  };
  
  try {
    // Stage 1: Authenticate
    ctx = await authenticate(ctx);
    if (!ctx.authenticated) {
      return {
        success: false,
        statusCode: 401,
        error: 'Authentication required',
        correlationId,
      };
    }
    
    // Stage 2: Derive Scope
    ctx = await deriveScope(ctx);
    
    // Stage 3: Authorize
    ctx = await authorize(ctx);
    if (!ctx.authorized) {
      return {
        success: false,
        statusCode: 403,
        error: ctx.authorizationReason || 'Access denied',
        correlationId,
      };
    }
    
    // Stage 4: Validate
    ctx = await validate(ctx);
    if (!ctx.validated) {
      return {
        success: false,
        statusCode: 400,
        error: `Validation failed: ${ctx.validationErrors?.join(', ')}`,
        correlationId,
      };
    }
    
    // Stage 5: Rate Limit
    ctx = await rateLimit(ctx);
    if (ctx.rateLimited) {
      return {
        success: false,
        statusCode: 429,
        error: 'Rate limit exceeded',
        correlationId,
      };
    }
    
    // Stage 6: Execute
    ctx = await execute(ctx, handler);
    if (!ctx.executed) {
      return {
        success: false,
        statusCode: 500,
        error: ctx.executionError?.message || 'Internal server error',
        correlationId,
      };
    }
    
    // Stage 7: Audit
    ctx = await audit(ctx);
    
    ctx.completedAt = new Date();
    
    return {
      success: true,
      statusCode: 200,
      data: ctx.executionResult,
      correlationId,
    };
  } catch (error) {
    ctx.completedAt = new Date();
    return {
      success: false,
      statusCode: 500,
      error: (error as Error).message || 'Internal server error',
      correlationId,
    };
  }
}

// ═══════════════════════════════════════════════════════════
// SECURITY HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Sanitize input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

/**
 * Check if string contains SQL injection patterns
 */
export function containsSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER)\b)/i,
    /(--|\/\*|\*\/)/,
    /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
    /(['"];\s*(DROP|DELETE|UPDATE|INSERT))/i,
  ];
  
  return sqlPatterns.some(pattern => pattern.test(input));
}

/**
 * Validate file type by magic bytes (browser-compatible)
 */
export function validateFileType(file: File, allowedMimes: string[]): boolean {
  // In browser, we check MIME type from File object
  // For production, magic byte validation would be done server-side
  return allowedMimes.includes(file.type);
}
