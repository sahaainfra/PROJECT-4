import React, { useState } from 'react';
import {
  Settings,
  Plus,
  Edit2,
  Trash2,
  Play,
  CheckCircle,
  XCircle,
  ArrowRight,
  GitBranch,
  Users,
  Clock,
  FileText,
  Filter,
  Search,
  Eye,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  workflowDefinitions,
  workflowSteps,
  workflowConditions,
  workflowInstances,
  getDefinitionById,
  getStepsByDefinition,
  getConditionsByDefinition,
  type WorkflowDefinition,
  type WorkflowStep,
} from '../data/workflowData';
import { simulateWorkflow } from '../core/WorkflowEngine';

// ═══════════════════════════════════════════════════════════
// WORKFLOW DESIGNER — Part 12
// Route: /admin/wf/designer
// ═══════════════════════════════════════════════════════════

export function WorkflowDesigner() {
  const [selectedDefinition, setSelectedDefinition] = useState<WorkflowDefinition | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const [simulationDocType, setSimulationDocType] = useState('purchase_requisition');
  const [simulationAmount, setSimulationAmount] = useState(1000000);
  const [simulationResult, setSimulationResult] = useState<{
    steps: string[];
    approvers: string[];
    conditions: string[];
  } | null>(null);

  const handleSimulate = () => {
    try {
      const result = simulateWorkflow(simulationDocType, simulationAmount, {});
      setSimulationResult(result);
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
              <Settings size={24} style={{ color: 'var(--brand-600)' }} />
              Workflow Designer
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Design and manage approval workflows
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSimulation(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <Play size={14} />
              Simulate
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
              style={{ background: 'var(--brand-600)', color: '#fff' }}>
              <Plus size={14} />
              New Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Definitions List */}
        <div className="w-80 border-r overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
          <div className="p-4">
            <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
              WORKFLOW DEFINITIONS
            </h3>
            <div className="space-y-2">
              {workflowDefinitions.map(def => (
                <div
                  key={def.id}
                  onClick={() => setSelectedDefinition(def)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedDefinition?.id === def.id ? 'ring-2 ring-[var(--brand-500)]' : 'hover:bg-[var(--nav-hover)]'
                  }`}
                  style={{
                    background: selectedDefinition?.id === def.id ? 'var(--nav-active-bg)' : 'transparent',
                    border: `1px solid ${selectedDefinition?.id === def.id ? 'var(--brand-500)' : 'var(--border-subtle)'}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {def.name}
                    </span>
                    {def.is_active ? (
                      <CheckCircle size={14} style={{ color: 'var(--success-600)' }} />
                    ) : (
                      <XCircle size={14} style={{ color: 'var(--text-muted)' }} />
                    )}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {def.doc_type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    v{def.version} · {getStepsByDefinition(def.id).length} steps
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Designer Canvas */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedDefinition ? (
            <DefinitionEditor definition={selectedDefinition} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Settings size={48} className="mb-4" style={{ color: 'var(--text-muted)' }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Select a Workflow
              </h3>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Choose a workflow definition from the left to edit
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simulation Modal */}
      {showSimulation && (
        <SimulationModal
          docType={simulationDocType}
          amount={simulationAmount}
          result={simulationResult}
          onDocTypeChange={setSimulationDocType}
          onAmountChange={setSimulationAmount}
          onSimulate={handleSimulate}
          onClose={() => {
            setShowSimulation(false);
            setSimulationResult(null);
          }}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEFINITION EDITOR
// ═══════════════════════════════════════════════════════════

function DefinitionEditor({ definition }: { definition: WorkflowDefinition }) {
  const steps = getStepsByDefinition(definition.id);
  const conditions = getConditionsByDefinition(definition.id);
  const instances = workflowInstances.filter(i => i.definition_id === definition.id);

  return (
    <div className="space-y-6">
      {/* Definition Header */}
      <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {definition.name}
            </h2>
            <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
              {definition.code} · v{definition.version}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-[var(--nav-hover)]" title="Edit">
              <Edit2 size={16} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button className="p-2 rounded-lg hover:bg-[var(--nav-hover)]" title="Delete">
              <Trash2 size={16} style={{ color: 'var(--error-600)' }} />
            </button>
          </div>
        </div>
        <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          {definition.description}
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {steps.length}
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Steps
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {conditions.length}
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Conditions
            </div>
          </div>
          <div className="text-center p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {instances.length}
            </div>
            <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Instances
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Steps */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Workflow Steps
          </h3>
          <button className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={12} />
            Add Step
          </button>
        </div>
        <div className="space-y-2">
          {steps.map((step, index) => (
            <StepCard key={step.id} step={step} index={index} total={steps.length} />
          ))}
        </div>
      </div>

      {/* Conditions */}
      {conditions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Conditions & Routing Rules
          </h3>
          <div className="space-y-2">
            {conditions.map(condition => (
              <div key={condition.id} className="p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-2">
                  <code className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
                    {condition.expression}
                  </code>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: condition.action === 'skip' ? 'var(--warning-50)' : 'var(--info-50)',
                      color: condition.action === 'skip' ? 'var(--warning-700)' : 'var(--info-700)',
                    }}>
                    {condition.action}
                  </span>
                </div>
                {condition.route_to_step && (
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Route to step {condition.route_to_step}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// STEP CARD
// ═══════════════════════════════════════════════════════════

function StepCard({ step, index, total }: { step: WorkflowStep; index: number; total: number }) {
  const getStepTypeIcon = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'sequential': return <ArrowRight size={14} />;
      case 'parallel_all': return <GitBranch size={14} />;
      case 'parallel_any': return <Zap size={14} />;
      case 'quorum': return <Users size={14} />;
    }
  };

  const getStepTypeLabel = (type: WorkflowStep['type']) => {
    switch (type) {
      case 'sequential': return 'Sequential';
      case 'parallel_all': return 'Parallel (All)';
      case 'parallel_any': return 'Parallel (Any)';
      case 'quorum': return `Quorum (${step.quorum_n})`;
    }
  };

  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--card-bg)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            {step.seq}
          </div>
          <div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              {step.name}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {getStepTypeIcon(step.type)}
                <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                  {getStepTypeLabel(step.type)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Edit">
            <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
          </button>
          <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
            <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Approver Rule
          </div>
          <div className="flex items-center gap-1">
            <Users size={12} style={{ color: 'var(--brand-600)' }} />
            <span className="text-xs" style={{ color: 'var(--text-primary)' }}>
              {step.approver_rule_type.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {step.approver_rule_value}
          </div>
        </div>
        <div>
          <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            SLA
          </div>
          <div className="flex items-center gap-1">
            <Clock size={12} style={{ color: 'var(--warning-600)' }} />
            <span className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {step.sla_hours}h
            </span>
          </div>
          {step.escalate_to_rule && (
            <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Escalate to: {step.escalate_to_rule}
            </div>
          )}
        </div>
      </div>

      {step.mandatory_comment && (
        <div className="flex items-center gap-1 text-[10px]" style={{ color: 'var(--text-muted)' }}>
          <AlertCircle size={10} />
          <span>Mandatory comment required</span>
        </div>
      )}

      {step.mandatory_documents.length > 0 && (
        <div className="flex items-center gap-1 text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
          <FileText size={10} />
          <span>Documents: {step.mandatory_documents.join(', ')}</span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SIMULATION MODAL
// ═══════════════════════════════════════════════════════════

function SimulationModal({
  docType,
  amount,
  result,
  onDocTypeChange,
  onAmountChange,
  onSimulate,
  onClose,
}: {
  docType: string;
  amount: number;
  result: { steps: string[]; approvers: string[]; conditions: string[] } | null;
  onDocTypeChange: (value: string) => void;
  onAmountChange: (value: number) => void;
  onSimulate: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Play size={20} style={{ color: 'var(--brand-600)' }} />
                Workflow Simulation
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Test workflow routing with sample data
              </p>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
              <span style={{ color: 'var(--text-muted)' }}>✕</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Document Type
              </label>
              <select
                value={docType}
                onChange={(e) => onDocTypeChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              >
                <option value="purchase_requisition">Purchase Requisition</option>
                <option value="purchase_order">Purchase Order</option>
                <option value="subcontractor_bill">Subcontractor Bill</option>
                <option value="leave_application">Leave Application</option>
                <option value="budget_revision">Budget Revision</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Amount (₹)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => onAmountChange(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          <button
            onClick={onSimulate}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <Play size={16} />
            Run Simulation
          </button>

          {result && (
            <div className="space-y-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div>
                <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Workflow Steps ({result.steps.length})
                </h3>
                <div className="space-y-1">
                  {result.steps.map((step, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--surface-sunken)' }}>
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: 'var(--brand-600)', color: '#fff' }}>
                        {i + 1}
                      </div>
                      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Approvers
                </h3>
                <div className="space-y-1">
                  {result.approvers.map((approver, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--surface-sunken)' }}>
                      <Users size={12} style={{ color: 'var(--brand-600)' }} />
                      <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{approver}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.conditions.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Conditions Applied
                  </h3>
                  <div className="space-y-1">
                    {result.conditions.map((condition, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--warning-50)' }}>
                        <AlertCircle size={12} style={{ color: 'var(--warning-600)' }} />
                        <span className="text-xs" style={{ color: 'var(--warning-700)' }}>{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
