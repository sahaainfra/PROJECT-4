import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Calendar,
  User,
  MessageSquare,
  Paperclip,
  ChevronRight,
  Filter,
  Search,
  Eye,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import {
  workflowTasks,
  workflowInstances,
  workflowActionLogs,
  getTaskStatusColor,
  getInstanceStatusColor,
  type WorkflowTask,
  type WorkflowInstance,
} from '../data/workflowData';
import { performTaskAction, isTaskOverdue } from '../core/WorkflowEngine';

// ═══════════════════════════════════════════════════════════
// MY APPROVALS INBOX — Part 12
// Route: /home/wf
// ═══════════════════════════════════════════════════════════

export function MyApprovalsInbox() {
  const [selectedTask, setSelectedTask] = useState<WorkflowTask | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'return'>('approve');
  const [comment, setComment] = useState('');
  const [reasonCode, setReasonCode] = useState('');

  // Current user (in production, this would come from auth context)
  const currentUserId = 'user-010'; // Rajesh Kumar

  // Get pending tasks for current user
  const myTasks = workflowTasks.filter(t => t.assignee_user_id === currentUserId);
  
  const filteredTasks = myTasks.filter(task => {
    const instance = workflowInstances.find(i => i.id === task.instance_id);
    if (!instance) return false;

    // Filter by status
    if (filter === 'pending' && task.status !== 'pending') return false;
    if (filter === 'overdue' && !isTaskOverdue(task)) return false;

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        instance.doc_number.toLowerCase().includes(query) ||
        instance.doc_type.toLowerCase().includes(query) ||
        task.step_name.toLowerCase().includes(query) ||
        instance.project_name?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const handleAction = (action: 'approve' | 'reject' | 'return') => {
    if (!selectedTask) return;

    try {
      performTaskAction({
        task_id: selectedTask.id,
        action,
        comment,
        reason_code: reasonCode || undefined,
        actor_id: currentUserId,
        actor_name: 'Rajesh Kumar',
      });

      // Refresh task list
      setSelectedTask(null);
      setShowActionModal(false);
      setComment('');
      setReasonCode('');
    } catch (error) {
      console.error('Action failed:', error);
      alert(`Failed to ${action}: ${(error as Error).message}`);
    }
  };

  const pendingCount = myTasks.filter(t => t.status === 'pending').length;
  const overdueCount = myTasks.filter(t => isTaskOverdue(t)).length;

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <CheckCircle size={24} style={{ color: 'var(--brand-600)' }} />
              My Approvals
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Pending approvals and workflow tasks
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'var(--warning-50)' }}>
              <Clock size={14} style={{ color: 'var(--warning-600)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--warning-700)' }}>
                {pendingCount} Pending
              </span>
            </div>
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
              placeholder="Search by document number, type, or project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'all' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
              }`}
              style={{
                background: filter === 'all' ? 'var(--brand-600)' : 'transparent',
                color: filter === 'all' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              All ({myTasks.length})
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'pending' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
              }`}
              style={{
                background: filter === 'pending' ? 'var(--brand-600)' : 'transparent',
                color: filter === 'pending' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('overdue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === 'overdue' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
              }`}
              style={{
                background: filter === 'overdue' ? 'var(--brand-600)' : 'transparent',
                color: filter === 'overdue' ? '#fff' : 'var(--text-secondary)',
              }}
            >
              Overdue ({overdueCount})
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <CheckCircle size={48} className="mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                No pending approvals
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map(task => {
                const instance = workflowInstances.find(i => i.id === task.instance_id);
                if (!instance) return null;

                const overdue = isTaskOverdue(task);

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedTask?.id === task.id ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
                    } ${overdue ? 'border-l-4' : ''}`}
                    style={{
                      background: 'var(--card-bg)',
                      borderColor: selectedTask?.id === task.id ? 'var(--brand-500)' : overdue ? 'var(--error-500)' : 'var(--card-border)',
                      borderLeftColor: overdue ? 'var(--error-600)' : undefined,
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText size={16} style={{ color: 'var(--brand-600)' }} />
                          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {instance.doc_number}
                          </h3>
                          <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                            {instance.doc_type.replace(/_/g, ' ')}
                          </span>
                        </div>
                        {instance.project_name && (
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {instance.project_name}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                          ₹{(instance.amount_snapshot / 100000).toFixed(2)}L
                        </div>
                        {overdue && (
                          <div className="text-[10px] font-medium" style={{ color: 'var(--error-600)' }}>
                            OVERDUE
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User size={12} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {instance.submitted_by_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={12} style={{ color: 'var(--text-muted)' }} />
                          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(instance.submitted_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: getTaskStatusColor(task.status) + '20',
                            color: getTaskStatusColor(task.status),
                          }}>
                          {task.step_name}
                        </span>
                        <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedTask && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <TaskDetailPanel
              task={selectedTask}
              onApprove={() => { setActionType('approve'); setShowActionModal(true); }}
              onReject={() => { setActionType('reject'); setShowActionModal(true); }}
              onReturn={() => { setActionType('return'); setShowActionModal(true); }}
              onClose={() => setSelectedTask(null)}
            />
          </div>
        )}
      </div>

      {/* Action Modal */}
      {showActionModal && selectedTask && (
        <ActionModal
          task={selectedTask}
          actionType={actionType}
          comment={comment}
          reasonCode={reasonCode}
          onCommentChange={setComment}
          onReasonCodeChange={setReasonCode}
          onConfirm={() => handleAction(actionType)}
          onCancel={() => {
            setShowActionModal(false);
            setComment('');
            setReasonCode('');
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TASK DETAIL PANEL
// ═══════════════════════════════════════════════════════════

function TaskDetailPanel({
  task,
  onApprove,
  onReject,
  onReturn,
  onClose,
}: {
  task: WorkflowTask;
  onApprove: () => void;
  onReject: () => void;
  onReturn: () => void;
  onClose: () => void;
}) {
  const instance = workflowInstances.find(i => i.id === task.instance_id);
  const actionLogs = workflowActionLogs.filter(l => l.instance_id === task.instance_id);

  if (!instance) return null;

  const overdue = isTaskOverdue(task);

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

      {/* Document Info */}
      <div className="space-y-3 mb-6">
        <DetailRow label="Amount" value={`₹${(instance.amount_snapshot / 100000).toFixed(2)} Lakh`} />
        <DetailRow label="Submitted By" value={instance.submitted_by_name} />
        <DetailRow label="Submitted On" value={new Date(instance.submitted_at).toLocaleDateString()} />
        {instance.project_name && <DetailRow label="Project" value={instance.project_name} />}
        {instance.site_name && <DetailRow label="Site" value={instance.site_name} />}
      </div>

      {/* Current Step */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-muted)' }}>
          Current Step
        </div>
        <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
          {task.step_name}
        </div>
        <div className="flex items-center gap-2">
          <User size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            Assigned to: {task.assignee_name}
          </span>
        </div>
        {overdue && (
          <div className="flex items-center gap-1 mt-2">
            <AlertCircle size={12} style={{ color: 'var(--error-600)' }} />
            <span className="text-xs font-medium" style={{ color: 'var(--error-600)' }}>
              Overdue since {new Date(task.due_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Action History */}
      <div className="mb-6">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Action History
        </h3>
        <div className="space-y-2">
          {actionLogs.map(log => (
            <div key={log.id} className="flex items-start gap-2 p-2 rounded" style={{ background: 'var(--surface-sunken)' }}>
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{
                background: log.action === 'approved' ? 'var(--success-600)' :
                           log.action === 'rejected' ? 'var(--error-600)' :
                           log.action === 'returned' ? 'var(--info-600)' :
                           'var(--text-muted)',
              }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {log.actor_name} - {log.action}
                </div>
                {log.comment && (
                  <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                    {log.comment}
                  </div>
                )}
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                  {new Date(log.at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      {task.status === 'pending' && (
        <div className="space-y-2">
          <button
            onClick={onApprove}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--success-600)', color: '#fff' }}
          >
            <Check size={16} />
            Approve
          </button>
          <button
            onClick={onReject}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--error-600)', color: '#fff' }}
          >
            <X size={16} />
            Reject
          </button>
          <button
            onClick={onReturn}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <RotateCcw size={16} />
            Return for Correction
          </button>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ACTION MODAL
// ═══════════════════════════════════════════════════════════

function ActionModal({
  task,
  actionType,
  comment,
  reasonCode,
  onCommentChange,
  onReasonCodeChange,
  onConfirm,
  onCancel,
}: {
  task: WorkflowTask;
  actionType: 'approve' | 'reject' | 'return';
  comment: string;
  reasonCode: string;
  onCommentChange: (value: string) => void;
  onReasonCodeChange: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const instance = workflowInstances.find(i => i.id === task.instance_id);
  if (!instance) return null;

  const title = actionType === 'approve' ? 'Approve Document' :
                actionType === 'reject' ? 'Reject Document' :
                'Return for Correction';

  const color = actionType === 'approve' ? 'var(--success-600)' :
                actionType === 'reject' ? 'var(--error-600)' :
                'var(--info-600)';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {instance.doc_number} - {instance.doc_type.replace(/_/g, ' ')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Comment {actionType !== 'approve' && '(Required)'}
            </label>
            <textarea
              value={comment}
              onChange={(e) => onCommentChange(e.target.value)}
              placeholder="Add your comments..."
              className="w-full h-24 p-3 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>

          {actionType !== 'approve' && (
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Reason Code
              </label>
              <select
                value={reasonCode}
                onChange={(e) => onReasonCodeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              >
                <option value="">Select reason...</option>
                <option value="BUDGET_EXCEEDED">Budget Exceeded</option>
                <option value="MISSING_DOCUMENT">Missing Document</option>
                <option value="INCORRECT_AMOUNT">Incorrect Amount</option>
                <option value="POLICY_VIOLATION">Policy Violation</option>
                <option value="VENDOR_ISSUE">Vendor Issue</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={actionType !== 'approve' && (!comment || !reasonCode)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: color, color: '#fff' }}
          >
            {actionType === 'approve' ? 'Approve' : actionType === 'reject' ? 'Reject' : 'Return'}
          </button>
        </div>
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
