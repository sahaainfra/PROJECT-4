import React, { useState } from 'react';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  Search,
  Eye,
  Download,
} from 'lucide-react';
import {
  raciAssignments,
  processCatalogue,
  getRaciAssignmentsByScope,
  getProcessByCode,
  getRaciRoleColor,
  type RaciAssignment,
} from '../data/accountabilityData';

// ═══════════════════════════════════════════════════════════
// RACI MATRIX EDITOR — Part 15
// Route: /admin/acc/raci
// ═══════════════════════════════════════════════════════════

export function RaciMatrixEditor() {
  const [selectedScope, setSelectedScope] = useState<{ type: string; id: string } | null>(null);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [editingRaci, setEditingRaci] = useState<RaciAssignment | null>(null);

  // Sample scopes for demo
  const scopes = [
    { type: 'project', id: 'project-001', name: 'Riverside Tower - Phase II' },
    { type: 'project', id: 'project-002', name: 'Green Valley Residences' },
    { type: 'department', id: 'dept-002', name: 'Finance Department' },
  ];

  const currentAssignments = selectedScope
    ? getRaciAssignmentsByScope(selectedScope.type, selectedScope.id)
    : [];

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users size={24} style={{ color: 'var(--brand-600)' }} />
              RACI Matrix Editor
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Assign Responsible, Accountable, Consulted, and Informed roles
            </p>
          </div>
          <button
            onClick={() => setShowAssignDialog(true)}
            disabled={!selectedScope}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <Plus size={14} />
            New Assignment
          </button>
        </div>

        {/* Scope Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Select Scope:
          </label>
          <select
            value={selectedScope ? `${selectedScope.type}:${selectedScope.id}` : ''}
            onChange={(e) => {
              const [type, id] = e.target.value.split(':');
              setSelectedScope({ type, id });
            }}
            className="flex-1 max-w-md px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="">Choose a project or department...</option>
            {scopes.map(scope => (
              <option key={`${scope.type}:${scope.id}`} value={`${scope.type}:${scope.id}`}>
                {scope.name} ({scope.type})
              </option>
            ))}
          </select>
          {selectedScope && (
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
              <Download size={14} />
              Export
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!selectedScope ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Users size={48} className="mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              Select a Scope
            </h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Choose a project or department to view and edit RACI assignments
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* RACI Matrix */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  RACI Matrix
                </h3>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {currentAssignments.length} assignments
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--surface-sunken)' }}>
                      <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        Process
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: getRaciRoleColor('R') }}>
                        R (Responsible)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: getRaciRoleColor('A') }}>
                        A (Accountable)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: getRaciRoleColor('C') }}>
                        C (Consulted)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: getRaciRoleColor('I') }}>
                        I (Informed)
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        Status
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {processCatalogue.filter(p => p.requires_raci).map(process => {
                      const assignment = currentAssignments.find(a => a.process_code === process.process_code);
                      
                      return (
                        <tr key={process.process_code} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                          <td className="px-4 py-3">
                            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                              {process.description}
                            </div>
                            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                              {process.process_code}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assignment ? (
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: getRaciRoleColor('R') + '20', color: getRaciRoleColor('R') }}>
                                {assignment.responsible_user_id}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assignment ? (
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: getRaciRoleColor('A') + '20', color: getRaciRoleColor('A') }}>
                                {assignment.accountable_user_id}
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assignment && assignment.consulted_json.length > 0 ? (
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: getRaciRoleColor('C') + '20', color: getRaciRoleColor('C') }}>
                                {assignment.consulted_json.length} users
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assignment && assignment.informed_json.length > 0 ? (
                              <span className="text-xs px-2 py-0.5 rounded" style={{ background: getRaciRoleColor('I') + '20', color: getRaciRoleColor('I') }}>
                                {assignment.informed_json.length} users
                              </span>
                            ) : (
                              <span style={{ color: 'var(--text-muted)' }}>—</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assignment ? (
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{
                                  background: assignment.status === 'EFFECTIVE' ? 'var(--success-50)' :
                                             assignment.status === 'DRAFT' ? 'var(--warning-50)' : 'var(--surface-sunken)',
                                  color: assignment.status === 'EFFECTIVE' ? 'var(--success-700)' :
                                         assignment.status === 'DRAFT' ? 'var(--warning-700)' : 'var(--text-muted)',
                                }}>
                                {assignment.status}
                              </span>
                            ) : (
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                                Missing
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-center">
                            {assignment ? (
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => setEditingRaci(assignment)}
                                  className="p-1 rounded hover:bg-[var(--nav-hover)]"
                                  title="Edit"
                                >
                                  <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                                </button>
                                <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
                                  <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingRaci(null);
                                  setShowAssignDialog(true);
                                }}
                                className="p-1 rounded hover:bg-[var(--nav-hover)]"
                                title="Assign"
                              >
                                <Plus size={12} style={{ color: 'var(--brand-600)' }} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Gap Report */}
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <AlertCircle size={16} style={{ color: 'var(--warning-600)' }} />
                  RACI Gap Report
                </h3>
              </div>
              <div className="p-4">
                {currentAssignments.length < processCatalogue.filter(p => p.requires_raci).length ? (
                  <div className="text-sm" style={{ color: 'var(--warning-700)' }}>
                    <AlertCircle size={14} className="inline mr-2" />
                    {processCatalogue.filter(p => p.requires_raci).length - currentAssignments.length} process(es) missing RACI assignments
                  </div>
                ) : (
                  <div className="text-sm flex items-center gap-2" style={{ color: 'var(--success-700)' }}>
                    <CheckCircle size={14} />
                    All required processes have RACI assignments
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assignment Dialog */}
      {showAssignDialog && (
        <RaciAssignmentDialog
          scope={selectedScope!}
          editingRaci={editingRaci}
          onClose={() => {
            setShowAssignDialog(false);
            setEditingRaci(null);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RACI ASSIGNMENT DIALOG
// ═══════════════════════════════════════════════════════════

function RaciAssignmentDialog({
  scope,
  editingRaci,
  onClose,
}: {
  scope: { type: string; id: string };
  editingRaci: RaciAssignment | null;
  onClose: () => void;
}) {
  const [processCode, setProcessCode] = useState(editingRaci?.process_code || '');
  const [responsibleUserId, setResponsibleUserId] = useState(editingRaci?.responsible_user_id || '');
  const [accountableUserId, setAccountableUserId] = useState(editingRaci?.accountable_user_id || '');
  const [consultedUserIds, setConsultedUserIds] = useState<string[]>(editingRaci?.consulted_json || []);
  const [informedUserIds, setInformedUserIds] = useState<string[]>(editingRaci?.informed_json || []);

  const process = getProcessByCode(processCode);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {editingRaci ? 'Edit RACI Assignment' : 'New RACI Assignment'}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {scope.type}: {scope.id}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Process *
            </label>
            <select
              value={processCode}
              onChange={(e) => setProcessCode(e.target.value)}
              disabled={!!editingRaci}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)] disabled:opacity-50"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            >
              <option value="">Select a process...</option>
              {processCatalogue.filter(p => p.requires_raci).map(p => (
                <option key={p.process_code} value={p.process_code}>
                  {p.description}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Responsible (R) *
              </label>
              <input
                type="text"
                value={responsibleUserId}
                onChange={(e) => setResponsibleUserId(e.target.value)}
                placeholder="User ID"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Accountable (A) *
              </label>
              <input
                type="text"
                value={accountableUserId}
                onChange={(e) => setAccountableUserId(e.target.value)}
                placeholder="User ID"
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {process?.requires_independent_accountability && responsibleUserId === accountableUserId && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--error-50)', border: '1px solid var(--error-200)' }}>
              <div className="flex items-start gap-2">
                <AlertCircle size={14} style={{ color: 'var(--error-700)' }} />
                <div className="text-xs" style={{ color: 'var(--error-800)' }}>
                  <strong>Independent Accountability Required:</strong> This process requires Responsible ≠ Accountable
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Consulted (C) - Comma-separated user IDs
            </label>
            <input
              type="text"
              value={consultedUserIds.join(', ')}
              onChange={(e) => setConsultedUserIds(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="user-001, user-002"
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Informed (I) - Comma-separated user IDs
            </label>
            <input
              type="text"
              value={informedUserIds.join(', ')}
              onChange={(e) => setInformedUserIds(e.target.value.split(',').map(s => s.trim()).filter(s => s))}
              placeholder="user-003, user-004"
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Would call createRaciAssignment or update here
              onClose();
            }}
            disabled={!processCode || !responsibleUserId || !accountableUserId || 
                     (process?.requires_independent_accountability && responsibleUserId === accountableUserId)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            {editingRaci ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
