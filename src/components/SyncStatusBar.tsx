import React, { useState, useEffect } from 'react';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  Cloud,
  CloudOff,
  AlertTriangle,
} from 'lucide-react';
import { getSyncStatus, type SyncStatusInfo } from '../data/offlineData';

// ═══════════════════════════════════════════════════════════
// SYNC STATUS BAR COMPONENT — Part 22
// ═══════════════════════════════════════════════════════════

interface SyncStatusBarProps {
  deviceId: string;
  onSyncClick?: () => void;
  className?: string;
}

export function SyncStatusBar({ deviceId, onSyncClick, className = '' }: SyncStatusBarProps) {
  const [syncStatus, setSyncStatus] = useState<SyncStatusInfo | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // Initial status load
    const status = getSyncStatus(deviceId);
    setSyncStatus(status);

    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      const updatedStatus = getSyncStatus(deviceId);
      setSyncStatus(updatedStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, [deviceId]);

  const handleSync = async () => {
    if (!syncStatus || isSyncing) return;
    
    setIsSyncing(true);
    try {
      // In production, this would call the actual sync API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Refresh status
      const updatedStatus = getSyncStatus(deviceId);
      setSyncStatus(updatedStatus);
      
      if (onSyncClick) {
        onSyncClick();
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!syncStatus) {
    return null;
  }

  const getStatusIcon = () => {
    if (isSyncing) {
      return <RefreshCw size={16} className="animate-spin" />;
    }

    switch (syncStatus.status) {
      case 'OFFLINE':
        return <CloudOff size={16} />;
      case 'QUEUED':
      case 'SYNCING':
        return <RefreshCw size={16} />;
      case 'SYNCED':
        return <CheckCircle size={16} />;
      case 'CONFLICT':
        return <AlertTriangle size={16} />;
      case 'FAILED':
        return <AlertCircle size={16} />;
      default:
        return <Cloud size={16} />;
    }
  };

  const getStatusColor = () => {
    if (isSyncing) {
      return 'var(--info-600)';
    }

    switch (syncStatus.status) {
      case 'OFFLINE':
        return 'var(--text-muted)';
      case 'QUEUED':
        return 'var(--info-600)';
      case 'SYNCING':
        return 'var(--warning-600)';
      case 'SYNCED':
        return 'var(--success-600)';
      case 'CONFLICT':
        return 'var(--error-600)';
      case 'FAILED':
        return 'var(--error-700)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getStatusText = () => {
    if (isSyncing) {
      return 'Syncing...';
    }

    switch (syncStatus.status) {
      case 'OFFLINE':
        return 'Offline';
      case 'QUEUED':
        return `${syncStatus.pending_commands} queued`;
      case 'SYNCING':
        return 'Syncing...';
      case 'SYNCED':
        return 'Synced';
      case 'CONFLICT':
        return `${syncStatus.open_conflicts} conflict${syncStatus.open_conflicts !== 1 ? 's' : ''}`;
      case 'FAILED':
        return 'Sync failed';
      default:
        return 'Unknown';
    }
  };

  const getBackgroundColor = () => {
    if (isSyncing) {
      return 'var(--info-50)';
    }

    switch (syncStatus.status) {
      case 'OFFLINE':
        return 'var(--surface-sunken)';
      case 'QUEUED':
        return 'var(--info-50)';
      case 'SYNCING':
        return 'var(--warning-50)';
      case 'SYNCED':
        return 'var(--success-50)';
      case 'CONFLICT':
        return 'var(--error-50)';
      case 'FAILED':
        return 'var(--error-50)';
      default:
        return 'var(--surface-sunken)';
    }
  };

  return (
    <div
      className={`flex items-center justify-between px-4 py-2 rounded-lg border ${className}`}
      style={{
        background: getBackgroundColor(),
        borderColor: getStatusColor(),
        borderWidth: '1px',
      }}
    >
      <div className="flex items-center gap-3">
        <div style={{ color: getStatusColor() }}>
          {getStatusIcon()}
        </div>
        <div>
          <div className="text-xs font-semibold" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </div>
          {syncStatus.last_sync_at && (
            <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
              Last sync: {new Date(syncStatus.last_sync_at).toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Snapshot age warning */}
        {syncStatus.snapshot_age_hours !== undefined && syncStatus.snapshot_age_hours > 24 && (
          <div className="flex items-center gap-1" title="Snapshot is stale">
            <Clock size={12} style={{ color: 'var(--warning-600)' }} />
            <span className="text-[10px]" style={{ color: 'var(--warning-600)' }}>
              {Math.floor(syncStatus.snapshot_age_hours)}h old
            </span>
          </div>
        )}

        {/* Pending items */}
        {(syncStatus.pending_commands > 0 || syncStatus.uploading_media > 0) && (
          <div className="flex items-center gap-2 text-[10px]" style={{ color: 'var(--text-muted)' }}>
            {syncStatus.pending_commands > 0 && (
              <span>{syncStatus.pending_commands} cmd</span>
            )}
            {syncStatus.uploading_media > 0 && (
              <span>{syncStatus.uploading_media} media</span>
            )}
          </div>
        )}

        {/* Sync button */}
        <button
          onClick={handleSync}
          disabled={isSyncing || syncStatus.status === 'SYNCED'}
          className="px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: getStatusColor(),
            color: '#fff',
          }}
        >
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>
    </div>
  );
}
