import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, XCircle, Filter, Eye } from 'lucide-react';
import { 
  sodViolations, 
  sodExceptions,
  getViolationStatusColor,
  getExceptionStatusColor,
  getSeverityColor,
  type SoDViolation,
  type SoDException
} from '../data/identitySodData';

// ═══════════════════════════════════════════════════════════
// SOD VIOLATIONS & EXCEPTIONS — Part 09
// Route: /admin/idsod/violations
// ═══════════════════════════════════════════════════════════

export function SoDViolationsExceptions() {
  const [activeTab, setActiveTab] = useState<'violations' | 'exceptions'>('violations');
  const [selectedItem, setSelectedItem] = useState<SoDViolation | SoDException | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredViolations = sodViolations.filter(v => 
    statusFilter === 'ALL' || v.status === statusFilter
  );

  const filteredExceptions = sodExceptions.filter(e => 
    statusFilter === 'ALL' || e.status === statusFilter
  );

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              SoD Violations & Exceptions
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor segregation of duties violations and manage exceptions
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveTab('violations'); setSelectedItem(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'violations' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'violations' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'violations' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Violations ({sodViolations.length})
          </button>
          <button
            onClick={() => { setActiveTab('exceptions'); setSelectedItem(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'exceptions' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'exceptions' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'exceptions' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Exceptions ({sodExceptions.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Filter */}
          <div className="mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            >
              <option value="ALL">All Status</option>
              {activeTab === 'violations' ? (
                <>
                  <option value="blocked">Blocked</option>
                  <option value="allowed_exception">Allowed (Exception)</option>
                  <option value="detective_finding">Detective Finding</option>
                </>
              ) : (
                <>
                  <option value="requested">Requested</option>
                  <option value="approved">Approved</option>
                  <option value="expired">Expired</option>
                  <option value="revoked">Revoked</option>
                </>
              )}
            </select>
          </div>

          {activeTab === 'violations' ? (
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rule</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Record</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Detected</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredViolations.map(violation => (
                    <tr
                      key={violation.id}
                      onClick={() => setSelectedItem(violation)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {violation.userName}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          {violation.ruleCode}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[10px]" style={{ color: 'var(--text-primary)' }}>
                          {violation.actionTaken}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {violation.recordType}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {violation.recordId}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {new Date(violation.detectedAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ 
                            background: getViolationStatusColor(violation.status) + '20', 
                            color: getViolationStatusColor(violation.status) 
                          }}>
                          {violation.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rule</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scope</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Valid Period</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Approved By</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExceptions.map(exception => (
                    <tr
                      key={exception.id}
                      onClick={() => setSelectedItem(exception)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {exception.userName}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          {exception.ruleCode}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {exception.scope.projectName || exception.scope.siteName || '—'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[10px] tabular-nums" style={{ color: 'var(--text-muted)' }}>
                          {new Date(exception.validFrom).toLocaleDateString()} - {new Date(exception.validTo).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                        {exception.approvedBy || '—'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ 
                            background: getExceptionStatusColor(exception.status) + '20', 
                            color: getExceptionStatusColor(exception.status) 
                          }}>
                          {exception.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedItem && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {activeTab === 'violations' ? 'Violation Details' : 'Exception Details'}
                </h2>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {selectedItem.id}
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <span style={{ color: 'var(--text-muted)' }}>✕</span>
              </button>
            </div>

            {activeTab === 'violations' ? (
              <ViolationDetail violation={selectedItem as SoDViolation} />
            ) : (
              <ExceptionDetail exception={selectedItem as SoDException} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ViolationDetail({ violation }: { violation: SoDViolation }) {
  return (
    <div className="space-y-4">
      <DetailRow label="User" value={violation.userName} />
      <DetailRow label="Rule Code" value={violation.ruleCode} />
      <DetailRow label="Action Taken" value={violation.actionTaken} />
      <DetailRow label="Record Type" value={violation.recordType} />
      <DetailRow label="Record ID" value={violation.recordId} />
      <DetailRow label="Record Name" value={violation.recordName} />
      <DetailRow label="Detected At" value={new Date(violation.detectedAt).toLocaleString()} />
      <DetailRow label="Status" value={violation.status.replace('_', ' ').toUpperCase()} />
      {violation.exceptionId && (
        <DetailRow label="Exception ID" value={violation.exceptionId} />
      )}
      {violation.compensatingControl && (
        <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Compensating Control
          </div>
          <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
            {violation.compensatingControl}
          </div>
        </div>
      )}
    </div>
  );
}

function ExceptionDetail({ exception }: { exception: SoDException }) {
  return (
    <div className="space-y-4">
      <DetailRow label="User" value={exception.userName} />
      <DetailRow label="Rule Code" value={exception.ruleCode} />
      <DetailRow label="Scope" value={exception.scope.projectName || exception.scope.siteName || '—'} />
      <DetailRow label="Valid From" value={new Date(exception.validFrom).toLocaleDateString()} />
      <DetailRow label="Valid To" value={new Date(exception.validTo).toLocaleDateString()} />
      <DetailRow label="Status" value={exception.status.toUpperCase()} />
      <DetailRow label="Requested At" value={new Date(exception.requestedAt).toLocaleString()} />
      <DetailRow label="Requested By" value={exception.requestedBy} />
      {exception.approvedAt && (
        <DetailRow label="Approved At" value={new Date(exception.approvedAt).toLocaleString()} />
      )}
      {exception.approvedBy && (
        <DetailRow label="Approved By" value={exception.approvedBy} />
      )}
      
      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Reason
        </div>
        <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          {exception.reason}
        </div>
      </div>

      <div className="pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Compensating Control
        </div>
        <div className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          {exception.compensatingControl}
        </div>
      </div>

      {exception.status === 'requested' && (
        <div className="pt-4 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button className="flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--success-600)', color: '#fff' }}>
            Approve
          </button>
          <button className="flex-1 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            Reject
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
