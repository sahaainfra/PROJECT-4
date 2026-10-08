// ═══════════════════════════════════════════════════════════
// IAM DATA — Part 06
// User, Role & Permission Architecture (Enterprise RBAC)
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// PERMISSION REGISTRY
// ═══════════════════════════════════════════════════════════

export interface Permission {
  key: string;
  module: string;
  feature: string;
  action: string;
  description: string;
  isSensitive: boolean;
  defaultScope: 'company' | 'branch' | 'department' | 'project' | 'site' | 'own';
  pcStage?: 'PLAN' | 'AUTHORIZE' | 'EXECUTE' | 'RECORD' | 'VERIFY' | 'ANALYZE' | 'CONTROL' | 'CLOSE';
}

export const permissions: Permission[] = [
  // Shell & Navigation
  { key: 'shell.home.view', module: 'shell', feature: 'home', action: 'view', description: 'View home dashboard', isSensitive: false, defaultScope: 'company', pcStage: 'PLAN' },
  { key: 'shell.search.use', module: 'shell', feature: 'search', action: 'use', description: 'Use global search', isSensitive: false, defaultScope: 'company' },
  
  // Procurement Module
  { key: 'procurement.module.view', module: 'procurement', feature: 'module', action: 'view', description: 'Access procurement module', isSensitive: false, defaultScope: 'company' },
  { key: 'procurement.pr.view', module: 'procurement', feature: 'pr', action: 'view', description: 'View purchase requisitions', isSensitive: false, defaultScope: 'project' },
  { key: 'procurement.pr.create', module: 'procurement', feature: 'pr', action: 'create', description: 'Create purchase requisition', isSensitive: false, defaultScope: 'project', pcStage: 'PLAN' },
  { key: 'procurement.pr.approve', module: 'procurement', feature: 'pr', action: 'approve', description: 'Approve purchase requisition', isSensitive: false, defaultScope: 'project', pcStage: 'AUTHORIZE' },
  { key: 'procurement.po.view', module: 'procurement', feature: 'po', action: 'view', description: 'View purchase orders', isSensitive: false, defaultScope: 'project' },
  { key: 'procurement.po.create', module: 'procurement', feature: 'po', action: 'create', description: 'Create purchase order', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'procurement.po.approve', module: 'procurement', feature: 'po', action: 'approve', description: 'Approve purchase order', isSensitive: false, defaultScope: 'project', pcStage: 'AUTHORIZE' },
  { key: 'procurement.vendor.view', module: 'procurement', feature: 'vendor', action: 'view', description: 'View vendors', isSensitive: false, defaultScope: 'company' },
  { key: 'procurement.vendor.create', module: 'procurement', feature: 'vendor', action: 'create', description: 'Create vendor', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  
  // Inventory Module
  { key: 'inventory.module.view', module: 'inventory', feature: 'module', action: 'view', description: 'Access inventory module', isSensitive: false, defaultScope: 'company' },
  { key: 'inventory.grn.view', module: 'inventory', feature: 'grn', action: 'view', description: 'View goods receipt notes', isSensitive: false, defaultScope: 'site' },
  { key: 'inventory.grn.create', module: 'inventory', feature: 'grn', action: 'create', description: 'Create goods receipt note', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  { key: 'inventory.stock.view', module: 'inventory', feature: 'stock', action: 'view', description: 'View stock register', isSensitive: false, defaultScope: 'site' },
  { key: 'inventory.issue.create', module: 'inventory', feature: 'issue', action: 'create', description: 'Create material issue', isSensitive: false, defaultScope: 'site', pcStage: 'EXECUTE' },
  
  // Projects Module
  { key: 'project.module.view', module: 'project', feature: 'module', action: 'view', description: 'Access projects module', isSensitive: false, defaultScope: 'company' },
  { key: 'project.view', module: 'project', feature: 'project', action: 'view', description: 'View project details', isSensitive: false, defaultScope: 'project' },
  { key: 'project.create', module: 'project', feature: 'project', action: 'create', description: 'Create project', isSensitive: false, defaultScope: 'company', pcStage: 'PLAN' },
  { key: 'project.edit', module: 'project', feature: 'project', action: 'edit', description: 'Edit project', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  { key: 'project.boq.view', module: 'project', feature: 'boq', action: 'view', description: 'View BOQ', isSensitive: false, defaultScope: 'project' },
  { key: 'project.boq.edit', module: 'project', feature: 'boq', action: 'edit', description: 'Edit BOQ', isSensitive: false, defaultScope: 'project', pcStage: 'EXECUTE' },
  
  // Finance Module
  { key: 'finance.module.view', module: 'finance', feature: 'module', action: 'view', description: 'Access finance module', isSensitive: false, defaultScope: 'company' },
  { key: 'finance.bills.view', module: 'finance', feature: 'bills', action: 'view', description: 'View subcontractor bills', isSensitive: false, defaultScope: 'project' },
  { key: 'finance.bills.approve', module: 'finance', feature: 'bills', action: 'approve', description: 'Approve subcontractor bill', isSensitive: false, defaultScope: 'project', pcStage: 'AUTHORIZE' },
  { key: 'finance.payment.create', module: 'finance', feature: 'payment', action: 'create', description: 'Create payment', isSensitive: true, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'finance.payment.approve', module: 'finance', feature: 'payment', action: 'approve', description: 'Approve payment', isSensitive: true, defaultScope: 'company', pcStage: 'AUTHORIZE' },
  
  // HR Module
  { key: 'hr.module.view', module: 'hr', feature: 'module', action: 'view', description: 'Access HR module', isSensitive: false, defaultScope: 'company' },
  { key: 'hr.attendance.view', module: 'hr', feature: 'attendance', action: 'view', description: 'View attendance', isSensitive: false, defaultScope: 'site' },
  { key: 'hr.attendance.mark', module: 'hr', feature: 'attendance', action: 'mark', description: 'Mark attendance', isSensitive: false, defaultScope: 'site', pcStage: 'RECORD' },
  { key: 'hr.payroll.view', module: 'hr', feature: 'payroll', action: 'view', description: 'View payroll', isSensitive: true, defaultScope: 'company' },
  { key: 'hr.payroll.process', module: 'hr', feature: 'payroll', action: 'process', description: 'Process payroll', isSensitive: true, defaultScope: 'company', pcStage: 'EXECUTE' },
  
  // Reports Module
  { key: 'reports.module.view', module: 'reports', feature: 'module', action: 'view', description: 'Access reports module', isSensitive: false, defaultScope: 'company' },
  { key: 'reports.generate', module: 'reports', feature: 'report', action: 'generate', description: 'Generate reports', isSensitive: false, defaultScope: 'company' },
  
  // Administration - Organization (Part 05)
  { key: 'admin.module.view', module: 'admin', feature: 'module', action: 'view', description: 'Access administration', isSensitive: false, defaultScope: 'company' },
  { key: 'org.structure.view', module: 'admin', feature: 'org', action: 'view', description: 'View organization structure', isSensitive: false, defaultScope: 'company' },
  { key: 'org.structure.edit', module: 'admin', feature: 'org', action: 'edit', description: 'Edit organization structure', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'org.project.view', module: 'admin', feature: 'org', action: 'view', description: 'View all projects', isSensitive: false, defaultScope: 'company' },
  { key: 'org.project.create', module: 'admin', feature: 'org', action: 'create', description: 'Create project', isSensitive: false, defaultScope: 'company', pcStage: 'PLAN' },
  { key: 'org.project.edit', module: 'admin', feature: 'org', action: 'edit', description: 'Edit project', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'org.allocation.view', module: 'admin', feature: 'org', action: 'view', description: 'View allocations', isSensitive: false, defaultScope: 'company' },
  { key: 'org.allocation.assign', module: 'admin', feature: 'org', action: 'assign', description: 'Assign allocations', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  
  // Administration - IAM (Part 06)
  { key: 'iam.role.view', module: 'admin', feature: 'iam', action: 'view', description: 'View roles', isSensitive: false, defaultScope: 'company' },
  { key: 'iam.role.create', module: 'admin', feature: 'iam', action: 'create', description: 'Create role', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'iam.role.edit', module: 'admin', feature: 'iam', action: 'edit', description: 'Edit role', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'iam.assignment.view', module: 'admin', feature: 'iam', action: 'view', description: 'View user assignments', isSensitive: false, defaultScope: 'company' },
  { key: 'iam.assignment.create', module: 'admin', feature: 'iam', action: 'create', description: 'Create user assignment', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'iam.assignment.edit', module: 'admin', feature: 'iam', action: 'edit', description: 'Edit user assignment', isSensitive: false, defaultScope: 'company', pcStage: 'EXECUTE' },
  { key: 'iam.permission.view', module: 'admin', feature: 'iam', action: 'view', description: 'View permissions', isSensitive: false, defaultScope: 'company' },
  { key: 'iam.effective.view', module: 'admin', feature: 'iam', action: 'view', description: 'View effective permissions', isSensitive: false, defaultScope: 'company' },
  
  // Technical Console (Part 00-04)
  { key: 'tech.console.view', module: 'tech', feature: 'console', action: 'view', description: 'Access technical console', isSensitive: false, defaultScope: 'company' },
  
  // Preview (Part 02)
  { key: 'preview.view', module: 'preview', feature: 'dashboard', action: 'view', description: 'Access preview dashboard', isSensitive: false, defaultScope: 'company' },
];

// ═══════════════════════════════════════════════════════════
// SYSTEM ROLES
// ═══════════════════════════════════════════════════════════

export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  isSystem: boolean;
  maxScope: 'company' | 'branch' | 'department' | 'project' | 'site' | 'own';
  category: 'administrative' | 'management' | 'operational' | 'external';
}

export const roles: Role[] = [
  // Administrative
  { id: 'role-001', code: 'SUPER_ADMIN', name: 'Super Admin', description: 'Full system access', isSystem: true, maxScope: 'company', category: 'administrative' },
  { id: 'role-002', code: 'MANAGEMENT', name: 'Management / CFO', description: 'Executive management access', isSystem: true, maxScope: 'company', category: 'management' },
  { id: 'role-003', code: 'AUDITOR', name: 'Auditor', description: 'Read-only audit access', isSystem: true, maxScope: 'company', category: 'administrative' },
  
  // Management
  { id: 'role-004', code: 'PROJECT_MANAGER', name: 'Project Manager', description: 'Project-level management', isSystem: true, maxScope: 'project', category: 'management' },
  { id: 'role-005', code: 'COMMERCIAL_MANAGER', name: 'Commercial Manager', description: 'Commercial and contracts management', isSystem: true, maxScope: 'project', category: 'management' },
  { id: 'role-006', code: 'PROCUREMENT_MANAGER', name: 'Procurement Manager', description: 'Procurement management', isSystem: true, maxScope: 'company', category: 'management' },
  { id: 'role-007', code: 'HR_MANAGER', name: 'HR Manager', description: 'Human resources management', isSystem: true, maxScope: 'company', category: 'management' },
  { id: 'role-008', code: 'ACCOUNTS_MANAGER', name: 'Accounts Manager', description: 'Financial accounts management', isSystem: true, maxScope: 'company', category: 'management' },
  { id: 'role-009', code: 'QS_MANAGER', name: 'QS / Quantity Surveyor', description: 'Quantity surveying and estimation', isSystem: true, maxScope: 'project', category: 'management' },
  
  // Operational
  { id: 'role-010', code: 'SITE_ENGINEER', name: 'Site Engineer', description: 'Site-level execution', isSystem: true, maxScope: 'site', category: 'operational' },
  { id: 'role-011', code: 'STORE_KEEPER', name: 'Store Keeper', description: 'Store and inventory management', isSystem: true, maxScope: 'site', category: 'operational' },
  { id: 'role-012', code: 'PLANT_MANAGER', name: 'Plant / Machinery Manager', description: 'Equipment and plant management', isSystem: true, maxScope: 'project', category: 'operational' },
  { id: 'role-013', code: 'QA_ENGINEER', name: 'QA / QC Engineer', description: 'Quality assurance and control', isSystem: true, maxScope: 'site', category: 'operational' },
  { id: 'role-014', code: 'HSE_OFFICER', name: 'HSE Officer', description: 'Health, safety and environment', isSystem: true, maxScope: 'site', category: 'operational' },
  { id: 'role-015', code: 'PLANNING_ENGINEER', name: 'Planning Engineer', description: 'Project planning and scheduling', isSystem: true, maxScope: 'project', category: 'operational' },
  
  // Self-Service
  { id: 'role-016', code: 'EMPLOYEE', name: 'Employee', description: 'Employee self-service', isSystem: true, maxScope: 'own', category: 'operational' },
  { id: 'role-017', code: 'LABOUR', name: 'Labour', description: 'Labour self-service', isSystem: true, maxScope: 'own', category: 'operational' },
  
  // External Portal
  { id: 'role-018', code: 'VENDOR', name: 'Vendor', description: 'Vendor portal access', isSystem: true, maxScope: 'own', category: 'external' },
  { id: 'role-019', code: 'SUBCONTRACTOR', name: 'Subcontractor', description: 'Subcontractor portal access', isSystem: true, maxScope: 'own', category: 'external' },
  { id: 'role-020', code: 'CLIENT', name: 'Client', description: 'Client portal access', isSystem: true, maxScope: 'project', category: 'external' },
];

// ═══════════════════════════════════════════════════════════
// ROLE-PERMISSION MAPPINGS
// ═══════════════════════════════════════════════════════════

export interface RolePermission {
  roleId: string;
  permissionKey: string;
  effect: 'allow' | 'deny';
  scopeType: 'company' | 'branch' | 'department' | 'project' | 'site' | 'own';
  conditions?: Record<string, any>;
}

export const rolePermissions: RolePermission[] = [
  // Super Admin - All permissions
  ...permissions.map(p => ({
    roleId: 'role-001',
    permissionKey: p.key,
    effect: 'allow' as const,
    scopeType: 'company' as const,
  })),
  
  // Management - Most permissions except IAM
  ...permissions
    .filter(p => !p.key.startsWith('iam.') && !p.key.startsWith('tech.'))
    .map(p => ({
      roleId: 'role-002',
      permissionKey: p.key,
      effect: 'allow' as const,
      scopeType: 'company' as const,
    })),
  
  // Auditor - Read-only
  ...permissions
    .filter(p => p.action === 'view')
    .map(p => ({
      roleId: 'role-003',
      permissionKey: p.key,
      effect: 'allow' as const,
      scopeType: 'company' as const,
    })),
  
  // Project Manager - Project-scoped permissions
  ...permissions
    .filter(p => ['shell.', 'project.', 'procurement.', 'inventory.', 'finance.', 'hr.', 'reports.'].some(prefix => p.key.startsWith(prefix)))
    .map(p => ({
      roleId: 'role-004',
      permissionKey: p.key,
      effect: 'allow' as const,
      scopeType: 'project' as const,
    })),
  
  // Site Engineer - Site-scoped operational permissions
  ...permissions
    .filter(p => ['shell.', 'project.view', 'inventory.grn', 'inventory.stock', 'hr.attendance'].some(prefix => p.key.startsWith(prefix)))
    .map(p => ({
      roleId: 'role-010',
      permissionKey: p.key,
      effect: 'allow' as const,
      scopeType: 'site' as const,
    })),
  
  // Store Keeper - Inventory permissions
  ...permissions
    .filter(p => ['shell.', 'inventory.'].some(prefix => p.key.startsWith(prefix)))
    .map(p => ({
      roleId: 'role-011',
      permissionKey: p.key,
      effect: 'allow' as const,
      scopeType: 'site' as const,
    })),
  
  // HR Manager - HR permissions
  ...permissions
    .filter(p => ['shell.', 'hr.', 'reports.'].some(prefix => p.key.startsWith(prefix)))
    .map(p => ({
      roleId: 'role-007',
      permissionKey: p.key,
      effect: 'allow' as const,
      scopeType: 'company' as const,
    })),
  
  // Employee - Self-service only
  { roleId: 'role-016', permissionKey: 'shell.home.view', effect: 'allow', scopeType: 'own' },
  { roleId: 'role-016', permissionKey: 'hr.attendance.view', effect: 'allow', scopeType: 'own' },
  { roleId: 'role-016', permissionKey: 'hr.payroll.view', effect: 'allow', scopeType: 'own' },
];

// ═══════════════════════════════════════════════════════════
// USER-ROLE ASSIGNMENTS
// ═══════════════════════════════════════════════════════════

export interface UserRoleAssignment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  roleId: string;
  roleName: string;
  scopeType: 'company' | 'branch' | 'department' | 'project' | 'site' | 'own';
  scopeId?: string;
  scopeName?: string;
  validFrom: string;
  validTo?: string;
  assignedBy: string;
  reason: string;
  isActive: boolean;
}

export const userRoleAssignments: UserRoleAssignment[] = [
  {
    id: 'assign-001',
    userId: 'user-001',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    roleId: 'role-001',
    roleName: 'Super Admin',
    scopeType: 'company',
    scopeId: 'company-001',
    scopeName: 'Acme Infrastructure Ltd',
    validFrom: '2023-01-01',
    assignedBy: 'System',
    reason: 'Initial system setup',
    isActive: true,
  },
  {
    id: 'assign-002',
    userId: 'user-002',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@acme-infra.com',
    roleId: 'role-002',
    roleName: 'Management / CFO',
    scopeType: 'company',
    scopeId: 'company-001',
    scopeName: 'Acme Infrastructure Ltd',
    validFrom: '2023-01-01',
    assignedBy: 'Rajesh Kumar',
    reason: 'CFO appointment',
    isActive: true,
  },
  {
    id: 'assign-003',
    userId: 'user-010',
    userName: 'Rajesh Kumar',
    userEmail: 'rajesh.kumar@acme-infra.com',
    roleId: 'role-004',
    roleName: 'Project Manager',
    scopeType: 'project',
    scopeId: 'project-001',
    scopeName: 'Riverside Tower - Phase II',
    validFrom: '2023-04-01',
    assignedBy: 'Priya Sharma',
    reason: 'Project assignment',
    isActive: true,
  },
  {
    id: 'assign-004',
    userId: 'user-017',
    userName: 'Suresh Kumar',
    userEmail: 'suresh.kumar@acme-infra.com',
    roleId: 'role-010',
    roleName: 'Site Engineer',
    scopeType: 'site',
    scopeId: 'site-001',
    scopeName: 'Main Construction Site',
    validFrom: '2023-04-01',
    assignedBy: 'Rajesh Kumar',
    reason: 'Site deployment',
    isActive: true,
  },
  {
    id: 'assign-005',
    userId: 'user-018',
    userName: 'Mohan Das',
    userEmail: 'mohan.das@acme-infra.com',
    roleId: 'role-011',
    roleName: 'Store Keeper',
    scopeType: 'site',
    scopeId: 'site-002',
    scopeName: 'Batch Plant & Storage Yard',
    validFrom: '2023-04-15',
    assignedBy: 'Rajesh Kumar',
    reason: 'Store assignment',
    isActive: true,
  },
  {
    id: 'assign-006',
    userId: 'user-007',
    userName: 'Meena Joshi',
    userEmail: 'meena.joshi@acme-infra.com',
    roleId: 'role-007',
    roleName: 'HR Manager',
    scopeType: 'company',
    scopeId: 'company-001',
    scopeName: 'Acme Infrastructure Ltd',
    validFrom: '2023-01-01',
    assignedBy: 'Priya Sharma',
    reason: 'HR Manager appointment',
    isActive: true,
  },
];

// ═══════════════════════════════════════════════════════════
// SOD (SEGREGATION OF DUTIES) RULES
// ═══════════════════════════════════════════════════════════

export interface SoDRule {
  id: string;
  code: string;
  permissionA: string;
  permissionB: string;
  scope: 'user' | 'project' | 'site' | 'company';
  severity: 'block' | 'warn';
  description: string;
}

export const sodRules: SoDRule[] = [
  {
    id: 'sod-001',
    code: 'PO_CREATE_APPROVE',
    permissionA: 'procurement.po.create',
    permissionB: 'procurement.po.approve',
    scope: 'project',
    severity: 'block',
    description: 'Cannot create and approve purchase orders in same project',
  },
  {
    id: 'sod-002',
    code: 'PR_CREATE_APPROVE',
    permissionA: 'procurement.pr.create',
    permissionB: 'procurement.pr.approve',
    scope: 'project',
    severity: 'block',
    description: 'Cannot create and approve purchase requisitions in same project',
  },
  {
    id: 'sod-003',
    code: 'BILL_CREATE_APPROVE',
    permissionA: 'finance.bills.create',
    permissionB: 'finance.bills.approve',
    scope: 'project',
    severity: 'block',
    description: 'Cannot create and approve bills in same project',
  },
  {
    id: 'sod-004',
    code: 'PAYMENT_CREATE_APPROVE',
    permissionA: 'finance.payment.create',
    permissionB: 'finance.payment.approve',
    scope: 'company',
    severity: 'block',
    description: 'Cannot create and approve payments',
  },
  {
    id: 'sod-005',
    code: 'VENDOR_PO',
    permissionA: 'procurement.vendor.create',
    permissionB: 'procurement.po.create',
    scope: 'company',
    severity: 'warn',
    description: 'Vendor master and PO creation should be separated',
  },
];

// ═══════════════════════════════════════════════════════════
// FIELD POLICIES
// ═══════════════════════════════════════════════════════════

export interface FieldPolicy {
  id: string;
  entity: string;
  field: string;
  permissionKeyToView: string;
  permissionKeyToEdit: string;
  maskType: 'full' | 'partial' | 'hash';
}

export const fieldPolicies: FieldPolicy[] = [
  {
    id: 'fp-001',
    entity: 'employee',
    field: 'salary',
    permissionKeyToView: 'hr.payroll.view',
    permissionKeyToEdit: 'hr.payroll.process',
    maskType: 'full',
  },
  {
    id: 'fp-002',
    entity: 'employee',
    field: 'bankAccount',
    permissionKeyToView: 'hr.payroll.view',
    permissionKeyToEdit: 'hr.payroll.process',
    maskType: 'partial',
  },
  {
    id: 'fp-003',
    entity: 'vendor',
    field: 'panNumber',
    permissionKeyToView: 'procurement.vendor.view',
    permissionKeyToEdit: 'procurement.vendor.create',
    maskType: 'partial',
  },
  {
    id: 'fp-004',
    entity: 'vendor',
    field: 'gstin',
    permissionKeyToView: 'procurement.vendor.view',
    permissionKeyToEdit: 'procurement.vendor.create',
    maskType: 'partial',
  },
];

// ═══════════════════════════════════════════════════════════
// USERS (Sample)
// ═══════════════════════════════════════════════════════════

export interface User {
  id: string;
  name: string;
  email: string;
  employeeCode: string;
  department?: string;
  isActive: boolean;
  lastLogin?: string;
}

export const users: User[] = [
  { id: 'user-001', name: 'Rajesh Kumar', email: 'rajesh.kumar@acme-infra.com', employeeCode: 'EMP001', department: 'Management', isActive: true, lastLogin: '2024-01-15 10:30' },
  { id: 'user-002', name: 'Priya Sharma', email: 'priya.sharma@acme-infra.com', employeeCode: 'EMP002', department: 'Finance', isActive: true, lastLogin: '2024-01-15 09:15' },
  { id: 'user-007', name: 'Meena Joshi', email: 'meena.joshi@acme-infra.com', employeeCode: 'EMP007', department: 'HR', isActive: true, lastLogin: '2024-01-15 08:45' },
  { id: 'user-010', name: 'Rajesh Kumar', email: 'rajesh.kumar@acme-infra.com', employeeCode: 'EMP010', department: 'Projects', isActive: true, lastLogin: '2024-01-15 10:30' },
  { id: 'user-017', name: 'Suresh Kumar', email: 'suresh.kumar@acme-infra.com', employeeCode: 'EMP017', department: 'Site Execution', isActive: true, lastLogin: '2024-01-15 07:30' },
  { id: 'user-018', name: 'Mohan Das', email: 'mohan.das@acme-infra.com', employeeCode: 'EMP018', department: 'Stores', isActive: true, lastLogin: '2024-01-15 08:00' },
  { id: 'user-019', name: 'Anil Sharma', email: 'anil.sharma@acme-infra.com', employeeCode: 'EMP019', department: 'Site Execution', isActive: true, lastLogin: '2024-01-14 17:30' },
  { id: 'user-020', name: 'Vijay Patil', email: 'vijay.patil@acme-infra.com', employeeCode: 'EMP020', department: 'Site Execution', isActive: true, lastLogin: '2024-01-15 09:00' },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getPermissionByKey(key: string): Permission | undefined {
  return permissions.find(p => p.key === key);
}

export function getRoleById(id: string): Role | undefined {
  return roles.find(r => r.id === id);
}

export function getRoleByCode(code: string): Role | undefined {
  return roles.find(r => r.code === code);
}

export function getUserPermissions(userId: string): string[] {
  const userAssignments = userRoleAssignments.filter(a => a.userId === userId && a.isActive);
  const permissionKeys = new Set<string>();
  
  userAssignments.forEach(assignment => {
    const rolePerms = rolePermissions.filter(rp => rp.roleId === assignment.roleId);
    rolePerms.forEach(rp => {
      if (rp.effect === 'allow') {
        permissionKeys.add(rp.permissionKey);
      }
    });
  });
  
  return Array.from(permissionKeys);
}

export function getUserRoles(userId: string): UserRoleAssignment[] {
  return userRoleAssignments.filter(a => a.userId === userId && a.isActive);
}

export function getPermissionsByModule(module: string): Permission[] {
  return permissions.filter(p => p.module === module);
}

export function getRolesByCategory(category: Role['category']): Role[] {
  return roles.filter(r => r.category === category);
}
