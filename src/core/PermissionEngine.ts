// ═══════════════════════════════════════════════════════════
// PERMISSION ENGINE — Part 06
// Policy Decision Point (PDP) for Enterprise RBAC
// ═══════════════════════════════════════════════════════════

import {
  permissions,
  roles,
  rolePermissions,
  userRoleAssignments,
  sodRules,
  fieldPolicies,
  type Permission,
  type Role,
  type UserRoleAssignment,
  type SoDRule,
} from '../data/iamData';

// ═══════════════════════════════════════════════════════════
// PERMISSION CHECK RESULT
// ═══════════════════════════════════════════════════════════

export interface PermissionCheckResult {
  allowed: boolean;
  reason?: string;
  source?: {
    roleId: string;
    roleName: string;
    scopeType: string;
    scopeName?: string;
  };
  sodConflict?: SoDRule;
}

// ═══════════════════════════════════════════════════════════
// MAIN PERMISSION CHECK FUNCTION
// ═══════════════════════════════════════════════════════════

/**
 * Check if a user has permission to perform an action on a resource
 * 
 * @param userId - The user ID to check
 * @param permissionKey - The permission key to check (e.g., 'procurement.po.create')
 * @param resource - Optional resource context (project, site, etc.)
 * @returns PermissionCheckResult with allowed status and reason
 */
export function can(
  userId: string,
  permissionKey: string,
  resource?: {
    type?: 'project' | 'site' | 'department' | 'company';
    id?: string;
  }
): PermissionCheckResult {
  // 1. Get user's active role assignments
  const userAssignments = userRoleAssignments.filter(
    a => a.userId === userId && a.isActive
  );

  if (userAssignments.length === 0) {
    return {
      allowed: false,
      reason: 'User has no active role assignments',
    };
  }

  // 2. Check each assignment for the permission
  for (const assignment of userAssignments) {
    // Check scope match
    if (resource && assignment.scopeType !== 'company') {
      if (assignment.scopeType === 'project' && resource.type !== 'project') {
        continue;
      }
      if (assignment.scopeType === 'site' && resource.type !== 'site') {
        continue;
      }
      if (assignment.scopeId && resource.id && assignment.scopeId !== resource.id) {
        continue;
      }
    }

    // Get role permissions
    const rolePerms = rolePermissions.filter(
      rp => rp.roleId === assignment.roleId && rp.permissionKey === permissionKey
    );

    for (const rp of rolePerms) {
      if (rp.effect === 'deny') {
        return {
          allowed: false,
          reason: `Explicitly denied by role ${assignment.roleName}`,
          source: {
            roleId: assignment.roleId,
            roleName: assignment.roleName,
            scopeType: assignment.scopeType,
            scopeName: assignment.scopeName,
          },
        };
      }

      if (rp.effect === 'allow') {
        // Check SoD rules
        const sodConflict = checkSoD(userId, permissionKey, assignment);
        if (sodConflict) {
          if (sodConflict.severity === 'block') {
            return {
              allowed: false,
              reason: `Segregation of Duties conflict: ${sodConflict.description}`,
              sodConflict,
            };
          }
          // For 'warn', we allow but note the conflict
        }

        return {
          allowed: true,
          source: {
            roleId: assignment.roleId,
            roleName: assignment.roleName,
            scopeType: assignment.scopeType,
            scopeName: assignment.scopeName,
          },
        };
      }
    }
  }

  return {
    allowed: false,
    reason: 'Permission not granted in any active role',
  };
}

// ═══════════════════════════════════════════════════════════
// SEGREGATION OF DUTIES CHECK
// ═══════════════════════════════════════════════════════════

function checkSoD(
  userId: string,
  permissionKey: string,
  currentAssignment: UserRoleAssignment
): SoDRule | null {
  // Get all permissions the user has
  const userPermissions = getUserEffectivePermissions(userId);
  
  // Check each SoD rule
  for (const rule of sodRules) {
    // Check if this rule applies to the current permission
    if (rule.permissionA === permissionKey || rule.permissionB === permissionKey) {
      const otherPermission = rule.permissionA === permissionKey 
        ? rule.permissionB 
        : rule.permissionA;
      
      // Check if user has the other permission in conflicting scope
      const hasConflict = userPermissions.some(up => {
        if (up.permissionKey !== otherPermission) return false;
        
        // Check scope conflict
        if (rule.scope === 'user') {
          return true; // Any scope conflicts at user level
        }
        
        if (rule.scope === 'project' && up.scopeType === 'project') {
          return up.scopeId === currentAssignment.scopeId;
        }
        
        if (rule.scope === 'site' && up.scopeType === 'site') {
          return up.scopeId === currentAssignment.scopeId;
        }
        
        if (rule.scope === 'company' && up.scopeType === 'company') {
          return true;
        }
        
        return false;
      });
      
      if (hasConflict) {
        return rule;
      }
    }
  }
  
  return null;
}

// ═══════════════════════════════════════════════════════════
// EFFECTIVE PERMISSIONS
// ═══════════════════════════════════════════════════════════

export interface EffectivePermission {
  permissionKey: string;
  permission: Permission;
  effect: 'allow' | 'deny';
  roleId: string;
  roleName: string;
  scopeType: string;
  scopeId?: string;
  scopeName?: string;
}

/**
 * Get all effective permissions for a user
 */
export function getUserEffectivePermissions(userId: string): EffectivePermission[] {
  const userAssignments = userRoleAssignments.filter(
    a => a.userId === userId && a.isActive
  );
  
  const effectivePerms: EffectivePermission[] = [];
  
  for (const assignment of userAssignments) {
    const rolePerms = rolePermissions.filter(rp => rp.roleId === assignment.roleId);
    
    for (const rp of rolePerms) {
      const permission = permissions.find(p => p.key === rp.permissionKey);
      if (permission) {
        effectivePerms.push({
          permissionKey: rp.permissionKey,
          permission,
          effect: rp.effect,
          roleId: assignment.roleId,
          roleName: assignment.roleName,
          scopeType: assignment.scopeType,
          scopeId: assignment.scopeId,
          scopeName: assignment.scopeName,
        });
      }
    }
  }
  
  return effectivePerms;
}

/**
 * Get unique permission keys for a user (allowed only)
 */
export function getUserPermissionKeys(userId: string): string[] {
  const effectivePerms = getUserEffectivePermissions(userId);
  const allowedPerms = effectivePerms.filter(ep => ep.effect === 'allow');
  return Array.from(new Set(allowedPerms.map(ep => ep.permissionKey)));
}

// ═══════════════════════════════════════════════════════════
// FIELD MASKING
// ═══════════════════════════════════════════════════════════

/**
 * Mask a field value based on field policy
 */
export function maskFieldValue(
  entity: string,
  field: string,
  value: string,
  userId: string
): string {
  const policy = fieldPolicies.find(fp => fp.entity === entity && fp.field === field);
  
  if (!policy) {
    return value; // No policy, return as-is
  }
  
  // Check if user has view permission
  const hasViewPermission = can(userId, policy.permissionKeyToView).allowed;
  
  if (hasViewPermission) {
    return value; // User can view, no masking
  }
  
  // Apply masking
  switch (policy.maskType) {
    case 'full':
      return '********';
    case 'partial':
      if (value.length <= 4) return '****';
      return value.substring(0, 2) + '****' + value.substring(value.length - 2);
    case 'hash':
      return 'HASH:' + value.length;
    default:
      return '********';
  }
}

/**
 * Mask sensitive fields in an object
 */
export function maskSensitiveFields<T extends Record<string, any>>(
  entity: string,
  data: T,
  userId: string
): T {
  const masked: any = { ...data };
  
  for (const key in masked) {
    const policy = fieldPolicies.find(fp => fp.entity === entity && fp.field === key);
    if (policy && typeof masked[key] === 'string') {
      masked[key] = maskFieldValue(entity, key, masked[key], userId);
    }
  }
  
  return masked as T;
}

// ═══════════════════════════════════════════════════════════
// PERMISSION SIMULATION
// ═══════════════════════════════════════════════════════════

export interface SimulationResult {
  userId: string;
  userName: string;
  permissionsGained: string[];
  permissionsLost: string[];
  sodConflicts: SoDRule[];
}

/**
 * Simulate permission changes before applying them
 */
export function simulatePermissionChange(
  userId: string,
  newAssignments: UserRoleAssignment[]
): SimulationResult {
  // Get current permissions
  const currentPerms = new Set(getUserPermissionKeys(userId));
  
  // Calculate new permissions
  const newPerms = new Set<string>();
  for (const assignment of newAssignments) {
    if (assignment.userId === userId && assignment.isActive) {
      const rolePerms = rolePermissions.filter(
        rp => rp.roleId === assignment.roleId && rp.effect === 'allow'
      );
      rolePerms.forEach(rp => newPerms.add(rp.permissionKey));
    }
  }
  
  // Calculate gains and losses
  const permissionsGained = Array.from(newPerms).filter(p => !currentPerms.has(p));
  const permissionsLost = Array.from(currentPerms).filter(p => !newPerms.has(p));
  
  // Check for SoD conflicts
  const sodConflicts: SoDRule[] = [];
  for (const rule of sodRules) {
    if (newPerms.has(rule.permissionA) && newPerms.has(rule.permissionB)) {
      sodConflicts.push(rule);
    }
  }
  
  const user = userRoleAssignments.find(a => a.userId === userId);
  
  return {
    userId,
    userName: user?.userName || 'Unknown',
    permissionsGained,
    permissionsLost,
    sodConflicts,
  };
}

// ═══════════════════════════════════════════════════════════
// MENU / ROUTE GUARDS
// ═══════════════════════════════════════════════════════════

/**
 * Check if user can access a route
 */
export function canAccessRoute(userId: string, route: string): boolean {
  // Map routes to permission keys
  const routePermissionMap: Record<string, string> = {
    '/': 'shell.home.view',
    '/procurement': 'procurement.module.view',
    '/procurement/requisitions': 'procurement.pr.view',
    '/procurement/orders': 'procurement.po.view',
    '/inventory': 'inventory.module.view',
    '/inventory/grn': 'inventory.grn.view',
    '/inventory/stock': 'inventory.stock.view',
    '/projects': 'project.module.view',
    '/projects/list': 'project.view',
    '/projects/boq': 'project.boq.view',
    '/finance': 'finance.module.view',
    '/finance/bills': 'finance.bills.view',
    '/hr': 'hr.module.view',
    '/hr/attendance': 'hr.attendance.view',
    '/reports': 'reports.module.view',
    '/admin/org': 'org.structure.view',
    '/admin/org/projects': 'org.project.view',
    '/admin/org/allocations': 'org.allocation.view',
    '/admin/iam': 'iam.role.view',
    '/preview': 'preview.view',
    '/_tech': 'tech.console.view',
  };
  
  const permissionKey = routePermissionMap[route];
  if (!permissionKey) {
    return false; // Unknown route
  }
  
  return can(userId, permissionKey).allowed;
}

/**
 * Get accessible routes for a user
 */
export function getAccessibleRoutes(userId: string): string[] {
  const allRoutes = [
    '/',
    '/procurement',
    '/procurement/requisitions',
    '/procurement/orders',
    '/inventory',
    '/inventory/grn',
    '/inventory/stock',
    '/projects',
    '/projects/list',
    '/projects/boq',
    '/finance',
    '/finance/bills',
    '/hr',
    '/hr/attendance',
    '/reports',
    '/admin/org',
    '/admin/org/projects',
    '/admin/org/allocations',
    '/admin/iam',
    '/preview',
    '/_tech',
  ];
  
  return allRoutes.filter(route => canAccessRoute(userId, route));
}

// ═══════════════════════════════════════════════════════════
// EXPLANATION / WHY CAN'T I?
// ═══════════════════════════════════════════════════════════

export interface PermissionExplanation {
  permissionKey: string;
  allowed: boolean;
  reason: string;
  requiredRole?: string;
  requiredScope?: string;
  alternativeActions?: string[];
}

/**
 * Explain why a user can or cannot perform an action
 */
export function explainPermission(userId: string, permissionKey: string): PermissionExplanation {
  const result = can(userId, permissionKey);
  const permission = permissions.find(p => p.key === permissionKey);
  
  if (result.allowed) {
    return {
      permissionKey,
      allowed: true,
      reason: `Allowed via role "${result.source?.roleName}" with ${result.source?.scopeType} scope`,
    };
  }
  
  // Find roles that have this permission
  const rolesWithPermission = rolePermissions
    .filter(rp => rp.permissionKey === permissionKey && rp.effect === 'allow')
    .map(rp => {
      const role = roles.find(r => r.id === rp.roleId);
      return role ? { roleName: role.name, scopeType: rp.scopeType } : null;
    })
    .filter(Boolean);
  
  return {
    permissionKey,
    allowed: false,
    reason: result.reason || 'Permission not granted',
    requiredRole: rolesWithPermission.length > 0 ? rolesWithPermission[0]?.roleName : undefined,
    requiredScope: rolesWithPermission.length > 0 ? rolesWithPermission[0]?.scopeType : undefined,
    alternativeActions: permission ? [
      `Contact administrator to request "${permission.description}" permission`,
      `Check if you have the correct role assigned`,
    ] : [],
  };
}
