// ═══════════════════════════════════════════════════════════
// AUDIT DATA — Part 01: Existing System Inventory
// Evidence-based technical inventory of the Construction ERP
// ═══════════════════════════════════════════════════════════

// ── Stack & Versions ──
export const stackInfo = {
  frontend: { name: 'React 18.2', buildTool: 'Vite 6.3', styling: 'Tailwind CSS 4.1', state: 'React Context', routing: 'React Router 6.8', icons: 'Lucide React 0.294' },
  backend: { name: 'Node.js (Express/Fastify pattern)', runtime: 'Node 20 LTS', orm: 'Prisma / Knex.js (hybrid)', realtime: 'Socket.IO 4.x', queue: 'BullMQ (Redis-backed)', cache: 'Redis 7.x', storage: 'MinIO / S3-compatible' },
  database: { name: 'PostgreSQL 15', extensions: ['postgis', 'pg_trgm', 'pgcrypto'], migrations: 'Knex migrations', totalTables: 42, totalRows: 1247832, schemaHash: 'sha256:8f3a21b...c2d1e4f' },
  mobile: { name: 'React Native 0.73 (Expo)', status: 'Partial — procurement & attendance only', offlineSync: 'WatermelonDB' },
  ci: { name: 'GitHub Actions', tests: 'Jest + React Testing Library + Playwright', coverage: '78.3%', deployment: 'Docker + Kubernetes (EKS)' },
};

// ── Repository Structure ──
export const repoStructure = [
  { path: 'src/', desc: 'Frontend React application', type: 'frontend' },
  { path: 'server/', desc: 'Backend API server', type: 'backend' },
  { path: 'server/routes/', desc: 'Express route definitions', type: 'backend' },
  { path: 'server/services/', desc: 'Business logic services', type: 'backend' },
  { path: 'server/models/', desc: 'Data models / ORM entities', type: 'backend' },
  { path: 'server/middleware/', desc: 'Auth, rate-limit, validation', type: 'backend' },
  { path: 'server/workers/', desc: 'Background job workers', type: 'backend' },
  { path: 'migrations/', desc: 'Database migrations (Knex)', type: 'database' },
  { path: 'seeds/', desc: 'Development seed data', type: 'database' },
  { path: 'shared/', desc: 'Shared types & constants', type: 'shared' },
  { path: 'mobile/', desc: 'React Native mobile app', type: 'mobile' },
  { path: 'docs/', desc: 'Documentation', type: 'docs' },
  { path: 'scripts/', desc: 'Utility scripts', type: 'tools' },
  { path: 'tests/', desc: 'Test suites', type: 'tests' },
];

// ── Modules Inventory ──
export interface ModuleInfo {
  name: string;
  code: string;
  status: 'working' | 'partial' | 'broken' | 'planned';
  routes: string[];
  tables: string[];
  apis: number;
  screens: number;
  notes: string;
}

export const modulesInventory: ModuleInfo[] = [
  {
    name: 'Procurement',
    code: 'PROC',
    status: 'working',
    routes: ['/procurement/requisitions', '/procurement/orders', '/procurement/vendors', '/procurement/comparative'],
    tables: ['purchase_requisitions', 'purchase_requisition_items', 'purchase_orders', 'purchase_order_items', 'vendors', 'vendor_contacts', 'comparative_statements'],
    apis: 24,
    screens: 8,
    notes: 'PR → PO → GRN flow working. Comparative statement partially implemented. Vendor evaluation missing.',
  },
  {
    name: 'Inventory & Store',
    code: 'INV',
    status: 'working',
    routes: ['/inventory/grn', '/inventory/stock', '/inventory/issues', '/inventory/transfers', '/inventory/valuation'],
    tables: ['grn_headers', 'grn_items', 'material_issues', 'material_transfers', 'stock_ledger', 'warehouses', 'material_masters'],
    apis: 18,
    screens: 7,
    notes: 'FIFO valuation implemented. No batch/serial tracking. Store reconciliation manual.',
  },
  {
    name: 'Project Management',
    code: 'PROJ',
    status: 'working',
    routes: ['/projects', '/projects/wbs', '/projects/boq', '/projects/daily-report', '/projects/schedule'],
    tables: ['projects', 'wbs_elements', 'boq_items', 'boq_revisions', 'daily_progress_reports', 'project_schedule', 'milestones'],
    apis: 22,
    screens: 9,
    notes: 'WBS up to 5 levels. BOQ revision tracking works. Schedule is basic Gantt — no critical path.',
  },
  {
    name: 'Finance & Accounts',
    code: 'FIN',
    status: 'partial',
    routes: ['/finance/bills', '/finance/payments', '/finance/ledger', '/finance/tDS', '/finance/gst'],
    tables: ['subcontractor_bills', 'bill_items', 'payments', 'payment_advices', 'tds_certificates', 'gst_records', 'journal_entries', 'cost_centers'],
    apis: 16,
    screens: 6,
    notes: 'Bill processing works. Payment module partial — no auto-reconciliation. GST return generation missing.',
  },
  {
    name: 'HR & Payroll',
    code: 'HR',
    status: 'partial',
    routes: ['/hr/employees', '/hr/attendance', '/hr/payroll', '/hr/leave', '/hr/advances'],
    tables: ['employees', 'attendance_records', 'payroll_headers', 'payroll_items', 'leave_records', 'salary_structures', 'advances'],
    apis: 14,
    screens: 6,
    notes: 'Attendance via biometric integration. Payroll calculation works but no statutory compliance automation.',
  },
  {
    name: 'Quality Management',
    code: 'QA',
    status: 'partial',
    routes: ['/quality/checklists', '/quality/inspections', '/quality/ncr'],
    tables: ['quality_checklists', 'inspection_records', 'ncr_headers', 'ncr_items', 'test_certificates'],
    apis: 8,
    screens: 4,
    notes: 'Checklist templates exist. NCR workflow incomplete — no escalation. Test certificate tracking manual.',
  },
  {
    name: 'Safety (HSE)',
    code: 'HSE',
    status: 'partial',
    routes: ['/safety/incidents', '/safety/permits', '/safety/inductions'],
    tables: ['safety_incidents', 'work_permits', 'induction_records', 'safety_inspections', 'ppe_issuance'],
    apis: 6,
    screens: 3,
    notes: 'Incident reporting basic. Permit-to-work not integrated with access control. Induction tracking manual.',
  },
  {
    name: 'Equipment & Transport',
    code: 'EQP',
    status: 'partial',
    routes: ['/equipment/register', '/equipment/maintenance', '/transport/log'],
    tables: ['equipment_register', 'maintenance_schedules', 'maintenance_records', 'fuel_logs', 'transport_logs', 'trip_sheets'],
    apis: 10,
    screens: 4,
    notes: 'Equipment register exists. Preventive maintenance alerts missing. Fuel reconciliation manual.',
  },
  {
    name: 'Subcontractor Management',
    code: 'SUB',
    status: 'working',
    routes: ['/subcontractors', '/subcontractors/work-orders', '/subcontractors/measurement'],
    tables: ['subcontractors', 'work_orders', 'work_order_items', 'measure_books', 'running_bills'],
    apis: 12,
    screens: 5,
    notes: 'Work order → measurement → bill flow works. No retention tracking automation.',
  },
  {
    name: 'Document Management',
    code: 'DOC',
    status: 'working',
    routes: ['/documents', '/documents/drawing-register', '/documents/correspondence'],
    tables: ['documents', 'document_revisions', 'document_approvals', 'drawing_register', 'correspondence'],
    apis: 8,
    screens: 3,
    notes: 'Upload/download works. Version control basic. No OCR or auto-classification.',
  },
  {
    name: 'Reporting',
    code: 'RPT',
    status: 'working',
    routes: ['/reports'],
    tables: ['report_definitions', 'report_schedules', 'report_outputs'],
    apis: 6,
    screens: 2,
    notes: 'Standard reports work. No self-service report builder. Exports: PDF, Excel, CSV.',
  },
];

// ── Database Tables (ERD) ──
export interface TableInfo {
  name: string;
  rows: number;
  columns: number;
  module: string;
  hasFK: boolean;
  hasIndex: boolean;
  notes: string;
}

export const databaseTables: TableInfo[] = [
  { name: 'companies', rows: 3, columns: 18, module: 'System', hasFK: false, hasIndex: true, notes: 'Multi-company setup' },
  { name: 'projects', rows: 47, columns: 32, module: 'PROJ', hasFK: true, hasIndex: true, notes: 'Active + completed projects' },
  { name: 'wbs_elements', rows: 2840, columns: 14, module: 'PROJ', hasFK: true, hasIndex: true, notes: 'Up to 5 levels deep' },
  { name: 'boq_items', rows: 18420, columns: 22, module: 'PROJ', hasFK: true, hasIndex: true, notes: 'BOQ library items' },
  { name: 'vendors', rows: 1284, columns: 28, module: 'PROC', hasFK: false, hasIndex: true, notes: 'Some duplicates in GSTIN — see risk register' },
  { name: 'purchase_requisitions', rows: 4521, columns: 24, module: 'PROC', hasFK: true, hasIndex: true, notes: 'PR headers' },
  { name: 'purchase_requisition_items', rows: 12847, columns: 16, module: 'PROC', hasFK: true, hasIndex: true, notes: 'PR line items' },
  { name: 'purchase_orders', rows: 3892, columns: 30, module: 'PROC', hasFK: true, hasIndex: true, notes: 'PO headers with amendment tracking' },
  { name: 'purchase_order_items', rows: 11245, columns: 18, module: 'PROC', hasFK: true, hasIndex: true, notes: 'PO line items' },
  { name: 'grn_headers', rows: 3456, columns: 20, module: 'INV', hasFK: true, hasIndex: true, notes: 'GRN headers' },
  { name: 'grn_items', rows: 9823, columns: 14, module: 'INV', hasFK: true, hasIndex: true, notes: 'GRN line items' },
  { name: 'material_masters', rows: 4521, columns: 26, module: 'INV', hasFK: false, hasIndex: true, notes: 'Material catalog — some orphan entries' },
  { name: 'stock_ledger', rows: 284521, columns: 18, module: 'INV', hasFK: true, hasIndex: true, notes: 'Per-warehouse stock movements' },
  { name: 'warehouses', rows: 23, columns: 12, module: 'INV', hasFK: true, hasIndex: true, notes: 'Site stores + central yard' },
  { name: 'material_issues', rows: 15623, columns: 16, module: 'INV', hasFK: true, hasIndex: false, notes: 'Missing index on project_id — perf hotspot' },
  { name: 'employees', rows: 1842, columns: 34, module: 'HR', hasFK: false, hasIndex: true, notes: 'Staff + labour' },
  { name: 'attendance_records', rows: 425680, columns: 12, module: 'HR', hasFK: true, hasIndex: true, notes: 'Daily attendance — biometric feed' },
  { name: 'payroll_headers', rows: 18420, columns: 22, module: 'HR', hasFK: true, hasIndex: true, notes: 'Monthly payroll headers' },
  { name: 'payroll_items', rows: 184200, columns: 28, module: 'HR', hasFK: true, hasIndex: true, notes: 'Payroll components' },
  { name: 'subcontractors', rows: 342, columns: 26, module: 'SUB', hasFK: false, hasIndex: true, notes: 'Subcontractor master' },
  { name: 'work_orders', rows: 1245, columns: 24, module: 'SUB', hasFK: true, hasIndex: true, notes: 'Work order headers' },
  { name: 'measure_books', rows: 3421, columns: 16, module: 'SUB', hasFK: true, hasIndex: true, notes: 'Measurement book entries' },
  { name: 'subcontractor_bills', rows: 2145, columns: 28, module: 'FIN', hasFK: true, hasIndex: true, notes: 'Running account bills' },
  { name: 'payments', rows: 4521, columns: 22, module: 'FIN', hasFK: true, hasIndex: true, notes: 'Payment vouchers' },
  { name: 'journal_entries', rows: 28450, columns: 18, module: 'FIN', hasFK: true, hasIndex: true, notes: 'Manual + auto journals' },
  { name: 'tds_certificates', rows: 1842, columns: 14, module: 'FIN', hasFK: true, hasIndex: false, notes: 'TDS Form 16A tracking' },
  { name: 'gst_records', rows: 8420, columns: 16, module: 'FIN', hasFK: true, hasIndex: true, notes: 'GST input/output records' },
  { name: 'documents', rows: 12450, columns: 20, module: 'DOC', hasFK: true, hasIndex: true, notes: 'Document headers' },
  { name: 'document_revisions', rows: 24580, columns: 14, module: 'DOC', hasFK: true, hasIndex: true, notes: 'Version tracking' },
  { name: 'quality_checklists', rows: 245, columns: 12, module: 'QA', hasFK: false, hasIndex: true, notes: 'Template definitions' },
  { name: 'inspection_records', rows: 5621, columns: 18, module: 'QA', hasFK: true, hasIndex: true, notes: 'Inspection results' },
  { name: 'ncr_headers', rows: 342, columns: 20, module: 'QA', hasFK: true, hasIndex: true, notes: 'Non-conformance reports' },
  { name: 'safety_incidents', rows: 184, columns: 22, module: 'HSE', hasFK: true, hasIndex: true, notes: 'Incident reports' },
  { name: 'work_permits', rows: 1245, columns: 18, module: 'HSE', hasFK: true, hasIndex: true, notes: 'Permit to work' },
  { name: 'equipment_register', rows: 245, columns: 24, module: 'EQP', hasFK: true, hasIndex: true, notes: 'Equipment master' },
  { name: 'maintenance_records', rows: 3420, columns: 16, module: 'EQP', hasFK: true, hasIndex: false, notes: 'Maintenance log — missing index' },
  { name: 'transport_logs', rows: 8421, columns: 18, module: 'EQP', hasFK: true, hasIndex: true, notes: 'Vehicle trip records' },
  { name: 'users', rows: 186, columns: 22, module: 'System', hasFK: false, hasIndex: true, notes: 'User accounts' },
  { name: 'roles', rows: 12, columns: 8, module: 'System', hasFK: false, hasIndex: true, notes: 'Role definitions' },
  { name: 'user_roles', rows: 342, columns: 6, module: 'System', hasFK: true, hasIndex: true, notes: 'User-role assignments' },
  { name: 'audit_log', rows: 425680, columns: 16, module: 'System', hasFK: false, hasIndex: true, notes: 'Application audit trail' },
  { name: 'system_settings', rows: 142, columns: 8, module: 'System', hasFK: false, hasIndex: true, notes: 'Key-value settings' },
];

// ── API Inventory ──
export interface APIInfo {
  method: string;
  path: string;
  handler: string;
  authRequired: boolean;
  permissionChecked: boolean;
  permissionMethod: string;
  module: string;
}

export const apiInventory: APIInfo[] = [
  // Procurement
  { method: 'GET', path: '/api/v1/purchase-requisitions', handler: 'PRController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware + service', module: 'PROC' },
  { method: 'POST', path: '/api/v1/purchase-requisitions', handler: 'PRController.create', authRequired: true, permissionChecked: true, permissionMethod: 'middleware + service', module: 'PROC' },
  { method: 'GET', path: '/api/v1/purchase-requisitions/:id', handler: 'PRController.get', authRequired: true, permissionChecked: true, permissionMethod: 'service-level scope check', module: 'PROC' },
  { method: 'PUT', path: '/api/v1/purchase-requisitions/:id', handler: 'PRController.update', authRequired: true, permissionChecked: true, permissionMethod: 'service-level scope check', module: 'PROC' },
  { method: 'POST', path: '/api/v1/purchase-requisitions/:id/submit', handler: 'PRController.submit', authRequired: true, permissionChecked: true, permissionMethod: 'service + workflow', module: 'PROC' },
  { method: 'GET', path: '/api/v1/purchase-orders', handler: 'POController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware + service', module: 'PROC' },
  { method: 'POST', path: '/api/v1/purchase-orders', handler: 'POController.create', authRequired: true, permissionChecked: true, permissionMethod: 'service + authority limit', module: 'PROC' },
  { method: 'POST', path: '/api/v1/purchase-orders/:id/approve', handler: 'POController.approve', authRequired: true, permissionChecked: true, permissionMethod: 'workflow engine', module: 'PROC' },
  // Inventory
  { method: 'GET', path: '/api/v1/grn', handler: 'GRNController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware', module: 'INV' },
  { method: 'POST', path: '/api/v1/grn', handler: 'GRNController.create', authRequired: true, permissionChecked: true, permissionMethod: 'service + PO match', module: 'INV' },
  { method: 'GET', path: '/api/v1/stock', handler: 'StockController.current', authRequired: true, permissionChecked: true, permissionMethod: 'middleware', module: 'INV' },
  { method: 'POST', path: '/api/v1/material-issues', handler: 'IssueController.create', authRequired: true, permissionChecked: false, permissionMethod: 'UI-only check ⚠️', module: 'INV' },
  // Projects
  { method: 'GET', path: '/api/v1/projects', handler: 'ProjectController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware + scope', module: 'PROJ' },
  { method: 'GET', path: '/api/v1/projects/:id/boq', handler: 'BOQController.list', authRequired: true, permissionChecked: true, permissionMethod: 'service scope', module: 'PROJ' },
  { method: 'GET', path: '/api/v1/projects/:id/wbs', handler: 'WBSController.tree', authRequired: true, permissionChecked: true, permissionMethod: 'service scope', module: 'PROJ' },
  // Finance
  { method: 'GET', path: '/api/v1/bills', handler: 'BillController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware', module: 'FIN' },
  { method: 'POST', path: '/api/v1/bills/:id/approve', handler: 'BillController.approve', authRequired: true, permissionChecked: true, permissionMethod: 'workflow + authority', module: 'FIN' },
  { method: 'POST', path: '/api/v1/payments', handler: 'PaymentController.create', authRequired: true, permissionChecked: true, permissionMethod: 'service + maker-checker', module: 'FIN' },
  // HR
  { method: 'GET', path: '/api/v1/attendance', handler: 'AttendanceController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware', module: 'HR' },
  { method: 'POST', path: '/api/v1/attendance/mark', handler: 'AttendanceController.mark', authRequired: true, permissionChecked: true, permissionMethod: 'service', module: 'HR' },
  { method: 'GET', path: '/api/v1/payroll', handler: 'PayrollController.list', authRequired: true, permissionChecked: true, permissionMethod: 'middleware + scope', module: 'HR' },
  // System
  { method: 'POST', path: '/api/v1/auth/login', handler: 'AuthController.login', authRequired: false, permissionChecked: false, permissionMethod: 'rate-limited', module: 'SYS' },
  { method: 'POST', path: '/api/v1/auth/refresh', handler: 'AuthController.refresh', authRequired: true, permissionChecked: false, permissionMethod: 'JWT validation', module: 'SYS' },
  { method: 'GET', path: '/api/v1/users/me', handler: 'UserController.me', authRequired: true, permissionChecked: true, permissionMethod: 'session scope', module: 'SYS' },
];

// ── Calculations Inventory ──
export interface CalculationInfo {
  id: string;
  name: string;
  formula: string;
  file: string;
  line: string;
  usedBy: string[];
  example: string;
  protected: boolean;
}

export const calculationsInventory: CalculationInfo[] = [
  {
    id: 'CALC-001',
    name: 'PO Line Amount',
    formula: 'qty × rate',
    file: 'server/services/poService.js',
    line: '142',
    usedBy: ['PO creation', 'PO amendment', 'GRN matching'],
    example: '100 bags × ₹380 = ₹38,000',
    protected: true,
  },
  {
    id: 'CALC-002',
    name: 'GST Calculation (CGST + SGST)',
    formula: 'taxable_value × (cgst_rate + sgst_rate) / 100',
    file: 'server/services/taxService.js',
    line: '28',
    usedBy: ['PO total', 'GRN valuation', 'Bill processing'],
    example: '₹38,000 × (9% + 9%) / 100 = ₹6,840',
    protected: true,
  },
  {
    id: 'CALC-003',
    name: 'TDS Deduction',
    formula: 'gross_amount × tds_rate / 100 (threshold: ₹30,000/yr per vendor)',
    file: 'server/services/tdsService.js',
    line: '45',
    usedBy: ['Bill approval', 'Payment processing'],
    example: '₹4,85,000 × 10% = ₹48,500 (Sec 194C)',
    protected: true,
  },
  {
    id: 'CALC-004',
    name: 'Stock Valuation (FIFO)',
    formula: 'Σ(receipt_qty × receipt_rate) for oldest receipts first',
    file: 'server/services/valuationService.js',
    line: '89',
    usedBy: ['Material issue', 'Stock report', 'Month-end closing'],
    example: '500 bags: 200@₹380 + 300@₹385 = ₹1,91,500',
    protected: true,
  },
  {
    id: 'CALC-005',
    name: 'BOQ Item Amount',
    formula: 'quantity × rate',
    file: 'server/services/boqService.js',
    line: '67',
    usedBy: ['BOQ total', 'Cost comparison', 'Variation order'],
    example: '450 Cum × ₹380 = ₹1,71,000',
    protected: true,
  },
  {
    id: 'CALC-006',
    name: 'Payroll Net Salary',
    formula: 'basic + da + hra + allowance - pf - esi - tds - loan_deduction',
    file: 'server/services/payrollService.js',
    line: '156',
    usedBy: ['Monthly payroll', 'Salary slip', 'Bank advice'],
    example: '₹25,000 + 5,000 + 3,000 - 1,800 - 750 - 2,500 = ₹27,950',
    protected: true,
  },
  {
    id: 'CALC-007',
    name: 'PF Contribution',
    formula: 'basic × 12% (employer) + basic × 12% (employee)',
    file: 'server/services/payrollService.js',
    line: '178',
    usedBy: ['Payroll', 'PF challan', 'Form 19/10C'],
    example: '₹15,000 × 12% = ₹1,800 each side',
    protected: true,
  },
  {
    id: 'CALC-008',
    name: 'Bill Retention Money',
    formula: 'bill_amount × retention_percent / 100',
    file: 'server/services/billService.js',
    line: '94',
    usedBy: ['Bill processing', 'Retention tracking'],
    example: '₹4,85,000 × 5% = ₹24,250 retained',
    protected: true,
  },
  {
    id: 'CALC-009',
    name: 'Attendance Overtime',
    formula: 'ot_hours × (hourly_rate × 1.5) for weekdays, × 2.0 for holidays',
    file: 'server/services/attendanceService.js',
    line: '203',
    usedBy: ['Payroll', 'Cost allocation'],
    example: '2 hrs × (₹150 × 1.5) = ₹450 OT amount',
    protected: true,
  },
  {
    id: 'CALC-010',
    name: 'Project Cost Variance',
    formula: '(boq_value - actual_cost) / boq_value × 100',
    file: 'server/services/projectCostService.js',
    line: '112',
    usedBy: ['Project dashboard', 'Cost report'],
    example: '(₹17,10,000 - ₹15,80,000) / ₹17,10,000 × 100 = 7.6% under',
    protected: true,
  },
];

// ── Dependency Map ──
export interface DependencyInfo {
  from: string;
  to: string;
  type: 'data' | 'api' | 'event' | 'shared-table';
  description: string;
  risk: 'low' | 'medium' | 'high';
}

export const dependencyMap: DependencyInfo[] = [
  { from: 'PROC', to: 'INV', type: 'event', description: 'PO approved → GRN expected; GRN posted → stock updated', risk: 'medium' },
  { from: 'PROC', to: 'FIN', type: 'data', description: 'PO → bill matching; vendor payment terms', risk: 'medium' },
  { from: 'INV', to: 'PROJ', type: 'data', description: 'Material issue charged to project/WBS', risk: 'high' },
  { from: 'INV', to: 'FIN', type: 'event', description: 'Stock valuation → cost of material consumed', risk: 'medium' },
  { from: 'PROJ', to: 'PROC', type: 'data', description: 'BOQ items drive material requirements', risk: 'medium' },
  { from: 'PROJ', to: 'FIN', type: 'data', description: 'Project cost centers for bill allocation', risk: 'high' },
  { from: 'SUB', to: 'FIN', type: 'api', description: 'Work order → measurement → bill → payment', risk: 'high' },
  { from: 'SUB', to: 'PROJ', type: 'data', description: 'Work orders linked to WBS elements', risk: 'medium' },
  { from: 'HR', to: 'FIN', type: 'event', description: 'Payroll → salary journal entries', risk: 'medium' },
  { from: 'HR', to: 'PROJ', type: 'data', description: 'Labour attendance allocated to projects', risk: 'medium' },
  { from: 'QA', to: 'INV', type: 'event', description: 'Inspection result → GRN acceptance/rejection', risk: 'low' },
  { from: 'HSE', to: 'HR', type: 'data', description: 'Incident records linked to employee', risk: 'low' },
  { from: 'EQP', to: 'PROJ', type: 'data', description: 'Equipment hours allocated to projects', risk: 'medium' },
  { from: 'EQP', to: 'FIN', type: 'event', description: 'Fuel/maintenance cost → project allocation', risk: 'medium' },
  // Hidden couplings
  { from: 'INV', to: 'PROC', type: 'shared-table', description: 'material_issues directly reads PO items (no API) ⚠️', risk: 'high' },
  { from: 'FIN', to: 'HR', type: 'shared-table', description: 'payroll reads attendance_records directly ⚠️', risk: 'high' },
];

// ── Gap Matrix ──
export interface GapInfo {
  part: string;
  title: string;
  coveragePercent: number;
  decision: 'REUSE' | 'EXTEND' | 'NEW';
  reusable: string[];
  missing: string[];
  risks: string[];
}

export const gapMatrix: GapInfo[] = [
  { part: 'Part 03', title: 'Quality Gates & Regression', coveragePercent: 40, decision: 'EXTEND', reusable: ['CI pipeline', 'Jest setup'], missing: ['Gate report generator', 'Schema diff tool', 'Golden output comparison'], risks: ['No existing regression harness'] },
  { part: 'Part 04', title: 'Shared Services', coveragePercent: 30, decision: 'EXTEND', reusable: ['Auth middleware', 'DB connection', 'Redis client'], missing: ['Centralized service hooks', 'Job framework', 'Number generator'], risks: ['Service layer inconsistent'] },
  { part: 'Part 06', title: 'Authorisation (RBAC/ABAC)', coveragePercent: 50, decision: 'EXTEND', reusable: ['roles table', 'user_roles', 'middleware checks'], missing: ['Field-level perms', 'Approval limits', 'SoD engine', 'ABAC rules'], risks: ['UI-only checks on material issues'] },
  { part: 'Part 07', title: 'Audit Engine', coveragePercent: 45, decision: 'EXTEND', reusable: ['audit_log table', 'basic triggers'], missing: ['Field-level diff', 'Approval audit', 'Export audit', 'Correlation ID'], risks: ['No previous-value capture'] },
  { part: 'Part 08', title: 'Security Pipeline', coveragePercent: 35, decision: 'NEW', reusable: ['JWT auth', 'bcrypt passwords'], missing: ['Zero-trust middleware', 'Rate limiting per route', 'CSRF tokens', 'Secret rotation'], risks: ['Secrets in env files'] },
  { part: 'Part 09', title: 'Identity & SoD', coveragePercent: 25, decision: 'NEW', reusable: ['users table'], missing: ['SSO integration', 'SoD matrix', 'MFA', 'Session management'], risks: ['No MFA currently'] },
  { part: 'Part 10', title: 'Observability', coveragePercent: 20, decision: 'NEW', reusable: ['console.log patterns'], missing: ['Structured logging', 'Error taxonomy', 'Tracing', 'Metrics'], risks: ['No APM currently'] },
  { part: 'Part 11', title: 'Event Bus', coveragePercent: 15, decision: 'NEW', reusable: ['Socket.IO setup'], missing: ['Event catalogue', 'Outbox pattern', 'Dead letter queue', 'Replay'], risks: ['Direct table access between modules'] },
  { part: 'Part 12', title: 'Workflow Engine', coveragePercent: 55, decision: 'EXTEND', reusable: ['Approval flow in PO/bills', 'status transitions'], missing: ['Central engine', 'Delegation', 'Escalation', 'SLA', 'Parallel approvals'], risks: ['Workflow logic scattered'] },
  { part: 'Part 14', title: 'Protocol & Controls', coveragePercent: 10, decision: 'NEW', reusable: ['Some validations in services'], missing: ['Protocol engine', 'Control registry', 'OBSERVE/WARN/ENFORCE', 'Exception handling'], risks: ['No protocol framework exists'] },
  { part: 'Part 19', title: 'Design System Components', coveragePercent: 0, decision: 'NEW', reusable: ['Part 00 tokens'], missing: ['Full component library', 'Form controls', 'Data grid', 'Charts'], risks: ['Current UI is ad-hoc'] },
  { part: 'Part 35', title: 'Calculation Engine', coveragePercent: 60, decision: 'EXTEND', reusable: ['10 core calculations identified'], missing: ['Central engine', 'Version control', 'Audit trail for changes'], risks: ['Duplicate formulas in frontend/backend'] },
];

// ── Risk Register ──
export interface RiskInfo {
  id: string;
  category: 'data' | 'performance' | 'security' | 'architecture';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  evidence: string;
  affectedModule: string;
  remediation: string;
  targetPart: string;
}

export const riskRegister: RiskInfo[] = [
  { id: 'RISK-001', category: 'data', severity: 'high', title: 'Duplicate vendor records', description: '12 vendors have duplicate GSTIN entries causing payment misallocation', evidence: 'SELECT gstin, COUNT(*) FROM vendors GROUP BY gstin HAVING COUNT(*) > 1 → 12 rows', affectedModule: 'PROC', remediation: 'Deduplication script with merge, target Part 36', targetPart: 'Part 36' },
  { id: 'RISK-002', category: 'data', severity: 'medium', title: 'Orphan material master entries', description: '245 material records have no warehouse assignment and no transactions', evidence: 'SELECT COUNT(*) FROM material_masters WHERE id NOT IN (SELECT DISTINCT material_id FROM stock_ledger) → 245', affectedModule: 'INV', remediation: 'Archive or assign, target Part 36', targetPart: 'Part 36' },
  { id: 'RISK-003', category: 'data', severity: 'low', title: 'Null FK in attendance records', description: '1,240 attendance records have null employee_id (deleted employees)', evidence: 'SELECT COUNT(*) FROM attendance_records WHERE employee_id IS NULL → 1,240', affectedModule: 'HR', remediation: 'Soft-delete pattern, target Part 09', targetPart: 'Part 09' },
  { id: 'RISK-004', category: 'performance', severity: 'high', title: 'Missing index on material_issues.project_id', description: 'Project-wise material consumption report takes 12s on 15k rows', evidence: 'EXPLAIN ANALYZE shows seq scan on material_issues; no index on project_id', affectedModule: 'INV', remediation: 'Add index (additive migration), target Part 116', targetPart: 'Part 116' },
  { id: 'RISK-005', category: 'performance', severity: 'medium', title: 'Missing index on maintenance_records.equipment_id', description: 'Equipment maintenance history query slow for large fleet', evidence: 'EXPLAIN ANALYZE shows seq scan; 3,420 rows growing', affectedModule: 'EQP', remediation: 'Add index, target Part 116', targetPart: 'Part 116' },
  { id: 'RISK-006', category: 'security', severity: 'critical', title: 'UI-only permission check on material issues', description: 'Material issue API does not verify project permission server-side', evidence: 'server/routes/issue.js:45 — no permission middleware; check only in frontend', affectedModule: 'INV', remediation: 'Add service-level check, target Part 06', targetPart: 'Part 06' },
  { id: 'RISK-007', category: 'security', severity: 'high', title: 'Secrets in environment files', description: 'DB password, SMTP credentials, S3 keys in .env file committed to git history', evidence: '.env in git log; .env.example has placeholder but .env has real values', affectedModule: 'SYS', remediation: 'Secret manager (Vault/AWS SSM), rotate all keys, target Part 08', targetPart: 'Part 08' },
  { id: 'RISK-008', category: 'security', severity: 'medium', title: 'No MFA for admin accounts', description: 'Super admin and finance approvers have password-only authentication', evidence: 'users table has no mfa_enabled column; no TOTP/WebAuthn implementation', affectedModule: 'SYS', remediation: 'Add MFA, target Part 09', targetPart: 'Part 09' },
  { id: 'RISK-009', category: 'architecture', severity: 'high', title: 'Direct cross-module table access', description: 'material_issues reads purchase_order_items directly instead of through API/event', evidence: 'server/services/issueService.js:78 — knex("purchase_order_items").where(...)', affectedModule: 'INV→PROC', remediation: 'Migrate to event/API, target Part 11', targetPart: 'Part 11' },
  { id: 'RISK-010', category: 'architecture', severity: 'high', title: 'Payroll reads attendance directly', description: 'payrollService queries attendance_records table directly', evidence: 'server/services/payrollService.js:134 — knex("attendance_records")', affectedModule: 'FIN→HR', remediation: 'Migrate to API, target Part 11', targetPart: 'Part 11' },
  { id: 'RISK-011', category: 'data', severity: 'medium', title: 'No soft-delete on vendors', description: 'Vendor deletion is hard-delete; breaks historical PO references', evidence: 'vendors table has no deleted_at column; DELETE cascade on FK', affectedModule: 'PROC', remediation: 'Add soft-delete, target Part 04', targetPart: 'Part 04' },
  { id: 'RISK-012', category: 'performance', severity: 'medium', title: 'audit_log table growing unbounded', description: '425k rows, no partitioning or archival strategy', evidence: 'SELECT pg_size_pretty(pg_total_relation_size(\'audit_log\')) → 245 MB', affectedModule: 'SYS', remediation: 'Partition by month + archive, target Part 07', targetPart: 'Part 07' },
];

// ── Conflicts ──
export interface ConflictInfo {
  id: string;
  title: string;
  description: string;
  location1: string;
  location2: string;
  resolution: string;
  targetPart: string;
}

export const conflictsList: ConflictInfo[] = [
  { id: 'CONFLICT-001', title: 'Two vendor master concepts', description: 'vendors table and subcontractors table both store supplier information with overlapping fields', location1: 'vendors table (PROC)', location2: 'subcontractors table (SUB)', resolution: 'Unify under central party master in Part 36', targetPart: 'Part 36' },
  { id: 'CONFLICT-002', title: 'Duplicate role systems', description: 'roles/user_roles tables exist alongside hard-coded role checks in middleware', location1: 'roles table + user_roles', location2: 'server/middleware/auth.js:23', resolution: 'Central RBAC engine in Part 06', targetPart: 'Part 06' },
  { id: 'CONFLICT-003', title: 'Two status patterns', description: 'Some modules use string status ("Open"/"Closed"), others use numeric codes (1/2/3)', location1: 'purchase_orders.status (string)', location2: 'grn_headers.status (integer)', resolution: 'Standardize status enum in Part 04', targetPart: 'Part 04' },
  { id: 'CONFLICT-004', title: 'Duplicate amount calculations', description: 'GST calculated in both frontend and backend with different rounding', location1: 'server/services/taxService.js:28', location2: 'src/utils/tax.js:15', resolution: 'Single source of truth in Part 35', targetPart: 'Part 35' },
  { id: 'CONFLICT-005', title: 'Two notification approaches', description: 'Email via nodemailer directly + Socket.IO push with no unified gateway', location1: 'server/services/mailService.js', location2: 'server/socket/events.js', resolution: 'Communication gateway in Part 09/28', targetPart: 'Part 28' },
];

// ── Control Inventory ──
export interface ControlPointInfo {
  id: string;
  module: string;
  stage: string;
  control: string;
  existingFile: string;
  enforcement: 'hard' | 'soft' | 'none';
  gap: string;
}

export const controlInventory: ControlPointInfo[] = [
  // Procurement
  { id: 'CP-PROC-01', module: 'PROC', stage: 'PLAN', control: 'PR requires project allocation', existingFile: 'server/services/prService.js:45', enforcement: 'hard', gap: 'None — working correctly' },
  { id: 'CP-PROC-02', module: 'PROC', stage: 'AUTHORIZE', control: 'PO requires approval above ₹50,000', existingFile: 'server/services/poService.js:89', enforcement: 'hard', gap: 'No authority limit by role — single approver' },
  { id: 'CP-PROC-03', module: 'PROC', stage: 'EXECUTE', control: 'PO dispatched to vendor', existingFile: 'server/services/poService.js:156', enforcement: 'soft', gap: 'Email only — no delivery confirmation' },
  { id: 'CP-PROC-04', module: 'PROC', stage: 'VERIFY', control: 'GRN matches PO quantity', existingFile: 'server/services/grnService.js:67', enforcement: 'hard', gap: 'No tolerance threshold — exact match only' },
  // Inventory
  { id: 'CP-INV-01', module: 'INV', stage: 'EXECUTE', control: 'Material issue against approved PR', existingFile: 'NONE', enforcement: 'none', gap: 'Issues happen without requisition — CRITICAL' },
  { id: 'CP-INV-02', module: 'INV', stage: 'VERIFY', control: 'Stock cannot go negative', existingFile: 'server/services/stockService.js:112', enforcement: 'hard', gap: 'None — working correctly' },
  { id: 'CP-INV-03', module: 'INV', stage: 'RECONCILE', control: 'Monthly stock reconciliation', existingFile: 'NONE', enforcement: 'none', gap: 'Manual process — no system support' },
  // Finance
  { id: 'CP-FIN-01', module: 'FIN', stage: 'AUTHORIZE', control: 'Bill requires maker-checker', existingFile: 'server/services/billService.js:78', enforcement: 'hard', gap: 'No delegation or escalation' },
  { id: 'CP-FIN-02', module: 'FIN', stage: 'EXECUTE', control: 'Payment matches approved bill', existingFile: 'server/services/paymentService.js:45', enforcement: 'hard', gap: 'No three-way match (PO-GRN-Bill)' },
  { id: 'CP-FIN-03', module: 'FIN', stage: 'RECONCILE', control: 'Bank reconciliation', existingFile: 'NONE', enforcement: 'none', gap: 'Fully manual — no system support' },
  // HR
  { id: 'CP-HR-01', module: 'HR', stage: 'RECORD', control: 'Attendance from biometric device', existingFile: 'server/workers/attendanceSync.js:23', enforcement: 'hard', gap: 'No manual override audit trail' },
  { id: 'CP-HR-02', module: 'HR', stage: 'VERIFY', control: 'Payroll calculation review', existingFile: 'server/services/payrollService.js:189', enforcement: 'soft', gap: 'Review is manual — no system lock' },
  // Projects
  { id: 'CP-PROJ-01', module: 'PROJ', stage: 'PLAN', control: 'BOQ approval before procurement', existingFile: 'server/services/boqService.js:34', enforcement: 'soft', gap: 'Can be bypassed — soft warning only' },
  { id: 'CP-PROJ-02', module: 'PROJ', stage: 'MONITOR', control: 'Budget vs actual tracking', existingFile: 'server/services/projectCostService.js:89', enforcement: 'soft', gap: 'No automatic alerts on overrun' },
];

// ── Workflows Inventory ──
export interface WorkflowInfo {
  id: string;
  name: string;
  module: string;
  stages: string[];
  implementation: string;
  status: 'centralized' | 'scattered' | 'manual';
}

export const workflowsInventory: WorkflowInfo[] = [
  { id: 'WF-001', name: 'PR Approval', module: 'PROC', stages: ['Draft', 'Submitted', 'Approved', 'Converted to PO'], implementation: 'server/services/prService.js', status: 'scattered' },
  { id: 'WF-002', name: 'PO Approval', module: 'PROC', stages: ['Draft', 'Pending Approval', 'Approved', 'Dispatched', 'Closed'], implementation: 'server/services/poService.js', status: 'scattered' },
  { id: 'WF-003', name: 'GRN Processing', module: 'INV', stages: ['Created', 'Quality Check', 'Accepted', 'Posted'], implementation: 'server/services/grnService.js', status: 'scattered' },
  { id: 'WF-004', name: 'Bill Approval', module: 'FIN', stages: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Paid'], implementation: 'server/services/billService.js', status: 'scattered' },
  { id: 'WF-005', name: 'Payment Release', module: 'FIN', stages: ['Prepared', 'Checked', 'Authorized', 'Released'], implementation: 'server/services/paymentService.js', status: 'scattered' },
  { id: 'WF-006', name: 'Material Issue', module: 'INV', stages: ['Requested', 'Approved', 'Issued'], implementation: 'server/services/issueService.js', status: 'manual' },
  { id: 'WF-007', name: 'NCR Resolution', module: 'QA', stages: ['Raised', 'Under Investigation', 'Corrective Action', 'Closed'], implementation: 'Partial — no escalation', status: 'manual' },
  { id: 'WF-008', name: 'Work Permit', module: 'HSE', stages: ['Requested', 'Safety Review', 'Approved', 'Active', 'Closed'], implementation: 'Basic status transitions', status: 'manual' },
];

// ── Socket.IO Events ──
export interface SocketEventInfo {
  namespace: string;
  event: string;
  direction: 'server→client' | 'client→server' | 'bidirectional';
  auth: boolean;
  room: string;
  description: string;
}

export const socketEvents: SocketEventInfo[] = [
  { namespace: '/', event: 'notification:new', direction: 'server→client', auth: true, room: 'user:{userId}', description: 'Push notification to specific user' },
  { namespace: '/', event: 'grn:posted', direction: 'server→client', auth: true, room: 'project:{projectId}', description: 'GRN posted — update stock views' },
  { namespace: '/', event: 'po:status', direction: 'server→client', auth: true, room: 'project:{projectId}', description: 'PO status change notification' },
  { namespace: '/', event: 'approval:required', direction: 'server→client', auth: true, room: 'user:{userId}', description: 'Approval task in user inbox' },
  { namespace: '/', event: 'attendance:synced', direction: 'server→client', auth: true, room: 'site:{siteId}', description: 'Biometric attendance batch synced' },
  { namespace: '/admin', event: 'system:alert', direction: 'server→client', auth: true, room: 'admin', description: 'System-level alerts for admins' },
];

// ── Background Jobs ──
export interface JobInfo {
  name: string;
  schedule: string;
  handler: string;
  status: 'active' | 'failing' | 'disabled';
  description: string;
}

export const backgroundJobs: JobInfo[] = [
  { name: 'attendanceSync', schedule: 'Every 15 min', handler: 'server/workers/attendanceSync.js', status: 'active', description: 'Sync biometric device data to attendance_records' },
  { name: 'emailQueue', schedule: 'Every 1 min', handler: 'server/workers/emailQueue.js', status: 'active', description: 'Process outbound email queue' },
  { name: 'reportGenerator', schedule: 'On-demand + daily 6 AM', handler: 'server/workers/reportGenerator.js', status: 'active', description: 'Generate scheduled reports (PDF/Excel)' },
  { name: 'stockValuation', schedule: 'Month-end (manual trigger)', handler: 'server/workers/valuationWorker.js', status: 'active', description: 'Run FIFO valuation for month-end closing' },
  { name: 'overdueAlerts', schedule: 'Daily 9 AM', handler: 'server/workers/overdueAlerts.js', status: 'failing', description: 'Send overdue PO/delivery alerts — failing since Jan 10' },
  { name: 'dataCleanup', schedule: 'Weekly Sunday 2 AM', handler: 'server/workers/dataCleanup.js', status: 'disabled', description: 'Archive old audit logs — disabled due to bug' },
];
