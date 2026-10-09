import React, { useState } from 'react';
import {
  Key,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Eye,
  RefreshCw,
} from 'lucide-react';
import {
  apiClients,
  getClientStatusColor,
  getClientsByStatus,
  type ApiClient,
} from '../data/apiPlatformData';
import { registerApiClient, approveApiClient, suspendApiClient } from '../core/ApiPlatformService';

// ═══════════════════════════════════════════════════════════
// API CLIENT MANAGEMENT — Part 18
// Route: /_tech/devapi/clients
// ═══════════════════════════════════════════════════════════

export function ApiClientManagement() {
  const [selectedClient, setSelectedClient] = useState<ApiClient | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);

  const filteredClients = filterStatus === 'ALL'
    ? apiClients
    : getClientsByStatus(filterStatus);

  const handleApprove = (clientId: string) => {
    try {
      approveApiClient(clientId, 'user-001'); // Current user
      alert('Client approved successfully');
    } catch (error) {
      alert(`Failed to approve client: ${(error as Error).message}`);
    }
  };

  const handleSuspend = (clientId: string) => {
    try {
      suspendApiClient(clientId, 'user-001', 'Suspended by administrator');
      alert('Client suspended successfully');
    } catch (error) {
      alert(`Failed to suspend client: ${(error as Error).message}`);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Key size={24} style={{ color: 'var(--brand-600)' }} />
              API Client Management
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Register, approve, and manage API clients (CP-API-01)
            </p>
          </div>
          <button
            onClick={() => setShowRegisterDialog(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <Plus size={14} />
            Register Client
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
            style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
          >
            <option value="ALL">All Status</option>
            <option value="REQUESTED">Requested</option>
            <option value="SECURITY_REVIEW">Security Review</option>
            <option value="APPROVED">Approved</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="REVOKED">Revoked</option>
          </select>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Client List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'var(--surface-sunken)' }}>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Owner</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scopes</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rate Limit</th>
                  <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
                  <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map(client => (
                  <tr
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                    style={{ borderColor: 'var(--border-subtle)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Key size={14} style={{ color: 'var(--brand-600)' }} />
                        <div>
                          <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {client.name}
                          </div>
                          <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {client.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                        {client.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {client.owner_name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {client.scopes_json.slice(0, 2).map(scope => (
                          <span key={scope} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                            {scope}
                          </span>
                        ))}
                        {client.scopes_json.length > 2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                            +{client.scopes_json.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: getClientStatusColor(client.status) + '20',
                          color: getClientStatusColor(client.status),
                        }}>
                        {client.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                      {client.rate_limit_per_minute}/min
                    </td>
                    <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        {(client.status === 'REQUESTED' || client.status === 'SECURITY_REVIEW') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(client.id);
                            }}
                            className="p-1 rounded hover:bg-[var(--success-50)]"
                            title="Approve"
                          >
                            <CheckCircle size={12} style={{ color: 'var(--success-600)' }} />
                          </button>
                        )}
                        {client.status === 'ACTIVE' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSuspend(client.id);
                            }}
                            className="p-1 rounded hover:bg-[var(--error-50)]"
                            title="Suspend"
                          >
                            <XCircle size={12} style={{ color: 'var(--error-600)' }} />
                          </button>
                        )}
                        <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="View">
                          <Eye size={12} style={{ color: 'var(--text-muted)' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedClient && (
          <div className="w-96 border-l overflow-y-auto" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <ClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} />
          </div>
        )}
      </div>

      {/* Register Dialog */}
      {showRegisterDialog && (
        <RegisterClientDialog onClose={() => setShowRegisterDialog(false)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CLIENT DETAIL
// ═══════════════════════════════════════════════════════════

function ClientDetail({ client, onClose }: { client: ApiClient; onClose: () => void }) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Key size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              {client.name}
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {client.id}
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
              background: getClientStatusColor(client.status) + '20',
              color: getClientStatusColor(client.status),
            }}>
            {client.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Type" value={client.type.replace('_', ' ')} />
        <DetailRow label="Owner" value={client.owner_name} />
        <DetailRow label="Rate Limit" value={`${client.rate_limit_per_minute} requests/minute`} />
        <DetailRow label="Daily Quota" value={client.daily_quota.toLocaleString()} />
        <DetailRow label="Created" value={new Date(client.created_at).toLocaleDateString()} />
        <DetailRow label="Updated" value={new Date(client.updated_at).toLocaleDateString()} />
        {client.expires_at && (
          <DetailRow label="Expires" value={new Date(client.expires_at).toLocaleDateString()} />
        )}
      </div>

      {/* Scopes */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Scopes
        </div>
        <div className="flex flex-wrap gap-1">
          {client.scopes_json.map(scope => (
            <span key={scope} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
              {scope}
            </span>
          ))}
        </div>
      </div>

      {/* Company Scope */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Company Scope
        </div>
        <div className="flex flex-wrap gap-1">
          {client.company_scope_json.map(company => (
            <span key={company} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* IP Allowlist */}
      {client.ip_allowlist.length > 0 && (
        <div className="mb-6">
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            IP Allowlist
          </div>
          <div className="space-y-1">
            {client.ip_allowlist.map(ip => (
              <div key={ip} className="text-xs p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                <code>{ip}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}>
          <RefreshCw size={12} />
          Rotate Credentials
        </button>
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
// REGISTER CLIENT DIALOG
// ═══════════════════════════════════════════════════════════

function RegisterClientDialog({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'confidential' | 'public' | 'api_key'>('confidential');
  const [scopes, setScopes] = useState<string[]>([]);
  const [rateLimit, setRateLimit] = useState(100);
  const [dailyQuota, setDailyQuota] = useState(10000);

  const availableScopes = [
    'project.read', 'project.write',
    'procurement.read', 'procurement.write',
    'finance.read', 'finance.write',
    'inventory.read', 'inventory.write',
    'hr.read', 'hr.write',
    'reports.read',
  ];

  const handleScopeToggle = (scope: string) => {
    setScopes(prev =>
      prev.includes(scope)
        ? prev.filter(s => s !== scope)
        : [...prev, scope]
    );
  };

  const handleSubmit = () => {
    try {
      registerApiClient({
        name,
        owner_id: 'user-001',
        type,
        scopes,
        company_scope: ['company-001'],
        rate_limit_per_minute: rateLimit,
        daily_quota: dailyQuota,
        requested_by: 'user-001',
      });
      alert('Client registered successfully. Awaiting security review (CP-API-01).');
      onClose();
    } catch (error) {
      alert(`Failed to register client: ${(error as Error).message}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'var(--overlay-bg)' }}>
      <div className="w-full max-w-2xl rounded-xl overflow-hidden" style={{ background: 'var(--surface-bg)' }}>
        {/* Header */}
        <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
            Register API Client
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Client will require security review and approval (CP-API-01)
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Client Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              placeholder="e.g., Partner Accounting System"
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Client Type *
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            >
              <option value="confidential">Confidential (Server-to-Server)</option>
              <option value="public">Public (Mobile/Web App)</option>
              <option value="api_key">API Key (Read-only)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
              Scopes *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {availableScopes.map(scope => (
                <label key={scope} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-[var(--nav-hover)]"
                  style={{ background: scopes.includes(scope) ? 'var(--brand-50)' : 'transparent' }}>
                  <input
                    type="checkbox"
                    checked={scopes.includes(scope)}
                    onChange={() => handleScopeToggle(scope)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-xs" style={{ color: 'var(--text-primary)' }}>{scope}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Rate Limit (per minute)
              </label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                Daily Quota
              </label>
              <input
                type="number"
                value={dailyQuota}
                onChange={(e) => setDailyQuota(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              />
            </div>
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
            disabled={!name || scopes.length === 0}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            Register Client
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
