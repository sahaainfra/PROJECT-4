import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { getGateStatus, type GateStatusResult } from '../core/ProtocolEngine';
import { getModeColor, getResultColor } from '../data/protocolData';

// ═══════════════════════════════════════════════════════════
// GATE STATUS PANEL — Part 14
// Reusable component shown on transactional forms
// ═══════════════════════════════════════════════════════════

interface GateStatusPanelProps {
  entityType: string;
  action: string;
  payload?: Record<string, any>;
  scopeType?: string;
  scopeId?: string;
}

export function GateStatusPanel({
  entityType,
  action,
  payload,
  scopeType,
  scopeId,
}: GateStatusPanelProps) {
  const [gateStatus, setGateStatus] = useState<GateStatusResult | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch gate status
    const status = getGateStatus({
      entity_type: entityType,
      action,
      payload,
      scope_type: scopeType,
      scope_id: scopeId,
    });
    setGateStatus(status);
    setLoading(false);
  }, [entityType, action, payload, scopeType, scopeId]);

  if (loading || !gateStatus) {
    return (
      <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          Loading gate status...
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PASS':
        return <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />;
      case 'WARN':
        return <AlertTriangle size={16} style={{ color: 'var(--warning-600)' }} />;
      case 'BLOCK':
        return <XCircle size={16} style={{ color: 'var(--error-600)' }} />;
      case 'EXCEPTION_REQUIRED':
        return <AlertCircle size={16} style={{ color: 'var(--info-600)' }} />;
      default:
        return <Info size={16} style={{ color: 'var(--text-muted)' }} />;
    }
  };

  const getOverallColor = () => {
    switch (gateStatus.overall_status) {
      case 'PASS':
        return 'var(--success-600)';
      case 'WARN':
        return 'var(--warning-600)';
      case 'BLOCK':
        return 'var(--error-600)';
      default:
        return 'var(--text-muted)';
    }
  };

  return (
    <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border-subtle)', background: 'var(--card-bg)' }}>
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[var(--card-hover)] transition-colors"
        onClick={() => setExpanded(!expanded)}
        style={{ borderBottom: expanded ? '1px solid var(--border-subtle)' : 'none' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: getOverallColor() }} />
          <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
            Gate Status
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: getOverallColor() + '20',
              color: getOverallColor(),
            }}>
            {gateStatus.overall_status}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {gateStatus.checks.length} checks
          </span>
          {expanded ? (
            <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} />
          ) : (
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-4 space-y-2">
          {gateStatus.checks.map((check, index) => (
            <div
              key={index}
              className="p-3 rounded-lg border"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-sunken)' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-2 flex-1">
                  {getStatusIcon(check.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {check.cp_code}
                      </code>
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-bg)', color: 'var(--text-muted)' }}>
                        {check.stage}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background: getModeColor(check.mode) + '20',
                          color: getModeColor(check.mode),
                        }}>
                        {check.mode}
                      </span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {check.description}
                    </div>
                  </div>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                  style={{
                    background: getResultColor(check.status) + '20',
                    color: getResultColor(check.status),
                  }}>
                  {check.status}
                </span>
              </div>
              {check.guidance && (
                <div className="text-[10px] mt-2 p-2 rounded" style={{ background: 'var(--surface-bg)', color: 'var(--text-muted)' }}>
                  <Info size={10} className="inline mr-1" />
                  {check.guidance}
                </div>
              )}
            </div>
          ))}

          {/* Summary */}
          <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CheckCircle size={12} style={{ color: 'var(--success-600)' }} />
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {gateStatus.checks.filter(c => c.status === 'PASS').length} pass
                </span>
              </div>
              <div className="flex items-center gap-1">
                <AlertTriangle size={12} style={{ color: 'var(--warning-600)' }} />
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {gateStatus.checks.filter(c => c.status === 'WARN').length} warn
                </span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle size={12} style={{ color: 'var(--error-600)' }} />
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {gateStatus.checks.filter(c => c.status === 'BLOCK').length} block
                </span>
              </div>
              <div className="flex items-center gap-1">
                <AlertCircle size={12} style={{ color: 'var(--info-600)' }} />
                <span className="text-[10px] tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {gateStatus.checks.filter(c => c.status === 'EXCEPTION_REQUIRED').length} exception
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// EXCEPTION REQUEST DIALOG
// ═══════════════════════════════════════════════════════════

interface ExceptionRequestDialogProps {
  cpCode: string;
  entityType: string;
  entityId: string;
  projectId?: string;
  siteId?: string;
  onClose: () => void;
  onSubmit: (exceptionData: any) => void;
}

export function ExceptionRequestDialog({
  cpCode,
  entityType,
  entityId,
  projectId,
  siteId,
  onClose,
  onSubmit,
}: ExceptionRequestDialogProps) {
  const [deviationValue, setDeviationValue] = useState('');
  const [deviationUnit, setDeviationUnit] = useState('MT');
  const [reasonCode, setReasonCode] = useState('');
  const [narrative, setNarrative] = useState('');
  const [isEmergency, setIsEmergency] = useState(false);

  const handleSubmit = () => {
    onSubmit({
      type: 'MATERIAL_EXCESS',
      cp_code: cpCode,
      entity_type: entityType,
      entity_id: entityId,
      project_id: projectId,
      site_id: siteId,
      requested_by: 'user-001', // Current user
      deviation_value: parseFloat(deviationValue),
      deviation_unit: deviationUnit,
      reason_code: reasonCode,
      narrative,
      evidence_doc_ids: [],
      validity_type: 'one_time',
      cap_value: parseFloat(deviationValue),
      is_emergency: isEmergency,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <AlertCircle size={20} style={{ color: 'var(--info-600)' }} />
                Request Exception
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
                Control Point: {cpCode}
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
                Deviation Value *
              </label>
              <input
                type="number"
                value={deviationValue}
                onChange={(e) => setDeviationValue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                placeholder="Enter deviation amount"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Unit *
              </label>
              <select
                value={deviationUnit}
                onChange={(e) => setDeviationUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              >
                <option value="MT">MT (Metric Ton)</option>
                <option value="KG">KG (Kilogram)</option>
                <option value="INR">INR (Indian Rupee)</option>
                <option value="DAYS">Days</option>
                <option value="QTY">Quantity</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Reason Code *
            </label>
            <select
              value={reasonCode}
              onChange={(e) => setReasonCode(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            >
              <option value="">Select reason code...</option>
              <option value="EMERGENCY_SITE">Emergency site requirement</option>
              <option value="VARIATION_ORDER">Approved variation order</option>
              <option value="CLIENT_REQUEST">Client requested additional quantity</option>
              <option value="SYSTEM_ERROR">System error requiring reversal</option>
              <option value="REGULATORY_CHANGE">Regulatory compliance requirement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Narrative * (minimum 50 characters)
            </label>
            <textarea
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              className="w-full h-24 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              placeholder="Provide detailed justification for the exception request..."
            />
            <div className="text-[10px] mt-1" style={{ color: narrative.length >= 50 ? 'var(--success-600)' : 'var(--text-muted)' }}>
              {narrative.length} / 50 characters minimum
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="emergency"
              checked={isEmergency}
              onChange={(e) => setIsEmergency(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="emergency" className="text-xs" style={{ color: 'var(--text-primary)' }}>
              This is an emergency exception (requires post-facto regularisation)
            </label>
          </div>

          {isEmergency && (
            <div className="p-3 rounded-lg" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
              <div className="flex items-start gap-2">
                <AlertTriangle size={14} style={{ color: 'var(--warning-700)' }} />
                <div className="text-xs" style={{ color: 'var(--warning-800)' }}>
                  <strong>Emergency Exception:</strong> This will be executed immediately and must be regularised within 7 days. 
                  Failure to regularise will result in escalation to L3 management.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex items-center justify-end gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!deviationValue || !reasonCode || narrative.length < 50}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <AlertCircle size={14} />
            Submit Exception Request
          </button>
        </div>
      </div>
    </div>
  );
}
