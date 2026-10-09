import React, { useState } from 'react';
import {
  releases,
  gateRuns,
  featureFlags,
  flagChanges,
  quarantine,
  evidenceBundles,
  pipelineMetrics,
  type Release,
  type GateRun,
  type GateStatus,
  type ReleaseStatus,
} from '../data/cicdData';
import {
  GitBranch,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Shield,
  Zap,
  Package,
  FileText,
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Filter,
  Download,
  ChevronRight,
  ChevronDown,
  Flag,
  Bug,
  BarChart3,
  Layers,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// CI/CD CONSOLE — Part 03
// Technical Console › Releases & Quality Gates
// Route: /_tech/cicd
// ═══════════════════════════════════════════════════════════

type TabKey = 'overview' | 'releases' | 'flags' | 'quarantine' | 'evidence';

const tabs: { key: TabKey; label: string; icon: any }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'releases', label: 'Releases', icon: GitBranch },
  { key: 'flags', label: 'Feature Flags', icon: Flag },
  { key: 'quarantine', label: 'Quarantine', icon: Bug },
  { key: 'evidence', label: 'Evidence', icon: FileText },
];

const statusColors: Record<ReleaseStatus, string> = {
  DRAFT: 'var(--text-muted)',
  CANDIDATE: 'var(--info-600)',
  STAGING_VERIFIED: 'var(--success-600)',
  APPROVED: 'var(--brand-600)',
  DEPLOYING: 'var(--warning-600)',
  LIVE: 'var(--success-600)',
  ROLLED_BACK: 'var(--error-600)',
};

const gateStatusColors: Record<GateStatus, string> = {
  PASS: 'var(--success-600)',
  FAIL: 'var(--error-600)',
  WARN: 'var(--warning-600)',
  SKIP: 'var(--text-muted)',
  RUNNING: 'var(--info-600)',
  PENDING: 'var(--text-muted)',
};

const riskColors: Record<string, string> = {
  low: 'var(--success-600)',
  medium: 'var(--warning-600)',
  high: 'var(--error-600)',
  critical: 'var(--error-700)',
};

export function CICDConsole() {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  return (
    <div className="min-h-screen" style={{ background: 'var(--shell-bg)' }}>
      {/* Minimal Shell Bar */}
      <header className="h-10 flex items-center px-4 gap-3 border-b"
        style={{ background: 'var(--shell-bar-bg)', color: 'var(--shell-bar-text)', borderColor: 'var(--shell-bar-border)' }}>
        <a href="/" className="flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity">
          <Eye size={14} />
          <span>Back to App</span>
        </a>
        <span className="opacity-30">|</span>
        <GitBranch size={14} />
        <span className="text-xs font-medium">CI/CD & Release Engineering — Part 03</span>
        <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'var(--info-600)', color: '#fff' }}>
          TECH_ADMIN
        </span>
      </header>

      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Quality Gates & Release Management
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Part 03 — Pipeline orchestration, gate enforcement, feature flags & evidence bundles
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setSelectedRelease(null); }}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key ? '' : 'border-transparent hover:opacity-70'
                }`}
                style={{
                  color: activeTab === tab.key ? 'var(--brand-600)' : 'var(--text-secondary)',
                  borderBottomColor: activeTab === tab.key ? 'var(--brand-600)' : 'transparent',
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && !selectedRelease && <OverviewTab />}
          {activeTab === 'releases' && !selectedRelease && <ReleasesTab onSelectRelease={setSelectedRelease} />}
          {activeTab === 'flags' && <FlagsTab />}
          {activeTab === 'quarantine' && <QuarantineTab />}
          {activeTab === 'evidence' && <EvidenceTab />}
          {selectedRelease && <ReleaseDetail release={selectedRelease} onBack={() => setSelectedRelease(null)} />}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Pipeline Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard label="Total Releases" value={pipelineMetrics.totalReleases} icon={Package} color="var(--brand-600)" />
        <MetricCard label="Successful" value={pipelineMetrics.successfulReleases} icon={CheckCircle2} color="var(--success-600)" />
        <MetricCard label="Failed" value={pipelineMetrics.failedReleases} icon={XCircle} color="var(--error-600)" />
        <MetricCard label="Avg Lead Time" value={`${pipelineMetrics.avgLeadTimeHours}h`} icon={Clock} color="var(--info-600)" />
        <MetricCard label="Change Failure" value={`${pipelineMetrics.changeFailureRate}%`} icon={AlertCircle} color="var(--warning-600)" />
        <MetricCard label="Gate Pass Rate" value={`${pipelineMetrics.gatePassRate}%`} icon={Shield} color="var(--success-600)" />
      </div>

      {/* Recent Releases */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Recent Releases</h3>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Last 5 releases</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Version</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Parts</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Risk</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Author</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
              </tr>
            </thead>
            <tbody>
              {releases.slice(0, 5).map(rel => (
                <tr key={rel.id} className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-2.5">
                    <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{rel.version}</code>
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1">
                      {rel.parts.map(p => (
                        <span key={p} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: statusColors[rel.status] + '20', color: statusColors[rel.status] }}>
                      {rel.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: riskColors[rel.risk] + '20', color: riskColors[rel.risk] }}>
                      {rel.risk}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{rel.author}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{rel.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Flags */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Active Feature Flags</h3>
        </div>
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {featureFlags.filter(f => f.status === 'ACTIVE').slice(0, 6).map(flag => (
            <div key={flag.key} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-2">
                <code className="text-xs font-medium" style={{ color: 'var(--brand-600)' }}>{flag.key}</code>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                  ACTIVE
                </span>
              </div>
              <div className="text-[11px] mb-2" style={{ color: 'var(--text-secondary)' }}>{flag.description}</div>
              <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
                <span>{flag.partNo}</span>
                <span>{flag.owner}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: any; icon: any; color: string }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RELEASES TAB
// ═══════════════════════════════════════════════════════════

function ReleasesTab({ onSelectRelease }: { onSelectRelease: (rel: Release) => void }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>All Releases</h3>
        <div className="flex items-center gap-2">
          <button className="text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 hover:bg-[var(--card-hover)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Filter size={12} />
            Filter
          </button>
          <button className="text-xs px-3 py-1.5 rounded-lg border flex items-center gap-1.5 hover:bg-[var(--card-hover)] transition-colors"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Download size={12} />
            Export
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Version</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Commit</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Parts</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Risk</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Author</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Approved By</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Environment</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {releases.map(rel => (
              <tr key={rel.id} onClick={() => onSelectRelease(rel)}
                className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-2.5">
                  <code className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>{rel.version}</code>
                </td>
                <td className="px-4 py-2.5">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{rel.commitSha}</code>
                </td>
                <td className="px-4 py-2.5">
                  <div className="flex gap-1">
                    {rel.parts.map(p => (
                      <span key={p} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: statusColors[rel.status] + '20', color: statusColors[rel.status] }}>
                    {rel.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: riskColors[rel.risk] + '20', color: riskColors[rel.risk] }}>
                    {rel.risk}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{rel.author}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{rel.approvedBy || '—'}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {rel.environment}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{rel.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RELEASE DETAIL
// ═══════════════════════════════════════════════════════════

function ReleaseDetail({ release, onBack }: { release: Release; onBack: () => void }) {
  const releaseGates = gateRuns.filter(g => g.releaseId === release.id);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity" style={{ color: 'var(--text-link)' }}>
        ← Back to releases
      </button>

      {/* Release Header */}
      <div className="rounded-xl border p-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>{release.version}</h2>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ background: statusColors[release.status] + '20', color: statusColors[release.status] }}>
                {release.status.replace('_', ' ')}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <span className="flex items-center gap-1">
                <GitBranch size={12} />
                {release.commitSha}
              </span>
              <span>by {release.author}</span>
              <span>{release.createdAt}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: riskColors[release.risk] + '20', color: riskColors[release.risk] }}>
              Risk: {release.risk}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Parts</div>
            <div className="flex gap-1">
              {release.parts.map(p => (
                <span key={p} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                  {p}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Approved By</div>
            <div className="text-xs" style={{ color: 'var(--text-primary)' }}>{release.approvedBy || '—'}</div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Lead Time</div>
            <div className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>{release.leadTimeHours}h</div>
          </div>
          <div>
            <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>Environment</div>
            <div className="text-xs" style={{ color: 'var(--text-primary)' }}>{release.environment}</div>
          </div>
        </div>

        {release.rollbackPlan && (
          <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
            <div className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--warning-700)' }}>Rollback Plan</div>
            <div className="text-xs" style={{ color: 'var(--warning-800)' }}>{release.rollbackPlan}</div>
          </div>
        )}
      </div>

      {/* Gate Matrix */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Quality Gate Matrix</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Gate</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Duration</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Metrics</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Started</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Finished</th>
              </tr>
            </thead>
            <tbody>
              {releaseGates.map(gate => (
                <tr key={gate.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-2.5">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{gate.gate}</span>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 w-fit"
                      style={{ background: gateStatusColors[gate.status] + '20', color: gateStatusColors[gate.status] }}>
                      {gate.status === 'PASS' && <CheckCircle2 size={10} />}
                      {gate.status === 'FAIL' && <XCircle size={10} />}
                      {gate.status === 'WARN' && <AlertCircle size={10} />}
                      {gate.status === 'RUNNING' && <Activity size={10} className="animate-pulse" />}
                      {gate.status === 'PENDING' && <Clock size={10} />}
                      {gate.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>{gate.duration}</td>
                  <td className="px-4 py-2.5">
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {Object.entries(gate.metrics).map(([k, v]) => (
                        <span key={k} className="mr-2">
                          <span className="font-medium">{k}:</span> {String(v)}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{gate.startedAt}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{gate.finishedAt || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FLAGS TAB
// ═══════════════════════════════════════════════════════════

function FlagsTab() {
  return (
    <div className="space-y-6">
      {/* Flag Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Flags" value={featureFlags.length} icon={Flag} color="var(--brand-600)" />
        <MetricCard label="Active" value={featureFlags.filter(f => f.status === 'ACTIVE').length} icon={CheckCircle2} color="var(--success-600)" />
        <MetricCard label="Prod Enabled" value={featureFlags.filter(f => f.defaultByEnv.production).length} icon={Zap} color="var(--info-600)" />
        <MetricCard label="Kill Switches" value={featureFlags.filter(f => f.killSwitch).length} icon={Pause} color="var(--error-600)" />
      </div>

      {/* Feature Flags Table */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Feature Flag Registry</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Flag Key</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Part</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Owner</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Dev</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Staging</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Prod</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Targeting</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Changed</th>
              </tr>
            </thead>
            <tbody>
              {featureFlags.map(flag => (
                <tr key={flag.key} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-2.5">
                    <code className="text-xs font-medium" style={{ color: 'var(--brand-600)' }}>{flag.key}</code>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                      {flag.partNo}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{flag.owner}</td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${flag.defaultByEnv.development ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${flag.defaultByEnv.staging ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${flag.defaultByEnv.production ? 'bg-green-500' : 'bg-gray-300'}`} />
                  </td>
                  <td className="px-4 py-2.5">
                    <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{flag.targeting}</code>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                      {flag.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    {flag.lastChanged}
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>by {flag.changedBy}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flag Change History */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Flag Change History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Flag</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Environment</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Old</th>
                <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>New</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reason</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Changed By</th>
                <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Changed At</th>
              </tr>
            </thead>
            <tbody>
              {flagChanges.map(change => (
                <tr key={change.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-2.5">
                    <code className="text-xs font-medium" style={{ color: 'var(--brand-600)' }}>{change.flagKey}</code>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {change.environment}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${change.oldValue ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                      {change.oldValue ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${change.newValue ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {change.newValue ? 'ON' : 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>{change.reason}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{change.changedBy}</td>
                  <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{change.changedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// QUARANTINE TAB
// ═══════════════════════════════════════════════════════════

function QuarantineTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Flaky Test Quarantine</h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {quarantine.filter(q => q.status === 'QUARANTINED').length} active
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Test ID</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Test Name</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reason</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Owner</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Expires</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Quarantined</th>
            </tr>
          </thead>
          <tbody>
            {quarantine.map(entry => (
              <tr key={entry.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-2.5">
                  <code className="text-xs font-medium" style={{ color: 'var(--brand-600)' }}>{entry.testId}</code>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>{entry.testName}</td>
                <td className="px-4 py-2.5 text-xs max-w-xs" style={{ color: 'var(--text-secondary)' }}>{entry.reason}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{entry.owner}</td>
                <td className="px-4 py-2.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: entry.status === 'QUARANTINED' ? 'var(--warning-50)' : entry.status === 'FIXED' ? 'var(--success-50)' : 'var(--surface-sunken)',
                      color: entry.status === 'QUARANTINED' ? 'var(--warning-700)' : entry.status === 'FIXED' ? 'var(--success-700)' : 'var(--text-muted)',
                    }}>
                    {entry.status}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>{entry.expiresAt}</td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{entry.quarantinedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EVIDENCE TAB
// ═══════════════════════════════════════════════════════════

function EvidenceTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Part Evidence Bundles</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Part</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Title</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Tests</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Coverage</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Contract</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Schema</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Screenshots</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Audit</th>
              <th className="px-4 py-2 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Trace %</th>
              <th className="px-4 py-2 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {evidenceBundles.map(bundle => (
              <tr key={bundle.partNo} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-2.5">
                  <span className="text-xs font-semibold" style={{ color: 'var(--brand-600)' }}>{bundle.partNo}</span>
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>{bundle.partTitle}</td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{
                      background: bundle.status === 'COMPLETE' ? 'var(--success-50)' : bundle.status === 'IN_PROGRESS' ? 'var(--info-50)' : 'var(--surface-sunken)',
                      color: bundle.status === 'COMPLETE' ? 'var(--success-700)' : bundle.status === 'IN_PROGRESS' ? 'var(--info-700)' : 'var(--text-muted)',
                    }}>
                    {bundle.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>{bundle.testReports}</td>
                <td className="px-4 py-2.5 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>{bundle.coveragePercent}%</td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: bundle.contractDiff === 'CLEAN' ? 'var(--success-50)' : bundle.contractDiff === 'BREAKING' ? 'var(--error-50)' : 'var(--surface-sunken)',
                      color: bundle.contractDiff === 'CLEAN' ? 'var(--success-700)' : bundle.contractDiff === 'BREAKING' ? 'var(--error-700)' : 'var(--text-muted)',
                    }}>
                    {bundle.contractDiff}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className="text-[10px] px-1.5 py-0.5 rounded"
                    style={{
                      background: bundle.schemaDiff === 'CLEAN' ? 'var(--success-50)' : bundle.schemaDiff === 'CHANGES' ? 'var(--warning-50)' : 'var(--surface-sunken)',
                      color: bundle.schemaDiff === 'CLEAN' ? 'var(--success-700)' : bundle.schemaDiff === 'CHANGES' ? 'var(--warning-700)' : 'var(--text-muted)',
                    }}>
                    {bundle.schemaDiff}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>{bundle.screenshots}</td>
                <td className="px-4 py-2.5 text-center">
                  {bundle.auditRecord ? (
                    <CheckCircle2 size={14} style={{ color: 'var(--success-600)' }} />
                  ) : (
                    <XCircle size={14} style={{ color: 'var(--text-muted)' }} />
                  )}
                </td>
                <td className="px-4 py-2.5 text-center text-xs tabular-nums font-medium" style={{ color: bundle.traceability === 100 ? 'var(--success-600)' : 'var(--text-secondary)' }}>
                  {bundle.traceability}%
                </td>
                <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{bundle.lastUpdated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
