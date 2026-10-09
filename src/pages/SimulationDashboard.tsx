import React, { useState } from 'react';
import {
  Play,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  Filter,
  Search,
  Eye,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import {
  simulations,
  decisionTables,
  getSimulationStatusColor,
  type Simulation,
} from '../data/rulesData';
import { runSimulation } from '../core/RulesEngine';

// ═══════════════════════════════════════════════════════════
// SIMULATION DASHBOARD — Part 13
// Route: /admin/rules/simulations
// ═══════════════════════════════════════════════════════════

export function SimulationDashboard() {
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
  const [showNewSimulation, setShowNewSimulation] = useState(false);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [periodFrom, setPeriodFrom] = useState<string>('');
  const [periodTo, setPeriodTo] = useState<string>('');

  const handleRunSimulation = () => {
    if (!selectedTable || !periodFrom || !periodTo) {
      alert('Please fill all fields');
      return;
    }

    try {
      const simulation = runSimulation({
        table_id: selectedTable,
        period_from: periodFrom,
        period_to: periodTo,
        run_by: 'user-001', // Current user
      });

      setSelectedSimulation(simulation);
      setShowNewSimulation(false);
    } catch (error) {
      console.error('Simulation failed:', error);
      alert(`Simulation failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Play size={24} style={{ color: 'var(--brand-600)' }} />
              Rule Simulation Dashboard
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Test decision tables against historical documents
            </p>
          </div>
          <button
            onClick={() => setShowNewSimulation(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <Play size={14} />
            New Simulation
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Simulation List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {simulations.map(simulation => (
              <SimulationCard
                key={simulation.id}
                simulation={simulation}
                isSelected={selectedSimulation?.id === simulation.id}
                onClick={() => setSelectedSimulation(simulation)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedSimulation && (
          <div className="w-[500px] border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <SimulationDetail
              simulation={selectedSimulation}
              onClose={() => setSelectedSimulation(null)}
            />
          </div>
        )}
      </div>

      {/* New Simulation Modal */}
      {showNewSimulation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
          <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
            <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                Run New Simulation
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Test a decision table against historical documents
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Decision Table
                </label>
                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                >
                  <option value="">Select a decision table...</option>
                  {decisionTables.map(dt => (
                    <option key={dt.id} value={dt.id}>{dt.name} (v{dt.version})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Period From
                  </label>
                  <input
                    type="date"
                    value={periodFrom}
                    onChange={(e) => setPeriodFrom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Period To
                  </label>
                  <input
                    type="date"
                    value={periodTo}
                    onChange={(e) => setPeriodTo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
              <button
                onClick={() => setShowNewSimulation(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
                style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleRunSimulation}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
                style={{ background: 'var(--brand-600)', color: '#fff' }}
              >
                <Play size={14} />
                Run Simulation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIMULATION CARD
// ═══════════════════════════════════════════════════════════

function SimulationCard({
  simulation,
  isSelected,
  onClick,
}: {
  simulation: Simulation;
  isSelected: boolean;
  onClick: () => void;
}) {
  const changePercent = simulation.total_documents > 0
    ? ((simulation.changed_routings / simulation.total_documents) * 100).toFixed(1)
    : '0.0';

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
            <FileText size={16} style={{ color: 'var(--brand-600)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {simulation.table_name}
            </h3>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            v{simulation.version} · Run by {simulation.run_by}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: getSimulationStatusColor(simulation.status) + '20',
            color: getSimulationStatusColor(simulation.status),
          }}>
          {simulation.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {simulation.total_documents}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Total Docs
          </div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--warning-50)' }}>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--warning-700)' }}>
            {simulation.changed_routings}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--warning-600)' }}>
            Changed ({changePercent}%)
          </div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--success-50)' }}>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
            {simulation.unchanged_routings}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--success-600)' }}>
            Unchanged
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Period: {new Date(simulation.period_from).toLocaleDateString()} - {new Date(simulation.period_to).toLocaleDateString()}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {new Date(simulation.run_at).toLocaleString()}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIMULATION DETAIL
// ═══════════════════════════════════════════════════════════

function SimulationDetail({
  simulation,
  onClose,
}: {
  simulation: Simulation;
  onClose: () => void;
}) {
  const [filterChanged, setFilterChanged] = useState<'all' | 'changed' | 'unchanged'>('all');

  const filteredResults = simulation.results?.filter(r => {
    if (filterChanged === 'all') return true;
    if (filterChanged === 'changed') return r.changed;
    return !r.changed;
  }) || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Play size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Simulation Results
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {simulation.table_name} v{simulation.version}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-lg border mb-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Period</div>
            <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
              {new Date(simulation.period_from).toLocaleDateString()} - {new Date(simulation.period_to).toLocaleDateString()}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Run At</div>
            <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
              {new Date(simulation.run_at).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Total Documents</div>
            <div className="text-sm font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {simulation.total_documents}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Changed Routings</div>
            <div className="text-sm font-semibold tabular-nums" style={{ color: 'var(--warning-700)' }}>
              {simulation.changed_routings} ({((simulation.changed_routings / simulation.total_documents) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setFilterChanged('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterChanged === 'all' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
          }`}
          style={{
            background: filterChanged === 'all' ? 'var(--brand-600)' : 'transparent',
            color: filterChanged === 'all' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          All ({simulation.results?.length || 0})
        </button>
        <button
          onClick={() => setFilterChanged('changed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterChanged === 'changed' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
          }`}
          style={{
            background: filterChanged === 'changed' ? 'var(--brand-600)' : 'transparent',
            color: filterChanged === 'changed' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          Changed ({simulation.changed_routings})
        </button>
        <button
          onClick={() => setFilterChanged('unchanged')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterChanged === 'unchanged' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
          }`}
          style={{
            background: filterChanged === 'unchanged' ? 'var(--brand-600)' : 'transparent',
            color: filterChanged === 'unchanged' ? '#fff' : 'var(--text-secondary)',
          }}
        >
          Unchanged ({simulation.unchanged_routings})
        </button>
      </div>

      {/* Results Table */}
      <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-3 py-2 text-left text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Document</th>
              <th className="px-3 py-2 text-center text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Amount</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Old Routing</th>
              <th className="px-3 py-2 text-left text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>New Routing</th>
              <th className="px-3 py-2 text-center text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>Changed</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.slice(0, 10).map(result => (
              <tr key={result.document_id} className="border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-3 py-2">
                  <div className="text-[10px] font-medium" style={{ color: 'var(--text-primary)' }}>
                    {result.document_number}
                  </div>
                  <div className="text-[9px]" style={{ color: 'var(--text-muted)' }}>
                    {result.document_type}
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-primary)' }}>
                    ₹{(result.amount / 100000).toFixed(1)}L
                  </span>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {result.old_routing.map(r => (
                      <span key={r} className="text-[9px] px-1 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-1">
                    {result.new_routing.map(r => (
                      <span key={r} className="text-[9px] px-1 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                        {r}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-2 text-center">
                  {result.changed ? (
                    <TrendingUp size={12} style={{ color: 'var(--warning-600)' }} />
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredResults.length > 10 && (
        <div className="mt-2 text-center text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Showing 10 of {filteredResults.length} results
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Download size={12} />
          Export Report
        </button>
      </div>
    </div>
  );
}
