import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff,
  Smartphone,
  FileText,
  Image,
  Settings,
  Download,
  Trash2,
} from 'lucide-react';
import {
  offlineDevices,
  offlineCommands,
  offlineConflicts,
  offlineSnapshots,
  mediaUploads,
  getDevicesByUser,
  getCommandsByDevice,
  getConflictsByDevice,
  getLatestSnapshot,
  getMediaByDevice,
  getSyncStatus,
  getDeviceStatusColor,
  getCommandStatusColor,
  getConflictStatusColor,
  formatBytes,
  formatSnapshotAge,
} from '../data/offlineData';
import { processCommandQueue, getSyncDiagnostics } from '../core/OfflineService';
import { SyncStatusBar } from '../components/SyncStatusBar';
import { ConflictResolution } from '../components/ConflictResolution';

// ═══════════════════════════════════════════════════════════
// OFFLINE SYNC CENTER — Part 22
// Route: /field/offline
// ═══════════════════════════════════════════════════════════

export function OfflineSyncCenter() {
  // Current user (in production, this would come from auth context)
  const currentUserId = 'user-017';
  const currentDeviceId = 'device-001';

  const [selectedDevice, setSelectedDevice] = useState(currentDeviceId);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'commands' | 'conflicts' | 'media' | 'devices'>('overview');
  const [syncStatus, setSyncStatus] = useState(getSyncStatus(currentDeviceId));
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<string | null>(null);

  useEffect(() => {
    // Update sync status every 5 seconds
    const interval = setInterval(() => {
      setSyncStatus(getSyncStatus(selectedDevice));
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedDevice]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await processCommandQueue(selectedDevice);
      setSyncStatus(getSyncStatus(selectedDevice));
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportDiagnostics = () => {
    try {
      const diagnostics = getSyncDiagnostics(selectedDevice);
      const blob = new Blob([JSON.stringify(diagnostics, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `sync-diagnostics-${selectedDevice}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const userDevices = getDevicesByUser(currentUserId);
  const commands = getCommandsByDevice(selectedDevice);
  const conflicts = getConflictsByDevice(selectedDevice);
  const media = getMediaByDevice(selectedDevice);
  const snapshot = getLatestSnapshot(currentUserId, selectedDevice);

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Cloud size={24} style={{ color: 'var(--brand-600)' }} />
              Offline Sync Center
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
              Manage offline data, commands, and conflicts
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportDiagnostics}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <Download size={14} />
              Export Diagnostics
            </button>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'var(--brand-600)', color: '#fff' }}
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
        </div>

        {/* Device Selector */}
        {userDevices.length > 1 && (
          <div className="flex items-center gap-2 mb-4">
            <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
              Device:
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
              style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
            >
              {userDevices.map(device => (
                <option key={device.id} value={device.device_id}>
                  {device.platform} - {device.app_version}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sync Status Bar */}
        <SyncStatusBar deviceId={selectedDevice} />

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          {[
            { id: 'overview', label: 'Overview', icon: Cloud },
            { id: 'commands', label: 'Commands', icon: FileText, count: commands.filter(c => c.status === 'QUEUED').length },
            { id: 'conflicts', label: 'Conflicts', icon: AlertTriangle, count: conflicts.filter(c => c.status === 'OPEN').length },
            { id: 'media', label: 'Media', icon: Image, count: media.filter(m => m.status !== 'COMPLETE').length },
            { id: 'devices', label: 'Devices', icon: Smartphone },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedTab === tab.id ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
                }`}
                style={{
                  background: selectedTab === tab.id ? 'var(--brand-600)' : 'transparent',
                  color: selectedTab === tab.id ? '#fff' : 'var(--text-secondary)',
                }}
              >
                <Icon size={14} />
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span
                    className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      background: selectedTab === tab.id ? 'rgba(255,255,255,0.2)' : 'var(--error-50)',
                      color: selectedTab === tab.id ? '#fff' : 'var(--error-700)',
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {selectedTab === 'overview' && (
          <OverviewTab
            syncStatus={syncStatus}
            snapshot={snapshot}
            commands={commands}
            conflicts={conflicts}
            media={media}
          />
        )}
        {selectedTab === 'commands' && (
          <CommandsTab commands={commands} />
        )}
        {selectedTab === 'conflicts' && (
          <ConflictsTab
            conflicts={conflicts}
            selectedConflict={selectedConflict}
            onSelectConflict={setSelectedConflict}
            currentUserId={currentUserId}
            onResolved={() => {
              setSelectedConflict(null);
              setSyncStatus(getSyncStatus(selectedDevice));
            }}
          />
        )}
        {selectedTab === 'media' && (
          <MediaTab media={media} />
        )}
        {selectedTab === 'devices' && (
          <DevicesTab devices={userDevices} currentDeviceId={selectedDevice} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

function OverviewTab({
  syncStatus,
  snapshot,
  commands,
  conflicts,
  media,
}: {
  syncStatus: any;
  snapshot: any;
  commands: any[];
  conflicts: any[];
  media: any[];
}) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<FileText size={20} />}
          label="Queued Commands"
          value={commands.filter(c => c.status === 'QUEUED').length}
          color="var(--info-600)"
          bgColor="var(--info-50)"
        />
        <SummaryCard
          icon={<AlertTriangle size={20} />}
          label="Open Conflicts"
          value={conflicts.filter(c => c.status === 'OPEN').length}
          color="var(--error-600)"
          bgColor="var(--error-50)"
        />
        <SummaryCard
          icon={<Image size={20} />}
          label="Uploading Media"
          value={media.filter(m => m.status === 'UPLOADING' || m.status === 'PENDING').length}
          color="var(--warning-600)"
          bgColor="var(--warning-50)"
        />
        <SummaryCard
          icon={<CheckCircle size={20} />}
          label="Synced Today"
          value={commands.filter(c => c.status === 'ACCEPTED' && new Date(c.server_received_at || '').toDateString() === new Date().toDateString()).length}
          color="var(--success-600)"
          bgColor="var(--success-50)"
        />
      </div>

      {/* Snapshot Info */}
      {snapshot && (
        <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h3 className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Download size={16} style={{ color: 'var(--brand-600)' }} />
              Local Snapshot
            </h3>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: syncStatus.snapshot_fresh ? 'var(--success-50)' : 'var(--warning-50)',
                color: syncStatus.snapshot_fresh ? 'var(--success-700)' : 'var(--warning-700)',
              }}
            >
              {syncStatus.snapshot_fresh ? 'Fresh' : 'Stale'}
            </span>
          </div>
          <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Version
              </div>
              <div className="text-sm font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                v{snapshot.version}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Generated
              </div>
              <div className="text-sm tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {formatSnapshotAge(syncStatus.snapshot_age_hours || 0)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Size
              </div>
              <div className="text-sm tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {formatBytes(snapshot.size_bytes)}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
                Records
              </div>
              <div className="text-sm tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {snapshot.record_count.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            Recent Activity
          </h3>
        </div>
        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {commands.slice(-5).reverse().map(cmd => (
            <div key={cmd.command_id} className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: getCommandStatusColor(cmd.status) }}
                />
                <div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {cmd.type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {new Date(cmd.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  background: getCommandStatusColor(cmd.status) + '20',
                  color: getCommandStatusColor(cmd.status),
                }}
              >
                {cmd.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMMANDS TAB
// ═══════════════════════════════════════════════════════════

function CommandsTab({ commands }: { commands: any[] }) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredCommands = filterStatus === 'ALL'
    ? commands
    : commands.filter(c => c.status === filterStatus);

  return (
    <div className="space-y-4">
      {/* Filter */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          Status:
        </label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 rounded-lg text-xs border outline-none focus:ring-2 focus:ring-[var(--brand-500)]"
          style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)', color: 'var(--text-primary)' }}
        >
          <option value="ALL">All</option>
          <option value="QUEUED">Queued</option>
          <option value="SENDING">Sending</option>
          <option value="ACCEPTED">Accepted</option>
          <option value="REJECTED">Rejected</option>
          <option value="CONFLICT">Conflict</option>
        </select>
      </div>

      {/* Commands List */}
      <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ background: 'var(--surface-sunken)' }}>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Created</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
              <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Retries</th>
              <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Result</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommands.map(cmd => (
              <tr key={cmd.command_id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
                <td className="px-4 py-3">
                  <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                    {cmd.type.replace(/_/g, ' ')}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    {cmd.command_id}
                  </div>
                </td>
                <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(cmd.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{
                      background: getCommandStatusColor(cmd.status) + '20',
                      color: getCommandStatusColor(cmd.status),
                    }}
                  >
                    {cmd.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                  {cmd.retry_count} / {cmd.max_retries}
                </td>
                <td className="px-4 py-3">
                  {cmd.result_code && (
                    <div className="text-xs" style={{ color: cmd.status === 'ACCEPTED' ? 'var(--success-600)' : 'var(--error-600)' }}>
                      {cmd.result_code}
                    </div>
                  )}
                  {cmd.result_message && (
                    <div className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {cmd.result_message}
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
// CONFLICTS TAB
// ═══════════════════════════════════════════════════════════

function ConflictsTab({
  conflicts,
  selectedConflict,
  onSelectConflict,
  currentUserId,
  onResolved,
}: {
  conflicts: any[];
  selectedConflict: string | null;
  onSelectConflict: (id: string | null) => void;
  currentUserId: string;
  onResolved: () => void;
}) {
  const openConflicts = conflicts.filter(c => c.status === 'OPEN');
  const resolvedConflicts = conflicts.filter(c => c.status === 'RESOLVED');

  return (
    <div className="space-y-6">
      {/* Open Conflicts */}
      {openConflicts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <AlertTriangle size={16} style={{ color: 'var(--error-600)' }} />
            Open Conflicts ({openConflicts.length})
          </h3>
          <div className="space-y-4">
            {openConflicts.map(conflict => (
              <ConflictResolution
                key={conflict.id}
                conflict={conflict}
                currentUserId={currentUserId}
                onResolved={onResolved}
              />
            ))}
          </div>
        </div>
      )}

      {/* Resolved Conflicts */}
      {resolvedConflicts.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
            Resolved Conflicts ({resolvedConflicts.length})
          </h3>
          <div className="space-y-2">
            {resolvedConflicts.map(conflict => (
              <div
                key={conflict.id}
                className="p-3 rounded-lg border"
                style={{
                  borderColor: 'var(--border-subtle)',
                  background: 'var(--success-50)',
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                    <div>
                      <div className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>
                        {conflict.record_label}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--success-600)' }}>
                        Resolved: {conflict.resolution} • {new Date(conflict.resolved_at!).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {conflicts.length === 0 && (
        <div className="text-center py-12">
          <CheckCircle size={48} className="mx-auto mb-4" style={{ color: 'var(--success-600)' }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            No Conflicts
          </h3>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            All your offline changes have been synced successfully
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MEDIA TAB
// ═══════════════════════════════════════════════════════════

function MediaTab({ media }: { media: any[] }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <table className="w-full">
        <thead>
          <tr style={{ background: 'var(--surface-sunken)' }}>
            <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>File</th>
            <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Size</th>
            <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Progress</th>
            <th className="px-4 py-3 text-center text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Status</th>
            <th className="px-4 py-3 text-left text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {media.map(item => (
            <tr key={item.id} className="border-t hover:bg-[var(--card-hover)] transition-colors" style={{ borderColor: 'var(--border-subtle)' }}>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Image size={16} style={{ color: 'var(--brand-600)' }} />
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>
                      {item.filename}
                    </div>
                    <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {item.mime_type}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-center text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
                {formatBytes(item.size_bytes)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-sunken)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(item.chunks_received / item.chunks_total) * 100}%`,
                        background: 'var(--brand-600)',
                      }}
                    />
                  </div>
                  <span className="text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                    {item.chunks_received}/{item.chunks_total}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: getCommandStatusColor(item.status === 'COMPLETE' ? 'ACCEPTED' : item.status === 'FAILED' ? 'REJECTED' : 'QUEUED') + '20',
                    color: getCommandStatusColor(item.status === 'COMPLETE' ? 'ACCEPTED' : item.status === 'FAILED' ? 'REJECTED' : 'QUEUED'),
                  }}
                >
                  {item.status}
                </span>
              </td>
              <td className="px-4 py-3 text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
                {item.uploaded_at ? new Date(item.uploaded_at).toLocaleString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEVICES TAB
// ═══════════════════════════════════════════════════════════

function DevicesTab({ devices, currentDeviceId }: { devices: any[]; currentDeviceId: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {devices.map(device => (
        <div
          key={device.id}
          className="p-4 rounded-xl border"
          style={{
            background: 'var(--card-bg)',
            borderColor: device.device_id === currentDeviceId ? 'var(--brand-600)' : 'var(--card-border)',
            borderWidth: device.device_id === currentDeviceId ? '2px' : '1px',
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Smartphone size={20} style={{ color: 'var(--brand-600)' }} />
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  {device.platform}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  v{device.app_version}
                </div>
              </div>
            </div>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{
                background: getDeviceStatusColor(device.status) + '20',
                color: getDeviceStatusColor(device.status),
              }}
            >
              {device.status}
            </span>
          </div>

          <div className="space-y-2 mb-3">
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Last Sync</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {new Date(device.last_sync_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Snapshot</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                v{device.snapshot_version}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span style={{ color: 'var(--text-muted)' }}>Queue</span>
              <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                {device.queue_size} commands
              </span>
            </div>
            {device.pending_conflicts > 0 && (
              <div className="flex justify-between text-xs">
                <span style={{ color: 'var(--text-muted)' }}>Conflicts</span>
                <span className="tabular-nums font-medium" style={{ color: 'var(--error-600)' }}>
                  {device.pending_conflicts}
                </span>
              </div>
            )}
          </div>

          {device.device_id === currentDeviceId && (
            <div className="text-[10px] px-2 py-1 rounded text-center" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
              Current Device
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUMMARY CARD
// ═══════════════════════════════════════════════════════════

function SummaryCard({
  icon,
  label,
  value,
  color,
  bgColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: bgColor }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="text-[10px] font-medium uppercase tracking-wide mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}
