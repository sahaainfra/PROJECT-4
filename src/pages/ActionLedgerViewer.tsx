import React, { useState } from 'react';
import {
  FileText,
  Filter,
  Search,
  Eye,
  Download,
  Clock,
  User,
  MapPin,
} from 'lucide-react';
import {
  actionLedger,
  getActionLedgerByEntity,
  getActionLedgerByUser,
  getActionColor,
  type ActionLedgerEntry,
} from '../data/accountabilityData';

// ═══════════════════════════════════════════════════════════
// ACTION LEDGER VIEWER — Part 15
// Route: /admin/acc/ledger
// ═══════════════════════════════════════════════════════════

export function ActionLedgerViewer() {
  const [selectedEntry, setSelectedEntry] = useState<ActionLedgerEntry | null>(null);
  const [filterAction, setFilterAction] = useState<string>('ALL');
  const [filterEntityType, setFilterEntityType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = actionLedger.filter(entry => {
    const matchesAction = filterAction === 'ALL' || entry.action === filterAction;
    const matchesEntityType = filterEntityType === 'ALL' || entry.entity_type === filterEntityType;
    
    const matchesSearch = searchQuery === '' ||
      entry.doc_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.entity_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.actor_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.narrative?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAction && matchesEntityType && matchesSearch;
  });

  const actions = Array.from(new Set(actionLedger.map(e => e.action)));
  const entityTypes = Array.from(new Set(actionLedger.map(e => e.entity_type)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FileText size={24} style={{ color: 'var(--brand-600)' }} />
              Action Ledger
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Complete audit trail of all lifecycle actions
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Download size={12} />
            Export
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by document number, entity ID, actor, or narrative..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Actions</option>
            {actions.map(action => (
              <option key={action} value={action}>{action}</option>
            ))}
          </select>
          <select
            value={filterEntityType}
            onChange={(e) => setFilterEntityType(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Entity Types</option>
            {entityTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Ledger List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Action</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Entity</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actor</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Narrative</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr
                    key={entry.ledger_id}
                    onClick={() => setSelectedEntry(entry)}
                    className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {new Date(entry.at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: getActionColor(entry.action) + '20',
                          color: getActionColor(entry.action),
                        }}>
                        {entry.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        {entry.entity_type}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {entry.entity_id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {entry.doc_no}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <User size={10} style={{ color: 'var(--text-muted)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {entry.actor_id}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                        {entry.actor_role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-xs max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>
                        {entry.narrative || '—'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedEntry && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Ledger Entry Details
                </h2>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {selectedEntry.ledger_id}
                </div>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <span style={{ color: 'var(--text-muted)' }}>✕</span>
              </button>
            </div>

            <div className="space-y-4">
              <DetailRow label="Timestamp" value={new Date(selectedEntry.at).toLocaleString()} />
              <DetailRow label="Action" value={selectedEntry.action} />
              <DetailRow label="Entity Type" value={selectedEntry.entity_type} />
              <DetailRow label="Entity ID" value={selectedEntry.entity_id} />
              <DetailRow label="Document Number" value={selectedEntry.doc_no} />
              <DetailRow label="Actor" value={selectedEntry.actor_id} />
              <DetailRow label="Actor Role" value={selectedEntry.actor_role} />
              {selectedEntry.on_behalf_of && (
                <DetailRow label="On Behalf Of" value={selectedEntry.on_behalf_of} />
              )}
              {selectedEntry.project_id && (
                <DetailRow label="Project" value={selectedEntry.project_id} />
              )}
              {selectedEntry.site_id && (
                <DetailRow label="Site" value={selectedEntry.site_id} />
              )}
              {selectedEntry.department_id && (
                <DetailRow label="Department" value={selectedEntry.department_id} />
              )}
              {selectedEntry.device_id && (
                <DetailRow label="Device" value={selectedEntry.device_id} />
              )}
              {selectedEntry.lat && selectedEntry.lng && (
                <div className="flex items-center gap-2">
                  <MapPin size={12} style={{ color: 'var(--text-muted)' }} />
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {selectedEntry.lat.toFixed(4)}, {selectedEntry.lng.toFixed(4)}
                  </span>
                </div>
              )}
              {selectedEntry.reason_code && (
                <DetailRow label="Reason Code" value={selectedEntry.reason_code} />
              )}
              {selectedEntry.narrative && (
                <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Narrative
                  </div>
                  <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {selectedEntry.narrative}
                  </div>
                </div>
              )}

              {/* Links */}
              <div className="pt-4 border-t space-y-2" style={{ borderColor: 'var(--border-subtle)' }}>
                {selectedEntry.audit_id && (
                  <div className="flex items-center gap-2">
                    <FileText size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-link)' }}>
                      View Audit Entry: {selectedEntry.audit_id}
                    </span>
                  </div>
                )}
                {selectedEntry.workflow_task_id && (
                  <div className="flex items-center gap-2">
                    <Clock size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-link)' }}>
                      View Workflow Task: {selectedEntry.workflow_task_id}
                    </span>
                  </div>
                )}
                {selectedEntry.protocol_evaluation_id && (
                  <div className="flex items-center gap-2">
                    <Eye size={12} style={{ color: 'var(--text-muted)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-link)' }}>
                      View Protocol Evaluation: {selectedEntry.protocol_evaluation_id}
                    </span>
                  </div>
                )}
              </div>
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

// ═══════════════════════════════════════════════════════════
// ACCOUNTABILITY TAB COMPONENT
// ═══════════════════════════════════════════════════════════

interface AccountabilityTabProps {
  entityType: string;
  entityId: string;
}

export function AccountabilityTab({ entityType, entityId }: AccountabilityTabProps) {
  const ledgerEntries = getActionLedgerByEntity(entityType, entityId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Accountability Timeline
        </h3>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {ledgerEntries.length} actions
        </span>
      </div>

      {ledgerEntries.length === 0 ? (
        <div className="text-center py-8">
          <FileText size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            No actions recorded yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ledgerEntries.map((entry, index) => (
            <div key={entry.ledger_id} className="flex gap-3">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: getActionColor(entry.action) + '20' }}>
                  <div className="w-2 h-2 rounded-full" style={{ background: getActionColor(entry.action) }} />
                </div>
                {index < ledgerEntries.length - 1 && (
                  <div className="w-0.5 flex-1 my-1" style={{ background: 'var(--border-subtle)' }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: getActionColor(entry.action) + '20',
                        color: getActionColor(entry.action),
                      }}>
                      {entry.action}
                    </span>
                    <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
                      by {entry.actor_id} ({entry.actor_role})
                    </span>
                  </div>
                  <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {new Date(entry.at).toLocaleString()}
                  </span>
                </div>
                {entry.narrative && (
                  <div className="text-xs mt-1 p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {entry.narrative}
                  </div>
                )}
                {entry.reason_code && (
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    Reason: {entry.reason_code}
                  </div>
                )}
                {entry.on_behalf_of && (
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    On behalf of: {entry.on_behalf_of}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
