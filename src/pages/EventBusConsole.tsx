import React, { useState } from 'react';
import { 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Database, 
  FileText, 
  GitBranch, 
  Layers, 
  Play, 
  RefreshCw, 
  Send, 
  Shield, 
  Webhook,
  Zap
} from 'lucide-react';
import {
  eventCatalogue,
  schemaVersions,
  subscriptions,
  deadLetters,
  deliveries,
  outboxEvents,
  getSubscriptionStatusColor,
  getDeliveryStatusColor,
  getSchemaStatusColor,
  getDLQStatusColor,
  getEventsByModule,
  getSubscriptionsByType,
  getDeadLettersByConsumer,
} from '../data/eventBusData';
import { getIntegrationMetrics } from '../core/EventBusService';

// ═══════════════════════════════════════════════════════════
// EVENT BUS CONSOLE — Part 11
// Route: /_tech/evbus
// ═══════════════════════════════════════════════════════════

export function EventBusConsole() {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalogue' | 'schemas' | 'subscriptions' | 'deadletters' | 'deliveries'>('overview');

  const metrics = getIntegrationMetrics();

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Zap size={24} style={{ color: 'var(--brand-600)' }} />
              Event Bus & Integration Platform
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Real-time event streaming, schema registry, and integration monitoring
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'catalogue', label: 'Event Catalogue', icon: Database },
            { id: 'schemas', label: 'Schemas', icon: FileText },
            { id: 'subscriptions', label: 'Subscriptions', icon: Send },
            { id: 'deadletters', label: 'Dead Letters', icon: AlertCircle },
            { id: 'deliveries', label: 'Deliveries', icon: Clock },
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
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && <OverviewTab metrics={metrics} />}
        {activeTab === 'catalogue' && <CatalogueTab />}
        {activeTab === 'schemas' && <SchemasTab />}
        {activeTab === 'subscriptions' && <SubscriptionsTab />}
        {activeTab === 'deadletters' && <DeadLettersTab />}
        {activeTab === 'deliveries' && <DeliveriesTab />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

function OverviewTab({ metrics }: { metrics: ReturnType<typeof getIntegrationMetrics> }) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Active Subscriptions"
          value={metrics.subscriptions.active}
          icon={Send}
          color="var(--success-600)"
          description={`of ${metrics.subscriptions.total} total`}
        />
        <SummaryCard
          title="Suspended"
          value={metrics.subscriptions.suspended}
          icon={AlertCircle}
          color={metrics.subscriptions.suspended > 0 ? 'var(--warning-600)' : 'var(--text-muted)'}
          description="Require attention"
        />
        <SummaryCard
          title="Dead Letters"
          value={metrics.deadLetterQueue.pending}
          icon={Database}
          color={metrics.deadLetterQueue.pending > 0 ? 'var(--error-600)' : 'var(--text-muted)'}
          description="Pending replay"
        />
        <SummaryCard
          title="Avg Latency"
          value={`${metrics.deliveries.avgLatencyMs}ms`}
          icon={Clock}
          color="var(--info-600)"
          description="Event delivery"
        />
      </div>

      {/* Recent Outbox Events */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Layers size={16} style={{ color: 'var(--brand-600)' }} />
            Recent Outbox Events
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {outboxEvents.slice(-5).reverse().map(event => (
            <div key={event.id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {event.event.event_type}
                  </code>
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                    v{event.event.schema_version}
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {event.event.correlation_id}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ 
                    background: event.status === 'published' ? 'var(--success-50)' : 
                               event.status === 'pending' ? 'var(--warning-50)' : 'var(--error-50)',
                    color: event.status === 'published' ? 'var(--success-700)' : 
                           event.status === 'pending' ? 'var(--warning-700)' : 'var(--error-700)'
                  }}>
                  {event.status}
                </span>
                <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                  {new Date(event.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Distribution by Module */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Events by Module
          </h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">
          {['project', 'procurement', 'stores', 'finance', 'hr'].map(module => {
            const count = getEventsByModule(module).length;
            return (
              <div key={module} className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                <div className="text-xs font-medium capitalize mb-1" style={{ color: 'var(--text-muted)' }}>
                  {module}
                </div>
                <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                  {count}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CATALOGUE TAB
// ═══════════════════════════════════════════════════════════

function CatalogueTab() {
  const [filterModule, setFilterModule] = useState<string>('ALL');

  const filteredEvents = filterModule === 'ALL' 
    ? eventCatalogue 
    : eventCatalogue.filter(e => e.module === filterModule);

  const modules = Array.from(new Set(eventCatalogue.map(e => e.module)));

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={filterModule}
          onChange={(e) => setFilterModule(e.target.value)}
          className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Modules</option>
          {modules.map(m => (
            <option key={m} value={m} className="capitalize">{m}</option>
          ))}
        </select>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {filteredEvents.length} event types
        </div>
      </div>

      {/* Event List */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Event Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Module</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Entity</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Verb</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Version</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.event_type} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {event.event_type}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {event.module}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {event.entity}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {event.verb}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                    v{event.current_version}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                  {event.description}
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
// SCHEMAS TAB
// ═══════════════════════════════════════════════════════════

function SchemasTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Schema Registry
        </h3>
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
          style={{ background: 'var(--brand-600)', color: '#fff' }}>
          <FileText size={12} />
          New Schema
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Event Type</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Version</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Published</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {schemaVersions.map(schema => (
              <tr key={schema.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {schema.event_type}
                  </code>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                    v{schema.version}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ 
                      background: getSchemaStatusColor(schema.status) + '20', 
                      color: getSchemaStatusColor(schema.status) 
                    }}>
                    {schema.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(schema.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {schema.published_at ? new Date(schema.published_at).toLocaleDateString() : '—'}
                </td>
                <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                  {schema.compatibility_notes || '—'}
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
// SUBSCRIPTIONS TAB
// ═══════════════════════════════════════════════════════════

function SubscriptionsTab() {
  const [filterType, setFilterType] = useState<'ALL' | 'internal' | 'webhook'>('ALL');

  const filteredSubs = filterType === 'ALL' 
    ? subscriptions 
    : subscriptions.filter(s => s.type === filterType);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All Types</option>
          <option value="internal">Internal</option>
          <option value="webhook">Webhook</option>
        </select>
      </div>

      {/* Subscriptions List */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subscriber</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Events</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Failures</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Last Success</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Module</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubs.map(sub => (
              <tr key={sub.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {sub.type === 'webhook' ? <Webhook size={14} style={{ color: 'var(--brand-600)' }} /> : <Send size={14} style={{ color: 'var(--text-muted)' }} />}
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                        {sub.subscriber}
                      </div>
                      {sub.endpoint && (
                        <div className="text-[10px] truncate max-w-xs" style={{ color: 'var(--text-muted)' }}>
                          {sub.endpoint}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded capitalize" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                    {sub.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {sub.event_types.slice(0, 3).map(et => (
                      <span key={et} className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                        {et === '*' ? 'all' : et.split('.').pop()}
                      </span>
                    ))}
                    {sub.event_types.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                        +{sub.event_types.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ 
                      background: getSubscriptionStatusColor(sub.status) + '20', 
                      color: getSubscriptionStatusColor(sub.status) 
                    }}>
                    {sub.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs tabular-nums" style={{ color: sub.failure_count > 0 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                    {sub.failure_count}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {sub.last_success_at ? new Date(sub.last_success_at).toLocaleString() : '—'}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {sub.owner_module}
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
// DEAD LETTERS TAB
// ═══════════════════════════════════════════════════════════

function DeadLettersTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Database size={16} style={{ color: 'var(--error-600)' }} />
          Dead Letter Queue
        </h3>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {deadLetters.filter(d => d.status === 'pending').length} pending
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Consumer</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Event Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reason</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Retries</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>First Failed</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {deadLetters.map(dl => (
              <tr key={dl.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                  {dl.consumer}
                </td>
                <td className="px-4 py-3">
                  <code className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {dl.event_type}
                  </code>
                </td>
                <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text-muted)' }}>
                  {dl.reason}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs tabular-nums" style={{ color: dl.retry_count > 3 ? 'var(--error-600)' : 'var(--text-secondary)' }}>
                    {dl.retry_count}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                  {new Date(dl.first_failed_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ 
                      background: getDLQStatusColor(dl.status) + '20', 
                      color: getDLQStatusColor(dl.status) 
                    }}>
                    {dl.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {dl.status === 'pending' && (
                    <div className="flex items-center justify-center gap-1">
                      <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Dry Run">
                        <Play size={12} style={{ color: 'var(--info-600)' }} />
                      </button>
                      <button className="p-1 rounded hover:bg-[var(--nav-hover)]" title="Replay">
                        <RefreshCw size={12} style={{ color: 'var(--success-600)' }} />
                      </button>
                    </div>
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
// DELIVERIES TAB
// ═══════════════════════════════════════════════════════════

function DeliveriesTab() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          Recent Deliveries
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Subscription</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Event ID</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Attempt</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Latency</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>HTTP</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Error</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.slice(-20).reverse().map(delivery => {
              const sub = subscriptions.find(s => s.id === delivery.subscription_id);
              return (
                <tr key={delivery.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-primary)' }}>
                    {sub?.subscriber || delivery.subscription_id}
                  </td>
                  <td className="px-4 py-3">
                    <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {delivery.event_id}
                    </code>
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {delivery.attempt}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{ 
                        background: getDeliveryStatusColor(delivery.status) + '20', 
                        color: getDeliveryStatusColor(delivery.status) 
                      }}>
                      {delivery.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                    {delivery.latency_ms ? `${delivery.latency_ms}ms` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: delivery.http_status && delivery.http_status >= 400 ? 'var(--error-600)' : 'var(--text-muted)' }}>
                    {delivery.http_status || '—'}
                  </td>
                  <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {new Date(delivery.created_at).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: delivery.error ? 'var(--error-600)' : 'var(--text-muted)' }}>
                    {delivery.error || '—'}
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
// SUMMARY CARD COMPONENT
// ═══════════════════════════════════════════════════════════

function SummaryCard({ title, value, icon: Icon, color, description }: {
  title: string;
  value: number | string;
  icon: any;
  color: string;
  description: string;
}) {
  return (
    <div className="rounded-xl p-4 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: color + '15' }}>
          <Icon size={20} style={{ color }} />
        </div>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        {title}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
      <div className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
        {description}
      </div>
    </div>
  );
}
