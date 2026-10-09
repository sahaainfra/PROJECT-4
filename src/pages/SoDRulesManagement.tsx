import React, { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle, Plus, Eye, Edit2, Filter } from 'lucide-react';
import { 
  sodRules, 
  sodViolations, 
  sodExceptions,
  getSeverityColor, 
  getSoDModeColor,
  getViolationsByRule,
  getExceptionsByRule,
  type SoDRule 
} from '../data/identitySodData';

// ═══════════════════════════════════════════════════════════
// SOD RULES MANAGEMENT — Part 09
// Route: /admin/idsod/rules
// ═══════════════════════════════════════════════════════════

export function SoDRulesManagement() {
  const [selectedRule, setSelectedRule] = useState<SoDRule | null>(null);
  const [filterMode, setFilterMode] = useState<string>('ALL');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredRules = sodRules.filter(rule => {
    const matchesMode = filterMode === 'ALL' || rule.mode === filterMode;
    const matchesSeverity = filterSeverity === 'ALL' || rule.severity === filterSeverity;
    return matchesMode && matchesSeverity;
  });

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield size={24} style={{ color: 'var(--brand-600)' }} />
              Segregation of Duties Rules
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage SoD rules to prevent conflicting permissions
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={16} />
            New Rule
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterMode}
            onChange={(e) => setFilterMode(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Modes</option>
            <option value="enforce">Enforce</option>
            <option value="observe">Observe</option>
          </select>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Rules List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredRules.map(rule => {
              const violations = getViolationsByRule(rule.id);
              const exceptions = getExceptionsByRule(rule.id);
              
              return (
                <div
                  key={rule.id}
                  onClick={() => setSelectedRule(rule)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedRule?.id === rule.id ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
                  }`}
                  style={{ background: 'var(--card-bg)', borderColor: selectedRule?.id === rule.id ? 'var(--brand-500)' : 'var(--card-border)' }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {rule.name}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                          style={{ background: getSoDModeColor(rule.mode) + '20', color: getSoDModeColor(rule.mode) }}>
                          {rule.mode.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {rule.code}
                      </div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ background: getSeverityColor(rule.severity) + '20', color: getSeverityColor(rule.severity) }}>
                      {rule.severity}
                    </span>
                  </div>

                  <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
                    {rule.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                      <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                        Action A
                      </div>
                      <code className="text-[10px]" style={{ color: 'var(--text-primary)' }}>
                        {rule.actionA}
                      </code>
                    </div>
                    <div className="p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                      <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                        Action B
                      </div>
                      <code className="text-[10px]" style={{ color: 'var(--text-primary)' }}>
                        {rule.actionB}
                      </code>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <AlertTriangle size={10} style={{ color: 'var(--error-600)' }} />
                        <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          {violations.length} violations
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle size={10} style={{ color: 'var(--success-600)' }} />
                        <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                          {exceptions.length} exceptions
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {rule.scope.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedRule && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {selectedRule.name}
                </h2>
                <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                  {selectedRule.code}
                </div>
              </div>
              <button onClick={() => setSelectedRule(null)} className="p-1 rounded hover:bg-[var(--nav-hover)]">
                <span style={{ color: 'var(--text-muted)' }}>✕</span>
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <DetailRow label="Description" value={selectedRule.description} />
              <DetailRow label="Mode" value={selectedRule.mode.toUpperCase()} />
              <DetailRow label="Severity" value={selectedRule.severity.toUpperCase()} />
              <DetailRow label="Scope" value={selectedRule.scope.replace('_', ' ')} />
              <DetailRow label="Status" value={selectedRule.status.toUpperCase()} />
              <DetailRow label="Action A" value={selectedRule.actionA} />
              <DetailRow label="Action B" value={selectedRule.actionB} />
              <DetailRow label="Created" value={new Date(selectedRule.createdAt).toLocaleDateString()} />
              {selectedRule.approvedAt && (
                <DetailRow label="Approved" value={`${new Date(selectedRule.approvedAt).toLocaleDateString()} by ${selectedRule.approvedBy}`} />
              )}
            </div>

            {/* Recent Violations */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                Recent Violations
              </h3>
              <div className="space-y-2">
                {getViolationsByRule(selectedRule.id).slice(0, 5).map(violation => (
                  <div key={violation.id} className="p-2 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {violation.userName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" 
                        style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
                        {violation.status}
                      </span>
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {violation.recordType} #{violation.recordId}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {new Date(violation.detectedAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                style={{ background: 'var(--brand-600)', color: '#fff' }}>
                <Edit2 size={12} />
                Edit Rule
              </button>
              <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                <Eye size={12} />
                Simulate
              </button>
            </div>
          </div>
        )}
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
