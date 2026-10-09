import React, { useState } from 'react';
import { getIcon } from '../data/registries';

// ═══════════════════════════════════════════════════════════
// OBJECT PAGE TEMPLATE (DS-27)
// Header facts, Gate-status panel, standard tabs
// ═══════════════════════════════════════════════════════════

interface ObjectPageProps {
  title: string;
  subtitle?: string;
  status: string;
  statusColor: string;
  headerFacts: { label: string; value: string; format?: string }[];
  tabs: { key: string; label: string; content: React.ReactNode }[];
  actions?: { label: string; variant: 'primary' | 'secondary' | 'danger'; onClick?: () => void }[];
}

export function ObjectPage({ title, subtitle, status, statusColor, headerFacts, tabs, actions }: ObjectPageProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.key || '');

  const BackIcon = getIcon('action.back');
  const MoreIcon = getIcon('action.more');

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Page Header */}
      <div className="px-[var(--density-spacing-xl)] pt-[var(--density-spacing-xl)] pb-[var(--density-spacing-md)]"
        style={{ background: 'var(--surface-bg)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <button className="p-1 rounded hover:opacity-70 transition-opacity" style={{ color: 'var(--text-muted)' }}>
                <BackIcon size={16} />
              </button>
              <h1 className="text-lg font-semibold truncate" style={{ color: 'var(--text-primary)' }}>{title}</h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                style={{ background: `${statusColor}15`, color: statusColor }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor }} />
                {status}
              </span>
            </div>
            {subtitle && <p className="text-sm ml-7" style={{ color: 'var(--text-secondary)' }}>{subtitle}</p>}

            {/* Header Facts */}
            <div className="flex flex-wrap gap-4 mt-3 ml-7">
              {headerFacts.map((fact, i) => (
                <div key={i}>
                  <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{fact.label}</div>
                  <div className={`text-sm font-medium ${fact.format === 'currency' ? 'tabular-nums' : ''}`} style={{ color: 'var(--text-primary)' }}>
                    {fact.format === 'currency' ? `₹${fact.value}` : fact.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {actions?.map((action, i) => (
              <button
                key={i}
                onClick={action.onClick}
                className={`px-3 py-1.5 rounded-[var(--density-border-radius)] text-xs font-medium transition-colors hover:opacity-90 ${
                  action.variant === 'primary' ? 'text-white' :
                  action.variant === 'danger' ? 'border' : 'border'
                }`}
                style={{
                  background: action.variant === 'primary' ? 'var(--brand-primary)' : 'transparent',
                  color: action.variant === 'primary' ? '#fff' :
                    action.variant === 'danger' ? 'var(--semantic-error)' : 'var(--text-secondary)',
                  borderColor: action.variant !== 'primary' ? 'var(--border-color)' : undefined,
                }}
              >
                {action.label}
              </button>
            ))}
            <button className="p-1.5 rounded-[var(--density-border-radius)] border hover:opacity-70 transition-opacity"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-muted)' }}>
              <MoreIcon size={16} />
            </button>
          </div>
        </div>

        {/* Gate Status Panel */}
        <div className="mt-4 ml-7 flex items-center gap-2 px-3 py-2 rounded-[var(--density-border-radius)]"
          style={{ background: 'var(--shell-bg)' }}>
          <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Protocol Gate</span>
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            PLAN ✓ → VERIFY ✓ → APPROVE → EXECUTE → RECORD → CLOSE
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-[var(--density-spacing-xl)] border-b" style={{ borderColor: 'var(--border-color)', background: 'var(--surface-bg)' }}>
        <div className="flex gap-0 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.key ? '' : 'border-transparent hover:opacity-70'
              }`}
              style={{
                color: activeTab === tab.key ? 'var(--brand-primary)' : 'var(--text-secondary)',
                borderBottomColor: activeTab === tab.key ? 'var(--brand-primary)' : 'transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-[var(--density-spacing-xl)]">
        {tabs.find(t => t.key === activeTab)?.content}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TECHNICAL CONSOLE (DS-32)
// /_tech routes — read-only program baseline
// ═══════════════════════════════════════════════════════════

export function TechnicalConsole() {
  const DatabaseIcon = getIcon('sys.database');
  const ShieldIcon = getIcon('sys.security');
  const GitIcon = getIcon('sys.git');
  const ActivityIcon = getIcon('sys.activity');
  const LayersIcon = getIcon('sys.layers');
  const EyeIcon = getIcon('sys.eye');
  const HomeIcon = getIcon('nav.home');

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
        <span className="text-xs font-medium">Technical Console</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--semantic-info)', color: '#fff' }}>
          TECH_ADMIN
        </span>
      </header>
      <div className="p-[var(--density-spacing-xl)] max-w-[1440px] mx-auto">
      {/* Tech Console Header */}
      <div className="flex items-center gap-2 mb-[var(--density-spacing-xl)]">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--semantic-info)', color: '#fff' }}>
          <ShieldIcon size={16} />
        </div>
        <div>
          <h1 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Technical Console</h1>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Program baseline & system diagnostics — TECH_ADMIN only</p>
        </div>
      </div>

      {/* Quick Navigation to Audit & Preview */}
      <div className="mb-[var(--density-spacing-lg)] flex flex-wrap gap-2">
        <a href="/_tech/audit" className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--density-border-radius)] text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-primary)', color: '#fff' }}>
          {React.createElement(getIcon('sys.eye'), { size: 16 })}
          System Audit (Part 01)
        </a>
        <a href="/preview" className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--density-border-radius)] text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: '#d97706', color: '#fff' }}>
          {React.createElement(getIcon('sys.eye'), { size: 16 })}
          Dashboard Preview (Part 02)
        </a>
        <a href="/_tech/cicd" className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--density-border-radius)] text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: '#059669', color: '#fff' }}>
          {React.createElement(getIcon('sys.git'), { size: 16 })}
          CI/CD & Releases (Part 03)
        </a>
        <a href="/_tech/core" className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--density-border-radius)] text-sm font-medium transition-colors hover:opacity-90"
          style={{ background: '#7c3aed', color: '#fff' }}>
          {React.createElement(getIcon('sys.zap'), { size: 16 })}
          Core Services (Part 04)
        </a>
        <a href="/_tech/preview/status" className="inline-flex items-center gap-2 px-4 py-2 rounded-[var(--density-border-radius)] text-sm font-medium transition-colors hover:opacity-90 border"
          style={{ borderColor: 'var(--border-color)', color: 'var(--text-secondary)' }}>
          {React.createElement(getIcon('sys.zap'), { size: 16 })}
          Widget Status Board
        </a>
      </div>

      {/* Baseline Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--density-spacing-md)] mb-[var(--density-spacing-xl)]">
        <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <GitIcon size={16} style={{ color: 'var(--semantic-info)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Git Baseline</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Tag</span>
              <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: 'var(--shell-bg)', color: 'var(--text-primary)' }}>erp-baseline-v0</code>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Branch</span>
              <span style={{ color: 'var(--text-primary)' }}>erp-program/baseline</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Commit</span>
              <code className="text-[10px]" style={{ color: 'var(--text-primary)' }}>a3f8c2d</code>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Status</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--semantic-success)', color: '#fff' }}>Verified</span>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <DatabaseIcon size={16} style={{ color: 'var(--semantic-success)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Database Baseline</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Tables</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>42</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Total Rows</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>1,247,832</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Schema Hash</span>
              <code className="text-[10px]" style={{ color: 'var(--text-primary)' }}>sha256:8f3a...c2d1</code>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Integrity</span>
              <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--semantic-success)', color: '#fff' }}>PASS</span>
            </div>
          </div>
        </div>

        <div className="rounded-[var(--density-border-radius)] p-4" style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <ActivityIcon size={16} style={{ color: 'var(--semantic-warning)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Regression Suite</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Unit Tests</span>
              <span className="tabular-nums" style={{ color: 'var(--semantic-success)' }}>342 passed</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Integration</span>
              <span className="tabular-nums" style={{ color: 'var(--semantic-success)' }}>89 passed</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Golden Tests</span>
              <span className="tabular-nums" style={{ color: 'var(--semantic-success)' }}>24 passed</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-muted)' }}>Coverage</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>78.3%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Flags */}
      <div className="rounded-[var(--density-border-radius)] overflow-hidden mb-[var(--density-spacing-xl)]"
        style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
          <LayersIcon size={16} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Feature Flags</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--shell-bg)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Flag</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Description</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Scope</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Owner</th>
              </tr>
            </thead>
            <tbody>
              {[
                { key: 'ff.pgm', desc: 'Master program flag', scope: 'global', enabled: true, owner: 'Part 00' },
                { key: 'ff.pgm.theme', desc: 'Theme bridge', scope: 'global', enabled: true, owner: 'Part 00' },
                { key: 'ff.pgm.shell', desc: 'Application shell', scope: 'global', enabled: true, owner: 'Part 00' },
                { key: 'ff.pgm.launchpad', desc: 'Home launchpad', scope: 'global', enabled: true, owner: 'Part 00' },
                { key: 'ff.tech_console', desc: 'Technical Console', scope: 'role', enabled: true, owner: 'Part 00' },
                { key: 'ff.modules.procurement', desc: 'Procurement module', scope: 'company', enabled: true, owner: 'Part 20' },
                { key: 'ff.modules.inventory', desc: 'Inventory module', scope: 'company', enabled: true, owner: 'Part 25' },
                { key: 'ff.modules.project', desc: 'Project module', scope: 'company', enabled: true, owner: 'Part 40' },
              ].map(flag => (
                <tr key={flag.key} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="px-4 py-2.5">
                    <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-primary)' }}>{flag.key}</code>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{flag.desc}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--shell-bg)', color: 'var(--text-secondary)' }}>{flag.scope}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: flag.enabled ? 'var(--semantic-success)' : 'var(--text-muted)',
                        color: '#fff'
                      }}>
                      {flag.enabled ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{flag.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protocol Baseline */}
      <div className="rounded-[var(--density-border-radius)] overflow-hidden"
        style={{ background: 'var(--tile-bg)', border: '1px solid var(--tile-border)' }}>
        <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-color)' }}>
          <EyeIcon size={16} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Protocol Control Points</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--shell-bg)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Control</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Stage</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Control</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Mode</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'CP-PGM-01', stage: 'PLAN', control: 'Regression gate evidence exists', mode: 'OBSERVE' },
                { id: 'CP-PGM-02', stage: 'VERIFY', control: 'Baseline integrity re-run', mode: 'OBSERVE' },
                { id: 'CP-PGM-03', stage: 'CLOSE', control: 'DoD checklist signed', mode: 'OBSERVE' },
              ].map(cp => (
                <tr key={cp.id} className="border-t" style={{ borderColor: 'var(--border-color)' }}>
                  <td className="px-4 py-2.5">
                    <code className="text-xs" style={{ color: 'var(--brand-primary)' }}>{cp.id}</code>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>{cp.stage}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{cp.control}</td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--semantic-warning)', color: '#fff' }}>
                      {cp.mode}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
