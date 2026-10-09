import React, { useState } from 'react';
import {
  Key,
  Link2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  Eye,
  Copy,
} from 'lucide-react';
import {
  integrationApiClients,
  integrationWebhooks,
  type IntegrationApiClient,
  type IntegrationWebhook,
} from '../data/integrationData';

// ═══════════════════════════════════════════════════════════
// API CLIENTS & WEBHOOKS — Part 17
// Route: /admin/intg/api-clients
// ═══════════════════════════════════════════════════════════

export function ApiClientsWebhooks() {
  const [activeTab, setActiveTab] = useState<'clients' | 'webhooks'>('clients');
  const [selectedClient, setSelectedClient] = useState<IntegrationApiClient | null>(null);
  const [selectedWebhook, setSelectedWebhook] = useState<IntegrationWebhook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = integrationApiClients.filter(client =>
    searchQuery === '' ||
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.client_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredWebhooks = integrationWebhooks.filter(webhook =>
    searchQuery === '' ||
    webhook.event_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    webhook.target_url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
              API Clients & Webhooks
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage external API access and event webhooks
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            {activeTab === 'clients' ? 'New API Client' : 'New Webhook'}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveTab('clients'); setSelectedWebhook(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'clients' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'clients' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'clients' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            API Clients ({integrationApiClients.length})
          </button>
          <button
            onClick={() => { setActiveTab('webhooks'); setSelectedClient(null); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'webhooks' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'webhooks' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'webhooks' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Webhooks ({integrationWebhooks.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Search */}
          <div className="mb-4">
            <div className="relative max-w-md">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder={`Search ${activeTab === 'clients' ? 'API clients' : 'webhooks'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
              />
            </div>
          </div>

          {activeTab === 'clients' ? (
            /* API Clients */
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Client ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Scopes</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Rate Limit</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Used</th>
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
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {client.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {client.client_id}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {client.scopes.slice(0, 2).map(scope => (
                            <span key={scope} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                              {scope}
                            </span>
                          ))}
                          {client.scopes.length > 2 && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                              +{client.scopes.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                        {client.rate_limit}/min
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: client.is_active ? 'var(--success-50)' : 'var(--surface-sunken)',
                            color: client.is_active ? 'var(--success-700)' : 'var(--text-muted)',
                          }}>
                          {client.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {client.last_used ? new Date(client.last_used).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Edit">
                            <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                          <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
                            <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Webhooks */
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Event Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Target URL</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Triggered</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWebhooks.map(webhook => (
                    <tr
                      key={webhook.id}
                      onClick={() => setSelectedWebhook(webhook)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link2 size={14} style={{ color: 'var(--brand-600)' }} />
                          <span className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                            {webhook.event_name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-[10px] max-w-xs truncate block" style={{ color: 'var(--text-muted)' }}>
                          {webhook.target_url}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: webhook.is_active ? 'var(--success-50)' : 'var(--surface-sunken)',
                            color: webhook.is_active ? 'var(--success-700)' : 'var(--text-muted)',
                          }}>
                          {webhook.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {new Date(webhook.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {webhook.last_triggered ? new Date(webhook.last_triggered).toLocaleString() : 'Never'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Edit">
                            <Edit2 size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                          <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Delete">
                            <Trash2 size={12} style={{ color: 'var(--text-muted)' }} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {(selectedClient || selectedWebhook) && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            {selectedClient ? (
              <ApiClientDetail client={selectedClient} onClose={() => setSelectedClient(null)} />
            ) : selectedWebhook ? (
              <WebhookDetail webhook={selectedWebhook} onClose={() => setSelectedWebhook(null)} />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// API CLIENT DETAIL
// ═══════════════════════════════════════════════════════════

function ApiClientDetail({ client, onClose }: { client: IntegrationApiClient; onClose: () => void }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Key size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              API Client Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {client.client_id}
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
              background: client.is_active ? 'var(--success-50)' : 'var(--surface-sunken)',
              color: client.is_active ? 'var(--success-700)' : 'var(--text-muted)',
            }}>
            {client.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Name" value={client.name} />
        <DetailRow label="Rate Limit" value={`${client.rate_limit} requests/minute`} />
        <DetailRow label="Created" value={new Date(client.created_at).toLocaleDateString()} />
        {client.last_used && <DetailRow label="Last Used" value={new Date(client.last_used).toLocaleString()} />}
        {client.expires_at && <DetailRow label="Expires" value={new Date(client.expires_at).toLocaleDateString()} />}
      </div>

      {/* Scopes */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Scopes
        </div>
        <div className="flex flex-wrap gap-1">
          {client.scopes.map(scope => (
            <span key={scope} className="text-xs px-2 py-1 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
              {scope}
            </span>
          ))}
        </div>
      </div>

      {/* IP Allowlist */}
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

      {/* API Key */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          API Key Hash
        </div>
        <div className="p-3 rounded-lg text-xs font-mono" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
          {client.key_hash}
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
          style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}>
          <Trash2 size={12} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// WEBHOOK DETAIL
// ═══════════════════════════════════════════════════════════

function WebhookDetail({ webhook, onClose }: { webhook: IntegrationWebhook; onClose: () => void }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link2 size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Webhook Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {webhook.id}
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
              background: webhook.is_active ? 'var(--success-50)' : 'var(--surface-sunken)',
              color: webhook.is_active ? 'var(--success-700)' : 'var(--text-muted)',
            }}>
            {webhook.is_active ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Event Name" value={webhook.event_name} />
        <div>
          <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
            Target URL
          </div>
          <div className="text-xs p-2 rounded break-all" style={{ background: 'var(--surface-sunken)', color: 'var(--text-primary)' }}>
            {webhook.target_url}
          </div>
        </div>
        <DetailRow label="Created" value={new Date(webhook.created_at).toLocaleDateString()} />
        {webhook.last_triggered && (
          <DetailRow label="Last Triggered" value={new Date(webhook.last_triggered).toLocaleString()} />
        )}
      </div>

      {/* Secret */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Secret Reference
        </div>
        <div className="p-3 rounded-lg text-xs font-mono" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
          {webhook.secret_ref}
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
          style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}>
          <Trash2 size={12} />
          Delete
        </button>
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
