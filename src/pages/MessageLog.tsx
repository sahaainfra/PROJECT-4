import React, { useState } from 'react';
import {
  Mail,
  Filter,
  Search,
  Eye,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import {
  integrationMessages,
  integrationDeadLetters,
  getMessageStatusColor,
  getConnectorTypeIcon,
  type IntegrationMessage,
  type IntegrationDeadLetter,
} from '../data/integrationData';
import { replayDeadLetter } from '../core/IntegrationService';

// ═══════════════════════════════════════════════════════════
// MESSAGE LOG & DLQ — Part 17
// Route: /admin/intg/messages
// ═══════════════════════════════════════════════════════════

export function MessageLog() {
  const [activeTab, setActiveTab] = useState<'messages' | 'deadletters'>('messages');
  const [selectedMessage, setSelectedMessage] = useState<IntegrationMessage | null>(null);
  const [selectedDeadLetter, setSelectedDeadLetter] = useState<IntegrationDeadLetter | null>(null);
  const [filterConnector, setFilterConnector] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const connectors = Array.from(new Set(integrationMessages.map(m => m.connector_code)));

  const filteredMessages = integrationMessages.filter(msg => {
    const matchesConnector = filterConnector === 'ALL' || msg.connector_code === filterConnector;
    const matchesStatus = filterStatus === 'ALL' || msg.status === filterStatus;
    
    const matchesSearch = searchQuery === '' ||
      msg.correlation_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.entity_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.entity_id?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesConnector && matchesStatus && matchesSearch;
  });

  const unresolvedDeadLetters = integrationDeadLetters.filter(dl => !dl.resolved);

  const handleReplayDeadLetter = (deadLetterId: string) => {
    try {
      replayDeadLetter(deadLetterId, 'user-001'); // Current user
      alert('Dead letter replayed successfully');
      setSelectedDeadLetter(null);
    } catch (error) {
      alert(`Replay failed: ${(error as Error).message}`);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Mail size={24} style={{ color: 'var(--brand-600)' }} />
              Message Log & Dead Letter Queue
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Monitor integration messages and manage failed deliveries
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'messages' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'messages' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'messages' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Messages ({integrationMessages.length})
          </button>
          <button
            onClick={() => setActiveTab('deadletters')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'deadletters' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'deadletters' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'deadletters' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Dead Letters ({unresolvedDeadLetters.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'messages' ? (
            <>
              {/* Filters */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search by correlation ID, entity..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                    style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                  />
                </div>
                <select
                  value={filterConnector}
                  onChange={(e) => setFilterConnector(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                >
                  <option value="ALL">All Connectors</option>
                  {connectors.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
                  style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
                >
                  <option value="ALL">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="sent">Sent</option>
                  <option value="delivered">Delivered</option>
                  <option value="failed">Failed</option>
                </select>
              </div>

              {/* Messages Table */}
              <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: 'var(--surface-sunken)' }}>
                      <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Connector</th>
                      <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Correlation ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Entity</th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                      <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Attempts</th>
                      <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map(msg => (
                      <tr
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{getConnectorTypeIcon(msg.connector_code.split('_')[0].toLowerCase())}</span>
                            <div>
                              <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                                {msg.connector_code}
                              </div>
                              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {msg.direction}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <code className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                            {msg.correlation_id}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          {msg.entity_type ? (
                            <div>
                              <div className="text-xs" style={{ color: 'var(--text-primary)' }}>
                                {msg.entity_type}
                              </div>
                              <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                                {msg.entity_id}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: 'var(--text-muted)' }}>—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: getMessageStatusColor(msg.status) + '20',
                              color: getMessageStatusColor(msg.status),
                            }}>
                            {msg.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="text-xs tabular-nums" style={{ color: msg.attempts > 1 ? 'var(--warning-600)' : 'var(--text-muted)' }}>
                            {msg.attempts}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                          {new Date(msg.at).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Dead Letters */
            <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'var(--surface-sunken)' }}>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Message ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Failed At</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
                    <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {integrationDeadLetters.map(dl => (
                    <tr
                      key={dl.id}
                      onClick={() => setSelectedDeadLetter(dl)}
                      className="border-t hover:bg-[var(--card-hover)] transition-colors cursor-pointer"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                          {dl.message_id}
                        </code>
                      </td>
                      <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ color: 'var(--text-secondary)' }}>
                        {dl.reason}
                      </td>
                      <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                        {new Date(dl.at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: dl.resolved ? 'var(--success-50)' : 'var(--error-50)',
                            color: dl.resolved ? 'var(--success-700)' : 'var(--error-700)',
                          }}>
                          {dl.resolved ? 'Resolved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {!dl.resolved && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReplayDeadLetter(dl.id);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors hover:opacity-90"
                            style={{ background: 'var(--brand-600)', color: '#fff' }}
                          >
                            <RefreshCw size={10} />
                            Replay
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {(selectedMessage || selectedDeadLetter) && (
          <div className="w-96 border-l overflow-y-auto p-6" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
            {selectedMessage ? (
              <MessageDetail message={selectedMessage} onClose={() => setSelectedMessage(null)} />
            ) : selectedDeadLetter ? (
              <DeadLetterDetail
                deadLetter={selectedDeadLetter}
                onClose={() => setSelectedDeadLetter(null)}
                onReplay={() => handleReplayDeadLetter(selectedDeadLetter.id)}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MESSAGE DETAIL
// ═══════════════════════════════════════════════════════════

function MessageDetail({ message, onClose }: { message: IntegrationMessage; onClose: () => void }) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Mail size={20} style={{ color: 'var(--brand-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Message Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {message.id}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Connector" value={message.connector_code} />
        <DetailRow label="Direction" value={message.direction} />
        <DetailRow label="Correlation ID" value={message.correlation_id} />
        {message.entity_type && <DetailRow label="Entity Type" value={message.entity_type} />}
        {message.entity_id && <DetailRow label="Entity ID" value={message.entity_id} />}
        <DetailRow label="Status" value={message.status.toUpperCase()} />
        <DetailRow label="Attempts" value={message.attempts.toString()} />
        <DetailRow label="Timestamp" value={new Date(message.at).toLocaleString()} />
        {message.error && (
          <div className="p-3 rounded-lg" style={{ background: 'var(--error-50)' }}>
            <div className="text-xs font-semibold mb-1" style={{ color: 'var(--error-700)' }}>
              Error
            </div>
            <div className="text-xs" style={{ color: 'var(--error-600)' }}>
              {message.error}
            </div>
          </div>
        )}
      </div>

      {/* Request */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Request (Redacted)
        </div>
        <div className="p-3 rounded-lg text-xs font-mono overflow-x-auto" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
          <pre>{JSON.stringify(message.request_redacted, null, 2)}</pre>
        </div>
      </div>

      {/* Response */}
      {message.response_redacted && (
        <div>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Response (Redacted)
          </div>
          <div className="p-3 rounded-lg text-xs font-mono overflow-x-auto" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
            <pre>{JSON.stringify(message.response_redacted, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEAD LETTER DETAIL
// ═══════════════════════════════════════════════════════════

function DeadLetterDetail({
  deadLetter,
  onClose,
  onReplay,
}: {
  deadLetter: IntegrationDeadLetter;
  onClose: () => void;
  onReplay: () => void;
}) {
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={20} style={{ color: 'var(--error-600)' }} />
            <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Dead Letter Details
            </h2>
          </div>
          <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {deadLetter.id}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <span style={{ color: 'var(--text-muted)' }}>✕</span>
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4 mb-6">
        <DetailRow label="Message ID" value={deadLetter.message_id} />
        <DetailRow label="Failed At" value={new Date(deadLetter.at).toLocaleString()} />
        <DetailRow label="Status" value={deadLetter.resolved ? 'Resolved' : 'Pending'} />
        {deadLetter.resolved_at && (
          <DetailRow label="Resolved At" value={new Date(deadLetter.resolved_at).toLocaleString()} />
        )}
        {deadLetter.resolved_by && (
          <DetailRow label="Resolved By" value={deadLetter.resolved_by} />
        )}
      </div>

      {/* Reason */}
      <div className="mb-6">
        <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Failure Reason
        </div>
        <div className="p-3 rounded-lg" style={{ background: 'var(--error-50)' }}>
          <div className="text-xs" style={{ color: 'var(--error-700)' }}>
            {deadLetter.reason}
          </div>
        </div>
      </div>

      {/* Actions */}
      {!deadLetter.resolved && (
        <div className="pt-6 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
          <button
            onClick={onReplay}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--brand-600)', color: '#fff' }}
          >
            <RefreshCw size={12} />
            Replay Message
          </button>
        </div>
      )}
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
