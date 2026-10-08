import React, { useState } from 'react';
import {
  Shield,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Filter,
  Search,
  Eye,
  Edit2,
  Plus,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import {
  controlPoints,
  controlPointModes,
  evaluations,
  exceptions,
  violations,
  getControlPointByCode,
  getControlPointsByModule,
  getActiveMode,
  getModeColor,
  getResultColor,
  getSeverityColor,
  type ControlPoint,
  type Evaluation,
  type Violation,
} from '../data/protocolData';
import { generateObserveReport } from '../core/ProtocolEngine';

// ═══════════════════════════════════════════════════════════
// PROTOCOL CONSOLE — Part 14
// Route: /admin/protocol
// ═══════════════════════════════════════════════════════════

export function ProtocolConsole() {
  const [activeTab, setActiveTab] = useState<'control-points' | 'evaluations' | 'violations' | 'exceptions' | 'observe-report'>('control-points');
  const [selectedCP, setSelectedCP] = useState<ControlPoint | null>(null);
  const [filterModule, setFilterModule] = useState<string>('ALL');
  const [filterMode, setFilterMode] = useState<string>('ALL');

  const modules = Array.from(new Set(controlPoints.map(cp => cp.module)));
  
  const filteredCPs = controlPoints.filter(cp => {
    const matchesModule = filterModule === 'ALL' || cp.module === filterModule;
    const mode = getActiveMode(cp.cp_code);
    const matchesMode = filterMode === 'ALL' || (mode && mode.mode === filterMode);
    return matchesModule && matchesMode;
  });

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Shield size={24} style={{ color: 'var(--brand-600)' }} />
              Protocol & Control Console
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage control points, exceptions, and violations
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Control Point
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'control-points', label: 'Control Points', icon: Settings },
            { id: 'evaluations', label: 'Evaluations', icon: CheckCircle },
            { id: 'violations', label: 'Violations', icon: AlertTriangle },
            { id: 'exceptions', label: 'Exceptions', icon: FileText },
            { id: 'observe-report', label: 'OBSERVE Report', icon: TrendingUp },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
                }`}
                style={{
                  background: activeTab === tab.id ? 'var(--brand-600)' : 'transparent',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'control-points' && (
            <ControlPointsTab
              controlPoints={filteredCPs}
              modules={modules}
              filterModule={filterModule}
              filterMode={filterMode}
              onFilterModuleChange={setFilterModule}
              onFilterModeChange={setFilterMode}
              onSelectCP={setSelectedCP}
            />
          )}
          {activeTab === 'evaluations' && <EvaluationsTab />}
          {activeTab === 'violations' && <ViolationsTab />}
          {activeTab === 'exceptions' && <ExceptionsTab />}
          {activeTab === 'observe-report' && <ObserveReportTab />}
        </div>

        {/* Detail Panel */}
        {selectedCP && activeTab === 'control-points' && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <ControlPointDetail cp={selectedCP} onClose={() => setSelectedCP(null)} />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTROL POINTS TAB
// ═══════════════════════════════════════════════════════════

function ControlPointsTab({
  controlPoints,
  modules,
  filterModule,
  filterMode,
  onFilterModuleChange,
  onFilterModeChange,
  onSelectCP,
}: {
  controlPoints: ControlPoint[];
  modules: string[];
  filterModule: string;
  filterMode: string;
  onFilterModuleChange: (value: string) => void;
  onFilterModeChange: (value: string) => void;
  onSelectCP: (cp: ControlPoint) => void;
}) {
  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <select
          value={filterModule}
          onChange={(e) => onFilterModuleChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Modules</option>
          {modules.map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select
          value={filterMode}
          onChange={(e) => onFilterModeChange(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Modes</option>
          <option value="OFF">OFF</option>
          <option value="OBSERVE">OBSERVE</option>
          <option value="WARN">WARN</option>
          <option value="ENFORCE">ENFORCE</option>
        </select>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {controlPoints.length} control points
        </div>
      </div>

      {/* Control Points List */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Code</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Module</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Stage</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Check Type</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Enforcement</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Mode</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {controlPoints.map(cp => {
              const mode = getActiveMode(cp.cp_code);
              return (
                <tr
                  key={cp.cp_code}
                  onClick={() => onSelectCP(cp)}
                  className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                  style={{ borderColor: 'var(--border-subtle)' }}
                >
                  <td className="px-4 py-3">
                    <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {cp.cp_code}
                    </code>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {cp.module}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {cp.stage}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {cp.check_type}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: cp.enforcement === 'BLOCK' ? 'var(--error-50)' :
                                   cp.enforcement === 'EXCEPTION' ? 'var(--warning-50)' :
                                   cp.enforcement === 'WARN' ? 'var(--info-50)' : 'var(--surface-sunken)',
                        color: cp.enforcement === 'BLOCK' ? 'var(--error-700)' :
                               cp.enforcement === 'EXCEPTION' ? 'var(--warning-700)' :
                               cp.enforcement === 'WARN' ? 'var(--info-700)' : 'var(--text-muted)',
                      }}>
                      {cp.enforcement}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: getModeColor(mode?.mode || 'OFF') + '20',
                        color: getModeColor(mode?.mode || 'OFF'),
                      }}>
                      {mode?.mode || 'OFF'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {cp.description}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONTROL POINT DETAIL
// ═══════════════════════════════════════════════════════════

function ControlPointDetail({ cp, onClose }: { cp: ControlPoint; onClose: () => void }) {
  const mode = getActiveMode(cp.cp_code);
  const cpEvaluations = evaluations.filter(e => e.cp_code === cp.cp_code);
  const cpViolations = violations.filter(v => v.cp_code === cp.cp_code);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Settings size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {cp.cp_code}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            v{cp.version}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Status */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Mode</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: getModeColor(mode?.mode || 'OFF') + '20',
              color: getModeColor(mode?.mode || 'OFF'),
            }}>
            {mode?.mode || 'OFF'}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Enforcement</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: cp.enforcement === 'BLOCK' ? 'var(--error-50)' :
                         cp.enforcement === 'EXCEPTION' ? 'var(--warning-50)' :
                         cp.enforcement === 'WARN' ? 'var(--info-50)' : 'var(--surface-sunken)',
              color: cp.enforcement === 'BLOCK' ? 'var(--error-700)' :
                     cp.enforcement === 'EXCEPTION' ? 'var(--warning-700)' :
                     cp.enforcement === 'WARN' ? 'var(--info-700)' : 'var(--text-muted)',
            }}>
            {cp.enforcement}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Active</span>
          <span className="text-xs" style={{ color: cp.is_active ? 'var(--success-600)' : 'var(--text-muted)' }}>
            {cp.is_active ? 'Yes' : 'No'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Module" value={cp.module} />
        <DetailRow label="Stage" value={cp.stage} />
        <DetailRow label="Trigger" value={cp.trigger} />
        <DetailRow label="Check Type" value={cp.check_type} />
        <DetailRow label="Owner Role" value={cp.owner_role} />
        <DetailRow label="Description" value={cp.description} />
        {cp.threshold_key && <DetailRow label="Threshold Key" value={cp.threshold_key} />}
        {cp.evidence_rule_code && <DetailRow label="Evidence Rule" value={cp.evidence_rule_code} />}
        {cp.escalation_ladder_code && <DetailRow label="Escalation Ladder" value={cp.escalation_ladder_code} />}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Evaluations
          </div>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {cpEvaluations.length}
          </div>
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Violations
          </div>
          <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--error-600)' }}>
            {cpViolations.length}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}>
          <Edit2 size={12} />
          Edit
        </button>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Eye size={12} />
          View Evaluations
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EVALUATIONS TAB
// ═══════════════════════════════════════════════════════════

function EvaluationsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Recent Evaluations ({evaluations.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Control Point</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Mode</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Entity</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Action</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Result</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {evaluations.slice(-20).reverse().map(eval_ => (
              <tr key={eval_.evaluation_id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {eval_.evaluation_id}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {eval_.cp_code}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: getModeColor(eval_.mode) + '20',
                      color: getModeColor(eval_.mode),
                    }}>
                    {eval_.mode}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {eval_.entity_type}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {eval_.entity_id}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {eval_.action}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: getResultColor(eval_.result) + '20',
                      color: getResultColor(eval_.result),
                    }}>
                    {eval_.result}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(eval_.at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VIOLATIONS TAB
// ═══════════════════════════════════════════════════════════

function ViolationsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Violations ({violations.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Control Point</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Severity</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actor</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Project</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {violations.map(violation => (
              <tr key={violation.violation_id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {violation.violation_id}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {violation.cp_code}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: getSeverityColor(violation.severity) + '20',
                      color: getSeverityColor(violation.severity),
                    }}>
                    {violation.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {violation.actor_id}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {violation.project_id || '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: violation.status === 'open' ? 'var(--error-50)' :
                                 violation.status === 'acknowledged' ? 'var(--warning-50)' :
                                 violation.status === 'resolved' ? 'var(--success-50)' : 'var(--info-50)',
                      color: violation.status === 'open' ? 'var(--error-700)' :
                             violation.status === 'acknowledged' ? 'var(--warning-700)' :
                             violation.status === 'resolved' ? 'var(--success-700)' : 'var(--info-700)',
                    }}>
                    {violation.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXCEPTIONS TAB
// ═══════════════════════════════════════════════════════════

function ExceptionsTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Exceptions ({exceptions.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Number</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Control Point</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Entity</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Deviation</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Emergency</th>
            </tr>
          </thead>
          <tbody>
            {exceptions.map(exception => (
              <tr key={exception.exception_no} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {exception.exception_no}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {exception.type}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {exception.cp_code}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {exception.entity_type}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {exception.entity_id}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs tabular-nums font-medium" style={{ color: 'var(--text-primary)' }}>
                    {exception.deviation_value} {exception.deviation_unit}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: exception.status === 'APPROVED' ? 'var(--success-50)' :
                                 exception.status === 'SUBMITTED' ? 'var(--warning-50)' :
                                 exception.status === 'REJECTED' ? 'var(--error-50)' :
                                 exception.status === 'CONSUMED' ? 'var(--info-50)' : 'var(--surface-sunken)',
                      color: exception.status === 'APPROVED' ? 'var(--success-700)' :
                             exception.status === 'SUBMITTED' ? 'var(--warning-700)' :
                             exception.status === 'REJECTED' ? 'var(--error-700)' :
                             exception.status === 'CONSUMED' ? 'var(--info-700)' : 'var(--text-muted)',
                    }}>
                    {exception.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {exception.is_emergency ? (
                    <AlertCircle size={14} style={{ color: 'var(--error-600)' }} />
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OBSERVE REPORT TAB
// ═══════════════════════════════════════════════════════════

function ObserveReportTab() {
  const report = generateObserveReport({
    from_date: '2024-01-01T00:00:00Z',
    to_date: '2024-01-31T23:59:59Z',
  });

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Total Evaluations
          </div>
          <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {report.total_evaluations}
          </div>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Blocked Actions
          </div>
          <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--error-600)' }}>
            {report.blocked_actions}
          </div>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Warnings
          </div>
          <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--warning-600)' }}>
            {report.warnings}
          </div>
        </div>
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Exceptions Required
          </div>
          <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--info-600)' }}>
            {report.exceptions_required}
          </div>
        </div>
      </div>

      {/* By Module */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            By Module
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Module</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Evaluations</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Blocked</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Warnings</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Exceptions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.by_module).map(([module, stats]) => (
                <tr key={module} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {module}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {stats.evaluations}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: stats.blocked > 0 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                    {stats.blocked}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: stats.warnings > 0 ? 'var(--warning-600)' : 'var(--text-muted)' }}>
                    {stats.warnings}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: stats.exceptions > 0 ? 'var(--info-600)' : 'var(--text-muted)' }}>
                    {stats.exceptions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* By Control Point */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            By Control Point
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface-sunken)' }}>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Code</th>
                <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Description</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Evaluations</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Blocked</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Warnings</th>
                <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Exceptions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.by_cp).map(([cpCode, stats]) => (
                <tr key={cpCode} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-3">
                    <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {cpCode}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                    {stats.description}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {stats.evaluations}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: stats.blocked > 0 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                    {stats.blocked}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: stats.warnings > 0 ? 'var(--warning-600)' : 'var(--text-muted)' }}>
                    {stats.warnings}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: stats.exceptions > 0 ? 'var(--info-600)' : 'var(--text-muted)' }}>
                    {stats.exceptions}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
