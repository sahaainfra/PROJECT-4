// ═══════════════════════════════════════════════════════════
// DASHBOARD SERVICE — Part 20
// Advanced Responsive Dashboard Architecture
// ═══════════════════════════════════════════════════════════

import {
  DashboardWidget,
  DashboardKpi,
  DashboardLayout,
  UserQuickAction,
  WidgetPosition,
  DeviceType,
  dashboardWidgets,
  dashboardKpis,
  dashboardLayouts,
  userQuickActions,
  sampleKpiData,
  sampleListData,
  sampleChartData,
  getWidgetByCode,
  getKpiByCode,
  getLayoutForUser,
  getKpiStatus,
  KpiWidgetData,
  ListWidgetData,
  ChartWidgetData,
} from '../data/dashboardData';
import { can } from './PermissionEngine';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// WIDGET MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Get all widgets permitted for a user
 */
export function getPermittedWidgets(userId: string, userPermissions: string[]): DashboardWidget[] {
  return dashboardWidgets.filter(widget => 
    userPermissions.includes(widget.required_permission)
  );
}

/**
 * Get widget data based on widget type
 */
export function getWidgetData(
  widgetCode: string,
  userId: string,
  filters?: Record<string, any>
): KpiWidgetData | ListWidgetData | ChartWidgetData | null {
  const widget = getWidgetByCode(widgetCode);
  if (!widget) return null;

  // In production, this would call the actual data endpoint
  // For now, return sample data
  switch (widget.type) {
    case 'kpi':
      return sampleKpiData[widgetCode] || null;
    case 'list':
      return sampleListData[widgetCode] || null;
    case 'chart':
      return sampleChartData[widgetCode] || null;
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════
// LAYOUT MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface SaveLayoutInput {
  userId: string;
  device: DeviceType;
  name: string;
  layout: WidgetPosition[];
}

/**
 * Save user's custom layout
 */
export function saveUserLayout(input: SaveLayoutInput): DashboardLayout {
  const correlation = getCurrentCorrelation();

  // Check if user already has a layout for this device
  const existingIndex = dashboardLayouts.findIndex(
    l => l.owner_type === 'user' && l.owner_id === input.userId && l.device === input.device
  );

  const layout: DashboardLayout = {
    id: existingIndex >= 0 ? dashboardLayouts[existingIndex].id : `layout-${Date.now()}`,
    owner_type: 'user',
    owner_id: input.userId,
    name: input.name,
    is_default: false,
    device: input.device,
    layout_json: input.layout,
    created_at: existingIndex >= 0 ? dashboardLayouts[existingIndex].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    dashboardLayouts[existingIndex] = layout;
  } else {
    dashboardLayouts.push(layout);
  }

  // Audit log
  writeAuditEntry({
    userId: input.userId,
    userName: 'User',
    userEmail: '',
    action: existingIndex >= 0 ? 'UPDATE' : 'CREATE',
    entityType: 'DashboardLayout',
    entityId: layout.id,
    entityName: `Saved dashboard layout: ${layout.name}`,
    after: layout,
    correlationId: correlation?.correlation_id || '',
  });

  return layout;
}

/**
 * Reset user layout to role default
 */
export function resetToRoleDefault(userId: string, roleId: string, device: DeviceType): DashboardLayout | null {
  const roleLayout = dashboardLayouts.find(
    l => l.owner_type === 'role' && l.owner_id === roleId && l.device === device && l.is_default
  );

  if (!roleLayout) return null;

  // Remove user's custom layout
  const userLayoutIndex = dashboardLayouts.findIndex(
    l => l.owner_type === 'user' && l.owner_id === userId && l.device === device
  );

  if (userLayoutIndex >= 0) {
    dashboardLayouts.splice(userLayoutIndex, 1);
  }

  return roleLayout;
}

/**
 * Get effective layout for user (user custom > role default > system default)
 */
export function getEffectiveLayout(userId: string, roleId: string, device: DeviceType): DashboardLayout | null {
  // Try user custom layout first
  const userLayout = getLayoutForUser(userId, device);
  if (userLayout && userLayout.owner_type === 'user') {
    return userLayout;
  }

  // Fall back to role default
  const roleLayout = dashboardLayouts.find(
    l => l.owner_type === 'role' && l.owner_id === roleId && l.device === device && l.is_default
  );
  if (roleLayout) {
    return roleLayout;
  }

  // Fall back to system default
  return dashboardLayouts.find(
    l => l.owner_type === 'system' && l.device === device && l.is_default
  ) || null;
}

// ═══════════════════════════════════════════════════════════
// KPI MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Get KPI value with status calculation
 */
export function getKpiValue(
  kpiCode: string,
  userId: string,
  filters?: Record<string, any>
): { kpi: DashboardKpi; data: KpiWidgetData } | null {
  const kpi = getKpiByCode(kpiCode);
  if (!kpi) return null;

  const data = sampleKpiData[kpiCode];
  if (!data) return null;

  // Calculate status based on thresholds
  const numericValue = typeof data.value === 'number' ? data.value : parseFloat(data.value);
  if (!isNaN(numericValue)) {
    data.status = getKpiStatus(numericValue, kpi);
  }

  return { kpi, data };
}

/**
 * Get all KPIs for a module
 */
export function getKpisByModule(module: string): DashboardKpi[] {
  return dashboardKpis.filter(k => k.owner_module === module);
}

// ═══════════════════════════════════════════════════════════
// QUICK ACTIONS MANAGEMENT
// ═══════════════════════════════════════════════════════════

export interface AddQuickActionInput {
  userId: string;
  actionCode: string;
  actionName: string;
  actionIcon: string;
  actionRoute: string;
  requiredPermission: string;
}

/**
 * Add quick action for user
 */
export function addQuickAction(input: AddQuickActionInput): UserQuickAction {
  const correlation = getCurrentCorrelation();

  // Get current max position
  const userActions = userQuickActions.filter(qa => qa.user_id === input.userId);
  const maxPosition = userActions.length > 0 
    ? Math.max(...userActions.map(qa => qa.position))
    : 0;

  const action: UserQuickAction = {
    id: `qa-${Date.now()}`,
    user_id: input.userId,
    action_code: input.actionCode,
    action_name: input.actionName,
    action_icon: input.actionIcon,
    action_route: input.actionRoute,
    required_permission: input.requiredPermission,
    position: maxPosition + 1,
  };

  userQuickActions.push(action);

  // Audit log
  writeAuditEntry({
    userId: input.userId,
    userName: 'User',
    userEmail: '',
    action: 'CREATE',
    entityType: 'UserQuickAction',
    entityId: action.id,
    entityName: `Added quick action: ${action.action_name}`,
    after: action,
    correlationId: correlation?.correlation_id || '',
  });

  return action;
}

/**
 * Remove quick action for user
 */
export function removeQuickAction(userId: string, actionId: string): boolean {
  const correlation = getCurrentCorrelation();

  const index = userQuickActions.findIndex(
    qa => qa.id === actionId && qa.user_id === userId
  );

  if (index < 0) return false;

  const removed = userQuickActions.splice(index, 1)[0];

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'User',
    userEmail: '',
    action: 'DELETE',
    entityType: 'UserQuickAction',
    entityId: removed.id,
    entityName: `Removed quick action: ${removed.action_name}`,
    before: removed,
    correlationId: correlation?.correlation_id || '',
  });

  return true;
}

/**
 * Reorder quick actions
 */
export function reorderQuickActions(userId: string, actionIds: string[]): void {
  const correlation = getCurrentCorrelation();

  actionIds.forEach((actionId, index) => {
    const action = userQuickActions.find(qa => qa.id === actionId && qa.user_id === userId);
    if (action) {
      action.position = index + 1;
    }
  });

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'User',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'UserQuickAction',
    entityId: 'multiple',
    entityName: `Reordered ${actionIds.length} quick actions`,
    after: { actionIds, positions: actionIds.map((id, i) => ({ id, position: i + 1 })) },
    correlationId: correlation?.correlation_id || '',
  });
}

// ═══════════════════════════════════════════════════════════
// ROLE LAYOUT MANAGEMENT (Super Admin)
// ═══════════════════════════════════════════════════════════

export interface SaveRoleLayoutInput {
  roleId: string;
  device: DeviceType;
  name: string;
  layout: WidgetPosition[];
  savedBy: string;
}

/**
 * Save role default layout (Super Admin only)
 */
export function saveRoleLayout(input: SaveRoleLayoutInput): DashboardLayout {
  const correlation = getCurrentCorrelation();

  // Protocol check: CP-DASH-01 would be enforced here
  // For now, just proceed

  // Check if role already has a layout for this device
  const existingIndex = dashboardLayouts.findIndex(
    l => l.owner_type === 'role' && l.owner_id === input.roleId && l.device === input.device
  );

  const layout: DashboardLayout = {
    id: existingIndex >= 0 ? dashboardLayouts[existingIndex].id : `layout-role-${Date.now()}`,
    owner_type: 'role',
    owner_id: input.roleId,
    name: input.name,
    is_default: true,
    device: input.device,
    layout_json: input.layout,
    created_at: existingIndex >= 0 ? dashboardLayouts[existingIndex].created_at : new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (existingIndex >= 0) {
    dashboardLayouts[existingIndex] = layout;
  } else {
    dashboardLayouts.push(layout);
  }

  // Audit log
  writeAuditEntry({
    userId: input.savedBy,
    userName: 'Super Admin',
    userEmail: '',
    action: existingIndex >= 0 ? 'UPDATE' : 'CREATE',
    entityType: 'DashboardLayout',
    entityId: layout.id,
    entityName: `Saved role layout: ${layout.name} for role ${input.roleId}`,
    after: layout,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'dashboard.layout.role_updated',
    company_id: 'company-001',
    actor_id: input.savedBy,
    payload: {
      layout_id: layout.id,
      role_id: input.roleId,
      device: input.device,
    },
  });

  return layout;
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD STATISTICS
// ═══════════════════════════════════════════════════════════

export interface DashboardStats {
  total_widgets: number;
  total_kpis: number;
  total_layouts: number;
  user_layouts: number;
  role_layouts: number;
  system_layouts: number;
}

/**
 * Get dashboard statistics
 */
export function getDashboardStats(): DashboardStats {
  return {
    total_widgets: dashboardWidgets.length,
    total_kpis: dashboardKpis.length,
    total_layouts: dashboardLayouts.length,
    user_layouts: dashboardLayouts.filter(l => l.owner_type === 'user').length,
    role_layouts: dashboardLayouts.filter(l => l.owner_type === 'role').length,
    system_layouts: dashboardLayouts.filter(l => l.owner_type === 'system').length,
  };
}
