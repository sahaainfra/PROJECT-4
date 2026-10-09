import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Filter,
  Search,
  Eye,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  emergencyApprovals,
  getEmergencyStatusColor,
  type EmergencyApproval,
} from '../data/rulesData';
import { regulariseEmergencyApproval } from '../core/RulesEngine';

// ═══════════════════════════════════════════════════════════
// EMERGENCY APPROVALS — Part 13
// Route: /admin/rules/emergency
// ═══════════════════════════════════════════════════════════

export function EmergencyApprovals() {
  const [selectedApproval, setSelectedApproval] = useState<EmergencyApproval | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApprovals = emergencyApprovals.filter(approval => {
    const matchesStatus = filterStatus === 'ALL' || approval.status === filterStatus;
    
    const matchesSearch = searchQuery === '' ||
      approval.document_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.document_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      approval.reason.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const pendingCount = emergencyApprovals.filter(a => a.status === 'pending').length;
  const overdueCount = emergencyApprovals.filter(a => a.status === 'overdue').length;

  const handleRegularise = (approvalId: string) => {
    try {
      regulariseEmergencyApproval(approvalId, 'user-001'); // Current user
      setSelectedApproval(null);
      alert('Emergency approval regularised successfully');
    } catch (error) {
      console.error('Regularisation failed:', error);
      alert(`Regularisation failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <AlertTriangle size={24} style={{ color: 'var(--error-600)' }} />
              Emergency Approvals
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Track and regularise emergency approvals
            </p>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--warning-50)' }}>
                <Clock size={14} style={{ color: 'var(--warning-600)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--warning-700)' }}>
                  {pendingCount} Pending
                </span>
              </div>
            )}
            {overdueCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--error-50)' }}>
                <AlertCircle size={14} style={{ color: 'var(--error-600)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--error-700)' }}>
                  {overdueCount} Overdue
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by document number, type, or reason..."
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
            <option value="regularised">Regularised</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Approvals List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredApprovals.map(approval => (
              <EmergencyApprovalCard
                key={approval.id}
                approval={approval}
                isSelected={selectedApproval?.id === approval.id}
                onClick={() => setSelectedApproval(approval)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedApproval && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <EmergencyApprovalDetail
              approval={selectedApproval}
              onClose={() => setSelectedApproval(null)}
              onRegularise={() => handleRegularise(selectedApproval.id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EMERGENCY APPROVAL CARD
// ═══════════════════════════════════════════════════════════

function EmergencyApprovalCard({
  approval,
  isSelected,
  onClick,
}: {
  approval: EmergencyApproval;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isOverdue = approval.status === 'pending' && 
    new Date(approval.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
      } ${isOverdue ? 'border-l-4' : ''}`}
      style={{
        background: 'var(--card-bg)',
        borderColor: isSelected ? 'var(--brand-500)' : isOverdue ? 'var(--error-500)' : 'var(--card-border)',
        borderLeftColor: isOverdue ? 'var(--error-600)' : undefined,
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <FileText size={16} style={{ color: 'var(--error-600)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {approval.document_number}
            </h3>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {approval.document_type.replace(/_/g, ' ')}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: getEmergencyStatusColor(approval.status) + '20',
            color: getEmergencyStatusColor(approval.status),
          }}>
          {approval.status}
        </span>
      </div>

      <div className="p-2 rounded-lg mb-3" style={{ background: 'var(--surface-sunken)' }}>
        <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
          Reason
        </div>
        <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
          {approval.reason}
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-muted)' }}>
        <div>
          Approved by: {approval.approved_by}
        </div>
        <div>
          {new Date(approval.approved_at).toLocaleDateString()}
        </div>
      </div>

      {isOverdue && (
        <div className="flex items-center gap-1 mt-2">
          <AlertCircle size={10} style={{ color: 'var(--error-600)' }} />
          <span className="text-[10px] font-medium" style={{ color: 'var(--error-600)' }}>
            Overdue for regularisation
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EMERGENCY APPROVAL DETAIL
// ═══════════════════════════════════════════════════════════

function EmergencyApprovalDetail({
  approval,
  onClose,
  onRegularise,
}: {
  approval: EmergencyApproval;
  onClose: () => void;
  onRegularise: () => void;
}) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={20} style={{ color: 'var(--error-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Emergency Approval
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {approval.document_number}
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
              background: getEmergencyStatusColor(approval.status) + '20',
              color: getEmergencyStatusColor(approval.status),
            }}>
            {approval.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Document Type" value={approval.document_type.replace(/_/g, ' ')} />
        <DetailRow label="Document Number" value={approval.document_number} />
        <DetailRow label="Approved By" value={approval.approved_by} />
        <DetailRow label="Approved At" value={new Date(approval.approved_at).toLocaleString()} />
        <DetailRow label="Regularise By" value={approval.regularise_by} />
        {approval.regularised_at && (
          <DetailRow label="Regularised At" value={new Date(approval.regularised_at).toLocaleString()} />
        )}
      </div>

      {/* Reason */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reason
        </h3>
        <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          {approval.reason}
        </div>
      </div>

      {/* Evidence */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Supporting Evidence ({approval.evidence_ids.length})
        </h3>
        <div className="space-y-1">
          {approval.evidence_ids.map(evidenceId => (
            <div key={evidenceId} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--surface-sunken)' }}>
              <FileText size={12} style={{ color: 'var(--text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                {evidenceId}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {approval.status === 'pending' && (
        <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={onRegularise}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--success-600)', color: '#fff' }}
          >
            <Check size={12} />
            Regularise
          </button>
          <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Eye size={12} />
            View Document
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
