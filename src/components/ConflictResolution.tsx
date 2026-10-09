import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  GitCompare,
  ArrowRight,
  Save,
  X,
} from 'lucide-react';
import {
  OfflineConflict,
  type ConflictResolution as ConflictResolutionType,
  getConflictStatusColor,
} from '../data/offlineData';
import { resolveConflict, approveSupervisorConflict } from '../core/OfflineService';

// ═══════════════════════════════════════════════════════════
// CONFLICT RESOLUTION COMPONENT — Part 22
// ═══════════════════════════════════════════════════════════

interface ConflictResolutionProps {
  conflict: OfflineConflict;
  currentUserId: string;
  onResolved?: () => void;
  className?: string;
}

export function ConflictResolution({
  conflict,
  currentUserId,
  onResolved,
  className = '',
}: ConflictResolutionProps) {
  const [fieldResolutions, setFieldResolutions] = useState<
    Record<string, { resolution: ConflictResolutionType; merged_value?: any }>
  >({});
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [isResolving, setIsResolving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFieldResolution = (
    fieldName: string,
    resolution: ConflictResolutionType,
    mergedValue?: any
  ) => {
    setFieldResolutions(prev => ({
      ...prev,
      [fieldName]: { resolution, merged_value: mergedValue },
    }));
  };

  const handleResolve = async (resolution: ConflictResolutionType) => {
    setIsResolving(true);
    setError(null);

    try {
      resolveConflict(
        conflict.id,
        resolution,
        currentUserId,
        resolutionNotes,
        Object.keys(fieldResolutions).length > 0 ? fieldResolutions : undefined
      );

      if (onResolved) {
        onResolved();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsResolving(false);
    }
  };

  const handleApprove = async () => {
    setIsResolving(true);
    setError(null);

    try {
      approveSupervisorConflict(conflict.id, currentUserId);

      if (onResolved) {
        onResolved();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsResolving(false);
    }
  };

  if (conflict.status !== 'OPEN') {
    return (
      <div
        className={`p-4 rounded-lg border ${className}`}
        style={{
          background: 'var(--success-50)',
          borderColor: 'var(--success-200)',
        }}
      >
        <div className="flex items-center gap-2">
          <CheckCircle size={20} style={{ color: 'var(--success-600)' }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--success-700)' }}>
              Conflict Resolved
            </div>
            <div className="text-xs" style={{ color: 'var(--success-600)' }}>
              Resolution: {conflict.resolution} • {new Date(conflict.resolved_at!).toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg border-2 overflow-hidden ${className}`}
      style={{
        borderColor: 'var(--error-200)',
        background: 'var(--card-bg)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 border-b flex items-center justify-between"
        style={{
          borderColor: 'var(--border-subtle)',
          background: 'var(--error-50)',
        }}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} style={{ color: 'var(--error-600)' }} />
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--error-700)' }}>
              {conflict.record_label}
            </div>
            <div className="text-xs" style={{ color: 'var(--error-600)' }}>
              {conflict.record_type} • v{conflict.server_version} (server) vs v{conflict.client_current_version} (you)
            </div>
          </div>
        </div>
        {conflict.requires_supervisor && !conflict.supervisor_approved && (
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{
              background: 'var(--warning-50)',
              color: 'var(--warning-700)',
              border: '1px solid var(--warning-200)',
            }}
          >
            Requires Supervisor
          </span>
        )}
      </div>

      {/* Field Comparisons */}
      <div className="p-4 space-y-4">
        {conflict.fields_json.map((field, index) => (
          <div
            key={index}
            className="p-3 rounded-lg border"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {field.field_name}
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Server Value */}
              <div>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Server Value
                </div>
                <div
                  className="p-2 rounded text-xs"
                  style={{
                    background: 'var(--surface-sunken)',
                    color: 'var(--text-primary)',
                  }}
                >
                  {JSON.stringify(field.server_value)}
                </div>
              </div>

              {/* Client Value */}
              <div>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                  Your Value
                </div>
                <div
                  className="p-2 rounded text-xs"
                  style={{
                    background: 'var(--info-50)',
                    color: 'var(--info-700)',
                  }}
                >
                  {JSON.stringify(field.client_value)}
                </div>
              </div>
            </div>

            {/* Resolution Options */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFieldResolution(field.field_name, 'KEEP_SERVER')}
                className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  fieldResolutions[field.field_name]?.resolution === 'KEEP_SERVER'
                    ? 'text-white'
                    : 'border hover:bg-[var(--card-hover)]'
                }`}
                style={{
                  background:
                    fieldResolutions[field.field_name]?.resolution === 'KEEP_SERVER'
                      ? 'var(--success-600)'
                      : 'transparent',
                  borderColor:
                    fieldResolutions[field.field_name]?.resolution === 'KEEP_SERVER'
                      ? 'var(--success-600)'
                      : 'var(--border-subtle)',
                  color:
                    fieldResolutions[field.field_name]?.resolution === 'KEEP_SERVER'
                      ? '#fff'
                      : 'var(--text-secondary)',
                }}
              >
                Keep Server
              </button>
              <button
                onClick={() => handleFieldResolution(field.field_name, 'KEEP_MINE')}
                className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  fieldResolutions[field.field_name]?.resolution === 'KEEP_MINE'
                    ? 'text-white'
                    : 'border hover:bg-[var(--card-hover)]'
                }`}
                style={{
                  background:
                    fieldResolutions[field.field_name]?.resolution === 'KEEP_MINE'
                      ? 'var(--info-600)'
                      : 'transparent',
                  borderColor:
                    fieldResolutions[field.field_name]?.resolution === 'KEEP_MINE'
                      ? 'var(--info-600)'
                      : 'var(--border-subtle)',
                  color:
                    fieldResolutions[field.field_name]?.resolution === 'KEEP_MINE'
                      ? '#fff'
                      : 'var(--text-secondary)',
                }}
              >
                Keep Mine
              </button>
              <button
                onClick={() => {
                  const mergedValue = prompt('Enter merged value:', JSON.stringify(field.client_value));
                  if (mergedValue) {
                    try {
                      handleFieldResolution(field.field_name, 'MERGE', JSON.parse(mergedValue));
                    } catch {
                      handleFieldResolution(field.field_name, 'MERGE', mergedValue);
                    }
                  }
                }}
                className={`flex-1 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  fieldResolutions[field.field_name]?.resolution === 'MERGE'
                    ? 'text-white'
                    : 'border hover:bg-[var(--card-hover)]'
                }`}
                style={{
                  background:
                    fieldResolutions[field.field_name]?.resolution === 'MERGE'
                      ? 'var(--warning-600)'
                      : 'transparent',
                  borderColor:
                    fieldResolutions[field.field_name]?.resolution === 'MERGE'
                      ? 'var(--warning-600)'
                      : 'var(--border-subtle)',
                  color:
                    fieldResolutions[field.field_name]?.resolution === 'MERGE'
                      ? '#fff'
                      : 'var(--text-secondary)',
                }}
              >
                Merge
              </button>
            </div>

            {/* Merged Value Display */}
            {fieldResolutions[field.field_name]?.resolution === 'MERGE' && (
              <div className="mt-2 p-2 rounded" style={{ background: 'var(--warning-50)' }}>
                <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--warning-700)' }}>
                  Merged Value
                </div>
                <div className="text-xs" style={{ color: 'var(--warning-800)' }}>
                  {JSON.stringify(fieldResolutions[field.field_name].merged_value)}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Resolution Notes */}
        <div>
          <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            Resolution Notes (optional)
          </label>
          <textarea
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
            style={{
              borderColor: 'var(--border-subtle)',
              background: 'var(--surface-bg)',
              color: 'var(--text-primary)',
              minHeight: '80px',
            }}
            placeholder="Explain your resolution decision..."
          />
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="p-3 rounded-lg"
            style={{
              background: 'var(--error-50)',
              border: '1px solid var(--error-200)',
            }}
          >
            <div className="flex items-start gap-2">
              <XCircle size={16} style={{ color: 'var(--error-700)' }} />
              <div className="text-xs" style={{ color: 'var(--error-700)' }}>
                {error}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          {conflict.requires_supervisor && !conflict.supervisor_approved ? (
            <button
              onClick={handleApprove}
              disabled={isResolving}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: 'var(--warning-600)',
                color: '#fff',
              }}
            >
              <CheckCircle size={16} />
              Approve as Supervisor
            </button>
          ) : (
            <>
              <button
                onClick={() => handleResolve('KEEP_SERVER')}
                disabled={isResolving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--success-600)',
                  color: 'var(--success-600)',
                }}
              >
                <CheckCircle size={16} />
                Keep Server
              </button>
              <button
                onClick={() => handleResolve('KEEP_MINE')}
                disabled={isResolving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--card-hover)] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderColor: 'var(--info-600)',
                  color: 'var(--info-600)',
                }}
              >
                <CheckCircle size={16} />
                Keep Mine
              </button>
              <button
                onClick={() => handleResolve('MERGE')}
                disabled={isResolving || Object.keys(fieldResolutions).length === 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: 'var(--warning-600)',
                  color: '#fff',
                }}
              >
                <Save size={16} />
                Apply Merge
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
