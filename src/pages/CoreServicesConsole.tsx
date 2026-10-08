import React, { useState, useEffect } from 'react';
import { getAuditLog, getEventOutbox, getNotifications } from '../core/ServiceHooks';
import { sampleContext } from '../core/RequestContext';
import {
  Activity,
  Database,
  Bell,
  Mail,
  Zap,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Eye,
  GitBranch,
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════
// CORE SERVICES CONSOLE — Part 04
// Technical Console › Shared Services Monitor
// Route: /_tech/core
// ═══════════════════════════════════════════════════════════

export function CoreServicesConsole() {
  const [auditLog, setAuditLog] = useState(getAuditLog());
  const [eventOutbox, setEventOutbox] = useState(getEventOutbox());
  const [notifications, setNotifications] = useState(getNotifications());
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = () => {
    setAuditLog(getAuditLog());
    setEventOutbox(getEventOutbox());
    setNotifications(getNotifications());
    setLastRefresh(new Date());
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    const interval = setInterval(handleRefresh, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: 'var(--shell-bg)' }}>
      {/* Minimal Shell Bar */}
      <header
        className="h-10 flex items-center px-4 gap-3 border-b"
        style={{
          background: 'var(--shell-bar-bg)',
          color: 'var(--shell-bar-text)',
          borderColor: 'var(--shell-bar-border)',
        }}
      >
        <a
          href="/"
          className="flex items-center gap-2 text-xs opacity-80 hover:opacity-100 transition-opacity"
        >
          <Eye size={14} />
          <span>Back to App</span>
        </a>
        <span className="opacity-30">|</span>
        <Zap size={14} />
        <span className="text-xs font-medium">Core Services Monitor — Part 04</span>
        <span
          className="ml-auto text-[10px] px-2 py-0.5 rounded-full"
          style={{ background: 'var(--info-600)', color: '#fff' }}
        >
          TECH_ADMIN
        </span>
      </header>

      <div className="p-6 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
            Shared Services Monitor
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Part 04 — Core Enterprise ERP Foundation: Audit log, Event outbox, Notifications
          </p>
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
              style={{ background: 'var(--brand-600)', color: '#fff' }}
            >
              <RefreshCw size={12} />
              Refresh
            </button>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard
            label="Audit Entries"
            value={auditLog.length}
            icon={Activity}
            color="var(--brand-600)"
          />
          <MetricCard
            label="Pending Events"
            value={eventOutbox.filter((e) => e.status === 'PENDING').length}
            icon={Zap}
            color="var(--warning-600)"
          />
          <MetricCard
            label="Published Events"
            value={eventOutbox.filter((e) => e.status === 'PUBLISHED').length}
            icon={CheckCircle2}
            color="var(--success-600)"
          />
          <MetricCard
            label="Notifications"
            value={notifications.length}
            icon={Bell}
            color="var(--info-600)"
          />
        </div>

        {/* Health Status */}
        <div className="rounded-xl border overflow-hidden mb-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Service Health
            </h3>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <HealthIndicator label="Database" status="healthy" />
            <HealthIndicator label="Event Bus" status="healthy" />
            <HealthIndicator label="Notification Service" status="healthy" />
            <HealthIndicator label="File Storage" status="healthy" />
          </div>
        </div>

        {/* Audit Log */}
        <div className="rounded-xl border overflow-hidden mb-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Audit Entries
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {auditLog.length} total
            </span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            {auditLog.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No audit entries yet. Perform some actions to see audit logs.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Timestamp
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      User
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Action
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Entity
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Correlation ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.slice(-20).reverse().map((entry) => (
                    <tr key={entry.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      <td className="px-4 py-2.5 text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {entry.timestamp.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-primary)' }}>
                        {entry.userName}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            background:
                              entry.action === 'CREATE'
                                ? 'var(--success-50)'
                                : entry.action === 'UPDATE'
                                ? 'var(--info-50)'
                                : entry.action === 'DELETE'
                                ? 'var(--error-50)'
                                : 'var(--warning-50)',
                            color:
                              entry.action === 'CREATE'
                                ? 'var(--success-700)'
                                : entry.action === 'UPDATE'
                                ? 'var(--info-700)'
                                : entry.action === 'DELETE'
                                ? 'var(--error-700)'
                                : 'var(--warning-700)',
                          }}
                        >
                          {entry.action}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {entry.entityType}#{entry.entityId}
                      </td>
                      <td className="px-4 py-2.5">
                        <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {entry.correlationId}
                        </code>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Event Outbox */}
        <div className="rounded-xl border overflow-hidden mb-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Event Outbox
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {eventOutbox.length} total
            </span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            {eventOutbox.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No events in outbox. Events are created when business operations occur.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Event Name
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Aggregate
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Status
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Created
                    </th>
                    <th className="px-4 py-2 text-left text-xs font-medium sticky top-0" style={{ color: 'var(--text-muted)' }}>
                      Attempts
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventOutbox.slice(-20).reverse().map((entry) => (
                    <tr key={entry.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      <td className="px-4 py-2.5 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {entry.eventName}
                      </td>
                      <td className="px-4 py-2.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {entry.aggregateType}#{entry.aggregateId}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                          style={{
                            background:
                              entry.status === 'PUBLISHED'
                                ? 'var(--success-50)'
                                : entry.status === 'PENDING'
                                ? 'var(--warning-50)'
                                : entry.status === 'FAILED'
                                ? 'var(--error-50)'
                                : 'var(--surface-sunken)',
                            color:
                              entry.status === 'PUBLISHED'
                                ? 'var(--success-700)'
                                : entry.status === 'PENDING'
                                ? 'var(--warning-700)'
                                : entry.status === 'FAILED'
                                ? 'var(--error-700)'
                                : 'var(--text-muted)',
                          }}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {entry.createdAt.toLocaleString()}
                      </td>
                      <td className="px-4 py-2.5 text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {entry.attempts}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Notifications
            </h3>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {notifications.length} total
            </span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No notifications yet.
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {notifications.slice(-20).reverse().map((notif) => (
                  <div key={notif.id} className="p-4 flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background:
                          notif.type === 'SUCCESS'
                            ? 'var(--success-50)'
                            : notif.type === 'ERROR'
                            ? 'var(--error-50)'
                            : notif.type === 'WARNING'
                            ? 'var(--warning-50)'
                            : 'var(--info-50)',
                      }}
                    >
                      {notif.type === 'SUCCESS' ? (
                        <CheckCircle2 size={16} style={{ color: 'var(--success-600)' }} />
                      ) : notif.type === 'ERROR' ? (
                        <AlertCircle size={16} style={{ color: 'var(--error-600)' }} />
                      ) : (
                        <Bell size={16} style={{ color: notif.type === 'WARNING' ? 'var(--warning-600)' : 'var(--info-600)' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {notif.title}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {notif.message}
                      </div>
                      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                        {notif.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: any; color: string }) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

function HealthIndicator({ label, status }: { label: string; status: 'healthy' | 'degraded' | 'down' }) {
  const colors = {
    healthy: 'var(--success-600)',
    degraded: 'var(--warning-600)',
    down: 'var(--error-600)',
  };

  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full" style={{ background: colors[status] }} />
      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
        {label}
      </span>
      <span className="text-[10px] ml-auto" style={{ color: colors[status] }}>
        {status.toUpperCase()}
      </span>
    </div>
  );
}
