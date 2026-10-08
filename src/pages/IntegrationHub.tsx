import React, { useState } from 'react';
import {
  Link2,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Activity,
  RefreshCw,
  Eye,
  Settings,
} from 'lucide-react';
import {
  integrationConnectors,
  getConnectorStatusColor,
  getConnectorHealthColor,
  getConnectorTypeIcon,
  type IntegrationConnector,
} from '../data/integrationData';
import { testConnector, getConnectorHealth, getIntegrationStats } from '../core/IntegrationService';

// ═══════════════════════════════════════════════════════════
// INTEGRATION HUB — Part 17
// Route: /admin/intg
// ═══════════════════════════════════════════════════════════

export function IntegrationHub() {
  const [selectedConnector, setSelectedConnector] = useState<IntegrationConnector | null>(null);
  const [testingConnector, setTestingConnector] = useState<string | null>(null);

  const stats = getIntegrationStats();
  const healthData = getConnectorHealth();

  const handleTestConnector = async (connectorCode: string) => {
    setTestingConnector(connectorCode);
    try {
      const result = testConnector(connectorCode);
      alert(`Test ${result.success ? 'PASSED' : 'FAILED'}\n\n${result.message}\nLatency: ${result.latency_ms}ms`);
    } catch (error) {
      alert(`Test failed: ${(error as Error).message}`);
    } finally {
      setTestingConnector(null);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Link2 size={24} style={{ color: 'var(--brand-600)' }} />
              Integration Hub
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage external service integrations and connectors
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}>
            <Plus size={14} />
            New Connector
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Connectors
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {stats.total_connectors}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--success-700)' }}>
              Healthy
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
              {stats.healthy_connectors}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Messages (24h)
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {stats.total_messages_24h}
            </div>
          </div>
          <div className="p-3 rounded-lg" style={{ background: stats.unresolved_dead_letters > 0 ? 'var(--error-50)' : 'var(--surface-sunken)' }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: stats.unresolved_dead_letters > 0 ? 'var(--error-700)' : 'var(--text-muted)' }}>
              Dead Letters
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: stats.unresolved_dead_letters > 0 ? 'var(--error-700)' : 'var(--text-primary)' }}>
              {stats.unresolved_dead_letters}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Connectors List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrationConnectors.map(connector => {
              const health = healthData.find(h => h.connector_code === connector.code);
              
              return (
                <div
                  key={connector.id}
                  onClick={() => setSelectedConnector(connector)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedConnector?.id === connector.id ? 'ring-2 ring-[var(--brand-500)]' : 'hover:shadow-md'
                  }`}
                  style={{
                    background: 'var(--card-bg)',
                    borderColor: selectedConnector?.id === connector.id ? 'var(--brand-500)' : 'var(--card-border)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="text-2xl">{getConnectorTypeIcon(connector.type)}</div>
                      <div>
                        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {connector.code}
                        </h3>
                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          {connector.provider}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: getConnectorHealthColor(connector.health) + '20',
                          color: getConnectorHealthColor(connector.health),
                        }}>
                        {connector.health}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{
                          background: getConnectorStatusColor(connector.status) + '20',
                          color: getConnectorStatusColor(connector.status),
                        }}>
                        {connector.status}
                      </span>
                    </div>
                  </div>

                  {health && (
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-center p-2 rounded" style={{ background: 'var(--surface-sunken)' }}>
                        <div className="text-xs font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                          {health.message_count_24h}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          Messages (24h)
                        </div>
                      </div>
                      <div className="text-center p-2 rounded" style={{ background: 'var(--surface-sunken)' }}>
                        <div className="text-xs font-bold tabular-nums" style={{ color: health.failure_rate_24h > 5 ? 'var(--error-600)' : 'var(--text-primary)' }}>
                          {health.failure_rate_24h.toFixed(1)}%
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          Failure Rate
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      Last checked: {new Date(connector.last_checked).toLocaleTimeString()}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTestConnector(connector.code);
                      }}
                      disabled={testingConnector === connector.code}
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors hover:opacity-90 disabled:opacity-50"
                      style={{ background: 'var(--brand-600)', color: '#fff' }}
                    >
                      {testingConnector === connector.code ? (
                        <RefreshCw size={10} className="animate-spin" />
                      ) : (
                        <Activity size={10} />
                      )}
                      Test
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detail Panel */}
        {selectedConnector && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            <ConnectorDetail
              connector={selectedConnector}
              onClose={() => setSelectedConnector(null)}
              onTest={() => handleTestConnector(selectedConnector.code)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONNECTOR DETAIL
// ═══════════════════════════════════════════════════════════

function ConnectorDetail({
  connector,
  onClose,
  onTest,
}: {
  connector: IntegrationConnector;
  onClose: () => void;
  onTest: () => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="text-3xl">{getConnectorTypeIcon(connector.type)}</div>
            <div>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {connector.code}
              </h2>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                {connector.provider}
              </div>
            </div>
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
              background: getConnectorStatusColor(connector.status) + '20',
              color: getConnectorStatusColor(connector.status),
            }}>
            {connector.status}
          </span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Health</span>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              background: getConnectorHealthColor(connector.health) + '20',
              color: getConnectorHealthColor(connector.health),
            }}>
            {connector.health}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Checked</span>
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {new Date(connector.last_checked).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Configuration */}
      <div className="space-y-4 mb-6">
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Configuration
          </div>
          <div className="p-3 rounded-lg text-xs font-mono overflow-x-auto" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
            <pre>{JSON.stringify(connector.config_json, null, 2)}</pre>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Secret Reference
          </div>
          <div className="p-3 rounded-lg text-xs font-mono" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
            {connector.secret_ref}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        <button
          onClick={onTest}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}
        >
          <Activity size={12} />
          Test Connection
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
