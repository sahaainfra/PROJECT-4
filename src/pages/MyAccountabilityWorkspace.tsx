import React, { useState } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  TrendingDown,
  FileText,
  Users,
  Calendar,
  Target,
} from 'lucide-react';
import {
  responsibilityItems,
  complianceScores,
  actionLedger,
  getResponsibilityItemsByUser,
  getOverdueItemsByUser,
  getComplianceScoreBySubject,
  getResponsibilityStatusColor,
  getPriorityColor,
  getScoreColor,
  type ResponsibilityItem,
  type ComplianceScore,
} from '../data/accountabilityData';

// ═══════════════════════════════════════════════════════════
// MY ACCOUNTABILITY WORKSPACE — Part 15
// Route: /home/acc
// ═══════════════════════════════════════════════════════════

export function MyAccountabilityWorkspace() {
  // Current user (in production, this would come from auth context)
  const currentUserId = 'user-010';
  const currentPeriod = '2024-01';

  const myResponsibilities = getResponsibilityItemsByUser(currentUserId);
  const myOverdueItems = getOverdueItemsByUser(currentUserId);
  const myScore = getComplianceScoreBySubject('user', currentUserId, currentPeriod);

  const pendingItems = myResponsibilities.filter(r => r.status === 'pending');
  const inProgressItems = myResponsibilities.filter(r => r.status === 'in_progress');
  const completedItems = myResponsibilities.filter(r => r.status === 'completed');

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Target size={24} style={{ color: 'var(--brand-600)' }} />
          My Accountability
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Your responsibilities, compliance score, and action history
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            title="Pending Items"
            value={pendingItems.length}
            icon={Clock}
            color="var(--info-600)"
            description="Awaiting action"
          />
          <SummaryCard
            title="In Progress"
            value={inProgressItems.length}
            icon={TrendingUp}
            color="var(--warning-600)"
            description="Currently working"
          />
          <SummaryCard
            title="Overdue"
            value={myOverdueItems.length}
            icon={AlertTriangle}
            color={myOverdueItems.length > 0 ? 'var(--error-600)' : 'var(--text-muted)'}
            description="Past due date"
          />
          <SummaryCard
            title="Compliance Score"
            value={myScore ? `${myScore.score}%` : 'N/A'}
            icon={CheckCircle}
            color={myScore ? getScoreColor(myScore.score) : 'var(--text-muted)'}
            description={currentPeriod}
          />
        </div>

        {/* Compliance Score Details */}
        {myScore && (
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Compliance Score Breakdown
              </h3>
              <button className="text-xs px-2 py-1 rounded border transition-colors hover:bg-[var(--card-hover)]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                Appeal Score
              </button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-5 gap-3">
                <ScoreComponent
                  label="On-Time Completion"
                  value={myScore.components_json.on_time_completion}
                />
                <ScoreComponent
                  label="Protocol Compliance"
                  value={myScore.components_json.protocol_compliance}
                />
                <ScoreComponent
                  label="Documentation Quality"
                  value={myScore.components_json.documentation_quality}
                />
                <ScoreComponent
                  label="Exception Rate"
                  value={myScore.components_json.exception_rate}
                />
                <ScoreComponent
                  label="Violation Count"
                  value={myScore.components_json.violation_count}
                />
              </div>
            </div>
          </div>
        )}

        {/* Overdue Items */}
        {myOverdueItems.length > 0 && (
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-4 py-3 border-b flex items-center gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <AlertTriangle size={16} style={{ color: 'var(--error-600)' }} />
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                Overdue Items ({myOverdueItems.length})
              </h3>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
              {myOverdueItems.map(item => (
                <ResponsibilityItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* All Responsibilities */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              All Responsibilities ({myResponsibilities.length})
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {myResponsibilities.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle size={32} className="mx-auto mb-2" style={{ color: 'var(--text-muted)' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  No responsibilities assigned
                </p>
              </div>
            ) : (
              myResponsibilities.map(item => (
                <ResponsibilityItemCard key={item.id} item={item} />
              ))
            )}
          </div>
        </div>

        {/* Recent Actions */}
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Actions
            </h3>
          </div>
          <div className="p-4">
            <div className="space-y-2">
              {actionLedger
                .filter(entry => entry.actor_id === currentUserId)
                .slice(-5)
                .reverse()
                .map(entry => (
                  <div key={entry.ledger_id} className="flex items-start gap-3 p-2 rounded hover:bg-[var(--nav-hover)]">
                    <FileText size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--text-muted)' }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                        {entry.action} - {entry.entity_type} {entry.doc_no}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {new Date(entry.at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUMMARY CARD COMPONENT
// ═══════════════════════════════════════════════════════════

function SummaryCard({ title, value, icon: Icon, color, description }: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  description: string;
}) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        {title}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
        {description}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCORE COMPONENT
// ═══════════════════════════════════════════════════════════

function ScoreComponent({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-2">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="var(--surface-sunken)"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke={getScoreColor(value)}
            strokeWidth="8"
            strokeDasharray={`${value * 2.51} 251`}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {value}
          </span>
        </div>
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RESPONSIBILITY ITEM CARD
// ═══════════════════════════════════════════════════════════

function ResponsibilityItemCard({ item }: { item: ResponsibilityItem }) {
  const isOverdue = item.due_at && new Date(item.due_at) < new Date() && item.status !== 'completed';

  return (
    <div className="p-4 hover:bg-[var(--card-hover)] transition-colors">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: getPriorityColor(item.priority) }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
              {item.description}
            </div>
            <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
              <span>{item.entity_type}</span>
              <span>•</span>
              <code>{item.doc_no}</code>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={{
              background: getResponsibilityStatusColor(item.status) + '20',
              color: getResponsibilityStatusColor(item.status),
            }}>
            {item.status}
          </span>
          {isOverdue && (
            <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
              OVERDUE
            </span>
          )}
        </div>
      </div>
      {item.due_at && (
        <div className="flex items-center gap-1 text-[10px]" style={{ color: isOverdue ? 'var(--error-600)' : 'var(--text-muted)' }}>
          <Calendar size={10} />
          <span>Due: {new Date(item.due_at).toLocaleString()}</span>
        </div>
      )}
    </div>
  );
}
