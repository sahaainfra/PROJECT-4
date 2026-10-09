// ═══════════════════════════════════════════════════════════
// SYSTEM AUDIT DATA — Part 01
// Existing System Audit & Architecture Discovery
// ═══════════════════════════════════════════════════════════

export const stackInfo = {
  frontend: { framework: 'React 18', buildTool: 'Vite', styling: 'Tailwind CSS', state: 'Context API' },
  backend: { framework: 'Node.js', runtime: 'Express', database: 'PostgreSQL', orm: 'Prisma' },
  deployment: { platform: 'Docker', orchestration: 'Kubernetes', ci: 'GitHub Actions' },
  monitoring: { logging: 'Winston', metrics: 'Prometheus', tracing: 'OpenTelemetry' },
};

export const repoStructure = [
  { path: 'src/', type: 'source', description: 'Frontend source code' },
  { path: 'src/pages/', type: 'source', description: 'Page components' },
  { path: 'src/shell/', type: 'source', description: 'Application shell' },
  { path: 'src/core/', type: 'source', description: 'Core services' },
  { path: 'src/data/', type: 'source', description: 'Data models and mock data' },
  { path: 'src/contexts/', type: 'source', description: 'React contexts' },
  { path: 'src/preview/', type: 'source', description: 'Preview environment (Part 02)' },
  { path: 'docs/', type: 'documentation', description: 'Documentation' },
  { path: 'public/', type: 'static', description: 'Static assets' },
];

export const modulesInventory = [
  { name: 'Procurement', status: 'active', tables: 8, apis: 24, screens: 12 },
  { name: 'Inventory', status: 'active', tables: 6, apis: 18, screens: 8 },
  { name: 'Projects', status: 'active', tables: 12, apis: 32, screens: 15 },
  { name: 'Finance', status: 'active', tables: 10, apis: 28, screens: 14 },
  { name: 'HR', status: 'active', tables: 8, apis: 22, screens: 10 },
  { name: 'Administration', status: 'active', tables: 15, apis: 40, screens: 20 },
];

export const databaseTables = [
  { name: 'companies', rows: 1, size: '12 KB' },
  { name: 'projects', rows: 5, size: '48 KB' },
  { name: 'sites', rows: 4, size: '32 KB' },
  { name: 'purchase_orders', rows: 142, size: '256 KB' },
  { name: 'purchase_requisitions', rows: 89, size: '128 KB' },
  { name: 'vendors', rows: 245, size: '192 KB' },
  { name: 'grn_headers', rows: 89, size: '96 KB' },
  { name: 'stock_ledger', rows: 12450, size: '2.1 MB' },
  { name: 'users', rows: 186, size: '64 KB' },
  { name: 'roles', rows: 20, size: '8 KB' },
  { name: 'audit_log', rows: 425680, size: '245 MB' },
];

export const apiInventory = [
  { method: 'GET', path: '/api/v1/projects', auth: true, permissions: true, module: 'Projects' },
  { method: 'POST', path: '/api/v1/projects', auth: true, permissions: true, module: 'Projects' },
  { method: 'GET', path: '/api/v1/purchase-orders', auth: true, permissions: true, module: 'Procurement' },
  { method: 'POST', path: '/api/v1/purchase-orders', auth: true, permissions: true, module: 'Procurement' },
  { method: 'GET', path: '/api/v1/grn', auth: true, permissions: true, module: 'Inventory' },
  { method: 'POST', path: '/api/v1/grn', auth: true, permissions: true, module: 'Inventory' },
  { method: 'GET', path: '/api/v1/bills', auth: true, permissions: true, module: 'Finance' },
  { method: 'POST', path: '/api/v1/bills/:id/approve', auth: true, permissions: true, module: 'Finance' },
  { method: 'GET', path: '/api/v1/attendance', auth: true, permissions: true, module: 'HR' },
  { method: 'POST', path: '/api/v1/attendance/mark', auth: true, permissions: true, module: 'HR' },
];

export const calculationsInventory = [
  { id: 'CALC-001', name: 'PO Line Amount', formula: 'qty × rate', file: 'poService.js', line: '142', usedBy: ['PO creation', 'GRN matching'], example: '100 bags × ₹380 = ₹38,000', protected: true },
  { id: 'CALC-002', name: 'GST Calculation', formula: 'taxable_value × (cgst_rate + sgst_rate) / 100', file: 'taxService.js', line: '28', usedBy: ['PO total', 'Bill processing'], example: '₹38,000 × 18% = ₹6,840', protected: true },
  { id: 'CALC-003', name: 'TDS Deduction', formula: 'gross_amount × tds_rate / 100', file: 'tdsService.js', line: '45', usedBy: ['Bill approval', 'Payment'], example: '₹4,85,000 × 10% = ₹48,500', protected: true },
  { id: 'CALC-004', name: 'Stock Valuation (FIFO)', formula: 'Σ(receipt_qty × receipt_rate)', file: 'valuationService.js', line: '89', usedBy: ['Material issue', 'Stock report'], example: '500 bags: 200@₹380 + 300@₹385 = ₹1,91,500', protected: true },
  { id: 'CALC-005', name: 'Payroll Net Salary', formula: 'basic + da + hra - pf - esi - tds', file: 'payrollService.js', line: '156', usedBy: ['Monthly payroll'], example: '₹25,000 + 5,000 + 3,000 - 1,800 - 750 - 2,500 = ₹27,950', protected: true },
];

export const dependencyMap = [
  { from: 'PROC', to: 'INV', type: 'event', description: 'PO approved → GRN expected', risk: 'medium' },
  { from: 'PROC', to: 'FIN', type: 'data', description: 'PO → bill matching', risk: 'medium' },
  { from: 'INV', to: 'PROJ', type: 'data', description: 'Material issue charged to project', risk: 'high' },
  { from: 'PROJ', to: 'FIN', type: 'data', description: 'Project cost centers', risk: 'high' },
  { from: 'SUB', to: 'FIN', type: 'api', description: 'Work order → bill → payment', risk: 'high' },
];

export const gapMatrix = [
  { part: 'Part 03', title: 'Quality Gates', coveragePercent: 40, decision: 'EXTEND', reusable: ['CI pipeline'], missing: ['Gate report generator'], risks: ['No regression harness'] },
  { part: 'Part 04', title: 'Shared Services', coveragePercent: 30, decision: 'EXTEND', reusable: ['Auth middleware'], missing: ['Service hooks'], risks: ['Inconsistent services'] },
  { part: 'Part 06', title: 'RBAC', coveragePercent: 50, decision: 'EXTEND', reusable: ['roles table'], missing: ['Field-level perms'], risks: ['UI-only checks'] },
  { part: 'Part 08', title: 'Security Pipeline', coveragePercent: 35, decision: 'NEW', reusable: ['JWT auth'], missing: ['Zero-trust middleware'], risks: ['Secrets in env'] },
];

export const riskRegister = [
  { id: 'RISK-001', category: 'data', severity: 'high', title: 'Duplicate vendor records', description: '12 vendors have duplicate GSTIN', evidence: 'SELECT gstin, COUNT(*) FROM vendors GROUP BY gstin HAVING COUNT(*) > 1', affectedModule: 'PROC', remediation: 'Deduplication script', targetPart: 'Part 36' },
  { id: 'RISK-002', category: 'performance', severity: 'high', title: 'Missing index on material_issues', description: 'Project-wise consumption report slow', evidence: 'EXPLAIN ANALYZE shows seq scan', affectedModule: 'INV', remediation: 'Add index', targetPart: 'Part 116' },
  { id: 'RISK-003', category: 'security', severity: 'critical', title: 'UI-only permission check', description: 'Material issue API lacks server check', evidence: 'server/routes/issue.js:45', affectedModule: 'INV', remediation: 'Add service check', targetPart: 'Part 06' },
];

export const conflictsList = [
  { id: 'CONFLICT-001', title: 'Two vendor masters', description: 'vendors and subcontractors overlap', location1: 'vendors table', location2: 'subcontractors table', resolution: 'Unify in Part 36', targetPart: 'Part 36' },
  { id: 'CONFLICT-002', title: 'Duplicate role systems', description: 'roles table + hard-coded checks', location1: 'roles table', location2: 'middleware/auth.js', resolution: 'Central RBAC in Part 06', targetPart: 'Part 06' },
];

export const controlInventory = [
  { id: 'CP-PROC-01', module: 'PROC', stage: 'PLAN', control: 'PR requires project allocation', existingFile: 'prService.js:45', enforcement: 'hard', gap: 'None' },
  { id: 'CP-PROC-02', module: 'PROC', stage: 'AUTHORIZE', control: 'PO requires approval', existingFile: 'poService.js:89', enforcement: 'hard', gap: 'No authority limit' },
  { id: 'CP-INV-01', module: 'INV', stage: 'EXECUTE', control: 'Issue against approved PR', existingFile: 'NONE', enforcement: 'none', gap: 'CRITICAL: No control' },
  { id: 'CP-FIN-01', module: 'FIN', stage: 'AUTHORIZE', control: 'Bill maker-checker', existingFile: 'billService.js:78', enforcement: 'hard', gap: 'No delegation' },
];

export const workflowsInventory = [
  { id: 'WF-001', name: 'PR Approval', module: 'PROC', stages: ['Draft', 'Submitted', 'Approved', 'Converted'], implementation: 'prService.js', status: 'scattered' },
  { id: 'WF-002', name: 'PO Approval', module: 'PROC', stages: ['Draft', 'Pending', 'Approved', 'Dispatched'], implementation: 'poService.js', status: 'scattered' },
  { id: 'WF-003', name: 'Bill Approval', module: 'FIN', stages: ['Draft', 'Submitted', 'Approved', 'Paid'], implementation: 'billService.js', status: 'scattered' },
];

export const socketEvents = [
  { namespace: '/', event: 'notification:new', direction: 'server→client', auth: true, room: 'user:{userId}', description: 'Push notification' },
  { namespace: '/', event: 'grn:posted', direction: 'server→client', auth: true, room: 'project:{projectId}', description: 'GRN posted update' },
  { namespace: '/', event: 'approval:required', direction: 'server→client', auth: true, room: 'user:{userId}', description: 'Approval task' },
];

export const backgroundJobs = [
  { name: 'attendanceSync', schedule: 'Every 15 min', handler: 'attendanceSync.js', status: 'active', description: 'Sync biometric data' },
  { name: 'emailQueue', schedule: 'Every 1 min', handler: 'emailQueue.js', status: 'active', description: 'Process email queue' },
  { name: 'reportGenerator', schedule: 'Daily 6 AM', handler: 'reportGenerator.js', status: 'active', description: 'Generate scheduled reports' },
  { name: 'overdueAlerts', schedule: 'Daily 9 AM', handler: 'overdueAlerts.js', status: 'failing', description: 'Send overdue alerts' },
];
