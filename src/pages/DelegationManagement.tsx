import React, { useState } from 'react';
import {
  Users,
  Plus,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  Filter,
  Search,
} from 'lucide-react';
import {
  workflowDelegations,
  getDelegationStatusColor,
  type WorkflowDelegation,
} from '../data/workflowData';

// ═══════════════════════════════════════════════════════════
// DELEGATION MANAGEMENT — Part 12
// Route: /admin/wf/delegations
// ═══════════════════════════════════════════════════════════

export function DelegationManagement() {
  const [selectedDelegation, setSelectedDelegation] = useState<WorkflowDelegation | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDelegations = workflowDelegations.filter(delegation => {
    const matchesStatus = filterStatus === 'ALL' || delegation.status === filterStatus;
    
    const matchesSearch = searchQuery === '' ||
      delegation.delegator_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegation.delegate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegation.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const activeDelegations = workflowDelegations.filter(d => d.status === 'active' || d.status === 'approved');
  const pendingDelegations = workflowDelegations.filter(d => d.status === 'pending');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Users size={24} style={{ color: 'var(--brand-600)' }} />
              Delegation Management
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage approval delegations and out-of-office coverage
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Delegation
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--success-700)' }}>
              Active Delegations
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
              {activeDelegations.length}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--warning-50)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--warning-700)' }}>
              Pending Approval
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--warning-700)' }}>
              {pendingDelegations.length}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Delegations
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {workflowDelegations.length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by delegator, delegate, or reason..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="revoked">Revoked</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Delegations List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredDelegations.map(delegation => (
              <DelegationCard
                key={delegation.id}
                delegation={delegation}
                isSelected={selectedDelegation?.id === delegation.id}
                onClick={() => setSelectedDelegation(delegation)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedDelegation && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <DelegationDetailPanel
              delegation={selectedDelegation}
              onClose={() => setSelectedDelegation(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DELEGATION CARD
// ═══════════════════════════════════════════════════════════

function DelegationCard({
  delegation,
  isSelected,
  onClick,
}: {
  delegation: WorkflowDelegation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isActive = delegation.status === 'active' || delegation.status === 'approved';
  const isPending = delegation.status === 'pending';

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
      }`}
      style={{
        background: 'var(--card-bg)',
        borderColor: isSelected ? 'var(--brand-500)' : 'var(--card-border)',
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Users size={16} style={{ color: 'var(--brand-600)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {delegation.delegator_name} → {delegation.delegate_name}
            </h3>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {delegation.doc_types.join(', ').replace(/\*/g, 'All documents')}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: getDelegationStatusColor(delegation.status) + '20',
            color: getDelegationStatusColor(delegation.status),
          }}>
          {delegation.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
          <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {new Date(delegation.from_date).toLocaleDateString()} - {new Date(delegation.to_date).toLocaleDateString()}
          </div>
        </div>
        {delegation.scope_name && (
          <div className="flex items-center gap-2">
            <FileText size={12} style={{ color: 'var(--text-muted)' }} />
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {delegation.scope_name}
            </div>
          </div>
        )}
      </div>

      <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
        {delegation.reason}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DELEGATION DETAIL PANEL
// ═══════════════════════════════════════════════════════════

function DelegationDetailPanel({
  delegation,
  onClose,
}: {
  delegation: WorkflowDelegation;
  onClose: () => void;
}) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Delegation Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {delegation.id}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Status */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: getDelegationStatusColor(delegation.status) + '20',
              color: getDelegationStatusColor(delegation.status),
            }}>
            {delegation.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Delegator" value={delegation.delegator_name} />
        <DetailRow label="Delegate" value={delegation.delegate_name} />
        <DetailRow label="Document Types" value={delegation.doc_types.join(', ').replace(/\*/g, 'All documents')} />
        <DetailRow label="Scope" value={delegation.scope} />
        {delegation.scope_name && <DetailRow label="Scope Name" value={delegation.scope_name} />}
        <DetailRow label="From Date" value={new Date(delegation.from_date).toLocaleDateString()} />
        <DetailRow label="To Date" value={new Date(delegation.to_date).toLocaleDateString()} />
        <DetailRow label="Created" value={new Date(delegation.created_at).toLocaleDateString()} />
        {delegation.approved_at && (
          <DetailRow label="Approved" value={`${new Date(delegation.approved_at).toLocaleDateString()} by ${delegation.approved_by}`} />
        )}
      </div>

      {/* Reason */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reason
        </h3>
        <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          {delegation.reason}
        </div>
      </div>

      {/* Actions */}
      {(delegation.status === 'pending' || delegation.status === 'approved' || delegation.status === 'active') && (
        <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          {delegation.status === 'pending' && (
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
              style={{ background: 'var(--success-600)', color: '#fff' }}>
              <CheckCircle size={12} />
              Approve
            </button>
          )}
          {(delegation.status === 'approved' || delegation.status === 'active') && (
            <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}>
              <XCircle size={12} />
              Revoke
            </button>
          )}
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Edit2 size={12} />
            Edit
          </button>
        </div>
      )}
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
