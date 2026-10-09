import React, { useState } from 'react';
import {
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  Search,
  Eye,
  RefreshCw,
  FileText,
} from 'lucide-react';
import {
  bulkJobs,
  getBulkJobStatusColor,
  getBulkJobsByClient,
  type BulkJob,
} from '../data/apiPlatformData';

// ═══════════════════════════════════════════════════════════
// BULK JOB MONITOR — Part 18
// Route: /_tech/devapi/bulk-jobs
// ═══════════════════════════════════════════════════════════

export function BulkJobMonitor() {
  const [selectedJob, setSelectedJob] = useState<BulkJob | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJobs = bulkJobs.filter(job => {
    const matchesType = filterType === 'ALL' || job.type === filterType;
    const matchesStatus = filterStatus === 'ALL' || job.status === filterStatus;
    
    const matchesSearch = searchQuery === '' ||
      job.template_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.file_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={14} style={{ color: 'var(--info-600)' }} />;
      case 'VALIDATING':
      case 'PREVIEW':
      case 'IMPORTING':
        return <RefreshCw size={14} className="animate-spin" style={{ color: 'var(--warning-600)' }} />;
      case 'COMPLETED':
        return <CheckCircle size={14} style={{ color: 'var(--success-600)' }} />;
      case 'FAILED':
        return <XCircle size={14} style={{ color: 'var(--error-600)' }} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <FileText size={24} style={{ color: 'var(--brand-600)' }} />
              Bulk Job Monitor
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Track bulk import and export job progress
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by template, client, or file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Types</option>
            <option value="import">Import</option>
            <option value="export">Export</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="VALIDATING">Validating</option>
            <option value="PREVIEW">Preview</option>
            <option value="IMPORTING">Importing</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Job List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Job ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Template</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Client</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>File</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Progress</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map(job => {
                  const progressPercent = job.total_records > 0 
                    ? Math.round((job.processed_records / job.total_records) * 100)
                    : 0;

                  return (
                    <tr
                      key={job.id}
                      onClick={() => setSelectedJob(job)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {job.id}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {job.type === 'import' ? (
                            <Upload size={12} style={{ color: 'var(--info-600)' }} />
                          ) : (
                            <Download size={12} style={{ color: 'var(--success-600)' }} />
                          )}
                          <span className="text-xs capitalize" style={{ color: 'var(--text-secondary)' }}>
                            {job.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {job.template_code}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {job.client_name}
                      </td>
                      <td className="px-4 py-3">
                        {job.file_name ? (
                          <div className="text-xs truncate max-w-[150px]" style={{ color: 'var(--text-secondary)' }}>
                            {job.file_name}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {getStatusIcon(job.status)}
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: getBulkJobStatusColor(job.status) + '20',
                              color: getBulkJobStatusColor(job.status),
                            }}>
                            {job.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${progressPercent}%`,
                                background: job.status === 'FAILED' ? 'var(--error-600)' : 'var(--success-600)',
                              }}
                            />
                          </div>
                          <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                          {job.processed_records} / {job.total_records}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {new Date(job.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedJob && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <JobDetail job={selectedJob} onClose={() => setSelectedJob(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// JOB DETAIL
// ═══════════════════════════════════════════════════════════

function JobDetail({ job, onClose }: { job: BulkJob; onClose: () => void }) {
  const progressPercent = job.total_records > 0 
    ? Math.round((job.processed_records / job.total_records) * 100)
    : 0;

  const successRate = job.processed_records > 0
    ? Math.round((job.success_records / job.processed_records) * 100)
    : 0;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {job.type === 'import' ? (
              <Upload size={20} style={{ color: 'var(--info-600)' }} />
            ) : (
              <Download size={20} style={{ color: 'var(--success-600)' }} />
            )}
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Job Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {job.id}
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
              background: getBulkJobStatusColor(job.status) + '20',
              color: getBulkJobStatusColor(job.status),
            }}>
            {job.status}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Progress</span>
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {progressPercent}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              background: job.status === 'FAILED' ? 'var(--error-600)' : 'var(--success-600)',
            }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Type" value={job.type} />
        <DetailRow label="Template" value={job.template_code} />
        <DetailRow label="Client" value={job.client_name} />
        {job.file_name && <DetailRow label="File" value={job.file_name} />}
        <DetailRow label="Created By" value={job.created_by} />
        <DetailRow label="Created" value={new Date(job.created_at).toLocaleString()} />
        {job.started_at && <DetailRow label="Started" value={new Date(job.started_at).toLocaleString()} />}
        {job.completed_at && <DetailRow label="Completed" value={new Date(job.completed_at).toLocaleString()} />}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Total Records
          </div>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {job.total_records.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Processed
          </div>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {job.processed_records.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--success-700)' }}>
            Success
          </div>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
            {job.success_records.toLocaleString()}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: job.error_records > 0 ? 'var(--error-50)' : 'var(--surface-sunken)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: job.error_records > 0 ? 'var(--error-700)' : 'var(--text-muted)' }}>
            Errors
          </div>
          <div className="text-xl font-bold tabular-nums" style={{ color: job.error_records > 0 ? 'var(--error-700)' : 'var(--text-primary)' }}>
            {job.error_records.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Success Rate */}
      {job.processed_records > 0 && (
        <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Success Rate</span>
            <span className="text-xs font-bold" style={{ color: successRate >= 95 ? 'var(--success-600)' : successRate >= 80 ? 'var(--warning-600)' : 'var(--error-600)' }}>
              {successRate}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${successRate}%`,
                background: successRate >= 95 ? 'var(--success-600)' : successRate >= 80 ? 'var(--warning-600)' : 'var(--error-600)',
              }}
            />
          </div>
        </div>
      )}

      {/* Error Summary */}
      {job.error_summary && (
        <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--error-200)', background: 'var(--error-50)' }}>
          <div className="flex items-start gap-2">
            <AlertCircle size={16} style={{ color: 'var(--error-700)' }} />
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--error-800)' }}>
                Error Summary
              </div>
              <div className="text-xs" style={{ color: 'var(--error-700)' }}>
                {job.error_summary}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        {job.report_file_id && (
          <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Download size={12} />
            Download Report
          </button>
        )}
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Eye size={12} />
          View Details
        </button>
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
