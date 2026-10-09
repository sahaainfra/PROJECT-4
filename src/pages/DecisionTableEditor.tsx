import React, { useState } from 'react';
import {
  Table,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Eye,
  Play,
  Download,
  Upload,
  AlertCircle,
} from 'lucide-react';
import {
  decisionTables,
  getDecisionTableStatusColor,
  type DecisionTable,
} from '../data/rulesData';

// ═══════════════════════════════════════════════════════════
// DECISION TABLE EDITOR — Part 13
// Route: /admin/rules/decision-tables
// ═══════════════════════════════════════════════════════════

export function DecisionTableEditor() {
  const [selectedTable, setSelectedTable] = useState<DecisionTable | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterDocType, setFilterDocType] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTables = decisionTables.filter(table => {
    const matchesStatus = filterStatus === 'ALL' || table.status === filterStatus;
    const matchesDocType = filterDocType === 'ALL' || table.document_type === filterDocType;
    
    const matchesSearch = searchQuery === '' ||
      table.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      table.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesDocType && matchesSearch;
  });

  const docTypes = Array.from(new Set(decisionTables.map(t => t.document_type)));

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Table size={24} style={{ color: 'var(--brand-600)' }} />
              Decision Table Editor
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage routing rules and approval logic
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Decision Table
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by name, code, or description..."
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
            <option value="draft">Draft</option>
            <option value="simulated">Simulated</option>
            <option value="approved">Approved</option>
            <option value="active">Active</option>
            <option value="superseded">Superseded</option>
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
        {/* Table List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredTables.map(table => (
              <DecisionTableCard
                key={table.id}
                table={table}
                isSelected={selectedTable?.id === table.id}
                onClick={() => setSelectedTable(table)}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedTable && (
          <div className="w-[500px] border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <DecisionTableDetail
              table={selectedTable}
              onClose={() => setSelectedTable(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DECISION TABLE CARD
// ═══════════════════════════════════════════════════════════

function DecisionTableCard({
  table,
  isSelected,
  onClick,
}: {
  table: DecisionTable;
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
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Table size={16} style={{ color: 'var(--brand-600)' }} />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {table.name}
            </h3>
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {table.code} · v{table.version}
          </div>
        </div>
        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: getDecisionTableStatusColor(table.status) + '20',
            color: getDecisionTableStatusColor(table.status),
          }}>
          {table.status}
        </span>
      </div>

      <p className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        {table.description}
      </p>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {table.inputs.length}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Inputs
          </div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {table.outputs.length}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Outputs
          </div>
        </div>
        <div className="text-center p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
          <div className="text-lg font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {table.rows.length}
          </div>
          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            Rules
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Document: {table.document_type.replace(/_/g, ' ')}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          Hit Policy: {table.hit_policy}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DECISION TABLE DETAIL
// ═══════════════════════════════════════════════════════════

function DecisionTableDetail({
  table,
  onClose,
}: {
  table: DecisionTable;
  onClose: () => void;
}) {
  const [activeTab, setActiveTab] = useState<'rules' | 'inputs' | 'outputs'>('rules');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Table size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {table.name}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {table.code} · v{table.version}
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
              background: getDecisionTableStatusColor(table.status) + '20',
              color: getDecisionTableStatusColor(table.status),
            }}>
            {table.status}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Hit Policy</span>
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{table.hit_policy}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Effective From</span>
          <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
            {new Date(table.effective_from).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'rules' ? '' : 'border-transparent hover:opacity-70'
          }`}
          style={{
            color: activeTab === 'rules' ? 'var(--brand-600)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'rules' ? 'var(--brand-600)' : 'transparent',
          }}
        >
          Rules ({table.rows.length})
        </button>
        <button
          onClick={() => setActiveTab('inputs')}
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'inputs' ? '' : 'border-transparent hover:opacity-70'
          }`}
          style={{
            color: activeTab === 'inputs' ? 'var(--brand-600)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'inputs' ? 'var(--brand-600)' : 'transparent',
          }}
        >
          Inputs ({table.inputs.length})
        </button>
        <button
          onClick={() => setActiveTab('outputs')}
          className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'outputs' ? '' : 'border-transparent hover:opacity-70'
          }`}
          style={{
            color: activeTab === 'outputs' ? 'var(--brand-600)' : 'var(--text-secondary)',
            borderBottomColor: activeTab === 'outputs' ? 'var(--brand-600)' : 'transparent',
          }}
        >
          Outputs ({table.outputs.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'rules' && (
        <div className="space-y-2">
          {table.rows.map(row => (
            <div key={row.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Rule #{row.priority}
                </span>
                <div className="flex items-center gap-1">
                  <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Edit">
                    <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                  </button>
                  <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
                    <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Inputs
                  </div>
                  <div className="space-y-1">
                    {Object.entries(row.inputs).map(([key, value]) => (
                      <div key={key} className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                    Outputs
                  </div>
                  <div className="space-y-1">
                    {Object.entries(row.outputs).map(([key, value]) => (
                      <div key={key} className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                        <span className="font-medium">{key}:</span> {String(value)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {row.annotation && (
                <div className="text-[10px] p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                  {row.annotation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'inputs' && (
        <div className="space-y-2">
          {table.inputs.map(input => (
            <div key={input.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {input.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                  {input.type}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {input.name} {input.required && '(required)'}
              </div>
              {input.allowed_values && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {input.allowed_values.map(v => (
                    <span key={v} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'outputs' && (
        <div className="space-y-2">
          {table.outputs.map(output => (
            <div key={output.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {output.label}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                  {output.type}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                {output.name}
              </div>
              {output.allowed_values && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {output.allowed_values.map(v => (
                    <span key={v} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                      {v}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="mt-6 pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}>
          <Edit2 size={12} />
          Edit Table
        </button>
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Play size={12} />
          Simulate
        </button>
      </div>
    </div>
  );
}
