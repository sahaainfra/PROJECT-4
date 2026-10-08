import React, { useState } from 'react';
import { Shield, Clock, AlertTriangle, Users, Eye } from 'lucide-react';
import { 
  privilegedSessions,
  type PrivilegedSession
} from '../data/identitySodData';

// ═══════════════════════════════════════════════════════════
// PRIVILEGED ACCESS CONSOLE — Part 09
// Route: /admin/idsod/privileged
// ═══════════════════════════════════════════════════════════

export function PrivilegedAccessConsole() {
  const [selectedSession, setSelectedSession] = useState<PrivilegedSession | null>(null);

  const activeSessions = privilegedSessions.filter(s => s.status === 'active');
  const completedSessions = privilegedSessions.filter(s => s.status === 'completed');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield size={24} style={{ color: 'var(--error-600)' }} />
              Privileged Access Console
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor and manage elevated access sessions
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--error-600)', color: '#fff' }}>
            <Shield size={16} />
            Request Elevation
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Active Sessions */}
          {activeSessions.length > 0 && (
            <div className="mb-6">
              <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertTriangle size={16} style={{ color: 'var(--error-600)' }} />
                Active Privileged Sessions ({activeSessions.length})
              </h2>
              <div className="grid grid-cols-1 gap-3">
                {activeSessions.map(session => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedSession(session)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedSession?.id === session.id ? 'ring-2 ring-[var(--error-500)]' : 'hover:shadow-md'
                    }`}
                    style={{ 
                      background: 'var(--card-bg)', 
                      borderColor: selectedSession?.id === session.id ? 'var(--error-500)' : 'var(--error-200)',
                      borderLeftWidth: '4px',
                      borderLeftColor: 'var(--error-600)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {session.adminName}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {session.adminEmail}
                        </div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium animate-pulse"
                        style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                        ACTIVE
                      </span>
                    </div>

                    <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                      <strong>Reason:</strong> {session.reason}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                        <div className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                          {session.actionsCount}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          Actions
                        </div>
                      </div>
                      <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                        <div className="text-xs font-medium tabular-nums" style={{ color: 'var(--text-primary)' }}>
                          {Math.floor((new Date().getTime() - new Date(session.startedAt).getTime()) / 60000)}m
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          Duration
                        </div>
                      </div>
                      <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {session.approvedByName}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          Approved By
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        Started: {new Date(session.startedAt).toLocaleString()}
                      </div>
                      <button className="text-xs px-3 py-1 rounded-lg font-medium transition-colors hover:opacity-90"
                        style={{ background: 'var(--error-600)', color: '#fff' }}>
                        Terminate
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Sessions */}
          <div>
            <h2 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Clock size={16} style={{ color: 'var(--text-muted)' }} />
              Recent Completed Sessions ({completedSessions.length})
            </h2>
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Admin</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Approved By</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Duration</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {completedSessions.map(session => (
                    <tr
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {session.adminName}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {session.reason}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {session.approvedByName}
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {session.duration}m
                      </td>
                      <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {session.actionsCount}
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {new Date(session.startedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedSession && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Session Details
                </h2>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {selectedSession.id}
                </div>
              </div>
              <button onClick={() => setSelectedSession(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <span style={{ color: 'var(--text-muted)' }}>✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <DetailRow label="Admin" value={selectedSession.adminName} />
              <DetailRow label="Email" value={selectedSession.adminEmail} />
              <DetailRow label="Status" value={selectedSession.status.toUpperCase()} />
              <DetailRow label="Reason" value={selectedSession.reason} />
              <DetailRow label="Justification" value={selectedSession.justification} />
              <DetailRow label="Approved By" value={selectedSession.approvedByName} />
              <DetailRow label="Started At" value={new Date(selectedSession.startedAt).toLocaleString()} />
              {selectedSession.endedAt && (
                <DetailRow label="Ended At" value={new Date(selectedSession.endedAt).toLocaleString()} />
              )}
              {selectedSession.duration && (
                <DetailRow label="Duration" value={`${selectedSession.duration} minutes`} />
              )}
              <DetailRow label="Actions Count" value={selectedSession.actionsCount.toString()} />
              
              {selectedSession.sessionRecording && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Session Recording
                  </div>
                  <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    <Eye size={12} />
                    View Recording
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4">
      <span className="text-xs font-medium flex-shrink-0" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="text-xs text-right" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
