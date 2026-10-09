import React, { useState } from 'react';
import { Activity, AlertTriangle, CheckCircle, Clock, TrendingUp, Database, Zap, FileText } from 'lucide-react';
import { 
  slos, 
  incidents, 
  alertRules, 
  capacityRuns, 
  healthChecks, 
  slowQueries, 
  queueJobs,
  getSLOStatusColor,
  getIncidentSeverityColor,
  getIncidentStatusColor,
  getHealthStatusColor,
  getAlertSeverityColor,
  getJobStatusColor,
  formatDuration,
  type SLO,
  type Incident,
  type AlertRule,
  type HealthCheck
} from '../data/observabilityData';

// ═══════════════════════════════════════════════════════════
// OBSERVABILITY CONSOLE — Part 10
// Route: /_tech/obs
// ═══════════════════════════════════════════════════════════

export function ObservabilityConsole() {
  const [activeTab, setActiveTab] = useState<'overview' | 'slos' | 'incidents' | 'health' | 'queries' | 'queues' | 'capacity'>('overview');

  const openIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'ACKNOWLEDGED');
  const criticalSLOs = slos.filter(s => s.status === 'critical');
  const unhealthyServices = healthChecks.filter(h => h.status !== 'healthy');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Activity size={24} style={{ color: 'var(--brand-600)' }} />
              Observability Console
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              System health, SLOs, incidents, and performance monitoring
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'slos', label: 'SLOs', icon: TrendingUp },
            { id: 'incidents', label: 'Incidents', icon: AlertTriangle },
            { id: 'health', label: 'Health', icon: CheckCircle },
            { id: 'queries', label: 'Slow Queries', icon: Database },
            { id: 'queues', label: 'Queues', icon: Zap },
            { id: 'capacity', label: 'Capacity', icon: FileText },
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
        {activeTab === 'overview' && (
          <OverviewTab 
            openIncidents={openIncidents} 
            criticalSLOs={criticalSLOs} 
            unhealthyServices={unhealthyServices} 
          />
        )}
        {activeTab === 'slos' && <SLOsTab />}
        {activeTab === 'incidents' && <IncidentsTab />}
        {activeTab === 'health' && <HealthTab />}
        {activeTab === 'queries' && <SlowQueriesTab />}
        {activeTab === 'queues' && <QueuesTab />}
        {activeTab === 'capacity' && <CapacityTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

function OverviewTab({ 
  openIncidents, 
  criticalSLOs, 
  unhealthyServices 
}: { 
  openIncidents: Incident[]; 
  criticalSLOs: SLO[]; 
  unhealthyServices: HealthCheck[];
}) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Open Incidents"
          value={openIncidents.length}
          icon={AlertTriangle}
          color={openIncidents.length > 0 ? 'var(--error-600)' : 'var(--success-600)'}
          description={openIncidents.length > 0 ? 'Requires attention' : 'All clear'}
        />
        <SummaryCard
          title="Critical SLOs"
          value={criticalSLOs.length}
          icon={TrendingUp}
          color={criticalSLOs.length > 0 ? 'var(--error-600)' : 'var(--success-600)'}
          description={criticalSLOs.length > 0 ? 'Budget exhausted' : 'Within budget'}
        />
        <SummaryCard
          title="Unhealthy Services"
          value={unhealthyServices.length}
          icon={CheckCircle}
          color={unhealthyServices.length > 0 ? 'var(--warning-600)' : 'var(--success-600)'}
          description={unhealthyServices.length > 0 ? 'Degraded performance' : 'All healthy'}
        />
        <SummaryCard
          title="System Uptime"
          value="99.95%"
          icon={Activity}
          color="var(--success-600)"
          description="Last 30 days"
        />
      </div>

      {/* Open Incidents */}
      {openIncidents.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--error-600)' }} />
              Open Incidents
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {openIncidents.slice(0, 3).map(incident => (
              <div key={incident.id} className="px-4 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: getIncidentSeverityColor(incident.severity) + '20', color: getIncidentSeverityColor(incident.severity) }}>
                      {incident.severity}
                    </span>
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {incident.title}
                    </span>
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {incident.summary}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {incident.duration_minutes ? formatDuration(incident.duration_minutes * 60000) : 'Ongoing'}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {incident.owner_name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Critical SLOs */}
      {criticalSLOs.length > 0 && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <TrendingUp size={16} style={{ color: 'var(--error-600)' }} />
              Critical SLOs
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {criticalSLOs.map(slo => (
              <div key={slo.id} className="px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {slo.journey}
                  </div>
                  <div className="text-xs tabular-nums font-medium" style={{ color: 'var(--error-600)' }}>
                    {slo.current_pct.toFixed(2)}% / {slo.target_pct}%
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                  <div 
                    className="h-full rounded-full transition-all" 
                    style={{ 
                      width: `${Math.min(100, (slo.current_pct / slo.target_pct) * 100)}%`,
                      background: 'var(--error-600)'
                    }}
                  />
                </div>
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  Error budget: {slo.error_budget_remaining.toFixed(1)}% remaining
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Health */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <CheckCircle size={16} style={{ color: 'var(--brand-600)' }} />
            Service Health
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
          {healthChecks.map(check => (
            <div key={check.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {check.service}
                </div>
                <span className="w-2 h-2 rounded-full" style={{ background: getHealthStatusColor(check.status) }} />
              </div>
              <div className="text-xs tabular-nums mb-1" style={{ color: 'var(--text-secondary)' }}>
                {check.response_time_ms}ms
              </div>
              {check.details && (
                <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {check.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SLOs TAB
// ═══════════════════════════════════════════════════════════

function SLOsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Service Level Objectives
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Journey</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Target</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Current</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Budget Remaining</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Owner</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {slos.map(slo => (
              <tr key={slo.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {slo.journey}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {slo.code} · {slo.window_days}d window
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {slo.target_pct}%
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs tabular-nums font-medium" style={{ color: getSLOStatusColor(slo.status) }}>
                    {slo.current_pct.toFixed(2)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs tabular-nums" style={{ color: slo.error_budget_remaining < 0 ? 'var(--error-600)' : 'var(--text-secondary)' }}>
                    {slo.error_budget_remaining.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {slo.owner_name}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: getSLOStatusColor(slo.status) + '20', color: getSLOStatusColor(slo.status) }}>
                    {slo.status}
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
// INCIDENTS TAB
// ═══════════════════════════════════════════════════════════

function IncidentsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Incident Register
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Title</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Severity</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Owner</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Started</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Duration</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map(incident => (
              <tr key={incident.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {incident.code}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm" style={{ color: 'var(--text-primary)' }}>
                    {incident.title}
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {incident.summary}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: getIncidentSeverityColor(incident.severity) + '20', color: getIncidentSeverityColor(incident.severity) }}>
                    {incident.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: getIncidentStatusColor(incident.status) + '20', color: getIncidentStatusColor(incident.status) }}>
                    {incident.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {incident.owner_name}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(incident.started_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {incident.duration_minutes ? formatDuration(incident.duration_minutes * 60000) : '—'}
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
// HEALTH TAB
// ═══════════════════════════════════════════════════════════

function HealthTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {healthChecks.map(check => (
        <div key={check.id} className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {check.service}
            </div>
            <span className="w-3 h-3 rounded-full" style={{ background: getHealthStatusColor(check.status) }} />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Response Time</span>
              <span className="tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
                {check.response_time_ms}ms
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Last Checked</span>
              <span className="tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {new Date(check.last_checked).toLocaleTimeString()}
              </span>
            </div>
            {check.details && (
              <div className="pt-2 border-t text-[10px]" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}>
                {check.details}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SLOW QUERIES TAB
// ═══════════════════════════════════════════════════════════

function SlowQueriesTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Slow Query Worklist
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Query</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rows Examined</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rows Returned</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Index Used</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Called At</th>
            </tr>
          </thead>
          <tbody>
            {slowQueries.map(query => (
              <tr key={query.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <span className="text-xs tabular-nums font-medium" style={{ color: query.duration_ms > 2000 ? 'var(--error-600)' : 'var(--warning-600)' }}>
                    {formatDuration(query.duration_ms)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <code className="text-[10px] block max-w-md truncate" style={{ color: 'var(--text-secondary)' }}>
                    {query.query_text}
                  </code>
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {query.rows_examined.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {query.rows_returned.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  {query.index_used ? (
                    <CheckCircle size={14} style={{ color: 'var(--success-600)' }} />
                  ) : (
                    <AlertTriangle size={14} style={{ color: 'var(--warning-600)' }} />
                  )}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(query.called_at).toLocaleString()}
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
// QUEUES TAB
// ═══════════════════════════════════════════════════════════

function QueuesTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Queue & Job Monitor
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Queue</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Job Type</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Retries</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Duration</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Error</th>
            </tr>
          </thead>
          <tbody>
            {queueJobs.map(job => (
              <tr key={job.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {job.queue_name}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {job.job_type}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: getJobStatusColor(job.status) + '20', color: getJobStatusColor(job.status) }}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(job.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: job.retries > 0 ? 'var(--warning-600)' : 'var(--text-muted)' }}>
                  {job.retries}
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {job.duration_ms ? formatDuration(job.duration_ms) : '—'}
                </td>
                <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: job.error ? 'var(--error-600)' : 'var(--text-muted)' }}>
                  {job.error || '—'}
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
// CAPACITY TAB
// ═══════════════════════════════════════════════════════════

function CapacityTab() {
  return (
    <div className="space-y-4">
      {capacityRuns.map(run => (
        <div key={run.id} className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                {run.scenario}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {new Date(run.run_at).toLocaleString()}
              </div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: run.passed ? 'var(--success-50)' : 'var(--error-50)', color: run.passed ? 'var(--success-700)' : 'var(--error-700)' }}>
              {run.passed ? 'PASSED' : 'FAILED'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
            <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Avg Response</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {run.results.avg_response_ms}ms
              </div>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>P95 Response</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {run.results.p95_response_ms}ms
              </div>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>P99 Response</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {run.results.p99_response_ms}ms
              </div>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Error Rate</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {run.results.error_rate_pct}%
              </div>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Throughput</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {run.results.throughput_rps} rps
              </div>
            </div>
            <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
              <div className="text-[10px] mb-1" style={{ color: 'var(--text-muted)' }}>Concurrent Users</div>
              <div className="text-sm font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {run.volumes.concurrent_users.toLocaleString()}
              </div>
            </div>
          </div>

          {run.notes && (
            <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
              {run.notes}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUMMARY CARD COMPONENT
// ═══════════════════════════════════════════════════════════

function SummaryCard({ title, value, icon: Icon, color, description }: {
  title: string;
  value: number | string;
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
