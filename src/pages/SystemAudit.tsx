import React, { useState } from 'react';
import { getIcon } from '../data/registries';
import {
  stackInfo,
  repoStructure,
  modulesInventory,
  databaseTables,
  apiInventory,
  calculationsInventory,
  dependencyMap,
  gapMatrix,
  riskRegister,
  conflictsList,
  controlInventory,
  workflowsInventory,
  socketEvents,
  backgroundJobs,
} from '../data/auditData';

// ═══════════════════════════════════════════════════════════
// SYSTEM AUDIT PAGE — Part 01
// Technical Console › Existing System Audit & Architecture
// Route: /_tech/audit
// ═══════════════════════════════════════════════════════════

type TabKey = 'overview' | 'stack' | 'modules' | 'database' | 'api' | 'calculations' | 'dependencies' | 'gaps' | 'risks' | 'conflicts' | 'controls' | 'workflows' | 'realtime' | 'jobs';

const tabs: { key: TabKey; label: string; iconKey: string }[] = [
  { key: 'overview', label: 'Overview', iconKey: 'sys.layers' },
  { key: 'stack', label: 'Stack & Infra', iconKey: 'sys.database' },
  { key: 'modules', label: 'Modules', iconKey: 'nav.modules' },
  { key: 'database', label: 'Database', iconKey: 'sys.database' },
  { key: 'api', label: 'APIs', iconKey: 'sys.activity' },
  { key: 'calculations', label: 'Calculations', iconKey: 'kpi.money' },
  { key: 'dependencies', label: 'Dependencies', iconKey: 'sys.git' },
  { key: 'gaps', label: 'Gap Matrix', iconKey: 'kpi.target' },
  { key: 'risks', label: 'Risk Register', iconKey: 'status.warning' },
  { key: 'conflicts', label: 'Conflicts', iconKey: 'status.rejected' },
  { key: 'controls', label: 'Controls', iconKey: 'sys.security' },
  { key: 'workflows', label: 'Workflows', iconKey: 'status.progress' },
  { key: 'realtime', label: 'Real-time', iconKey: 'sys.zap' },
  { key: 'jobs', label: 'Jobs', iconKey: 'sys.activity' },
];

const severityColors: Record<string, string> = {
  critical: '#dc2626',
  high: '#ea580c',
  medium: '#d97706',
  low: '#2563eb',
};

const statusColors: Record<string, string> = {
  working: '#059669',
  partial: '#d97706',
  broken: '#dc2626',
  planned: '#6b7280',
  active: '#059669',
  failing: '#dc2626',
  disabled: '#6b7280',
  centralized: '#059669',
  scattered: '#d97706',
  manual: '#dc2626',
};

const decisionColors: Record<string, string> = {
  REUSE: '#059669',
  EXTEND: '#2563eb',
  NEW: '#d97706',
};

export function SystemAuditPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const HomeIcon = getIcon('nav.home');
  const ShieldIcon = getIcon('sys.security');

  return (
    <div className="min-h-screen" style={{ background: 'var(--shell-bg)' }}>
      {/* Minimal Shell Bar for /_tech (DS-32) */}
      <header className="h-10 flex items-center px-4 gap-3 border-b"
        style={{ background: 'var(--shell-bar-bg)', color: 'var(--shell-bar-text)', borderColor: 'var(--border-color)' }}>
        <a href="/" className="flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity">
          <HomeIcon size={14} />
          <span>Back to App</span>
        </a>
        <span className="opacity-30">|</span>
        <ShieldIcon size={14} />
        <span className="text-xs font-medium">System Audit — Part 01</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--semantic-info)', color: '#fff' }}>
          TECH_ADMIN
        </span>
      </header>

      <div className="p-[var(--density-spacing-xl)] max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-[var(--density-spacing-xl)]">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Existing System Audit & Architecture Discovery
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Part 01 — Read-only technical inventory · Evidence-based · ff.audit enabled
          </p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--semantic-success)', color: '#fff' }}>
              Baseline: erp-baseline-v0
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--shell-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}>
              42 tables · 1.2M rows · 164 APIs
            </span>
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--semantic-warning)', color: '#fff' }}>
              12 risks identified
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-0 overflow-x-auto mb-[var(--density-spacing-lg)] border-b" style={{ borderColor: 'var(--border-color)' }}>
          {tabs.map(tab => {
            const Icon = getIcon(tab.iconKey);
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key ? '' : 'border-transparent hover:opacity-70'
                }`}
                style={{
                  color: activeTab === tab.key ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === tab.key ? 'var(--brand-primary)' : 'transparent',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && <OverviewTab />}
          {activeTab === 'stack' && <StackTab />}
          {activeTab === 'modules' && <ModulesTab />}
          {activeTab === 'database' && <DatabaseTab />}
          {activeTab === 'api' && <APITab />}
          {activeTab === 'calculations' && <CalculationsTab />}
          {activeTab === 'dependencies' && <DependenciesTab />}
          {activeTab === 'gaps' && <GapsTab />}
          {activeTab === 'risks' && <RisksTab />}
          {activeTab === 'conflicts' && <ConflictsTab />}
          {activeTab === 'controls' && <ControlsTab />}
          {activeTab === 'workflows' && <WorkflowsTab />}
          {activeTab === 'realtime' && <RealtimeTab />}
          {activeTab === 'jobs' && <JobsTab />}
        </div>
      </div>
    </div>
  );
}

// ── Overview Tab ──
function OverviewTab() {
  const totalTables = databaseTables.length;
  const totalRows = databaseTables.reduce((sum, t) => sum + t.rows, 0);
  const totalAPIs = apiInventory.length;
  const totalModules = modulesInventory.length;
  const workingModules = modulesInventory.filter(m => m.status === 'working').length;
  const partialModules = modulesInventory.filter(m => m.status === 'partial').length;
  const criticalRisks = riskRegister.filter(r => r.severity === 'critical').length;
  const highRisks = riskRegister.filter(r => r.severity === 'high').length;
  const hardControls = controlInventory.filter(c => c.enforcement === 'hard').length;
  const noControls = controlInventory.filter(c => c.enforcement === 'none').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <SummaryCard label="Tables" value={totalTables} color="var(--semantic-info)" />
        <SummaryCard label="Total Rows" value={totalRows.toLocaleString()} color="var(--semantic-info)" />
        <SummaryCard label="API Endpoints" value={totalAPIs} color="var(--brand-primary)" />
        <SummaryCard label="Modules" value={`${workingModules}/${totalModules}`} subtitle={`${partialModules} partial`} color="var(--semantic-success)" />
        <SummaryCard label="Critical Risks" value={criticalRisks} color="var(--semantic-error)" />
        <SummaryCard label="Controls Missing" value={noControls} subtitle={`of ${controlInventory.length}`} color="var(--semantic-warning)" />
      </div>

      {/* Module Status Overview */}
      <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Module Health</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {modulesInventory.map(mod => (
            <div key={mod.code} className="flex items-center gap-3 p-2 rounded" style={{ background: 'var(--shell-bg)' }}>
              <div className="w-2 h-8 rounded-full" style={{ background: statusColors[mod.status] }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{mod.name}</div>
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {mod.tables.length} tables · {mod.apis} APIs · {mod.screens} screens
                </div>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: `${statusColors[mod.status]}20`, color: statusColors[mod.status] }}>
                {mod.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Findings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--semantic-error)' }}>
            {React.createElement(getIcon('status.warning'), { size: 16 })}
            Critical Findings
          </h3>
          <div className="space-y-2">
            {riskRegister.filter(r => r.severity === 'critical' || r.severity === 'high').slice(0, 5).map(risk => (
              <div key={risk.id} className="flex items-start gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: severityColors[risk.severity] }} />
                <div>
                  <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{risk.title}</span>
                  <span className="ml-1" style={{ color: 'var(--text-muted)' }}>→ {risk.targetPart}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--semantic-warning)' }}>
            {React.createElement(getIcon('sys.security'), { size: 16 })}
            Control Gaps
          </h3>
          <div className="space-y-2">
            {controlInventory.filter(c => c.enforcement === 'none' || c.enforcement === 'soft').slice(0, 5).map(cp => (
              <div key={cp.id} className="flex items-start gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ background: cp.enforcement === 'none' ? 'var(--semantic-error)' : 'var(--semantic-warning)' }} />
                <div>
                  <code className="text-[10px]" style={{ color: 'var(--brand-primary)' }}>{cp.id}</code>
                  <span className="ml-1" style={{ color: 'var(--text-secondary)' }}>{cp.gap}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, subtitle, color }: { label: string; value: string | number; subtitle?: string; color: string }) {
  return (
    <div className="rounded-[var(--density-border-radius)] p-3" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-lg font-semibold tabular-nums" style={{ color }}>{value}</div>
      {subtitle && <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>}
    </div>
  );
}

// ── Stack Tab ──
function StackTab() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(stackInfo).map(([key, value]) => (
          <div key={key} className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
            <h3 className="text-sm font-semibold mb-3 capitalize" style={{ color: 'var(--text-primary)' }}>{key}</h3>
            <div className="space-y-2">
              {Object.entries(value).map(([k, v]) => (
                <div key={k} className="flex justify-between text-xs">
                  <span style={{ color: 'var(--text-muted)' }}>{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                  <span className="font-medium text-right max-w-[60%] truncate" style={{ color: 'var(--text-primary)' }}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Repository Structure */}
      <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Repository Structure</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--shell-bg)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Path</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Type</th>
              </tr>
            </thead>
            <tbody>
              {repoStructure.map(item => (
                <tr key={item.path} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="px-4 py-2">
                    <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-primary)' }}>{item.path}</code>
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{item.desc}</td>
                  <td className="px-4 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{item.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Modules Tab ──
function ModulesTab() {
  return (
    <div className="space-y-4">
      {modulesInventory.map(mod => (
        <div key={mod.code} className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="px-4 py-3 flex items-center justify-between border-b" style={{ borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full" style={{ background: statusColors[mod.status] }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{mod.name}</h3>
              <code className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{mod.code}</code>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: `${statusColors[mod.status]}20`, color: statusColors[mod.status] }}>
              {mod.status}
            </span>
          </div>
          <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Routes ({mod.routes.length})</div>
              <div className="space-y-1">
                {mod.routes.map(r => (
                  <code key={r} className="block text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>{r}</code>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Tables ({mod.tables.length})</div>
              <div className="space-y-1">
                {mod.tables.map(t => (
                  <code key={t} className="block text-[10px] truncate" style={{ color: 'var(--text-secondary)' }}>{t}</code>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Notes</div>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{mod.notes}</p>
              <div className="flex gap-3 mt-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>{mod.apis} APIs</span>
                <span>{mod.screens} screens</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Database Tab ──
function DatabaseTab() {
  return (
    <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Database Tables ({databaseTables.length})</h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Total: {databaseTables.reduce((s, t) => s + t.rows, 0).toLocaleString()} rows
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--shell-bg)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Table</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Module</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Rows</th>
              <th className="px-4 py-2 text-right text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Cols</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>FK</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Idx</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {databaseTables.map(table => (
              <tr key={table.name} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-2">
                  <code className="text-xs" style={{ color: 'var(--text-primary)' }}>{table.name}</code>
                </td>
                <td className="px-4 py-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{table.module}</span>
                </td>
                <td className="px-4 py-2 text-right text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>{table.rows.toLocaleString()}</td>
                <td className="px-4 py-2 text-right text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>{table.columns}</td>
                <td className="px-4 py-2 text-center">
                  <span className={`text-[10px] ${table.hasFK ? '' : 'opacity-40'}`} style={{ color: table.hasFK ? 'var(--semantic-success)' : 'var(--text-muted)' }}>
                    {table.hasFK ? '✓' : '—'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className={`text-[10px] ${table.hasIndex ? '' : 'opacity-40'}`} style={{ color: table.hasIndex ? 'var(--semantic-success)' : 'var(--semantic-error)' }}>
                    {table.hasIndex ? '✓' : '✗'}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>{table.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── API Tab ──
function APITab() {
  return (
    <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>API Endpoints ({apiInventory.length})</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--shell-bg)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Method</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Path</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Handler</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Auth</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Perm</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Module</th>
            </tr>
          </thead>
          <tbody>
            {apiInventory.map((api, i) => (
              <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-2">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: api.method === 'GET' ? '#dbeafe' : api.method === 'POST' ? '#dcfce7' : api.method === 'PUT' ? '#fef3c7' : '#fee2e2',
                      color: api.method === 'GET' ? '#1d4ed8' : api.method === 'POST' ? '#15803d' : api.method === 'PUT' ? '#a16207' : '#dc2626',
                    }}>
                    {api.method}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <code className="text-xs" style={{ color: 'var(--text-primary)' }}>{api.path}</code>
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-muted)' }}>{api.handler}</td>
                <td className="px-4 py-2 text-center">
                  <span className="text-[10px]" style={{ color: api.authRequired ? 'var(--semantic-success)' : 'var(--text-muted)' }}>
                    {api.authRequired ? '✓' : '—'}
                  </span>
                </td>
                <td className="px-4 py-2 text-center">
                  {api.permissionChecked ? (
                    <span className="text-[10px] px-1 py-0.5 rounded" style={{ background: 'var(--semantic-success)', color: '#fff' }}>YES</span>
                  ) : (
                    <span className="text-[10px] px-1 py-0.5 rounded" style={{ background: 'var(--semantic-error)', color: '#fff' }}>NO ⚠️</span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{api.module}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Calculations Tab ──
function CalculationsTab() {
  return (
    <div className="space-y-3">
      {calculationsInventory.map(calc => (
        <div key={calc.id} className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2">
                <code className="text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>{calc.id}</code>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{calc.name}</span>
              </div>
              <code className="text-xs mt-1 block px-2 py-1 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-secondary)' }}>
                {calc.formula}
              </code>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'var(--semantic-success)', color: '#fff' }}>
              Protected
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3 text-xs">
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Location: </span>
              <code style={{ color: 'var(--text-secondary)' }}>{calc.file}:{calc.line}</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Used by: </span>
              <span style={{ color: 'var(--text-secondary)' }}>{calc.usedBy.join(', ')}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Example: </span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>{calc.example}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Dependencies Tab ──
function DependenciesTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Module Dependencies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--shell-bg)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>From</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>To</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Risk</th>
              </tr>
            </thead>
            <tbody>
              {dependencyMap.map((dep, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="px-4 py-2">
                    <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-primary)' }}>{dep.from}</code>
                  </td>
                  <td className="px-4 py-2">
                    <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-primary)' }}>{dep.to}</code>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{
                      background: dep.type === 'shared-table' ? '#fee2e2' : dep.type === 'event' ? '#dcfce7' : '#dbeafe',
                      color: dep.type === 'shared-table' ? '#dc2626' : dep.type === 'event' ? '#15803d' : '#1d4ed8',
                    }}>{dep.type}</span>
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{dep.description}</td>
                  <td className="px-4 py-2 text-center">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: `${severityColors[dep.risk]}20`, color: severityColors[dep.risk] }}>
                      {dep.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hidden Couplings Alert */}
      <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
        <h4 className="text-sm font-semibold flex items-center gap-2 mb-2" style={{ color: '#dc2626' }}>
          {React.createElement(getIcon('status.warning'), { size: 16 })}
          Hidden Couplings (Direct Table Access)
        </h4>
        <div className="space-y-2">
          {dependencyMap.filter(d => d.type === 'shared-table').map((dep, i) => (
            <div key={i} className="text-xs flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#dc2626' }} />
              <span style={{ color: '#7f1d1d' }}>
                <strong>{dep.from} → {dep.to}:</strong> {dep.description}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Gaps Tab ──
function GapsTab() {
  return (
    <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Gap Matrix — Parts 3–130 Coverage</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--shell-bg)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Part</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Title</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Coverage</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Decision</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Reusable</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Missing</th>
            </tr>
          </thead>
          <tbody>
            {gapMatrix.map(gap => (
              <tr key={gap.part} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-2">
                  <code className="text-xs font-medium" style={{ color: 'var(--brand-primary)' }}>{gap.part}</code>
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-primary)' }}>{gap.title}</td>
                <td className="px-4 py-2 text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--shell-bg)' }}>
                      <div className="h-full rounded-full" style={{ width: `${gap.coveragePercent}%`, background: gap.coveragePercent > 50 ? 'var(--semantic-success)' : gap.coveragePercent > 25 ? 'var(--semantic-warning)' : 'var(--semantic-error)' }} />
                    </div>
                    <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>{gap.coveragePercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: `${decisionColors[gap.decision]}20`, color: decisionColors[gap.decision] }}>
                    {gap.decision}
                  </span>
                </td>
                <td className="px-4 py-2 text-[10px] max-w-[200px]" style={{ color: 'var(--text-muted)' }}>
                  {gap.reusable.join(', ')}
                </td>
                <td className="px-4 py-2 text-[10px] max-w-[200px]" style={{ color: 'var(--text-secondary)' }}>
                  {gap.missing.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Risks Tab ──
function RisksTab() {
  return (
    <div className="space-y-3">
      {riskRegister.map(risk => (
        <div key={risk.id} className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: severityColors[risk.severity] }} />
              <code className="text-xs" style={{ color: 'var(--brand-primary)' }}>{risk.id}</code>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{risk.title}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{risk.category}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                style={{ background: `${severityColors[risk.severity]}20`, color: severityColors[risk.severity] }}>
                {risk.severity}
              </span>
            </div>
          </div>
          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{risk.description}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px]">
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Evidence: </span>
              <code style={{ color: 'var(--text-secondary)' }}>{risk.evidence}</code>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Module: </span>
              <span style={{ color: 'var(--text-primary)' }}>{risk.affectedModule}</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Target: </span>
              <span style={{ color: 'var(--brand-primary)' }}>{risk.targetPart}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Conflicts Tab ──
function ConflictsTab() {
  return (
    <div className="space-y-3">
      {conflictsList.map(conflict => (
        <div key={conflict.id} className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <code className="text-xs font-medium" style={{ color: 'var(--semantic-error)' }}>{conflict.id}</code>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{conflict.title}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--semantic-warning)', color: '#fff' }}>
              → {conflict.targetPart}
            </span>
          </div>
          <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>{conflict.description}</p>
          <div className="flex items-center gap-2 text-[10px]">
            <code className="px-1.5 py-0.5 rounded" style={{ background: '#fee2e2', color: '#dc2626' }}>{conflict.location1}</code>
            <span style={{ color: 'var(--text-muted)' }}>vs</span>
            <code className="px-1.5 py-0.5 rounded" style={{ background: '#fee2e2', color: '#dc2626' }}>{conflict.location2}</code>
          </div>
          <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>Resolution: {conflict.resolution}</p>
        </div>
      ))}
    </div>
  );
}

// ── Controls Tab ──
function ControlsTab() {
  return (
    <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Control Inventory — PC-1 Stage Coverage</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--shell-bg)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Module</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Stage</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Control</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Enforcement</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Gap</th>
            </tr>
          </thead>
          <tbody>
            {controlInventory.map(cp => (
              <tr key={cp.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-2">
                  <code className="text-xs" style={{ color: 'var(--brand-primary)' }}>{cp.id}</code>
                </td>
                <td className="px-4 py-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{cp.module}</span>
                </td>
                <td className="px-4 py-2 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{cp.stage}</td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{cp.control}</td>
                <td className="px-4 py-2 text-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: cp.enforcement === 'hard' ? 'var(--semantic-success)' : cp.enforcement === 'soft' ? 'var(--semantic-warning)' : 'var(--semantic-error)',
                      color: '#fff'
                    }}>
                    {cp.enforcement.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-2 text-[10px] max-w-[250px]" style={{ color: cp.enforcement === 'none' ? 'var(--semantic-error)' : 'var(--text-muted)' }}>
                  {cp.gap}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Workflows Tab ──
function WorkflowsTab() {
  return (
    <div className="space-y-3">
      {workflowsInventory.map(wf => (
        <div key={wf.id} className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <code className="text-xs" style={{ color: 'var(--brand-primary)' }}>{wf.id}</code>
              <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{wf.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{wf.module}</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ background: `${statusColors[wf.status]}20`, color: statusColors[wf.status] }}>
              {wf.status}
            </span>
          </div>
          {/* Stage pipeline */}
          <div className="flex items-center gap-1 flex-wrap mt-3">
            {wf.stages.map((stage, i) => (
              <React.Fragment key={stage}>
                <span className="text-[10px] px-2 py-1 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-secondary)' }}>
                  {stage}
                </span>
                {i < wf.stages.length - 1 && <span style={{ color: 'var(--text-muted)' }}>→</span>}
              </React.Fragment>
            ))}
          </div>
          <div className="text-[10px] mt-2" style={{ color: 'var(--text-muted)' }}>
            Implementation: <code>{wf.implementation}</code>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Real-time Tab ──
function RealtimeTab() {
  return (
    <div className="space-y-4">
      <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Socket.IO Events</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--shell-bg)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Namespace</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Event</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Direction</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Auth</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Room</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
              </tr>
            </thead>
            <tbody>
              {socketEvents.map((ev, i) => (
                <tr key={i} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="px-4 py-2">
                    <code className="text-xs" style={{ color: 'var(--text-primary)' }}>{ev.namespace}</code>
                  </td>
                  <td className="px-4 py-2">
                    <code className="text-xs" style={{ color: 'var(--brand-primary)' }}>{ev.event}</code>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-muted)' }}>{ev.direction}</span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="text-[10px]" style={{ color: ev.auth ? 'var(--semantic-success)' : 'var(--semantic-error)' }}>
                      {ev.auth ? '✓' : '✗'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{ev.room}</code>
                  </td>
                  <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{ev.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Jobs Tab ──
function JobsTab() {
  return (
    <div className="rounded-[var(--density-border-radius)] overflow-hidden" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Background Jobs & Schedules</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--shell-bg)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Job</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Schedule</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Handler</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {backgroundJobs.map(job => (
              <tr key={job.name} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                <td className="px-4 py-2">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{job.name}</code>
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{job.schedule}</td>
                <td className="px-4 py-2">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{job.handler}</code>
                </td>
                <td className="px-4 py-2 text-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: `${statusColors[job.status]}20`, color: statusColors[job.status] }}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-xs" style={{ color: 'var(--text-secondary)' }}>{job.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
