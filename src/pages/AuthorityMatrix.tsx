import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  Filter,
  Search,
  Users,
  FileText,
} from 'lucide-react';
import {
  authorityMatrix,
  type AuthorityMatrix as AuthorityMatrixType,
} from '../data/rulesData';

// ═══════════════════════════════════════════════════════════
// AUTHORITY MATRIX — Part 13
// Route: /admin/rules/authority-matrix
// ═══════════════════════════════════════════════════════════

export function AuthorityMatrix() {
  const [selectedEntry, setSelectedEntry] = useState<AuthorityMatrixType | null>(null);
  const [filterRole, setFilterRole] = useState<string>('ALL');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEntries = authorityMatrix.filter(entry => {
    const matchesRole = filterRole === 'ALL' || entry.role_id === filterRole;
    const matchesDocType = filterDocType === 'ALL' || entry.document_type === filterDocType;
    
    const matchesSearch = searchQuery === '' ||
      entry.role_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.document_type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesDocType && matchesSearch;
  });

  const roles = Array.from(new Set(authorityMatrix.map(e => e.role_id)));
  const docTypes = Array.from(new Set(authorityMatrix.map(e => e.document_type)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <DollarSign size={24} style={{ color: 'var(--brand-600)' }} />
              Authority Matrix
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage approval limits by role and document type
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Entry
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by role or document type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Roles</option>
            {roles.map(roleId => {
              const entry = authorityMatrix.find(e => e.role_id === roleId);
              return (
                <option key={roleId} value={roleId}>{entry?.role_name}</option>
              );
            })}
          </select>
          <select
            value={filterDocType}
            onChange={(e) => setFilterDocType(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Document Types</option>
            {docTypes.map(dt => (
              <option key={dt} value={dt}>{dt.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Matrix Grid */}
        <div className="rounded-xl border overflow-hidden mb-6" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium sticky left-0" style={{ color: 'var(--text-muted)', background: 'var(--surface-sunken)' }}>
                    Role / Document Type
                  </th>
                  {docTypes.map(dt => (
                    <th key={dt} className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                      {dt.replace(/_/g, ' ')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {roles.map(roleId => {
                  const roleEntry = authorityMatrix.find(e => e.role_id === roleId);
                  if (!roleEntry) return null;

                  return (
                    <tr key={roleId} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      <td className="px-4 py-3 sticky left-0" style={{ background: 'var(--card-bg)' }}>
                        <div className="flex items-center gap-2">
                          <Users size={14} style={{ color: 'var(--brand-600)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {roleEntry.role_name}
                          </span>
                        </div>
                      </td>
                      {docTypes.map(dt => {
                        const entry = authorityMatrix.find(e => e.role_id === roleId && e.document_type === dt);
                        return (
                          <td key={dt} className="px-4 py-3 text-center">
                            {entry ? (
                              <div
                                onClick={() => setSelectedEntry(entry)}
                                className="inline-block px-3 py-1.5 rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}
                              >
                                <div className="text-xs font-semibold tabular-nums">
                                  ₹{(entry.max_amount / 100000).toFixed(1)}L
                                </div>
                              </div>
                            ) : (
                              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* List View */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Authority Limits ({filteredEntries.length})
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Document Type</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Max Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Effective From</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Effective To</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr
                    key={entry.id}
                    onClick={() => setSelectedEntry(entry)}
                    className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Users size={14} style={{ color: 'var(--brand-600)' }} />
                        <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {entry.role_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {entry.document_type.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--success-700)' }}>
                        ₹{(entry.max_amount / 100000).toFixed(2)} Lakh
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {new Date(entry.effective_from).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {entry.effective_to ? new Date(entry.effective_to).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Edit">
                          <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                        </button>
                        <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
                          <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                        </button>
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
          <div className="mt-6 p-6 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Authority Limit Details
                </h3>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selectedEntry.id}
                </div>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <span style={{ color: 'var(--text-muted)' }}>✕</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Role</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedEntry.role_name}</div>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Document Type</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedEntry.document_type.replace(/_/g, ' ')}</div>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Max Amount</div>
                <div className="text-sm font-semibold tabular-nums" style={{ color: 'var(--success-700)' }}>
                  ₹{selectedEntry.max_amount.toLocaleString()} {selectedEntry.currency}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Currency</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{selectedEntry.currency}</div>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Effective From</div>
                <div className="text-sm tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {new Date(selectedEntry.effective_from).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Effective To</div>
                <div className="text-sm tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {selectedEntry.effective_to ? new Date(selectedEntry.effective_to).toLocaleDateString() : 'No expiry'}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                style={{ background: 'var(--brand-600)', color: '#fff' }}>
                <Edit2 size={12} />
                Edit
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}>
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
