import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Clock, Lock, Key, FileWarning, GitBranch, Package, AlertCircle } from 'lucide-react';
import { 
  pipelineRuns, 
  routeRegistry, 
  dependencies, 
  riskAcceptances, 
  legacyFindings, 
  secretRefs,
  getSeverityColor, 
  getPipelineResultColor,
  getExpiringRiskAcceptances,
  getBlockedBuilds,
  type PipelineRun,
  type RouteRegistryEntry,
  type Dependency,
  type RiskAcceptance,
  type LegacyFinding
} from '../data/securityData';

// ═══════════════════════════════════════════════════════════
// SECURE-BY-DESIGN CONSOLE — Part 08
// Route: /_tech/secbase
// ═══════════════════════════════════════════════════════════

export function SecureByDesignConsole() {
  const [activeTab, setActiveTab] = useState<'overview' | 'pipeline' | 'routes' | 'dependencies' | 'risks' | 'findings' | 'secrets'>('overview');

  const blockedBuilds = getBlockedBuilds();
  const expiringRisks = getExpiringRiskAcceptances(30);
  const criticalFindings = legacyFindings.filter(f => f.severity === 'critical' && f.status !== 'closed');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield size={24} style={{ color: 'var(--brand-600)' }} />
              Secure-by-Design Console
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Security Pipeline, Route Registry, Dependencies & Risk Management
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'pipeline', label: 'Pipeline Runs', icon: GitBranch },
            { id: 'routes', label: 'Route Registry', icon: Lock },
            { id: 'dependencies', label: 'Dependencies', icon: Package },
            { id: 'risks', label: 'Risk Acceptances', icon: AlertTriangle },
            { id: 'findings', label: 'Legacy Findings', icon: FileWarning },
            { id: 'secrets', label: 'Secrets', icon: Key },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
                }`}
                style={{
                  background: activeTab === tab.id ? 'var(--brand-600)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && <OverviewTab blockedBuilds={blockedBuilds} expiringRisks={expiringRisks} criticalFindings={criticalFindings} />}
        {activeTab === 'pipeline' && <PipelineTab />}
        {activeTab === 'routes' && <RoutesTab />}
        {activeTab === 'dependencies' && <DependenciesTab />}
        {activeTab === 'risks' && <RisksTab />}
        {activeTab === 'findings' && <FindingsTab />}
        {activeTab === 'secrets' && <SecretsTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

function OverviewTab({ blockedBuilds, expiringRisks, criticalFindings }: { 
  blockedBuilds: PipelineRun[]; 
  expiringRisks: RiskAcceptance[]; 
  criticalFindings: LegacyFinding[];
}) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Blocked Builds"
          value={blockedBuilds.length}
          icon={XCircle}
          color="var(--error-600)"
          description="Builds blocked by security gates"
        />
        <SummaryCard
          title="Expiring Risks"
          value={expiringRisks.length}
          icon={Clock}
          color="var(--warning-600)"
          description="Risk acceptances expiring in 30 days"
        />
        <SummaryCard
          title="Critical Findings"
          value={criticalFindings.length}
          icon={AlertTriangle}
          color="var(--error-700)"
          description="Open critical legacy findings"
        />
        <SummaryCard
          title="Registered Routes"
          value={routeRegistry.length}
          icon={Lock}
          color="var(--success-600)"
          description="Routes in zero-trust registry"
        />
      </div>

      {/* Recent Blocked Builds */}
      {blockedBuilds.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <XCircle size={16} style={{ color: 'var(--error-600)' }} />
              Recently Blocked Builds
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {blockedBuilds.slice(0, 5).map(run => (
              <div key={run.id} className="px-4 py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {run.buildRef}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {run.gate} gate · {new Date(run.at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                    {run.findingsBySeverity.critical} critical
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--error-50)', color: 'var(--error-600)' }}>
                    {run.findingsBySeverity.high} high
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical Findings */}
      {criticalFindings.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--error-700)' }} />
              Critical Legacy Findings
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {criticalFindings.map(finding => (
              <div key={finding.id} className="px-4 py-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {finding.type.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                    {finding.status}
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {finding.location}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {finding.remediationPlan}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PIPELINE TAB
// ═══════════════════════════════════════════════════════════

function PipelineTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Pipeline Security Gate Results
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Build</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Commit</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Gate</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Result</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Critical</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>High</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Medium</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Low</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {pipelineRuns.map(run => (
              <tr key={run.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {run.buildRef}
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {run.commitSha.substring(0, 12)}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {run.gate}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: getPipelineResultColor(run.result) + '20', 
                      color: getPipelineResultColor(run.result) 
                    }}>
                    {run.result.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: run.findingsBySeverity.critical > 0 ? 'var(--error-700)' : 'var(--text-muted)' }}>
                  {run.findingsBySeverity.critical}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: run.findingsBySeverity.high > 0 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                  {run.findingsBySeverity.high}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: run.findingsBySeverity.medium > 0 ? 'var(--warning-600)' : 'var(--text-muted)' }}>
                  {run.findingsBySeverity.medium}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {run.findingsBySeverity.low}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(run.at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ROUTES TAB
// ═══════════════════════════════════════════════════════════

function RoutesTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Route Registry — Zero-Trust Enforcement
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Method</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Path</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Permission</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scope</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rate Limit</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Idempotent</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Module</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {routeRegistry.map(route => (
              <tr key={route.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" 
                    style={{ 
                      background: route.method === 'GET' ? 'var(--info-50)' : 
                                 route.method === 'POST' ? 'var(--success-50)' : 
                                 route.method === 'PUT' ? 'var(--warning-50)' : 
                                 route.method === 'DELETE' ? 'var(--error-50)' : 'var(--surface-sunken)',
                      color: route.method === 'GET' ? 'var(--info-700)' : 
                             route.method === 'POST' ? 'var(--success-700)' : 
                             route.method === 'PUT' ? 'var(--warning-700)' : 
                             route.method === 'DELETE' ? 'var(--error-700)' : 'var(--text-primary)'
                    }}>
                    {route.method}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs" style={{ color: 'var(--text-primary)' }}>
                    {route.pathPattern}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                    {route.permissionKey}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {route.scopeRule}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {route.rateLimitGroup}
                </td>
                <td className="px-4 py-3 text-center">
                  {route.idempotencyRequired ? (
                    <CheckCircle size={14} style={{ color: 'var(--success-600)' }} />
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {route.ownerModule}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: route.status === 'active' ? 'var(--success-50)' : 'var(--surface-sunken)', 
                      color: route.status === 'active' ? 'var(--success-700)' : 'var(--text-muted)' 
                    }}>
                    {route.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEPENDENCIES TAB
// ═══════════════════════════════════════════════════════════

function DependenciesTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Dependency Inventory
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Ecosystem</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Package</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Version</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Licence</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Advisories</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Added By</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reviewed By</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {dependencies.map(dep => (
              <tr key={dep.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {dep.ecosystem}
                </td>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {dep.package}
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {dep.version}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {dep.licenceSpdx}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs tabular-nums" style={{ color: dep.openAdvisories > 0 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                    {dep.openAdvisories}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {dep.addedBy}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {dep.reviewedBy || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: dep.status === 'approved' ? 'var(--success-50)' : 
                                 dep.status === 'blocked' ? 'var(--error-50)' : 'var(--surface-sunken)', 
                      color: dep.status === 'approved' ? 'var(--success-700)' : 
                             dep.status === 'blocked' ? 'var(--error-700)' : 'var(--text-muted)' 
                    }}>
                    {dep.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RISKS TAB
// ═══════════════════════════════════════════════════════════

function RisksTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Risk Acceptances
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Finding</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Justification</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Compensating Controls</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Approved By</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Expires</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {riskAcceptances.map(risk => (
              <tr key={risk.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs" style={{ color: 'var(--text-primary)' }}>
                    {risk.findingRef}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: getSeverityColor(risk.severity) + '20', 
                      color: getSeverityColor(risk.severity) 
                    }}>
                    {risk.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                  {risk.justification}
                </td>
                <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                  {risk.compensatingControls}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {risk.approvedBy}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(risk.expiresAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: risk.status === 'active' ? 'var(--success-50)' : 
                                 risk.status === 'expired' ? 'var(--error-50)' : 'var(--surface-sunken)', 
                      color: risk.status === 'active' ? 'var(--success-700)' : 
                             risk.status === 'expired' ? 'var(--error-700)' : 'var(--text-muted)' 
                    }}>
                    {risk.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// FINDINGS TAB
// ═══════════════════════════════════════════════════════════

function FindingsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Legacy Security Findings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Location</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Remediation Plan</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Feature Flag</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Discovered</th>
            </tr>
          </thead>
          <tbody>
            {legacyFindings.map(finding => (
              <tr key={finding.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {finding.type.replace(/_/g, ' ')}
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {finding.location}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: getSeverityColor(finding.severity) + '20', 
                      color: getSeverityColor(finding.severity) 
                    }}>
                    {finding.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                  {finding.remediationPlan}
                </td>
                <td className="px-4 py-3">
                  {finding.flagCode ? (
                    <code className="text-[10px]" style={{ color: 'var(--brand-600)' }}>
                      {finding.flagCode}
                    </code>
                  ) : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" 
                    style={{ 
                      background: finding.status === 'closed' ? 'var(--success-50)' : 
                                 finding.status === 'open' ? 'var(--error-50)' : 
                                 finding.status === 'fixed_behind_flag' ? 'var(--warning-50)' : 'var(--surface-sunken)', 
                      color: finding.status === 'closed' ? 'var(--success-700)' : 
                             finding.status === 'open' ? 'var(--error-700)' : 
                             finding.status === 'fixed_behind_flag' ? 'var(--warning-700)' : 'var(--text-muted)' 
                    }}>
                    {finding.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(finding.discoveredAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SECRETS TAB
// ═══════════════════════════════════════════════════════════

function SecretsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Secret References (Vault-Backed)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Name</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Environment</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Vault Path</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Owner</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rotation (Days)</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Rotated</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Next Rotation</th>
            </tr>
          </thead>
          <tbody>
            {secretRefs.map(secret => (
              <tr key={secret.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {secret.name}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {secret.environment}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {secret.vaultPath}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {secret.owner}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {secret.rotationDays}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(secret.lastRotatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(secret.nextRotationAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUMMARY CARD COMPONENT
// ═══════════════════════════════════════════════════════════

function SummaryCard({ title, value, icon: Icon, color, description }: {
  title: string;
  value: number;
  icon: any;
  color: string;
  description: string;
}) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        {title}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
        {description}
      </div>
    </div>
  );
}
