import React, { useState } from 'react';
import {
  TrendingUp,
  Info,
  AlertCircle,
  CheckCircle,
  FileText,
  Download,
} from 'lucide-react';
import {
  complianceScores,
  getComplianceScoreBySubject,
  getScoreColor,
  type ComplianceScore,
} from '../data/accountabilityData';

// ═══════════════════════════════════════════════════════════
// COMPLIANCE SCORE EXPLAINER — Part 15
// Route: /admin/acc/scores
// ═══════════════════════════════════════════════════════════

export function ComplianceScoreExplainer() {
  const [selectedScore, setSelectedScore] = useState<ComplianceScore | null>(null);
  const [filterSubjectType, setFilterSubjectType] = useState<string>('ALL');
  const [filterPeriod, setFilterPeriod] = useState<string>('2024-01');

  const filteredScores = complianceScores.filter(score => {
    const matchesSubjectType = filterSubjectType === 'ALL' || score.subject_type === filterSubjectType;
    const matchesPeriod = score.period === filterPeriod;
    return matchesSubjectType && matchesPeriod;
  });

  const subjectTypes = Array.from(new Set(complianceScores.map(s => s.subject_type)));
  const periods = Array.from(new Set(complianceScores.map(s => s.period)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <TrendingUp size={24} style={{ color: 'var(--brand-600)' }} />
              Compliance Scores
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Track and explain compliance performance
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <Download size={12} />
            Export Report
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterSubjectType}
            onChange={(e) => setFilterSubjectType(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Subject Types</option>
            {subjectTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            {periods.map(period => (
              <option key={period} value={period}>{period}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Scores List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredScores.map(score => (
              <ScoreCard
                key={score.id}
                score={score}
                isSelected={selectedScore?.id === score.id}
                onClick={() => setSelectedScore(score)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedScore && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <ScoreDetail score={selectedScore} onClose={() => setSelectedScore(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCORE CARD
// ═══════════════════════════════════════════════════════════

function ScoreCard({
  score,
  isSelected,
  onClick,
}: {
  score: ComplianceScore;
  isSelected: boolean;
  onClick: () => void;
}) {
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
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            {score.subject_type}
          </div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            {score.subject_id}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold tabular-nums" style={{ color: getScoreColor(score.score) }}>
            {score.score}%
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {score.period}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-2">
        <ScoreBar
          label="On-Time"
          value={score.components_json.on_time_completion}
          color={getScoreColor(score.components_json.on_time_completion)}
        />
        <ScoreBar
          label="Protocol"
          value={score.components_json.protocol_compliance}
          color={getScoreColor(score.components_json.protocol_compliance)}
        />
        <ScoreBar
          label="Documentation"
          value={score.components_json.documentation_quality}
          color={getScoreColor(score.components_json.documentation_quality)}
        />
        <ScoreBar
          label="Exception Rate"
          value={score.components_json.exception_rate}
          color={getScoreColor(score.components_json.exception_rate)}
        />
        <ScoreBar
          label="Violations"
          value={score.components_json.violation_count}
          color={getScoreColor(score.components_json.violation_count)}
        />
      </div>

      {score.appeal_status && (
        <div className="mt-3 pt-3 border-t flex items-center gap-1" style={{ borderColor: 'var(--border-subtle)' }}>
          <Info size={10} style={{ color: 'var(--warning-600)' }} />
          <span className="text-[10px]" style={{ color: 'var(--warning-700)' }}>
            Appeal {score.appeal_status}
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCORE BAR
// ═══════════════════════════════════════════════════════════

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{label}</span>
        <span className="text-[10px] tabular-nums font-medium" style={{ color }}>{value}</span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCORE DETAIL
// ═══════════════════════════════════════════════════════════

function ScoreDetail({ score, onClose }: { score: ComplianceScore; onClose: () => void }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={20} style={{ color: getScoreColor(score.score) }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Score Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {score.subject_type}: {score.subject_id}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Overall Score */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="text-center">
          <div className="text-4xl font-bold tabular-nums mb-2" style={{ color: getScoreColor(score.score) }}>
            {score.score}%
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Overall Compliance Score
          </div>
          <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Period: {score.period}
          </div>
        </div>
      </div>

      {/* Component Breakdown */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
          Component Breakdown
        </h3>
        
        <ComponentDetail
          icon={CheckCircle}
          label="On-Time Completion"
          value={score.components_json.on_time_completion}
          description="Percentage of tasks completed on or before due date"
          weight={25}
        />
        <ComponentDetail
          icon={FileText}
          label="Protocol Compliance"
          value={score.components_json.protocol_compliance}
          description="Adherence to protocol controls and procedures"
          weight={25}
        />
        <ComponentDetail
          icon={FileText}
          label="Documentation Quality"
          value={score.components_json.documentation_quality}
          description="Quality and completeness of documentation"
          weight={20}
        />
        <ComponentDetail
          icon={AlertCircle}
          label="Exception Rate"
          value={score.components_json.exception_rate}
          description="Lower exception rate indicates better compliance"
          weight={15}
        />
        <ComponentDetail
          icon={AlertCircle}
          label="Violation Count"
          value={score.components_json.violation_count}
          description="Fewer violations indicate better compliance"
          weight={15}
        />
      </div>

      {/* Calculation Formula */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Calculation Formula
        </div>
        <div className="text-[10px] font-mono p-2 rounded" style={{ background: 'var(--surface-bg)', color: 'var(--text-secondary)' }}>
          Score = (On-Time × 0.25) + (Protocol × 0.25) + (Documentation × 0.20) + (Exception × 0.15) + (Violations × 0.15)
        </div>
      </div>

      {/* Appeal Information */}
      {score.appeal_note && (
        <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--warning-200)', background: 'var(--warning-50)' }}>
          <div className="flex items-start gap-2">
            <Info size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--warning-700)' }} />
            <div>
              <div className="text-xs font-semibold mb-1" style={{ color: 'var(--warning-800)' }}>
                Appeal Note
              </div>
              <div className="text-xs" style={{ color: 'var(--warning-700)' }}>
                {score.appeal_note}
              </div>
              {score.appeal_status && (
                <div className="text-[10px] mt-2" style={{ color: 'var(--warning-600)' }}>
                  Status: {score.appeal_status}
                  {score.appeal_reviewed_by && ` by ${score.appeal_reviewed_by}`}
                  {score.appeal_reviewed_at && ` on ${new Date(score.appeal_reviewed_at).toLocaleDateString()}`}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}>
          <Info size={12} />
          Appeal Score
        </button>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Download size={12} />
          Export
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENT DETAIL
// ═══════════════════════════════════════════════════════════

function ComponentDetail({
  icon: Icon,
  label,
  value,
  description,
  weight,
}: {
  icon: any;
  label: string;
  value: number;
  description: string;
  weight: number;
}) {
  return (
    <div className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon size={14} style={{ color: getScoreColor(value) }} />
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
              {label}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Weight: {weight}%
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold tabular-nums" style={{ color: getScoreColor(value) }}>
            {value}
          </div>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden mb-2" style={{ background: 'var(--surface-sunken)' }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${value}%`, background: getScoreColor(value) }}
        />
      </div>
      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
        {description}
      </div>
    </div>
  );
}
