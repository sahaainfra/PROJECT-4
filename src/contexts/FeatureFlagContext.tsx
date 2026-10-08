import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════
// FEATURE FLAG CONTEXT (ff.pgm)
// isEnabled(flagKey, context) — server-side equivalent
// ═══════════════════════════════════════════════════════════

interface FeatureFlagContext {
  company?: string;
  project?: string;
  role?: string;
  user?: string;
}

interface FeatureFlag {
  key: string;
  description: string;
  scopeType: 'global' | 'company' | 'project' | 'role' | 'user';
  enabled: boolean;
  rolloutPercent: number;
  ownerPrompt: string;
}

interface FeatureFlagContextValue {
  flags: Record<string, FeatureFlag>;
  isEnabled: (flagKey: string, context?: FeatureFlagContext) => boolean;
  toggleFlag: (flagKey: string) => void;
}

// Default flags — ff.pgm is the master program flag
const defaultFlags: Record<string, FeatureFlag> = {
  'ff.pgm': {
    key: 'ff.pgm',
    description: 'Master program flag — enables ERP program features',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 00',
  },
  'ff.pgm.theme': {
    key: 'ff.pgm.theme',
    description: 'Theme bridge for existing screens',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 00',
  },
  'ff.pgm.shell': {
    key: 'ff.pgm.shell',
    description: 'Application shell with navigation',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 00',
  },
  'ff.pgm.launchpad': {
    key: 'ff.pgm.launchpad',
    description: 'Home launchpad with role spaces',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 00',
  },
  'ff.pgm.templates': {
    key: 'ff.pgm.templates',
    description: 'Baseline page templates',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 00',
  },
  'ff.tech_console': {
    key: 'ff.tech_console',
    description: 'Technical Console — /_tech routes',
    scopeType: 'role',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 00',
  },
  'ff.audit': {
    key: 'ff.audit',
    description: 'Existing System Audit & Architecture Discovery',
    scopeType: 'role',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 01',
  },
  'ff.preview': {
    key: 'ff.preview',
    description: 'Live Dashboard Preview & Walking Skeleton',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 02',
  },
  'ff.cicd': {
    key: 'ff.cicd',
    description: 'Quality Gates, CI/CD & Release Engineering',
    scopeType: 'role',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 03',
  },
  'ff.modules.procurement': {
    key: 'ff.modules.procurement',
    description: 'Procurement module (PR/PO/GRN)',
    scopeType: 'company',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 20',
  },
  'ff.modules.inventory': {
    key: 'ff.modules.inventory',
    description: 'Inventory & Stock module',
    scopeType: 'company',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 25',
  },
  'ff.modules.project': {
    key: 'ff.modules.project',
    description: 'Project Management module',
    scopeType: 'company',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 40',
  },
  'ff.modules.finance': {
    key: 'ff.modules.finance',
    description: 'Finance & Accounting module',
    scopeType: 'company',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 50',
  },
  'ff.modules.hr': {
    key: 'ff.modules.hr',
    description: 'HR & Payroll module',
    scopeType: 'company',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 60',
  },
  'ff.core': {
    key: 'ff.core',
    description: 'Core Enterprise ERP Foundation (Shared Services)',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 04',
  },
  'ff.org': {
    key: 'ff.org',
    description: 'Organization, Company, Project & Site Master',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 05',
  },
  'ff.iam': {
    key: 'ff.iam',
    description: 'User, Role & Permission Architecture (Enterprise RBAC)',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 06',
  },
  'ff.audit_sec': {
    key: 'ff.audit_sec',
    description: 'Audit, Security & Governance Foundation',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 07',
  },
  'ff.secbase': {
    key: 'ff.secbase',
    description: 'Secure-by-Design Foundation',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 08',
  },
  'ff.idsod': {
    key: 'ff.idsod',
    description: 'Security, Identity & Segregation of Duties',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 09',
  },
  'ff.obs': {
    key: 'ff.obs',
    description: 'Observability, Performance & Reliability',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 10',
  },
  'ff.evbus': {
    key: 'ff.evbus',
    description: 'Real-Time Event Bus & Integration Platform',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 11',
  },
  'ff.wf': {
    key: 'ff.wf',
    description: 'Workflow & Approval Engine',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 12',
  },
  'ff.rules': {
    key: 'ff.rules',
    description: 'Workflow Rules & Decision Tables',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 13',
  },
  'ff.protocol': {
    key: 'ff.protocol',
    description: 'Protocol & Control Engine',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 14',
  },
  'ff.acc': {
    key: 'ff.acc',
    description: 'Accountability, Responsibility Assignment & Action Ledger',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 15',
  },
  'ff.rt': {
    key: 'ff.rt',
    description: 'Real-Time Notification & Collaboration Foundation',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 16',
  },
  'ff.intg': {
    key: 'ff.intg',
    description: 'Integration Architecture',
    scopeType: 'global',
    enabled: true,
    rolloutPercent: 100,
    ownerPrompt: 'Part 17',
  },
};

const FeatureFlagCtx = createContext<FeatureFlagContextValue | null>(null);

export function FeatureFlagProvider({ children }: { children: ReactNode }) {
  const [flags, setFlags] = useState<Record<string, FeatureFlag>>(() => {
    const saved = localStorage.getItem('erp-feature-flags');
    if (saved) {
      try { return { ...defaultFlags, ...JSON.parse(saved) }; } catch { return defaultFlags; }
    }
    return defaultFlags;
  });

  const isEnabled = useCallback((flagKey: string, _context?: FeatureFlagContext): boolean => {
    const flag = flags[flagKey];
    if (!flag) return false;
    return flag.enabled && flag.rolloutPercent > 0;
  }, [flags]);

  const toggleFlag = useCallback((flagKey: string) => {
    setFlags(prev => ({
      ...prev,
      [flagKey]: { ...prev[flagKey], enabled: !prev[flagKey]?.enabled },
    }));
    // Persist
    setFlags(current => {
      localStorage.setItem('erp-feature-flags', JSON.stringify(current));
      return current;
    });
  }, []);

  return (
    <FeatureFlagCtx.Provider value={{ flags, isEnabled, toggleFlag }}>
      {children}
    </FeatureFlagCtx.Provider>
  );
}

export function useFeatureFlags() {
  const ctx = useContext(FeatureFlagCtx);
  if (!ctx) throw new Error('useFeatureFlags must be used within FeatureFlagProvider');
  return ctx;
}
