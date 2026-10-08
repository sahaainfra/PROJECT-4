// ═══════════════════════════════════════════════════════════
// PREVIEW DATA — Part 02: Personas & Fixture Data
// Synthetic data for stakeholder preview dashboards
// ═══════════════════════════════════════════════════════════

export interface Persona {
  id: string;
  name: string;
  role: string;
  avatar: string;
  color: string;
  dashboards: string[];
}

export const personas: Persona[] = [
  { id: 'cfo', name: 'Priya Sharma', role: 'CFO / Management', avatar: 'PS', color: '#7c3aed', dashboards: ['cfo-snapshot', 'financial-health'] },
  { id: 'pm', name: 'Rajesh Kumar', role: 'Project Manager', avatar: 'RK', color: '#0066cc', dashboards: ['project-360', 'my-work'] },
  { id: 'site-eng', name: 'Amit Verma', role: 'Site Engineer', avatar: 'AV', color: '#059669', dashboards: ['site-mobile', 'daily-progress'] },
  { id: 'store', name: 'Suresh Patel', role: 'Store Keeper', avatar: 'SP', color: '#d97706', dashboards: ['stores-control', 'material-balance'] },
  { id: 'qs', name: 'Vikram Mehta', role: 'QS / Commercial', avatar: 'VM', color: '#dc2626', dashboards: ['cost-control', 'boq-tracking'] },
  { id: 'procurement', name: 'Anita Desai', role: 'Procurement Head', avatar: 'AD', color: '#0891b2', dashboards: ['procurement-control', 'vendor-performance'] },
  { id: 'plant', name: 'Karan Singh', role: 'Plant Manager', avatar: 'KS', color: '#65a30d', dashboards: ['plant-utilisation', 'equipment-status'] },
  { id: 'hr', name: 'Meena Joshi', role: 'HR Manager', avatar: 'MJ', color: '#ea580c', dashboards: ['workforce-overview', 'attendance-summary'] },
  { id: 'qa', name: 'Deepak Rao', role: 'QA/QC Manager', avatar: 'DR', color: '#9333ea', dashboards: ['quality-dashboard', 'inspection-status'] },
  { id: 'hse', name: 'Ravi Nair', role: 'HSE Officer', avatar: 'RN', color: '#e11d48', dashboards: ['safety-dashboard', 'incident-tracker'] },
  { id: 'protocol', name: 'Sneha Kulkarni', role: 'Protocol / Compliance', avatar: 'SK', color: '#4f46e5', dashboards: ['protocol-tower', 'compliance-score'] },
  { id: 'admin', name: 'System Admin', role: 'Super Admin', avatar: 'SA', color: '#374151', dashboards: ['system-health', 'user-management'] },
];

// Widget payload contract (Part 20)
export interface WidgetPayload {
  value: string | number;
  previous?: string | number;
  trend?: { label: string; value: number }[];
  label: string;
  drillLink?: string;
  asOf: string;
  kpiCode: string;
  formula?: string;
  status?: 'good' | 'warning' | 'critical' | 'neutral';
}

export interface WidgetDefinition {
  code: string;
  title: string;
  persona: string;
  kpiCodes: string[];
  futureSourcePrompt: string;
  futureApi: string;
  status: 'PREVIEW' | 'LIVE' | 'PROMOTED' | 'RETIRED';
  dataMode: 'fixture' | 'live';
  owner: string;
  feedbackCount: number;
  size: 'small' | 'medium' | 'large' | 'full';
}

export const widgetRegistry: WidgetDefinition[] = [
  // CFO Dashboards
  { code: 'W-CFO-001', title: 'Cash Position', persona: 'cfo', kpiCodes: ['KPI-FIN-001'], futureSourcePrompt: 'Part 50', futureApi: '/api/v1/dash/cfo/cash', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 50', feedbackCount: 0, size: 'medium' },
  { code: 'W-CFO-002', title: 'Revenue vs Budget', persona: 'cfo', kpiCodes: ['KPI-FIN-002'], futureSourcePrompt: 'Part 50', futureApi: '/api/v1/dash/cfo/revenue', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 50', feedbackCount: 0, size: 'medium' },
  { code: 'W-CFO-003', title: 'Outstanding Receivables', persona: 'cfo', kpiCodes: ['KPI-FIN-003'], futureSourcePrompt: 'Part 50', futureApi: '/api/v1/dash/cfo/receivables', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 50', feedbackCount: 0, size: 'small' },
  { code: 'W-CFO-004', title: 'Project P&L Summary', persona: 'cfo', kpiCodes: ['KPI-FIN-004'], futureSourcePrompt: 'Part 50', futureApi: '/api/v1/dash/cfo/project-pnl', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 50', feedbackCount: 0, size: 'large' },
  // PM Dashboards
  { code: 'W-PM-001', title: 'Project Completion', persona: 'pm', kpiCodes: ['KPI-PROJ-001'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/pm/completion', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'medium' },
  { code: 'W-PM-002', title: 'Budget vs Actual', persona: 'pm', kpiCodes: ['KPI-PROJ-002'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/pm/budget', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'medium' },
  { code: 'W-PM-003', title: 'Schedule Variance', persona: 'pm', kpiCodes: ['KPI-PROJ-003'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/pm/schedule', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'small' },
  { code: 'W-PM-004', title: 'Open Issues', persona: 'pm', kpiCodes: ['KPI-PROJ-004'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/pm/issues', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'small' },
  { code: 'W-PM-005', title: 'My Approvals', persona: 'pm', kpiCodes: ['KPI-GEN-001'], futureSourcePrompt: 'Part 12', futureApi: '/api/v1/dash/pm/approvals', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 12', feedbackCount: 0, size: 'small' },
  // Site Engineer
  { code: 'W-SITE-001', title: "Today's Work Orders", persona: 'site-eng', kpiCodes: ['KPI-SITE-001'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/site/work-orders', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'medium' },
  { code: 'W-SITE-002', title: 'Labour On-Site', persona: 'site-eng', kpiCodes: ['KPI-SITE-002'], futureSourcePrompt: 'Part 60', futureApi: '/api/v1/dash/site/labour', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 60', feedbackCount: 0, size: 'small' },
  { code: 'W-SITE-003', title: 'Material Availability', persona: 'site-eng', kpiCodes: ['KPI-SITE-003'], futureSourcePrompt: 'Part 25', futureApi: '/api/v1/dash/site/materials', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 25', feedbackCount: 0, size: 'small' },
  { code: 'W-SITE-004', title: 'Gate Status', persona: 'site-eng', kpiCodes: ['KPI-SITE-004'], futureSourcePrompt: 'Part 14', futureApi: '/api/v1/dash/site/gate-status', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 14', feedbackCount: 0, size: 'medium' },
  // Store Keeper
  { code: 'W-STORE-001', title: 'Stock Alerts', persona: 'store', kpiCodes: ['KPI-INV-001'], futureSourcePrompt: 'Part 25', futureApi: '/api/v1/dash/store/alerts', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 25', feedbackCount: 0, size: 'medium' },
  { code: 'W-STORE-002', title: 'Pending GRNs', persona: 'store', kpiCodes: ['KPI-INV-002'], futureSourcePrompt: 'Part 25', futureApi: '/api/v1/dash/store/grn-pending', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 25', feedbackCount: 0, size: 'small' },
  { code: 'W-STORE-003', title: 'Consumption vs Theoretical', persona: 'store', kpiCodes: ['KPI-INV-003'], futureSourcePrompt: 'Part 25', futureApi: '/api/v1/dash/store/consumption', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 25', feedbackCount: 0, size: 'large' },
  // QS / Commercial
  { code: 'W-QS-001', title: 'Cost Variance by WBS', persona: 'qs', kpiCodes: ['KPI-COST-001'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/qs/cost-variance', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'large' },
  { code: 'W-QS-002', title: 'Claim Register', persona: 'qs', kpiCodes: ['KPI-COST-002'], futureSourcePrompt: 'Part 40', futureApi: '/api/v1/dash/qs/claims', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 40', feedbackCount: 0, size: 'medium' },
  // Procurement
  { code: 'W-PROC-001', title: 'Open POs Value', persona: 'procurement', kpiCodes: ['KPI-PROC-001'], futureSourcePrompt: 'Part 20', futureApi: '/api/v1/dash/proc/open-pos', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 20', feedbackCount: 0, size: 'medium' },
  { code: 'W-PROC-002', title: 'Vendor Delivery Performance', persona: 'procurement', kpiCodes: ['KPI-PROC-002'], futureSourcePrompt: 'Part 20', futureApi: '/api/v1/dash/proc/vendor-delivery', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 20', feedbackCount: 0, size: 'large' },
  { code: 'W-PROC-003', title: 'PR Aging', persona: 'procurement', kpiCodes: ['KPI-PROC-003'], futureSourcePrompt: 'Part 20', futureApi: '/api/v1/dash/proc/pr-aging', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 20', feedbackCount: 0, size: 'medium' },
  // Plant Manager
  { code: 'W-PLANT-001', title: 'Equipment Utilisation', persona: 'plant', kpiCodes: ['KPI-EQP-001'], futureSourcePrompt: 'Part 45', futureApi: '/api/v1/dash/plant/utilisation', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 45', feedbackCount: 0, size: 'large' },
  { code: 'W-PLANT-002', title: 'Maintenance Due', persona: 'plant', kpiCodes: ['KPI-EQP-002'], futureSourcePrompt: 'Part 45', futureApi: '/api/v1/dash/plant/maintenance', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 45', feedbackCount: 0, size: 'medium' },
  // HR
  { code: 'W-HR-001', title: 'Attendance Rate', persona: 'hr', kpiCodes: ['KPI-HR-001'], futureSourcePrompt: 'Part 60', futureApi: '/api/v1/dash/hr/attendance', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 60', feedbackCount: 0, size: 'medium' },
  { code: 'W-HR-002', title: 'Manpower Deployment', persona: 'hr', kpiCodes: ['KPI-HR-002'], futureSourcePrompt: 'Part 60', futureApi: '/api/v1/dash/hr/deployment', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 60', feedbackCount: 0, size: 'large' },
  // QA/QC
  { code: 'W-QA-001', title: 'Inspection Pass Rate', persona: 'qa', kpiCodes: ['KPI-QA-001'], futureSourcePrompt: 'Part 55', futureApi: '/api/v1/dash/qa/pass-rate', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 55', feedbackCount: 0, size: 'medium' },
  { code: 'W-QA-002', title: 'Open NCRs', persona: 'qa', kpiCodes: ['KPI-QA-002'], futureSourcePrompt: 'Part 55', futureApi: '/api/v1/dash/qa/ncrs', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 55', feedbackCount: 0, size: 'small' },
  // HSE
  { code: 'W-HSE-001', title: 'Safety Incidents (MTD)', persona: 'hse', kpiCodes: ['KPI-HSE-001'], futureSourcePrompt: 'Part 56', futureApi: '/api/v1/dash/hse/incidents', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 56', feedbackCount: 0, size: 'medium' },
  { code: 'W-HSE-002', title: 'Permit Compliance', persona: 'hse', kpiCodes: ['KPI-HSE-002'], futureSourcePrompt: 'Part 56', futureApi: '/api/v1/dash/hse/permits', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 56', feedbackCount: 0, size: 'medium' },
  // Protocol / Compliance
  { code: 'W-PROTO-001', title: 'Protocol Violations', persona: 'protocol', kpiCodes: ['KPI-PC-001'], futureSourcePrompt: 'Part 14', futureApi: '/api/v1/dash/protocol/violations', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 14', feedbackCount: 0, size: 'medium' },
  { code: 'W-PROTO-002', title: 'Compliance Score', persona: 'protocol', kpiCodes: ['KPI-PC-002'], futureSourcePrompt: 'Part 14', futureApi: '/api/v1/dash/protocol/compliance', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 14', feedbackCount: 0, size: 'medium' },
  { code: 'W-PROTO-003', title: 'Exception Requests', persona: 'protocol', kpiCodes: ['KPI-PC-003'], futureSourcePrompt: 'Part 14', futureApi: '/api/v1/dash/protocol/exceptions', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 14', feedbackCount: 0, size: 'small' },
  // Super Admin
  { code: 'W-ADMIN-001', title: 'System Health', persona: 'admin', kpiCodes: ['KPI-SYS-001'], futureSourcePrompt: 'Part 10', futureApi: '/api/v1/dash/admin/health', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 10', feedbackCount: 0, size: 'medium' },
  { code: 'W-ADMIN-002', title: 'Active Users', persona: 'admin', kpiCodes: ['KPI-SYS-002'], futureSourcePrompt: 'Part 09', futureApi: '/api/v1/dash/admin/users', status: 'PREVIEW', dataMode: 'fixture', owner: 'Part 09', feedbackCount: 0, size: 'small' },
];

// ═══════════════════════════════════════════════════════════
// FIXTURE DATA — Synthetic, labelled PREVIEW
// ═══════════════════════════════════════════════════════════

export const fixtureData: Record<string, WidgetPayload> = {
  // CFO
  'W-CFO-001': { value: '₹4.2 Cr', previous: '₹3.8 Cr', trend: [{ label: 'Jan', value: 3.2 }, { label: 'Feb', value: 3.5 }, { label: 'Mar', value: 3.8 }, { label: 'Apr', value: 4.2 }], label: 'Cash & Bank Balance', asOf: '15 Jan 2024, 09:30', kpiCode: 'KPI-FIN-001', formula: 'Σ(bank_accounts.balance) + cash_in_hand', status: 'good' },
  'W-CFO-002': { value: '₹28.4 Cr', previous: '₹26.1 Cr', trend: [{ label: 'Q1', value: 6.2 }, { label: 'Q2', value: 7.1 }, { label: 'Q3', value: 7.8 }, { label: 'Q4', value: 7.3 }], label: 'Revenue YTD (Budget: ₹32 Cr)', asOf: '15 Jan 2024', kpiCode: 'KPI-FIN-002', formula: 'Σ(invoice_lines.net_amount) WHERE fiscal_year = current', status: 'warning' },
  'W-CFO-003': { value: '₹8.7 Cr', previous: '₹9.2 Cr', label: 'Outstanding Receivables (>30 days: ₹3.1 Cr)', asOf: '15 Jan 2024', kpiCode: 'KPI-FIN-003', formula: 'Σ(invoices.outstanding_amount) WHERE status = open', status: 'warning' },
  'W-CFO-004': { value: 5, label: 'Active Projects', asOf: '15 Jan 2024', kpiCode: 'KPI-FIN-004', formula: 'COUNT(projects) WHERE status = active', status: 'neutral' },
  // PM
  'W-PM-001': { value: '67%', previous: '62%', trend: [{ label: 'Oct', value: 52 }, { label: 'Nov', value: 58 }, { label: 'Dec', value: 62 }, { label: 'Jan', value: 67 }], label: 'Riverside Tower — Physical Progress', asOf: '15 Jan 2024', kpiCode: 'KPI-PROJ-001', formula: 'Σ(boq_items.completed_qty × rate) / Σ(boq_items.qty × rate) × 100', status: 'good' },
  'W-PM-002': { value: '₹8.6 Cr', previous: '₹8.1 Cr', label: 'Actual Cost (Budget: ₹9.2 Cr)', asOf: '15 Jan 2024', kpiCode: 'KPI-PROJ-002', formula: 'Σ(cost_entries.amount) WHERE project_id = current', status: 'good' },
  'W-PM-003': { value: '-4 days', previous: '-2 days', label: 'Schedule Variance (Critical Path)', asOf: '15 Jan 2024', kpiCode: 'KPI-PROJ-003', formula: 'planned_completion - forecast_completion', status: 'warning' },
  'W-PM-004': { value: 12, label: 'Open Issues / RFIs', asOf: '15 Jan 2024', kpiCode: 'KPI-PROJ-004', formula: 'COUNT(issues) WHERE status IN (open, in_progress)', status: 'neutral' },
  'W-PM-005': { value: 7, label: 'Pending My Approval', asOf: '15 Jan 2024, 10:15', kpiCode: 'KPI-GEN-001', formula: 'COUNT(workflow_tasks) WHERE assignee = me AND status = pending', status: 'neutral' },
  // Site Engineer
  'W-SITE-001': { value: 8, label: "Today's Work Orders", asOf: '15 Jan 2024, 07:00', kpiCode: 'KPI-SITE-001', formula: 'COUNT(work_orders) WHERE date = today AND site = current', status: 'neutral' },
  'W-SITE-002': { value: '186/210', label: 'Labour Present (88.6%)', asOf: '15 Jan 2024, 09:00', kpiCode: 'KPI-SITE-002', formula: 'COUNT(attendance) WHERE date = today AND status = present / planned_headcount × 100', status: 'good' },
  'W-SITE-003': { value: 3, label: 'Material Shortages', asOf: '15 Jan 2024', kpiCode: 'KPI-SITE-003', formula: 'COUNT(materials) WHERE stock_qty < reorder_level', status: 'critical' },
  'W-SITE-004': { value: '3/5', label: 'Protocol Gates Passed', asOf: '15 Jan 2024', kpiCode: 'KPI-SITE-004', formula: 'COUNT(gates) WHERE status = passed / total_gates', status: 'warning' },
  // Store Keeper
  'W-STORE-001': { value: 7, label: 'Items Below Reorder Level', asOf: '15 Jan 2024', kpiCode: 'KPI-INV-001', formula: 'COUNT(materials) WHERE stock_qty < reorder_level', status: 'critical' },
  'W-STORE-002': { value: 4, label: 'GRNs Pending Today', asOf: '15 Jan 2024', kpiCode: 'KPI-INV-002', formula: 'COUNT(grn) WHERE date = today AND status = pending', status: 'neutral' },
  'W-STORE-003': { value: '+3.2%', previous: '+2.8%', label: 'Wastage (Theoretical: 2%)', asOf: 'Jan 2024', kpiCode: 'KPI-INV-003', formula: '(issued_qty - theoretical_qty) / theoretical_qty × 100', status: 'warning' },
  // QS
  'W-QS-001': { value: '-₹42 L', label: 'Cost Overrun (3 WBS elements)', asOf: '15 Jan 2024', kpiCode: 'KPI-COST-001', formula: 'Σ(boq_items.actual_cost - boq_items.budget_cost) WHERE variance > 0', status: 'critical' },
  'W-QS-002': { value: 5, label: 'Open Claims (₹1.8 Cr)', asOf: '15 Jan 2024', kpiCode: 'KPI-COST-002', formula: 'COUNT(claims) WHERE status = open', status: 'warning' },
  // Procurement
  'W-PROC-001': { value: '₹2.4 Cr', previous: '₹2.1 Cr', label: 'Open PO Value (47 orders)', asOf: '15 Jan 2024', kpiCode: 'KPI-PROC-001', formula: 'Σ(po_items.order_value) WHERE po.status = open', status: 'neutral' },
  'W-PROC-002': { value: '87%', previous: '84%', label: 'On-Time Delivery Rate', asOf: 'Jan 2024', kpiCode: 'KPI-PROC-002', formula: 'COUNT(grn WHERE delivery_date <= po.delivery_date) / COUNT(grn) × 100', status: 'good' },
  'W-PROC-003': { value: 8, label: 'PRs Pending > 7 Days', asOf: '15 Jan 2024', kpiCode: 'KPI-PROC-003', formula: 'COUNT(pr) WHERE status = open AND age > 7', status: 'warning' },
  // Plant
  'W-PLANT-001': { value: '72%', previous: '68%', trend: [{ label: 'Oct', value: 65 }, { label: 'Nov', value: 68 }, { label: 'Dec', value: 70 }, { label: 'Jan', value: 72 }], label: 'Fleet Utilisation', asOf: 'Jan 2024', kpiCode: 'KPI-EQP-001', formula: 'Σ(equipment.active_hours) / Σ(equipment.available_hours) × 100', status: 'good' },
  'W-PLANT-002': { value: 6, label: 'Maintenance Due This Week', asOf: '15 Jan 2024', kpiCode: 'KPI-EQP-002', formula: 'COUNT(maintenance) WHERE due_date BETWEEN today AND today+7', status: 'neutral' },
  // HR
  'W-HR-001': { value: '94.2%', previous: '92.8%', label: 'Attendance Rate (All Sites)', asOf: 'Jan 2024', kpiCode: 'KPI-HR-001', formula: 'Σ(present_days) / Σ(planned_days) × 100', status: 'good' },
  'W-HR-002': { value: 1842, label: 'Total Workforce Deployed', asOf: '15 Jan 2024', kpiCode: 'KPI-HR-002', formula: 'COUNT(employees) WHERE status = active', status: 'neutral' },
  // QA
  'W-QA-001': { value: '91%', previous: '89%', label: 'First-Pass Inspection Rate', asOf: 'Jan 2024', kpiCode: 'KPI-QA-001', formula: 'COUNT(inspections WHERE result = pass) / COUNT(inspections) × 100', status: 'good' },
  'W-QA-002': { value: 4, label: 'Open NCRs (2 overdue)', asOf: '15 Jan 2024', kpiCode: 'KPI-QA-002', formula: 'COUNT(ncr) WHERE status = open', status: 'warning' },
  // HSE
  'W-HSE-001': { value: 2, previous: 3, label: 'Recordable Incidents (MTD)', asOf: 'Jan 2024', kpiCode: 'KPI-HSE-001', formula: 'COUNT(incidents) WHERE severity >= recordable AND month = current', status: 'good' },
  'W-HSE-002': { value: '96%', label: 'Permit Compliance Rate', asOf: 'Jan 2024', kpiCode: 'KPI-HSE-002', formula: 'COUNT(permits WHERE compliant = true) / COUNT(permits) × 100', status: 'good' },
  // Protocol
  'W-PROTO-001': { value: 3, label: 'Active Violations', asOf: '15 Jan 2024', kpiCode: 'KPI-PC-001', formula: 'COUNT(protocol_violations) WHERE status = active', status: 'critical' },
  'W-PROTO-002': { value: '82%', previous: '78%', label: 'Overall Compliance Score', asOf: 'Jan 2024', kpiCode: 'KPI-PC-002', formula: '(total_checks - violations) / total_checks × 100', status: 'warning' },
  'W-PROTO-003': { value: 5, label: 'Pending Exception Requests', asOf: '15 Jan 2024', kpiCode: 'KPI-PC-003', formula: 'COUNT(exceptions) WHERE status = pending', status: 'neutral' },
  // Admin
  'W-ADMIN-001': { value: '99.7%', label: 'System Uptime (30 days)', asOf: 'Jan 2024', kpiCode: 'KPI-SYS-001', formula: 'uptime_seconds / total_seconds × 100', status: 'good' },
  'W-ADMIN-002': { value: 142, label: 'Active Users (today)', asOf: '15 Jan 2024, 10:30', kpiCode: 'KPI-SYS-002', formula: 'COUNT(DISTINCT user_id) FROM sessions WHERE last_active > now() - 1 hour', status: 'neutral' },
};

// Feedback entries
export interface FeedbackEntry {
  widgetCode: string;
  screen: string;
  reviewer: string;
  comment: string;
  decision: 'accepted' | 'change_requested' | 'pending';
  createdAt: string;
}

export const feedbackEntries: FeedbackEntry[] = [
  { widgetCode: 'W-CFO-001', screen: 'CFO Snapshot', reviewer: 'Priya Sharma', comment: 'Add trend sparkline and drill-down to bank accounts', decision: 'change_requested', createdAt: '10 Jan 2024' },
  { widgetCode: 'W-PM-001', screen: 'Project 360', reviewer: 'Rajesh Kumar', comment: 'Good layout. Add S-curve comparison with baseline', decision: 'accepted', createdAt: '11 Jan 2024' },
  { widgetCode: 'W-SITE-002', screen: 'Site Mobile', reviewer: 'Amit Verma', comment: 'Show breakdown by trade (mason, helper, electrician)', decision: 'change_requested', createdAt: '12 Jan 2024' },
  { widgetCode: 'W-STORE-003', screen: 'Stores Control', reviewer: 'Suresh Patel', comment: 'Need material-wise wastage, not just aggregate', decision: 'pending', createdAt: '13 Jan 2024' },
  { widgetCode: 'W-PROTO-002', screen: 'Protocol Tower', reviewer: 'Sneha Kulkarni', comment: 'Break down by control stage (PLAN, VERIFY, EXECUTE)', decision: 'accepted', createdAt: '14 Jan 2024' },
];
