import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  Filter,
  Search,
  Eye,
} from 'lucide-react';
import {
  apiClients,
  apiAuditLogs,
  getHttpMethodColor,
  getHttpStatusColor,
  type ApiAuditLog,
} from '../data/apiPlatformData';
import { getClientUsageStats, detectAnomalies, type ClientUsageStats, type AnomalyAlert } from '../core/ApiPlatformService';

// ═══════════════════════════════════════════════════════════
// API USAGE DASHBOARD — Part 18
// Route: /_tech/devapi/usage
// ═══════════════════════════════════════════════════════════

export function ApiUsageDashboard() {
  const [selectedClient, setSelectedClient] = useState<string>('ALL');
  const [filterMethod, setFilterMethod] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const clientStats = selectedClient === 'ALL'
    ? apiClients.map(c => getClientUsageStats(c.id))
    : [getClientUsageStats(selectedClient)];

  const anomalies = detectAnomalies();

  let filteredLogs = apiAuditLogs;
  if (selectedClient !== 'ALL') {
    filteredLogs = filteredLogs.filter(l => l.client_id === selectedClient);
  }
  if (filterMethod !== 'ALL') {
    filteredLogs = filteredLogs.filter(l => l.method === filterMethod);
  }
  if (filterStatus !== 'ALL') {
    const statusRange = filterStatus.split('-');
    filteredLogs = filteredLogs.filter(l => 
      l.status >= parseInt(statusRange[0]) && l.status < parseInt(statusRange[1])
    );
  }
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredLogs = filteredLogs.filter(l =>
      l.route.toLowerCase().includes(query) ||
      l.client_name.toLowerCase().includes(query) ||
      l.correlation_id.toLowerCase().includes(query)
    );
  }

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <BarChart3 size={24} style={{ color: 'var(--brand-600)' }} />
              API Usage Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor API usage, performance, and anomalies (CP-API-03)
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Clients</option>
            {apiClients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Methods</option>
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Status</option>
            <option value="200-300">2xx Success</option>
            <option value="300-400">3xx Redirect</option>
            <option value="400-500">4xx Client Error</option>
            <option value="500-600">5xx Server Error</option>
          </select>
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by route, client, or correlation ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Anomaly Alerts */}
        {anomalies.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle size={16} style={{ color: 'var(--warning-600)' }} />
                Anomaly Alerts (CP-API-03)
              </h3>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}>
                {anomalies.length} alert{anomalies.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {anomalies.map((alert, idx) => (
                <AnomalyAlertCard key={idx} alert={alert} />
              ))}
            </div>
          </div>
        )}

        {/* Client Usage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clientStats.map(stats => (
            <ClientUsageCard key={stats.client_id} stats={stats} />
          ))}
        </div>

        {/* Audit Logs */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Activity size={16} style={{ color: 'var(--brand-600)' }} />
              API Audit Logs
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Method</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Route</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Latency</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Records</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Correlation ID</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.slice(0, 20).map(log => (
                  <tr key={log.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {new Date(log.at).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {log.client_name}
                      </div>
                      {log.user_name && (
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {log.user_name}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-bold px-2 py-0.5 rounded"
                        style={{
                          background: getHttpMethodColor(log.method) + '20',
                          color: getHttpMethodColor(log.method),
                        }}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {log.route}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: getHttpStatusColor(log.status) + '20',
                          color: getHttpStatusColor(log.status),
                        }}>
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                      {log.latency_ms}ms
                    </td>
                    <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                      {log.records_touched}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {log.correlation_id}
                      </code>
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

// ═══════════════════════════════════════════════════════════
// ANOMALY ALERT CARD
// ═══════════════════════════════════════════════════════════

function AnomalyAlertCard({ alert }: { alert: AnomalyAlert }) {
  const severityColors = {
    low: 'var(--info-600)',
    medium: 'var(--warning-600)',
    high: 'var(--error-600)',
  };

  const typeIcons = {
    error_spike: '📈',
    scope_probing: '🔍',
    volume_anomaly: '📊',
  };

  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3">
          <div className="text-2xl">{typeIcons[alert.anomaly_type]}</div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {alert.client_name}
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
              {alert.description}
            </div>
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: severityColors[alert.severity] + '20',
            color: severityColors[alert.severity],
          }}>
          {alert.severity}
        </span>
      </div>
      <div className="text-[10px] ml-10" style={{ color: 'var(--text-muted)' }}>
        Detected: {new Date(alert.detected_at).toLocaleString()}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLIENT USAGE CARD
// ═══════════════════════════════════════════════════════════

function ClientUsageCard({ stats }: { stats: ClientUsageStats }) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {stats.client_name}
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Last 24h
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Total Calls
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {stats.total_calls_24h.toLocaleString()}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Error Rate
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: stats.error_rate_24h > 5 ? 'var(--error-600)' : 'var(--text-primary)' }}>
            {stats.error_rate_24h.toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Avg Latency
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {Math.round(stats.avg_latency_ms)}ms
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Quota Usage
          </div>
          <div className="text-lg font-bold tabular-nums" style={{ color: stats.quota_usage_percent > 80 ? 'var(--warning-600)' : 'var(--text-primary)' }}>
            {stats.quota_usage_percent.toFixed(1)}%
          </div>
        </div>
      </div>

      {stats.top_routes.length > 0 && (
        <div>
          <div className="text-[10px] font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Top Routes
          </div>
          <div className="space-y-1">
            {stats.top_routes.slice(0, 3).map((route, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <code className="flex-1 truncate" style={{ color: 'var(--text-secondary)' }}>
                  {route.route}
                </code>
                <span className="ml-2 tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {route.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
