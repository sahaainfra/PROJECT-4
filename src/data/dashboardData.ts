// ═══════════════════════════════════════════════════════════
// DASHBOARD DATA MODEL — Part 20
// Advanced Responsive Dashboard Architecture
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// WIDGET REGISTRY
// ═══════════════════════════════════════════════════════════

export type WidgetType = 'kpi' | 'chart' | 'list' | 'table' | 'map' | 'calendar' | 'custom';

export interface DashboardWidget {
  code: string;
  name: string;
  module: string;
  type: WidgetType;
  data_endpoint: string;
  required_permission: string;
  default_size: {
    desktop: { w: number; h: number };
    tablet: { w: number; h: number };
    mobile: { w: number; h: number };
  };
  refresh_seconds: number;
  supports_filters: boolean;
  description: string;
  icon: string;
}

// ═══════════════════════════════════════════════════════════
// KPI REGISTRY
// ═══════════════════════════════════════════════════════════

export type KpiDataLabel = 'actual' | 'calculated' | 'forecast';
export type KpiDirection = 'higher_better' | 'lower_better';

export interface KpiThreshold {
  red: number;
  amber: number;
  green: number;
}

export interface DashboardKpi {
  code: string;
  name: string;
  formula_description: string;
  unit: string;
  data_label: KpiDataLabel;
  source_endpoint: string;
  thresholds: KpiThreshold;
  direction: KpiDirection;
  owner_module: string;
  version: string;
  effective_from: string;
}

// ═══════════════════════════════════════════════════════════
// LAYOUT DEFINITIONS
// ═══════════════════════════════════════════════════════════

export type LayoutOwnerType = 'user' | 'role' | 'system';
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface WidgetPosition {
  widgetCode: string;
  x: number;
  y: number;
  w: number;
  h: number;
  filters?: Record<string, any>;
}

export interface DashboardLayout {
  id: string;
  owner_type: LayoutOwnerType;
  owner_id: string;
  name: string;
  is_default: boolean;
  device: DeviceType;
  layout_json: WidgetPosition[];
  created_at: string;
  updated_at: string;
}

// ═══════════════════════════════════════════════════════════
// USER QUICK ACTIONS
// ═══════════════════════════════════════════════════════════

export interface UserQuickAction {
  id: string;
  user_id: string;
  action_code: string;
  action_name: string;
  action_icon: string;
  action_route: string;
  required_permission: string;
  position: number;
}

// ═══════════════════════════════════════════════════════════
// WIDGET DATA PAYLOADS
// ═══════════════════════════════════════════════════════════

export interface KpiWidgetData {
  value: number | string;
  previous?: number | string;
  trend?: Array<{ period: string; value: number }>;
  label: string;
  unit?: string;
  status: 'red' | 'amber' | 'green';
  drillLink?: string;
  asOf: string;
}

export interface ChartWidgetData {
  type: 'line' | 'bar' | 'pie' | 'area';
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    color?: string;
  }>;
  asOf: string;
}

export interface ListWidgetData {
  items: Array<{
    id: string;
    title: string;
    subtitle?: string;
    status?: string;
    priority?: 'low' | 'medium' | 'high' | 'critical';
    link?: string;
  }>;
  totalCount: number;
  asOf: string;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const dashboardWidgets: DashboardWidget[] = [
  {
    code: 'my_approvals',
    name: 'My Approvals',
    module: 'workflow',
    type: 'list',
    data_endpoint: '/api/v1/dash/widgets/my-approvals',
    required_permission: 'wf.task.act',
    default_size: {
      desktop: { w: 4, h: 2 },
      tablet: { w: 6, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 60,
    supports_filters: true,
    description: 'Pending approval tasks assigned to you',
    icon: 'CheckCircle',
  },
  {
    code: 'my_tasks',
    name: 'My Tasks',
    module: 'tasks',
    type: 'list',
    data_endpoint: '/api/v1/dash/widgets/my-tasks',
    required_permission: 'task.view',
    default_size: {
      desktop: { w: 4, h: 2 },
      tablet: { w: 6, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 120,
    supports_filters: true,
    description: 'Your assigned tasks and to-dos',
    icon: 'ListTodo',
  },
  {
    code: 'my_notifications',
    name: 'My Notifications',
    module: 'notifications',
    type: 'list',
    data_endpoint: '/api/v1/dash/widgets/my-notifications',
    required_permission: 'ntf.notification.view',
    default_size: {
      desktop: { w: 4, h: 2 },
      tablet: { w: 6, h: 2 },
      mobile: { w: 12, h: 2 },
    },
    refresh_seconds: 30,
    supports_filters: false,
    description: 'Recent notifications and alerts',
    icon: 'Bell',
  },
  {
    code: 'my_projects',
    name: 'My Projects',
    module: 'projects',
    type: 'list',
    data_endpoint: '/api/v1/dash/widgets/my-projects',
    required_permission: 'project.view',
    default_size: {
      desktop: { w: 6, h: 2 },
      tablet: { w: 12, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 300,
    supports_filters: true,
    description: 'Projects you are allocated to',
    icon: 'Building2',
  },
  {
    code: 'kpi_project_progress',
    name: 'Project Progress',
    module: 'projects',
    type: 'kpi',
    data_endpoint: '/api/v1/dash/kpis/project-progress',
    required_permission: 'project.view',
    default_size: {
      desktop: { w: 3, h: 1 },
      tablet: { w: 6, h: 1 },
      mobile: { w: 6, h: 1 },
    },
    refresh_seconds: 600,
    supports_filters: true,
    description: 'Overall project progress percentage',
    icon: 'TrendingUp',
  },
  {
    code: 'kpi_budget_variance',
    name: 'Budget Variance',
    module: 'finance',
    type: 'kpi',
    data_endpoint: '/api/v1/dash/kpis/budget-variance',
    required_permission: 'finance.budget.view',
    default_size: {
      desktop: { w: 3, h: 1 },
      tablet: { w: 6, h: 1 },
      mobile: { w: 6, h: 1 },
    },
    refresh_seconds: 600,
    supports_filters: true,
    description: 'Budget vs actual variance percentage',
    icon: 'DollarSign',
  },
  {
    code: 'kpi_material_consumption',
    name: 'Material Consumption',
    module: 'inventory',
    type: 'kpi',
    data_endpoint: '/api/v1/dash/kpis/material-consumption',
    required_permission: 'inventory.stock.view',
    default_size: {
      desktop: { w: 3, h: 1 },
      tablet: { w: 6, h: 1 },
      mobile: { w: 6, h: 1 },
    },
    refresh_seconds: 600,
    supports_filters: true,
    description: 'Material consumption vs theoretical',
    icon: 'Package',
  },
  {
    code: 'kpi_workforce_utilization',
    name: 'Workforce Utilization',
    module: 'hr',
    type: 'kpi',
    data_endpoint: '/api/v1/dash/kpis/workforce-utilization',
    required_permission: 'hr.attendance.view',
    default_size: {
      desktop: { w: 3, h: 1 },
      tablet: { w: 6, h: 1 },
      mobile: { w: 6, h: 1 },
    },
    refresh_seconds: 600,
    supports_filters: true,
    description: 'Workforce utilization percentage',
    icon: 'Users',
  },
  {
    code: 'chart_progress_trend',
    name: 'Progress Trend',
    module: 'projects',
    type: 'chart',
    data_endpoint: '/api/v1/dash/charts/progress-trend',
    required_permission: 'project.view',
    default_size: {
      desktop: { w: 6, h: 2 },
      tablet: { w: 12, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 900,
    supports_filters: true,
    description: 'Planned vs actual progress over time',
    icon: 'LineChart',
  },
  {
    code: 'chart_cost_breakdown',
    name: 'Cost Breakdown',
    module: 'finance',
    type: 'chart',
    data_endpoint: '/api/v1/dash/charts/cost-breakdown',
    required_permission: 'finance.budget.view',
    default_size: {
      desktop: { w: 6, h: 2 },
      tablet: { w: 12, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 900,
    supports_filters: true,
    description: 'Cost breakdown by category',
    icon: 'PieChart',
  },
  {
    code: 'my_gates_today',
    name: 'My Gates Today',
    module: 'protocol',
    type: 'custom',
    data_endpoint: '/api/v1/dash/widgets/my-gates',
    required_permission: 'protocol.evaluation.view',
    default_size: {
      desktop: { w: 4, h: 2 },
      tablet: { w: 6, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 120,
    supports_filters: false,
    description: 'Protocol gates evaluated today',
    icon: 'Shield',
  },
  {
    code: 'my_exceptions',
    name: 'My Exceptions',
    module: 'protocol',
    type: 'list',
    data_endpoint: '/api/v1/dash/widgets/my-exceptions',
    required_permission: 'protocol.exception.view',
    default_size: {
      desktop: { w: 4, h: 2 },
      tablet: { w: 6, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 120,
    supports_filters: true,
    description: 'Exception requests pending or approved',
    icon: 'AlertTriangle',
  },
  {
    code: 'my_compliance_score',
    name: 'My Compliance Score',
    module: 'accountability',
    type: 'kpi',
    data_endpoint: '/api/v1/dash/kpis/compliance-score',
    required_permission: 'acc.score.view',
    default_size: {
      desktop: { w: 3, h: 1 },
      tablet: { w: 6, h: 1 },
      mobile: { w: 6, h: 1 },
    },
    refresh_seconds: 3600,
    supports_filters: false,
    description: 'Your compliance score for current period',
    icon: 'Award',
  },
  {
    code: 'quick_actions',
    name: 'Quick Actions',
    module: 'system',
    type: 'custom',
    data_endpoint: '/api/v1/dash/widgets/quick-actions',
    required_permission: 'shell.home.view',
    default_size: {
      desktop: { w: 12, h: 1 },
      tablet: { w: 12, h: 1 },
      mobile: { w: 12, h: 2 },
    },
    refresh_seconds: 0,
    supports_filters: false,
    description: 'Frequently used actions',
    icon: 'Zap',
  },
  {
    code: 'recent_records',
    name: 'Recent Records',
    module: 'system',
    type: 'list',
    data_endpoint: '/api/v1/dash/widgets/recent-records',
    required_permission: 'shell.home.view',
    default_size: {
      desktop: { w: 6, h: 2 },
      tablet: { w: 12, h: 2 },
      mobile: { w: 12, h: 3 },
    },
    refresh_seconds: 60,
    supports_filters: false,
    description: 'Recently viewed or modified records',
    icon: 'Clock',
  },
];

export const dashboardKpis: DashboardKpi[] = [
  {
    code: 'project_progress',
    name: 'Project Progress',
    formula_description: '(Actual work completed / Total planned work) × 100',
    unit: '%',
    data_label: 'actual',
    source_endpoint: '/api/v1/projects/progress',
    thresholds: { red: 0, amber: 70, green: 90 },
    direction: 'higher_better',
    owner_module: 'projects',
    version: '1.0.0',
    effective_from: '2024-01-01T00:00:00Z',
  },
  {
    code: 'budget_variance',
    name: 'Budget Variance',
    formula_description: '((Actual cost - Budgeted cost) / Budgeted cost) × 100',
    unit: '%',
    data_label: 'calculated',
    source_endpoint: '/api/v1/finance/budget/variance',
    thresholds: { red: 10, amber: 5, green: 0 },
    direction: 'lower_better',
    owner_module: 'finance',
    version: '1.0.0',
    effective_from: '2024-01-01T00:00:00Z',
  },
  {
    code: 'material_consumption',
    name: 'Material Consumption Variance',
    formula_description: '((Actual consumption - Theoretical consumption) / Theoretical consumption) × 100',
    unit: '%',
    data_label: 'calculated',
    source_endpoint: '/api/v1/inventory/consumption/variance',
    thresholds: { red: 10, amber: 5, green: 0 },
    direction: 'lower_better',
    owner_module: 'inventory',
    version: '1.0.0',
    effective_from: '2024-01-01T00:00:00Z',
  },
  {
    code: 'workforce_utilization',
    name: 'Workforce Utilization',
    formula_description: '(Actual man-hours worked / Planned man-hours) × 100',
    unit: '%',
    data_label: 'actual',
    source_endpoint: '/api/v1/hr/attendance/utilization',
    thresholds: { red: 0, amber: 75, green: 90 },
    direction: 'higher_better',
    owner_module: 'hr',
    version: '1.0.0',
    effective_from: '2024-01-01T00:00:00Z',
  },
  {
    code: 'compliance_score',
    name: 'Compliance Score',
    formula_description: 'Weighted average of on-time completion, protocol compliance, documentation quality, exception rate, and violation count',
    unit: '%',
    data_label: 'calculated',
    source_endpoint: '/api/v1/accountability/scores',
    thresholds: { red: 0, amber: 75, green: 90 },
    direction: 'higher_better',
    owner_module: 'accountability',
    version: '1.0.0',
    effective_from: '2024-01-01T00:00:00Z',
  },
];

export const dashboardLayouts: DashboardLayout[] = [
  {
    id: 'layout-role-pm-default',
    owner_type: 'role',
    owner_id: 'role-004', // Project Manager
    name: 'Project Manager Default',
    is_default: true,
    device: 'desktop',
    layout_json: [
      { widgetCode: 'quick_actions', x: 0, y: 0, w: 12, h: 1 },
      { widgetCode: 'kpi_project_progress', x: 0, y: 1, w: 3, h: 1 },
      { widgetCode: 'kpi_budget_variance', x: 3, y: 1, w: 3, h: 1 },
      { widgetCode: 'kpi_material_consumption', x: 6, y: 1, w: 3, h: 1 },
      { widgetCode: 'kpi_workforce_utilization', x: 9, y: 1, w: 3, h: 1 },
      { widgetCode: 'my_approvals', x: 0, y: 2, w: 4, h: 2 },
      { widgetCode: 'my_tasks', x: 4, y: 2, w: 4, h: 2 },
      { widgetCode: 'my_notifications', x: 8, y: 2, w: 4, h: 2 },
      { widgetCode: 'chart_progress_trend', x: 0, y: 4, w: 6, h: 2 },
      { widgetCode: 'chart_cost_breakdown', x: 6, y: 4, w: 6, h: 2 },
      { widgetCode: 'my_projects', x: 0, y: 6, w: 6, h: 2 },
      { widgetCode: 'recent_records', x: 6, y: 6, w: 6, h: 2 },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'layout-role-pm-mobile',
    owner_type: 'role',
    owner_id: 'role-004',
    name: 'Project Manager Mobile',
    is_default: true,
    device: 'mobile',
    layout_json: [
      { widgetCode: 'quick_actions', x: 0, y: 0, w: 12, h: 2 },
      { widgetCode: 'kpi_project_progress', x: 0, y: 2, w: 6, h: 1 },
      { widgetCode: 'kpi_budget_variance', x: 6, y: 2, w: 6, h: 1 },
      { widgetCode: 'my_approvals', x: 0, y: 3, w: 12, h: 3 },
      { widgetCode: 'my_tasks', x: 0, y: 6, w: 12, h: 3 },
      { widgetCode: 'my_notifications', x: 0, y: 9, w: 12, h: 2 },
      { widgetCode: 'my_projects', x: 0, y: 11, w: 12, h: 3 },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'layout-user-001-desktop',
    owner_type: 'user',
    owner_id: 'user-001',
    name: 'My Custom Layout',
    is_default: false,
    device: 'desktop',
    layout_json: [
      { widgetCode: 'quick_actions', x: 0, y: 0, w: 12, h: 1 },
      { widgetCode: 'my_compliance_score', x: 0, y: 1, w: 3, h: 1 },
      { widgetCode: 'kpi_project_progress', x: 3, y: 1, w: 3, h: 1 },
      { widgetCode: 'kpi_budget_variance', x: 6, y: 1, w: 3, h: 1 },
      { widgetCode: 'kpi_workforce_utilization', x: 9, y: 1, w: 3, h: 1 },
      { widgetCode: 'my_approvals', x: 0, y: 2, w: 6, h: 2 },
      { widgetCode: 'my_gates_today', x: 6, y: 2, w: 6, h: 2 },
      { widgetCode: 'my_exceptions', x: 0, y: 4, w: 6, h: 2 },
      { widgetCode: 'chart_progress_trend', x: 6, y: 4, w: 6, h: 2 },
    ],
    created_at: '2024-01-15T00:00:00Z',
    updated_at: '2024-01-16T00:00:00Z',
  },
];

export const userQuickActions: UserQuickAction[] = [
  {
    id: 'qa-001',
    user_id: 'user-001',
    action_code: 'create_pr',
    action_name: 'Create Purchase Requisition',
    action_icon: 'Plus',
    action_route: '/procurement/requisitions/new',
    required_permission: 'procurement.pr.create',
    position: 1,
  },
  {
    id: 'qa-002',
    user_id: 'user-001',
    action_code: 'create_po',
    action_name: 'Create Purchase Order',
    action_icon: 'Plus',
    action_route: '/procurement/orders/new',
    required_permission: 'procurement.po.create',
    position: 2,
  },
  {
    id: 'qa-003',
    user_id: 'user-001',
    action_code: 'mark_attendance',
    action_name: 'Mark Attendance',
    action_icon: 'CheckCircle',
    action_route: '/hr/attendance/mark',
    required_permission: 'hr.attendance.mark',
    position: 3,
  },
  {
    id: 'qa-004',
    user_id: 'user-001',
    action_code: 'submit_dpr',
    action_name: 'Submit Daily Progress Report',
    action_icon: 'FileText',
    action_route: '/projects/dpr/new',
    required_permission: 'project.dpr.create',
    position: 4,
  },
];

// ═══════════════════════════════════════════════════════════
// SAMPLE WIDGET DATA
// ═══════════════════════════════════════════════════════════

export const sampleKpiData: Record<string, KpiWidgetData> = {
  kpi_project_progress: {
    value: 78.5,
    previous: 75.2,
    trend: [
      { period: 'Jan', value: 65 },
      { period: 'Feb', value: 68 },
      { period: 'Mar', value: 72 },
      { period: 'Apr', value: 75 },
      { period: 'May', value: 78.5 },
    ],
    label: 'Project Progress',
    unit: '%',
    status: 'green',
    drillLink: '/projects?status=active',
    asOf: '2024-01-16T12:00:00Z',
  },
  kpi_budget_variance: {
    value: 3.2,
    previous: 4.5,
    trend: [
      { period: 'Jan', value: 5.2 },
      { period: 'Feb', value: 4.8 },
      { period: 'Mar', value: 4.1 },
      { period: 'Apr', value: 3.8 },
      { period: 'May', value: 3.2 },
    ],
    label: 'Budget Variance',
    unit: '%',
    status: 'amber',
    drillLink: '/finance/budget/variance',
    asOf: '2024-01-16T12:00:00Z',
  },
  kpi_material_consumption: {
    value: 2.1,
    previous: 1.8,
    trend: [
      { period: 'Jan', value: 1.5 },
      { period: 'Feb', value: 1.7 },
      { period: 'Mar', value: 1.9 },
      { period: 'Apr', value: 2.0 },
      { period: 'May', value: 2.1 },
    ],
    label: 'Material Consumption',
    unit: '%',
    status: 'amber',
    drillLink: '/inventory/consumption/variance',
    asOf: '2024-01-16T12:00:00Z',
  },
  kpi_workforce_utilization: {
    value: 92.3,
    previous: 89.5,
    trend: [
      { period: 'Jan', value: 85 },
      { period: 'Feb', value: 87 },
      { period: 'Mar', value: 89 },
      { period: 'Apr', value: 91 },
      { period: 'May', value: 92.3 },
    ],
    label: 'Workforce Utilization',
    unit: '%',
    status: 'green',
    drillLink: '/hr/attendance/utilization',
    asOf: '2024-01-16T12:00:00Z',
  },
  my_compliance_score: {
    value: 88,
    previous: 85,
    trend: [
      { period: 'Jan', value: 82 },
      { period: 'Feb', value: 84 },
      { period: 'Mar', value: 85 },
      { period: 'Apr', value: 87 },
      { period: 'May', value: 88 },
    ],
    label: 'Compliance Score',
    unit: '%',
    status: 'green',
    drillLink: '/home/acc',
    asOf: '2024-01-16T12:00:00Z',
  },
};

export const sampleListData: Record<string, ListWidgetData> = {
  my_approvals: {
    items: [
      {
        id: 'task-001',
        title: 'PO-2024-002',
        subtitle: 'Purchase Order for Steel Materials',
        status: 'pending',
        priority: 'high',
        link: '/procurement/orders/PO-2024-002',
      },
      {
        id: 'task-002',
        title: 'BILL-2024-003',
        subtitle: 'Subcontractor Bill - Foundation Work',
        status: 'pending',
        priority: 'medium',
        link: '/finance/bills/BILL-2024-003',
      },
      {
        id: 'task-003',
        title: 'PR-2024-005',
        subtitle: 'Purchase Requisition - Cement',
        status: 'pending',
        priority: 'low',
        link: '/procurement/requisitions/PR-2024-005',
      },
    ],
    totalCount: 3,
    asOf: '2024-01-16T12:00:00Z',
  },
  my_tasks: {
    items: [
      {
        id: 'task-101',
        title: 'Review Material Requisition',
        subtitle: 'MR-2024-045',
        status: 'in_progress',
        priority: 'high',
        link: '/procurement/requisitions/MR-2024-045',
      },
      {
        id: 'task-102',
        title: 'Site Inspection Report',
        subtitle: 'Due: 2024-01-18',
        status: 'pending',
        priority: 'medium',
        link: '/projects/inspections/INS-2024-012',
      },
    ],
    totalCount: 2,
    asOf: '2024-01-16T12:00:00Z',
  },
  my_notifications: {
    items: [
      {
        id: 'ntf-001',
        title: 'Approval Required',
        subtitle: 'PO-2024-002 awaiting your approval',
        status: 'unread',
        priority: 'high',
        link: '/home/rt',
      },
      {
        id: 'ntf-002',
        title: 'Overdue Item',
        subtitle: '2 responsibilities overdue',
        status: 'unread',
        priority: 'medium',
        link: '/home/acc',
      },
    ],
    totalCount: 2,
    asOf: '2024-01-16T12:00:00Z',
  },
  my_projects: {
    items: [
      {
        id: 'proj-001',
        title: 'Riverside Tower - Phase II',
        subtitle: 'Project Manager • 78% complete',
        status: 'active',
        link: '/projects/proj-001',
      },
      {
        id: 'proj-002',
        title: 'Green Valley Residences',
        subtitle: 'Consultant • 45% complete',
        status: 'active',
        link: '/projects/proj-002',
      },
    ],
    totalCount: 2,
    asOf: '2024-01-16T12:00:00Z',
  },
  recent_records: {
    items: [
      {
        id: 'rec-001',
        title: 'PO-2024-001',
        subtitle: 'Purchase Order • Viewed 2 hours ago',
        link: '/procurement/orders/PO-2024-001',
      },
      {
        id: 'rec-002',
        title: 'GRN-2024-045',
        subtitle: 'Goods Receipt • Viewed 5 hours ago',
        link: '/inventory/grn/GRN-2024-045',
      },
      {
        id: 'rec-003',
        title: 'BILL-2024-012',
        subtitle: 'Subcontractor Bill • Viewed yesterday',
        link: '/finance/bills/BILL-2024-012',
      },
    ],
    totalCount: 3,
    asOf: '2024-01-16T12:00:00Z',
  },
};

export const sampleChartData: Record<string, ChartWidgetData> = {
  chart_progress_trend: {
    type: 'line',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Planned',
        data: [20, 40, 60, 80, 100],
        color: '#3B82F6',
      },
      {
        label: 'Actual',
        data: [18, 38, 58, 75, 78.5],
        color: '#10B981',
      },
    ],
    asOf: '2024-01-16T12:00:00Z',
  },
  chart_cost_breakdown: {
    type: 'pie',
    labels: ['Material', 'Labour', 'Equipment', 'Overhead'],
    datasets: [
      {
        label: 'Cost Breakdown',
        data: [45, 30, 15, 10],
        color: '#8B5CF6',
      },
    ],
    asOf: '2024-01-16T12:00:00Z',
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getWidgetByCode(code: string): DashboardWidget | undefined {
  return dashboardWidgets.find(w => w.code === code);
}

export function getWidgetsByModule(module: string): DashboardWidget[] {
  return dashboardWidgets.filter(w => w.module === module);
}

export function getWidgetsByType(type: WidgetType): DashboardWidget[] {
  return dashboardWidgets.filter(w => w.type === type);
}

export function getKpiByCode(code: string): DashboardKpi | undefined {
  return dashboardKpis.find(k => k.code === code);
}

export function getLayoutForUser(userId: string, device: DeviceType): DashboardLayout | undefined {
  // First check for user-specific layout
  const userLayout = dashboardLayouts.find(
    l => l.owner_type === 'user' && l.owner_id === userId && l.device === device
  );
  
  if (userLayout) return userLayout;
  
  // Fall back to system default
  return dashboardLayouts.find(
    l => l.owner_type === 'system' && l.device === device && l.is_default
  );
}

export function getLayoutForRole(roleId: string, device: DeviceType): DashboardLayout | undefined {
  return dashboardLayouts.find(
    l => l.owner_type === 'role' && l.owner_id === roleId && l.device === device && l.is_default
  );
}

export function getQuickActionsForUser(userId: string): UserQuickAction[] {
  return userQuickActions
    .filter(qa => qa.user_id === userId)
    .sort((a, b) => a.position - b.position);
}

export function getKpiStatus(value: number, kpi: DashboardKpi): 'red' | 'amber' | 'green' {
  const { thresholds, direction } = kpi;
  
  if (direction === 'higher_better') {
    if (value >= thresholds.green) return 'green';
    if (value >= thresholds.amber) return 'amber';
    return 'red';
  } else {
    if (value <= thresholds.green) return 'green';
    if (value <= thresholds.amber) return 'amber';
    return 'red';
  }
}
