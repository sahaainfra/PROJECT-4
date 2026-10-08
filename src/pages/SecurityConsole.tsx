import React, { useState } from 'react';
import { Shield, Monitor, Smartphone, Tablet, LogOut, AlertTriangle } from 'lucide-react';
import { sessions, securityEvents, loginHistory, getSecurityEventColor, getSecurityEventIcon, type Session, type SecurityEvent } from '../data/auditSecurityData';

// ═══════════════════════════════════════════════════════════
// SECURITY CONSOLE — Part 07
// Route: /admin/security
// ═══════════════════════════════════════════════════════════

export function SecurityConsole() {
  const [activeTab, setActiveTab] = useState<'sessions' | 'events' | 'logins'>('sessions');

  const activeSessions = sessions.filter(s => s.isActive);
  const openEvents = securityEvents.filter(e => e.status === 'OPEN' || e.status === 'ACKNOWLEDGED');

  const getDeviceIcon = (type: Session['deviceType']) => {
    switch (type) {
      case 'desktop': return <Monitor size={16} />;
      case 'mobile': return <Smartphone size={16} />;
      case 'tablet': return <Tablet size={16} />;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Security Console
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage sessions, monitor security events, and review login history
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'sessions' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'sessions' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'sessions' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Active Sessions ({activeSessions.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'events' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'events' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'events' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Security Events ({openEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('logins')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'logins' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'logins' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'logins' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Login History
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map(session => (
              <div key={session.id} className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getDeviceIcon(session.deviceType)}
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {session.deviceName}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {session.browser} · {session.os}
                      </div>
                    </div>
                  </div>
                  {session.isActive ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                      Revoked
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>User</span>
                    <span style={{ color: 'var(--text-primary)' }}>{session.userName}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>IP Address</span>
                    <code style={{ color: 'var(--text-primary)' }}>{session.ipAddress}</code>
                  </div>
                  {session.location && (
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Location</span>
                      <span style={{ color: 'var(--text-primary)' }}>{session.location}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Last Active</span>
                    <span style={{ color: 'var(--text-primary)' }}>
                      {new Date(session.lastSeenAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                {session.isActive && (
                  <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                    style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}>
                    <LogOut size={12} />
                    Revoke Session
                  </button>
                )}

                {!session.isActive && session.revokeReason && (
                  <div className="text-[10px] p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                    Revoked: {session.revokeReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-3">
            {securityEvents.map(event => (
              <div key={event.id} className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getSecurityEventIcon(event.type)}</div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {event.type.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {event.userName || 'System'} · {new Date(event.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: getSecurityEventColor(event.severity) + '20', color: getSecurityEventColor(event.severity) }}>
                      {event.severity}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: event.status === 'OPEN' ? 'var(--error-50)' : event.status === 'ACKNOWLEDGED' ? 'var(--warning-50)' : 'var(--success-50)',
                        color: event.status === 'OPEN' ? 'var(--error-700)' : event.status === 'ACKNOWLEDGED' ? 'var(--warning-700)' : 'var(--success-700)',
                      }}>
                      {event.status}
                    </span>
                  </div>
                </div>

                <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                  <pre className="p-2 rounded overflow-x-auto" style={{ background: 'var(--surface-sunken)' }}>
                    {JSON.stringify(event.details, null, 2)}
                  </pre>
                </div>

                {event.resolutionNotes && (
                  <div className="text-xs p-2 rounded mb-3" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                    <strong>Resolution:</strong> {event.resolutionNotes}
                  </div>
                )}

                {event.status === 'OPEN' && (
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                      style={{ background: 'var(--warning-600)', color: '#fff' }}>
                      Acknowledge
                    </button>
                    <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      Mark as False Positive
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'logins' && (
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Device
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Method
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Result
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Location
                  </th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map(login => (
                  <tr key={login.id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      {new Date(login.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-primary)' }}>
                      {login.userName}
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {login.ipAddress}
                      </code>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {login.userAgent.substring(0, 30)}...
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                        {login.method}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: login.result === 'SUCCESS' ? 'var(--success-50)' : login.result === 'FAIL' ? 'var(--error-50)' : 'var(--warning-50)',
                          color: login.result === 'SUCCESS' ? 'var(--success-700)' : login.result === 'FAIL' ? 'var(--error-700)' : 'var(--warning-700)',
                        }}>
                        {login.result}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {login.location || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
