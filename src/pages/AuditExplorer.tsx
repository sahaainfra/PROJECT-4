import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Calendar, User, FileText } from 'lucide-react';
import { auditLog, formatAuditAction, type AuditLogEntry } from '../data/auditSecurityData';
import { queryAuditLogs } from '../core/AuditService';

// ═══════════════════════════════════════════════════════════
// AUDIT EXPLORER — Part 07
// Route: /admin/audit
// ═══════════════════════════════════════════════════════════

export function AuditExplorer() {
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [entityFilter, setEntityFilter] = useState<string>('ALL');

  const filteredLogs = auditLog.filter(entry => {
    const matchesSearch = searchQuery === '' ||
      entry.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entityName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entityId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = actionFilter === 'ALL' || entry.action === actionFilter;
    const matchesEntity = entityFilter === 'ALL' || entry.entityType === entityFilter;
    
    return matchesSearch && matchesAction && matchesEntity;
  });

  const actions = Array.from(new Set(auditLog.map(e => e.action)));
  const entities = Array.from(new Set(auditLog.map(e => e.entityType)));

  const getActionColor = (action: AuditLogEntry['action']): string => {
    const colors: Record<string, string> = {
      CREATE: 'var(--success-600)',
      UPDATE: 'var(--info-600)',
      DELETE: 'var(--error-600)',
      APPROVE: 'var(--success-600)',
      REJECT: 'var(--error-600)',
      SUBMIT: 'var(--brand-600)',
      CANCEL: 'var(--warning-600)',
      LOGIN: 'var(--info-600)',
      LOGOUT: 'var(--text-muted)',
      EXPORT: 'var(--accent-600)',
      VIEW: 'var(--text-muted)',
    };
    return colors[action] || 'var(--text-muted)';
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              Audit Trail
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Tamper-evident audit log with hash chain verification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <Download size={12} />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
              style={{ background: 'var(--success-600)', color: '#fff' }}>
              <Eye size={12} />
              Verify Hash Chain
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by user, entity, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{formatAuditAction(action)}</option>
            ))}
          </select>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Entities</option>
            {entities.map(entity => (
              <option key={entity} value={entity}>{entity}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Audit Log List */}
        <div className="flex-1 overflow-y-auto p-6">
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
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Entity
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    IP Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                    Hash
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(entry => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <User size={12} style={{ color: 'var(--text-muted)' }} />
                        <div>
                          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {entry.userName}
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {entry.userEmail}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: getActionColor(entry.action) + '20', color: getActionColor(entry.action) }}>
                        {formatAuditAction(entry.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <FileText size={12} style={{ color: 'var(--text-muted)' }} />
                        <div>
                          <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                            {entry.entityType}
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {entry.entityName || entry.entityId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {entry.ipAddress || '—'}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
                        {entry.hash.substring(0, 12)}
                      </code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="mt-6 grid grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Total Entries
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {auditLog.length}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Today
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--success-600)' }}>
                {auditLog.filter(e => new Date(e.timestamp).toDateString() === new Date().toDateString()).length}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Unique Users
              </div>
              <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {new Set(auditLog.map(e => e.userId)).size}
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Hash Chain
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--success-600)' }}>
                ✓ Valid
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedEntry && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Audit Entry Details
                </h2>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {selectedEntry.id}
                </div>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <span style={{ color: 'var(--text-muted)' }}>✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <DetailRow label="Timestamp" value={new Date(selectedEntry.timestamp).toLocaleString()} />
              <DetailRow label="User" value={`${selectedEntry.userName} (${selectedEntry.userEmail})`} />
              <DetailRow label="Action" value={formatAuditAction(selectedEntry.action)} />
              <DetailRow label="Entity Type" value={selectedEntry.entityType} />
              <DetailRow label="Entity ID" value={selectedEntry.entityId} />
              {selectedEntry.entityName && <DetailRow label="Entity Name" value={selectedEntry.entityName} />}
              {selectedEntry.reason && <DetailRow label="Reason" value={selectedEntry.reason} />}
              {selectedEntry.reasonCode && <DetailRow label="Reason Code" value={selectedEntry.reasonCode} />}
              <DetailRow label="IP Address" value={selectedEntry.ipAddress || '—'} />
              <DetailRow label="Correlation ID" value={selectedEntry.correlationId} />
              {selectedEntry.projectId && <DetailRow label="Project ID" value={selectedEntry.projectId} />}
              {selectedEntry.siteId && <DetailRow label="Site ID" value={selectedEntry.siteId} />}
              
              <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Hash Chain
                </div>
                <DetailRow label="Entry Hash" value={selectedEntry.hash} />
                <DetailRow label="Previous Hash" value={selectedEntry.previousHash} />
              </div>

              {selectedEntry.before && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Before
                  </div>
                  <pre className="text-[10px] p-2 rounded overflow-x-auto" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {JSON.stringify(selectedEntry.before, null, 2)}
                  </pre>
                </div>
              )}

              {selectedEntry.after && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    After
                  </div>
                  <pre className="text-[10px] p-2 rounded overflow-x-auto" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {JSON.stringify(selectedEntry.after, null, 2)}
                  </pre>
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
      <span className="text-xs text-right break-all" style={{ color: 'var(--text-primary)' }}>
        {value}
      </span>
    </div>
  );
}
