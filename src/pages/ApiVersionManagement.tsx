import React, { useState } from 'react';
import {
  Tag,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Filter,
  Search,
  Eye,
  Edit2,
  Plus,
} from 'lucide-react';
import {
  apiVersions,
  getVersionStatusColor,
  getVersionsByApi,
  type ApiVersion,
} from '../data/apiPlatformData';
import { deprecateApiVersion } from '../core/ApiPlatformService';

// ═══════════════════════════════════════════════════════════
// API VERSION MANAGEMENT — Part 18
// Route: /_tech/devapi/versions
// ═══════════════════════════════════════════════════════════

export function ApiVersionManagement() {
  const [selectedVersion, setSelectedVersion] = useState<ApiVersion | null>(null);
  const [filterApi, setFilterApi] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showDeprecateDialog, setShowDeprecateDialog] = useState(false);

  const apis = Array.from(new Set(apiVersions.map(v => v.api)));

  const filteredVersions = apiVersions.filter(version => {
    const matchesApi = filterApi === 'ALL' || version.api === filterApi;
    const matchesStatus = filterStatus === 'ALL' || version.status === filterStatus;
    return matchesApi && matchesStatus;
  });

  const handleDeprecate = (versionId: string, sunsetDate: string, message: string) => {
    try {
      deprecateApiVersion({
        version_id: versionId,
        sunset_date: sunsetDate,
        deprecated_message: message,
        deprecated_by: 'user-001', // Current user
      });
      alert('Version deprecated successfully (CP-API-02)');
      setShowDeprecateDialog(false);
    } catch (error) {
      alert(`Failed to deprecate version: ${(error as Error).message}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'BETA':
        return <Clock size={14} style={{ color: 'var(--info-600)' }} />;
      case 'GA':
        return <CheckCircle size={14} style={{ color: 'var(--success-600)' }} />;
      case 'DEPRECATED':
        return <AlertTriangle size={14} style={{ color: 'var(--warning-600)' }} />;
      case 'RETIRED':
        return <XCircle size={14} style={{ color: 'var(--text-muted)' }} />;
      default:
        return <Clock size={14} />;
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Tag size={24} style={{ color: 'var(--brand-600)' }} />
              API Version Management
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage API versions and deprecation (CP-API-02)
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Version
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterApi}
            onChange={(e) => setFilterApi(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All APIs</option>
            {apis.map(api => (
              <option key={api} value={api}>{api}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Status</option>
            <option value="BETA">Beta</option>
            <option value="GA">GA</option>
            <option value="DEPRECATED">Deprecated</option>
            <option value="RETIRED">Retired</option>
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Version List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 gap-4">
            {filteredVersions.map(version => (
              <VersionCard
                key={version.id}
                version={version}
                isSelected={selectedVersion?.id === version.id}
                onClick={() => setSelectedVersion(version)}
                getStatusIcon={getStatusIcon}
              />
            ))}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedVersion && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <VersionDetail
              version={selectedVersion}
              onClose={() => setSelectedVersion(null)}
              onDeprecate={() => setShowDeprecateDialog(true)}
              getStatusIcon={getStatusIcon}
            />
          </div>
        )}
      </div>

      {/* Deprecate Dialog */}
      {showDeprecateDialog && selectedVersion && (
        <DeprecateVersionDialog
          version={selectedVersion}
          onClose={() => setShowDeprecateDialog(false)}
          onDeprecate={handleDeprecate}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VERSION CARD
// ═══════════════════════════════════════════════════════════

function VersionCard({
  version,
  isSelected,
  onClick,
  getStatusIcon,
}: {
  version: ApiVersion;
  isSelected: boolean;
  onClick: () => void;
  getStatusIcon: (status: string) => React.ReactNode;
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
        <div className="flex items-center gap-2">
          <Tag size={16} style={{ color: 'var(--brand-600)' }} />
          <div>
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {version.api} {version.version}
            </h3>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Released: {new Date(version.released_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {getStatusIcon(version.status)}
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: getVersionStatusColor(version.status) + '20',
              color: getVersionStatusColor(version.status),
            }}>
            {version.status}
          </span>
        </div>
      </div>

      <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>
        {version.changelog}
      </div>

      {version.status === 'DEPRECATED' && version.sunset_at && (
        <div className="p-2 rounded-lg" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
          <div className="flex items-start gap-2">
            <AlertTriangle size={12} style={{ color: 'var(--warning-700)' }} />
            <div className="flex-1">
              <div className="text-[10px] font-semibold mb-0.5" style={{ color: 'var(--warning-800)' }}>
                Deprecated - Sunset: {new Date(version.sunset_at).toLocaleDateString()}
              </div>
              {version.deprecated_message && (
                <div className="text-[10px]" style={{ color: 'var(--warning-700)' }}>
                  {version.deprecated_message}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
        <div className="flex items-center gap-2">
          {version.breaking_changes && (
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
              Breaking Changes
            </span>
          )}
        </div>
        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
          {version.status === 'GA' && 'Stable'}
          {version.status === 'BETA' && 'Preview'}
          {version.status === 'DEPRECATED' && 'Migration Required'}
          {version.status === 'RETIRED' && 'No Longer Available'}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// VERSION DETAIL
// ═══════════════════════════════════════════════════════════

function VersionDetail({
  version,
  onClose,
  onDeprecate,
  getStatusIcon,
}: {
  version: ApiVersion;
  onClose: () => void;
  onDeprecate: () => void;
  getStatusIcon: (status: string) => React.ReactNode;
}) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Tag size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {version.api} {version.version}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {version.id}
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
          <div className="flex items-center gap-1">
            {getStatusIcon(version.status)}
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: getVersionStatusColor(version.status) + '20',
                color: getVersionStatusColor(version.status),
              }}>
              {version.status}
            </span>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="API" value={version.api} />
        <DetailRow label="Version" value={version.version} />
        <DetailRow label="Released" value={new Date(version.released_at).toLocaleDateString()} />
        {version.sunset_at && (
          <DetailRow label="Sunset Date" value={new Date(version.sunset_at).toLocaleDateString()} />
        )}
        <DetailRow label="Breaking Changes" value={version.breaking_changes ? 'Yes' : 'No'} />
      </div>

      {/* Changelog */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Changelog
        </div>
        <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          {version.changelog}
        </div>
      </div>

      {/* Deprecation Message */}
      {version.status === 'DEPRECATED' && version.deprecated_message && (
        <div className="mb-6">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Deprecation Message
          </div>
          <div className="text-xs p-3 rounded-lg" style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}>
            {version.deprecated_message}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        {version.status === 'GA' && (
          <button
            onClick={onDeprecate}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--warning-600)', color: '#fff' }}
          >
            <AlertTriangle size={12} />
            Deprecate
          </button>
        )}
        <button className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
          <Edit2 size={12} />
          Edit
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEPRECATE VERSION DIALOG
// ═══════════════════════════════════════════════════════════

function DeprecateVersionDialog({
  version,
  onClose,
  onDeprecate,
}: {
  version: ApiVersion;
  onClose: () => void;
  onDeprecate: (versionId: string, sunsetDate: string, message: string) => void;
}) {
  const [sunsetDate, setSunsetDate] = useState('');
  const [message, setMessage] = useState('');

  // Default sunset date: 6 months from now
  const defaultSunset = new Date();
  defaultSunset.setMonth(defaultSunset.getMonth() + 6);
  const defaultSunsetStr = defaultSunset.toISOString().split('T')[0];

  const handleSubmit = () => {
    if (!sunsetDate || !message) {
      alert('Please fill in all required fields');
      return;
    }
    onDeprecate(version.id, sunsetDate, message);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--warning-600)' }} />
            Deprecate API Version
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            {version.api} {version.version}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="p-3 rounded-lg" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} style={{ color: 'var(--warning-700)' }} />
              <div className="text-xs" style={{ color: 'var(--warning-700)' }}>
                <strong>CP-API-02:</strong> Deprecation requires minimum 6 months overlap. All affected clients will be notified.
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Sunset Date * (minimum 6 months from now)
            </label>
            <input
              type="date"
              value={sunsetDate}
              onChange={(e) => setSunsetDate(e.target.value)}
              min={defaultSunsetStr}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Deprecation Message *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full h-24 px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)] resize-none"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              placeholder="Explain why this version is being deprecated and what clients should migrate to..."
            />
          </div>
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
            disabled={!sunsetDate || !message}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--warning-600)', color: '#fff' }}
          >
            Deprecate Version
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
