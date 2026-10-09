// ═══════════════════════════════════════════════════════════
// CI/CD DATA — Part 03: Quality Gates & Release Engineering
// Technical Console data for release management
// ═══════════════════════════════════════════════════════════

export type ReleaseStatus = 'DRAFT' | 'CANDIDATE' | 'STAGING_VERIFIED' | 'APPROVED' | 'DEPLOYING' | 'LIVE' | 'ROLLED_BACK';
export type GateStatus = 'PASS' | 'FAIL' | 'WARN' | 'SKIP' | 'RUNNING' | 'PENDING';
export type FlagStatus = 'ACTIVE' | 'INACTIVE' | 'KILLED';

export interface Release {
  id: string;
  version: string;
  commitSha: string;
  parts: string[];
  status: ReleaseStatus;
  risk: 'low' | 'medium' | 'high' | 'critical';
  rollbackPlan: string;
  approvedBy?: string;
  approvedAt?: string;
  deployedAt?: string;
  author: string;
  createdAt: string;
  environment: 'staging' | 'production';
  leadTimeHours: number;
  changeFailureRate: number;
}

export interface GateRun {
  id: string;
  releaseId: string;
  gate: string;
  status: GateStatus;
  duration: string;
  metrics: Record<string, any>;
  reportFile?: string;
  startedAt: string;
  finishedAt?: string;
}

export interface FeatureFlag {
  key: string;
  partNo: string;
  owner: string;
  description: string;
  defaultByEnv: {
    development: boolean;
    staging: boolean;
    production: boolean;
  };
  targeting: string;
  killSwitch: boolean;
  status: FlagStatus;
  lastChanged: string;
  changedBy: string;
  staleDays: number;
}

export interface FlagChange {
  id: string;
  flagKey: string;
  environment: string;
  oldValue: boolean;
  newValue: boolean;
  reason: string;
  changedBy: string;
  changedAt: string;
}

export interface QuarantineEntry {
  id: string;
  testId: string;
  testName: string;
  reason: string;
  owner: string;
  expiresAt: string;
  status: 'QUARANTINED' | 'FIXED' | 'REMOVED';
  quarantinedAt: string;
}

export interface EvidenceBundle {
  partNo: string;
  partTitle: string;
  status: 'COMPLETE' | 'IN_PROGRESS' | 'PENDING';
  testReports: number;
  coveragePercent: number;
  contractDiff: 'CLEAN' | 'BREAKING' | 'PENDING';
  schemaDiff: 'CLEAN' | 'CHANGES' | 'PENDING';
  screenshots: number;
  auditRecord: boolean;
  traceability: number;
  lastUpdated: string;
}

// ═══════════════════════════════════════════════════════════
// RELEASES
// ═══════════════════════════════════════════════════════════

export const releases: Release[] = [
  {
    id: 'rel-001',
    version: 'v1.12.0',
    commitSha: 'a3f8c2d',
    parts: ['Part 00', 'Part 01', 'Part 02'],
    status: 'LIVE',
    risk: 'low',
    rollbackPlan: 'Revert to v1.11.3, restore DB backup from 2024-01-14 22:00',
    approvedBy: 'Priya Sharma (Release Manager)',
    approvedAt: '2024-01-15 09:30',
    deployedAt: '2024-01-15 10:15',
    author: 'Rajesh Kumar',
    createdAt: '2024-01-14 14:00',
    environment: 'production',
    leadTimeHours: 20.25,
    changeFailureRate: 0,
  },
  {
    id: 'rel-002',
    version: 'v1.13.0',
    commitSha: 'b7e2f4a',
    parts: ['Part 03'],
    status: 'APPROVED',
    risk: 'medium',
    rollbackPlan: 'Disable ff.cicd, revert migrations 20240116_001 through 20240116_005',
    approvedBy: 'Amit Verma (Tech Lead)',
    approvedAt: '2024-01-16 11:45',
    author: 'Sneha Kulkarni',
    createdAt: '2024-01-16 08:00',
    environment: 'staging',
    leadTimeHours: 3.75,
    changeFailureRate: 0,
  },
  {
    id: 'rel-003',
    version: 'v1.14.0-rc1',
    commitSha: 'c9d1e3b',
    parts: ['Part 04'],
    status: 'CANDIDATE',
    risk: 'high',
    rollbackPlan: 'Revert shared services, restore user preferences table',
    author: 'Vikram Mehta',
    createdAt: '2024-01-16 13:00',
    environment: 'staging',
    leadTimeHours: 1.5,
    changeFailureRate: 0,
  },
  {
    id: 'rel-004',
    version: 'v1.11.3',
    commitSha: 'd4f6g8h',
    parts: ['Hotfix'],
    status: 'ROLLED_BACK',
    risk: 'critical',
    rollbackPlan: 'Auto-rollback triggered: payment calculation error detected',
    approvedBy: 'Priya Sharma (Release Manager)',
    approvedAt: '2024-01-13 16:00',
    deployedAt: '2024-01-13 16:30',
    author: 'Karan Singh',
    createdAt: '2024-01-13 15:00',
    environment: 'production',
    leadTimeHours: 1.5,
    changeFailureRate: 100,
  },
  {
    id: 'rel-005',
    version: 'v1.11.2',
    commitSha: 'e5g7h9i',
    parts: ['Part 20', 'Part 25'],
    status: 'LIVE',
    risk: 'low',
    rollbackPlan: 'Revert procurement and inventory modules',
    approvedBy: 'Amit Verma (Tech Lead)',
    approvedAt: '2024-01-10 10:00',
    deployedAt: '2024-01-10 11:30',
    author: 'Anita Desai',
    createdAt: '2024-01-09 16:00',
    environment: 'production',
    leadTimeHours: 19.5,
    changeFailureRate: 0,
  },
];

// ═══════════════════════════════════════════════════════════
// GATE RUNS
// ═══════════════════════════════════════════════════════════

export const gateRuns: GateRun[] = [
  // Release 001 gates
  { id: 'gate-001-01', releaseId: 'rel-001', gate: 'Install', status: 'PASS', duration: '45s', metrics: { packages: 1247 }, startedAt: '2024-01-15 08:00', finishedAt: '2024-01-15 08:00:45' },
  { id: 'gate-001-02', releaseId: 'rel-001', gate: 'Lint', status: 'PASS', duration: '12s', metrics: { errors: 0, warnings: 3 }, startedAt: '2024-01-15 08:01', finishedAt: '2024-01-15 08:01:12' },
  { id: 'gate-001-03', releaseId: 'rel-001', gate: 'Typecheck', status: 'PASS', duration: '28s', metrics: { errors: 0 }, startedAt: '2024-01-15 08:02', finishedAt: '2024-01-15 08:02:28' },
  { id: 'gate-001-04', releaseId: 'rel-001', gate: 'Unit Tests', status: 'PASS', duration: '1m 23s', metrics: { passed: 342, failed: 0, coverage: 78.3 }, startedAt: '2024-01-15 08:03', finishedAt: '2024-01-15 08:04:23' },
  { id: 'gate-001-05', releaseId: 'rel-001', gate: 'Integration', status: 'PASS', duration: '2m 15s', metrics: { passed: 89, failed: 0 }, startedAt: '2024-01-15 08:05', finishedAt: '2024-01-15 08:07:15' },
  { id: 'gate-001-06', releaseId: 'rel-001', gate: 'API Contract', status: 'PASS', duration: '18s', metrics: { breaking: 0, additive: 12 }, startedAt: '2024-01-15 08:08', finishedAt: '2024-01-15 08:08:18' },
  { id: 'gate-001-07', releaseId: 'rel-001', gate: 'Auth Tests', status: 'PASS', duration: '34s', metrics: { allowed: 45, denied: 23, outOfScope: 8 }, startedAt: '2024-01-15 08:09', finishedAt: '2024-01-15 08:09:34' },
  { id: 'gate-001-08', releaseId: 'rel-001', gate: 'Migration', status: 'PASS', duration: '52s', metrics: { up: true, down: true, schemaDiff: 'EMPTY' }, startedAt: '2024-01-15 08:10', finishedAt: '2024-01-15 08:10:52' },
  { id: 'gate-001-09', releaseId: 'rel-001', gate: 'E2E Smoke', status: 'PASS', duration: '3m 42s', metrics: { passed: 24, failed: 0 }, startedAt: '2024-01-15 08:11', finishedAt: '2024-01-15 08:14:42' },
  { id: 'gate-001-10', releaseId: 'rel-001', gate: 'Security Scan', status: 'PASS', duration: '1m 08s', metrics: { critical: 0, high: 0, medium: 2 }, startedAt: '2024-01-15 08:15', finishedAt: '2024-01-15 08:16:08' },
  { id: 'gate-001-11', releaseId: 'rel-001', gate: 'Performance', status: 'PASS', duration: '45s', metrics: { p95Api: '342ms', p95Dash: '2.1s' }, startedAt: '2024-01-15 08:17', finishedAt: '2024-01-15 08:17:45' },
  { id: 'gate-001-12', releaseId: 'rel-001', gate: 'Build', status: 'PASS', duration: '1m 12s', metrics: { bundleSize: '2.4MB', withinBudget: true }, startedAt: '2024-01-15 08:18', finishedAt: '2024-01-15 08:19:12' },
  { id: 'gate-001-13', releaseId: 'rel-001', gate: 'Deploy Staging', status: 'PASS', duration: '2m 30s', metrics: { healthCheck: 'PASS' }, startedAt: '2024-01-15 08:20', finishedAt: '2024-01-15 08:22:30' },
  { id: 'gate-001-14', releaseId: 'rel-001', gate: 'Staging Smoke', status: 'PASS', duration: '1m 15s', metrics: { passed: 18, failed: 0 }, startedAt: '2024-01-15 09:00', finishedAt: '2024-01-15 09:01:15' },
  { id: 'gate-001-15', releaseId: 'rel-001', gate: 'Approval', status: 'PASS', duration: '—', metrics: { approver: 'Priya Sharma', author: 'Rajesh Kumar' }, startedAt: '2024-01-15 09:15', finishedAt: '2024-01-15 09:30' },
  { id: 'gate-001-16', releaseId: 'rel-001', gate: 'Deploy Prod', status: 'PASS', duration: '3m 45s', metrics: { healthCheck: 'PASS', rollbackReady: true }, startedAt: '2024-01-15 10:00', finishedAt: '2024-01-15 10:03:45' },

  // Release 002 gates (Part 03 - current)
  { id: 'gate-002-01', releaseId: 'rel-002', gate: 'Install', status: 'PASS', duration: '42s', metrics: { packages: 1251 }, startedAt: '2024-01-16 08:30', finishedAt: '2024-01-16 08:30:42' },
  { id: 'gate-002-02', releaseId: 'rel-002', gate: 'Lint', status: 'PASS', duration: '11s', metrics: { errors: 0, warnings: 1 }, startedAt: '2024-01-16 08:31', finishedAt: '2024-01-16 08:31:11' },
  { id: 'gate-002-03', releaseId: 'rel-002', gate: 'Typecheck', status: 'PASS', duration: '26s', metrics: { errors: 0 }, startedAt: '2024-01-16 08:32', finishedAt: '2024-01-16 08:32:26' },
  { id: 'gate-002-04', releaseId: 'rel-002', gate: 'Unit Tests', status: 'PASS', duration: '1m 18s', metrics: { passed: 356, failed: 0, coverage: 79.1 }, startedAt: '2024-01-16 08:33', finishedAt: '2024-01-16 08:34:18' },
  { id: 'gate-002-05', releaseId: 'rel-002', gate: 'Integration', status: 'PASS', duration: '2m 08s', metrics: { passed: 94, failed: 0 }, startedAt: '2024-01-16 08:35', finishedAt: '2024-01-16 08:37:08' },
  { id: 'gate-002-06', releaseId: 'rel-002', gate: 'API Contract', status: 'PASS', duration: '16s', metrics: { breaking: 0, additive: 5 }, startedAt: '2024-01-16 08:38', finishedAt: '2024-01-16 08:38:16' },
  { id: 'gate-002-07', releaseId: 'rel-002', gate: 'Auth Tests', status: 'PASS', duration: '31s', metrics: { allowed: 12, denied: 8, outOfScope: 3 }, startedAt: '2024-01-16 08:39', finishedAt: '2024-01-16 08:39:31' },
  { id: 'gate-002-08', releaseId: 'rel-002', gate: 'Migration', status: 'PASS', duration: '48s', metrics: { up: true, down: true, schemaDiff: 'EMPTY' }, startedAt: '2024-01-16 08:40', finishedAt: '2024-01-16 08:40:48' },
  { id: 'gate-002-09', releaseId: 'rel-002', gate: 'E2E Smoke', status: 'PASS', duration: '3m 28s', metrics: { passed: 26, failed: 0 }, startedAt: '2024-01-16 08:41', finishedAt: '2024-01-16 08:44:28' },
  { id: 'gate-002-10', releaseId: 'rel-002', gate: 'Security Scan', status: 'PASS', duration: '1m 05s', metrics: { critical: 0, high: 0, medium: 1 }, startedAt: '2024-01-16 08:45', finishedAt: '2024-01-16 08:46:05' },
  { id: 'gate-002-11', releaseId: 'rel-002', gate: 'Performance', status: 'PASS', duration: '42s', metrics: { p95Api: '328ms', p95Dash: '1.9s' }, startedAt: '2024-01-16 08:47', finishedAt: '2024-01-16 08:47:42' },
  { id: 'gate-002-12', releaseId: 'rel-002', gate: 'Build', status: 'PASS', duration: '1m 08s', metrics: { bundleSize: '2.5MB', withinBudget: true }, startedAt: '2024-01-16 08:48', finishedAt: '2024-01-16 08:49:08' },
  { id: 'gate-002-13', releaseId: 'rel-002', gate: 'Deploy Staging', status: 'PASS', duration: '2m 22s', metrics: { healthCheck: 'PASS' }, startedAt: '2024-01-16 08:50', finishedAt: '2024-01-16 08:52:22' },
  { id: 'gate-002-14', releaseId: 'rel-002', gate: 'Staging Smoke', status: 'PASS', duration: '1m 10s', metrics: { passed: 20, failed: 0 }, startedAt: '2024-01-16 09:00', finishedAt: '2024-01-16 09:01:10' },
  { id: 'gate-002-15', releaseId: 'rel-002', gate: 'Approval', status: 'PASS', duration: '—', metrics: { approver: 'Amit Verma', author: 'Sneha Kulkarni' }, startedAt: '2024-01-16 11:00', finishedAt: '2024-01-16 11:45' },
  { id: 'gate-002-16', releaseId: 'rel-002', gate: 'Deploy Prod', status: 'PENDING', duration: '—', metrics: {}, startedAt: '—', finishedAt: '—' },

  // Release 003 gates (in progress)
  { id: 'gate-003-01', releaseId: 'rel-003', gate: 'Install', status: 'PASS', duration: '44s', metrics: { packages: 1253 }, startedAt: '2024-01-16 13:10', finishedAt: '2024-01-16 13:10:44' },
  { id: 'gate-003-02', releaseId: 'rel-003', gate: 'Lint', status: 'PASS', duration: '12s', metrics: { errors: 0, warnings: 2 }, startedAt: '2024-01-16 13:11', finishedAt: '2024-01-16 13:11:12' },
  { id: 'gate-003-03', releaseId: 'rel-003', gate: 'Typecheck', status: 'PASS', duration: '27s', metrics: { errors: 0 }, startedAt: '2024-01-16 13:12', finishedAt: '2024-01-16 13:12:27' },
  { id: 'gate-003-04', releaseId: 'rel-003', gate: 'Unit Tests', status: 'RUNNING', duration: '—', metrics: { passed: 280, failed: 0, coverage: 0 }, startedAt: '2024-01-16 13:13', finishedAt: '—' },
  { id: 'gate-003-05', releaseId: 'rel-003', gate: 'Integration', status: 'PENDING', duration: '—', metrics: {}, startedAt: '—', finishedAt: '—' },
  { id: 'gate-003-06', releaseId: 'rel-003', gate: 'API Contract', status: 'PENDING', duration: '—', metrics: {}, startedAt: '—', finishedAt: '—' },

  // Release 004 gates (rolled back)
  { id: 'gate-004-01', releaseId: 'rel-004', gate: 'Install', status: 'PASS', duration: '43s', metrics: { packages: 1245 }, startedAt: '2024-01-13 15:10', finishedAt: '2024-01-13 15:10:43' },
  { id: 'gate-004-02', releaseId: 'rel-004', gate: 'Lint', status: 'PASS', duration: '11s', metrics: { errors: 0, warnings: 0 }, startedAt: '2024-01-13 15:11', finishedAt: '2024-01-13 15:11:11' },
  { id: 'gate-004-03', releaseId: 'rel-004', gate: 'Typecheck', status: 'PASS', duration: '25s', metrics: { errors: 0 }, startedAt: '2024-01-13 15:12', finishedAt: '2024-01-13 15:12:25' },
  { id: 'gate-004-04', releaseId: 'rel-004', gate: 'Unit Tests', status: 'PASS', duration: '1m 15s', metrics: { passed: 338, failed: 0, coverage: 77.9 }, startedAt: '2024-01-13 15:13', finishedAt: '2024-01-13 15:14:15' },
  { id: 'gate-004-05', releaseId: 'rel-004', gate: 'Integration', status: 'PASS', duration: '2m 05s', metrics: { passed: 87, failed: 0 }, startedAt: '2024-01-13 15:15', finishedAt: '2024-01-13 15:17:05' },
  { id: 'gate-004-06', releaseId: 'rel-004', gate: 'API Contract', status: 'PASS', duration: '17s', metrics: { breaking: 0, additive: 3 }, startedAt: '2024-01-13 15:18', finishedAt: '2024-01-13 15:18:17' },
  { id: 'gate-004-07', releaseId: 'rel-004', gate: 'Auth Tests', status: 'PASS', duration: '32s', metrics: { allowed: 42, denied: 21, outOfScope: 7 }, startedAt: '2024-01-13 15:19', finishedAt: '2024-01-13 15:19:32' },
  { id: 'gate-004-08', releaseId: 'rel-004', gate: 'Migration', status: 'PASS', duration: '50s', metrics: { up: true, down: true, schemaDiff: 'EMPTY' }, startedAt: '2024-01-13 15:20', finishedAt: '2024-01-13 15:20:50' },
  { id: 'gate-004-09', releaseId: 'rel-004', gate: 'E2E Smoke', status: 'PASS', duration: '3m 35s', metrics: { passed: 23, failed: 0 }, startedAt: '2024-01-13 15:21', finishedAt: '2024-01-13 15:24:35' },
  { id: 'gate-004-10', releaseId: 'rel-004', gate: 'Security Scan', status: 'PASS', duration: '1m 02s', metrics: { critical: 0, high: 0, medium: 2 }, startedAt: '2024-01-13 15:25', finishedAt: '2024-01-13 15:26:02' },
  { id: 'gate-004-11', releaseId: 'rel-004', gate: 'Performance', status: 'PASS', duration: '44s', metrics: { p95Api: '356ms', p95Dash: '2.2s' }, startedAt: '2024-01-13 15:27', finishedAt: '2024-01-13 15:27:44' },
  { id: 'gate-004-12', releaseId: 'rel-004', gate: 'Build', status: 'PASS', duration: '1m 10s', metrics: { bundleSize: '2.4MB', withinBudget: true }, startedAt: '2024-01-13 15:28', finishedAt: '2024-01-13 15:29:10' },
  { id: 'gate-004-13', releaseId: 'rel-004', gate: 'Deploy Staging', status: 'PASS', duration: '2m 28s', metrics: { healthCheck: 'PASS' }, startedAt: '2024-01-13 15:30', finishedAt: '2024-01-13 15:32:28' },
  { id: 'gate-004-14', releaseId: 'rel-004', gate: 'Staging Smoke', status: 'PASS', duration: '1m 12s', metrics: { passed: 17, failed: 0 }, startedAt: '2024-01-13 16:00', finishedAt: '2024-01-13 16:01:12' },
  { id: 'gate-004-15', releaseId: 'rel-004', gate: 'Approval', status: 'PASS', duration: '—', metrics: { approver: 'Priya Sharma', author: 'Karan Singh' }, startedAt: '2024-01-13 16:10', finishedAt: '2024-01-13 16:00' },
  { id: 'gate-004-16', releaseId: 'rel-004', gate: 'Deploy Prod', status: 'FAIL', duration: '—', metrics: { reason: 'Payment calculation error detected post-deploy', autoRollback: true }, startedAt: '2024-01-13 16:30', finishedAt: '2024-01-13 16:45' },
];

// ═══════════════════════════════════════════════════════════
// FEATURE FLAGS
// ═══════════════════════════════════════════════════════════

export const featureFlags: FeatureFlag[] = [
  {
    key: 'ff.pgm',
    partNo: 'Part 00',
    owner: 'Rajesh Kumar',
    description: 'Master program flag — enables ERP program features',
    defaultByEnv: { development: true, staging: true, production: true },
    targeting: 'global',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-15 10:00',
    changedBy: 'Priya Sharma',
    staleDays: 0,
  },
  {
    key: 'ff.pgm.theme',
    partNo: 'Part 00',
    owner: 'Rajesh Kumar',
    description: 'Theme bridge for existing screens',
    defaultByEnv: { development: true, staging: true, production: true },
    targeting: 'global',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-15 10:00',
    changedBy: 'Priya Sharma',
    staleDays: 0,
  },
  {
    key: 'ff.pgm.shell',
    partNo: 'Part 00',
    owner: 'Rajesh Kumar',
    description: 'Application shell with navigation',
    defaultByEnv: { development: true, staging: true, production: true },
    targeting: 'global',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-15 10:00',
    changedBy: 'Priya Sharma',
    staleDays: 0,
  },
  {
    key: 'ff.audit',
    partNo: 'Part 01',
    owner: 'Sneha Kulkarni',
    description: 'Existing System Audit & Architecture Discovery',
    defaultByEnv: { development: true, staging: true, production: true },
    targeting: 'role:TECH_ADMIN',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-16 08:00',
    changedBy: 'Amit Verma',
    staleDays: 0,
  },
  {
    key: 'ff.preview',
    partNo: 'Part 02',
    owner: 'Vikram Mehta',
    description: 'Live Dashboard Preview & Walking Skeleton',
    defaultByEnv: { development: true, staging: true, production: false },
    targeting: 'preview-users',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-16 09:00',
    changedBy: 'Priya Sharma',
    staleDays: 0,
  },
  {
    key: 'ff.cicd',
    partNo: 'Part 03',
    owner: 'Sneha Kulkarni',
    description: 'Quality Gates, CI/CD & Release Engineering',
    defaultByEnv: { development: true, staging: true, production: false },
    targeting: 'role:TECH_ADMIN,QA_LEAD',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-16 11:00',
    changedBy: 'Amit Verma',
    staleDays: 0,
  },
  {
    key: 'ff.modules.procurement',
    partNo: 'Part 20',
    owner: 'Anita Desai',
    description: 'Procurement module (PR/PO/GRN)',
    defaultByEnv: { development: true, staging: true, production: true },
    targeting: 'company:all',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-10 11:00',
    changedBy: 'Priya Sharma',
    staleDays: 6,
  },
  {
    key: 'ff.modules.inventory',
    partNo: 'Part 25',
    owner: 'Suresh Patel',
    description: 'Inventory & Stock module',
    defaultByEnv: { development: true, staging: true, production: true },
    targeting: 'company:all',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-10 11:00',
    changedBy: 'Priya Sharma',
    staleDays: 6,
  },
  {
    key: 'ff.tech_console',
    partNo: 'Part 00',
    owner: 'Rajesh Kumar',
    description: 'Technical Console — /_tech routes',
    defaultByEnv: { development: true, staging: true, production: false },
    targeting: 'role:TECH_ADMIN,QA_LEAD,RELEASE_MANAGER',
    killSwitch: false,
    status: 'ACTIVE',
    lastChanged: '2024-01-15 10:00',
    changedBy: 'Priya Sharma',
    staleDays: 0,
  },
];

// ═══════════════════════════════════════════════════════════
// FLAG CHANGES
// ═══════════════════════════════════════════════════════════

export const flagChanges: FlagChange[] = [
  { id: 'fc-001', flagKey: 'ff.cicd', environment: 'staging', oldValue: false, newValue: true, reason: 'Part 03 deployment to staging', changedBy: 'Amit Verma', changedAt: '2024-01-16 11:00' },
  { id: 'fc-002', flagKey: 'ff.preview', environment: 'staging', oldValue: false, newValue: true, reason: 'Part 02 stakeholder review', changedBy: 'Priya Sharma', changedAt: '2024-01-16 09:00' },
  { id: 'fc-003', flagKey: 'ff.audit', environment: 'production', oldValue: false, newValue: true, reason: 'Part 01 production enablement', changedBy: 'Amit Verma', changedAt: '2024-01-16 08:00' },
  { id: 'fc-004', flagKey: 'ff.pgm', environment: 'production', oldValue: false, newValue: true, reason: 'Part 00 baseline production enablement', changedBy: 'Priya Sharma', changedAt: '2024-01-15 10:00' },
  { id: 'fc-005', flagKey: 'ff.pgm.theme', environment: 'production', oldValue: false, newValue: true, reason: 'Theme bridge production enablement', changedBy: 'Priya Sharma', changedAt: '2024-01-15 10:00' },
  { id: 'fc-006', flagKey: 'ff.modules.procurement', environment: 'production', oldValue: false, newValue: true, reason: 'Procurement module go-live', changedBy: 'Priya Sharma', changedAt: '2024-01-10 11:00' },
  { id: 'fc-007', flagKey: 'ff.modules.inventory', environment: 'production', oldValue: false, newValue: true, reason: 'Inventory module go-live', changedBy: 'Priya Sharma', changedAt: '2024-01-10 11:00' },
];

// ═══════════════════════════════════════════════════════════
// QUARANTINE
// ═══════════════════════════════════════════════════════════

export const quarantine: QuarantineEntry[] = [
  {
    id: 'q-001',
    testId: 'test-proc-045',
    testName: 'PO approval with concurrent modification',
    reason: 'Flaky due to timing issue in optimistic locking test',
    owner: 'Anita Desai',
    expiresAt: '2024-01-20',
    status: 'QUARANTINED',
    quarantinedAt: '2024-01-14',
  },
  {
    id: 'q-002',
    testId: 'test-inv-023',
    testName: 'Stock valuation with large dataset',
    reason: 'Performance test exceeding timeout in CI environment',
    owner: 'Suresh Patel',
    expiresAt: '2024-01-25',
    status: 'QUARANTINED',
    quarantinedAt: '2024-01-12',
  },
  {
    id: 'q-003',
    testId: 'test-hr-067',
    testName: 'Payroll calculation with leap year',
    reason: 'Fixed in PR #1247, awaiting merge',
    owner: 'Meena Joshi',
    expiresAt: '2024-01-18',
    status: 'FIXED',
    quarantinedAt: '2024-01-10',
  },
];

// ═══════════════════════════════════════════════════════════
// EVIDENCE BUNDLES
// ═══════════════════════════════════════════════════════════

export const evidenceBundles: EvidenceBundle[] = [
  {
    partNo: 'Part 00',
    partTitle: 'Master Development Directive & Design Foundation',
    status: 'COMPLETE',
    testReports: 3,
    coveragePercent: 78.3,
    contractDiff: 'CLEAN',
    schemaDiff: 'CLEAN',
    screenshots: 12,
    auditRecord: true,
    traceability: 100,
    lastUpdated: '2024-01-15 10:30',
  },
  {
    partNo: 'Part 01',
    partTitle: 'Existing System Audit & Architecture Discovery',
    status: 'COMPLETE',
    testReports: 2,
    coveragePercent: 82.1,
    contractDiff: 'CLEAN',
    schemaDiff: 'CLEAN',
    screenshots: 8,
    auditRecord: true,
    traceability: 100,
    lastUpdated: '2024-01-16 08:30',
  },
  {
    partNo: 'Part 02',
    partTitle: 'Live Dashboard Preview & Walking Skeleton',
    status: 'COMPLETE',
    testReports: 2,
    coveragePercent: 79.8,
    contractDiff: 'CLEAN',
    schemaDiff: 'CLEAN',
    screenshots: 15,
    auditRecord: true,
    traceability: 100,
    lastUpdated: '2024-01-16 09:45',
  },
  {
    partNo: 'Part 03',
    partTitle: 'Quality Gates, CI/CD & Release Engineering',
    status: 'IN_PROGRESS',
    testReports: 1,
    coveragePercent: 79.1,
    contractDiff: 'CLEAN',
    schemaDiff: 'CLEAN',
    screenshots: 6,
    auditRecord: false,
    traceability: 85,
    lastUpdated: '2024-01-16 11:45',
  },
  {
    partNo: 'Part 04',
    partTitle: 'Core Enterprise ERP Foundation (Shared Services)',
    status: 'PENDING',
    testReports: 0,
    coveragePercent: 0,
    contractDiff: 'PENDING',
    schemaDiff: 'PENDING',
    screenshots: 0,
    auditRecord: false,
    traceability: 0,
    lastUpdated: '—',
  },
];

// ═══════════════════════════════════════════════════════════
// PIPELINE METRICS
// ═══════════════════════════════════════════════════════════

export const pipelineMetrics = {
  totalReleases: 5,
  successfulReleases: 3,
  failedReleases: 1,
  rolledBackReleases: 1,
  avgLeadTimeHours: 12.5,
  changeFailureRate: 20,
  mttrMinutes: 45,
  deploymentFrequency: '2.3/week',
  gatePassRate: 94.2,
  avgBuildTime: '8m 32s',
  avgDeployTime: '3m 15s',
};
