import React, { useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Search,
  Eye,
  TrendingUp,
  Users,
  FileText,
  DollarSign,
} from 'lucide-react';
import {
  workflowInstances,
  workflowTasks,
  workflowDefinitions,
  getInstanceStatusColor,
  getTaskStatusColor,
  type WorkflowInstance,
} from '../data/workflowData';
import { isTaskOverdue, getWorkflowStats } from '../core/WorkflowEngine';

// ═══════════════════════════════════════════════════════════
// WORKFLOW MONITOR — Part 12
// Route: /admin/wf/monitor
// ═══════════════════════════════════════════════════════════

export function WorkflowMonitor() {
  const [selectedInstance, setSelectedInstance] = useState<WorkflowInstance | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = getWorkflowStats();

  const filteredInstances = workflowInstances.filter(instance => {
    const matchesStatus = filterStatus === 'ALL' || instance.status === filterStatus;
    const matchesDocType = filterDocType === 'ALL' || instance.doc_type === filterDocType;
    
    const matchesSearch = searchQuery === '' ||
      instance.doc_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.doc_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.submitted_by_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      instance.project_name?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDocType && matchesSearch;
  });

  const docTypes = Array.from(new Set(workflowInstances.map(i => i.doc_type)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Activity size={24} style={{ color: 'var(--brand-600)' }} />
              Workflow Monitor
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor all workflow instances and tasks
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Instances
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {stats.totalInstances}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--warning-50)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--warning-700)' }}>
              Pending Tasks
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--warning-700)' }}>
              {stats.pendingTasks}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--error-50)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--error-700)' }}>
              Overdue Tasks
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--error-700)' }}>
              {stats.overdueTasks}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--success-700)' }}>
              Approved Today
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
              {stats.approvedToday}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by document number, type, or submitter..."
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
            <option value="IN_PROGRESS">In Progress</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="RETURNED">Returned</option>
            <option value="CANCELLED">Cancelled</option>
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
      <div className="flex-1 flex overflow-hidden">
        {/* Instances List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Document</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Submitter</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Amount</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Current Step</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstances.map(instance => {
                  const tasks = workflowTasks.filter(t => t.instance_id === instance.id);
                  const currentTask = tasks.find(t => t.step_seq === instance.current_step_seq && t.status === 'pending');
                  const hasOverdue = tasks.some(t => isTaskOverdue(t));

                  return (
                    <tr
                      key={instance.id}
                      onClick={() => setSelectedInstance(instance)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText size={14} style={{ color: 'var(--brand-600)' }} />
                          <div>
                            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                              {instance.doc_number}
                            </div>
                            {instance.project_name && (
                              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {instance.project_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {instance.doc_type.replace(/_/g, ' ')}
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {instance.submitted_by_name}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
                          ₹{(instance.amount_snapshot / 100000).toFixed(2)}L
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: getInstanceStatusColor(instance.status) + '20',
                              color: getInstanceStatusColor(instance.status),
                            }}>
                            {instance.status}
                          </span>
                          {hasOverdue && (
                            <AlertCircle size={12} style={{ color: 'var(--error-600)' }} />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {currentTask ? currentTask.step_name : '—'}
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {new Date(instance.submitted_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedInstance && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <InstanceDetailPanel
              instance={selectedInstance}
              onClose={() => setSelectedInstance(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// INSTANCE DETAIL PANEL
// ═══════════════════════════════════════════════════════════

function InstanceDetailPanel({
  instance,
  onClose,
}: {
  instance: WorkflowInstance;
  onClose: () => void;
}) {
  const tasks = workflowTasks.filter(t => t.instance_id === instance.id);
  const definition = workflowDefinitions.find(d => d.id === instance.definition_id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <FileText size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {instance.doc_number}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {instance.doc_type.replace(/_/g, ' ')}
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
              background: getInstanceStatusColor(instance.status) + '20',
              color: getInstanceStatusColor(instance.status),
            }}>
            {instance.status}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Current Step</span>
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {instance.current_step_seq} of {tasks.length}
          </span>
        </div>
      </div>

      {/* Document Info */}
      <div className="space-y-3 mb-6">
        <DetailRow label="Amount" value={`₹${(instance.amount_snapshot / 100000).toFixed(2)} Lakh`} />
        <DetailRow label="Submitted By" value={instance.submitted_by_name} />
        <DetailRow label="Submitted On" value={new Date(instance.submitted_at).toLocaleDateString()} />
        {instance.completed_at && (
          <DetailRow label="Completed On" value={new Date(instance.completed_at).toLocaleDateString()} />
        )}
        {instance.project_name && <DetailRow label="Project" value={instance.project_name} />}
        {instance.site_name && <DetailRow label="Site" value={instance.site_name} />}
      </div>

      {/* Workflow Steps */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Workflow Steps
        </h3>
        <div className="space-y-2">
          {tasks.map((task, index) => {
            const overdue = isTaskOverdue(task);
            return (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border"
                style={{ borderColor: overdue ? 'var(--error-500)' : 'var(--border-subtle)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                  style={{
                    background: task.status === 'approved' ? 'var(--success-600)' :
                               task.status === 'rejected' ? 'var(--error-600)' :
                               task.status === 'returned' ? 'var(--info-600)' :
                               task.status === 'pending' ? 'var(--warning-600)' : 'var(--text-muted)',
                    color: '#fff',
                  }}>
                  {task.step_seq}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {task.step_name}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                      style={{
                        background: getTaskStatusColor(task.status) + '20',
                        color: getTaskStatusColor(task.status),
                      }}>
                      {task.status}
                    </span>
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Assigned to: {task.assignee_name}
                  </div>
                  {task.comment && (
                    <div className="text-[10px] mt-1 p-1.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {task.comment}
                    </div>
                  )}
                  {overdue && (
                    <div className="flex items-center gap-1 mt-1">
                      <AlertCircle size={10} style={{ color: 'var(--error-600)' }} />
                      <span className="text-[10px] font-medium" style={{ color: 'var(--error-600)' }}>
                        Overdue
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Context */}
      {Object.keys(instance.context_json).length > 0 && (
        <div>
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Context
          </h3>
          <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <pre className="text-[10px] overflow-x-auto" style={{ color: 'var(--text-secondary)' }}>
              {JSON.stringify(instance.context_json, null, 2)}
            </pre>
          </div>
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
