import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Shield,
  ShieldOff,
  RefreshCw,
  Plus,
  Bell,
  Camera,
  MapPin,
  QrCode,
  Wifi,
  WifiOff,
} from 'lucide-react';
import {
  devices,
  getDevicesByUser,
  getDeviceById,
  getDeviceTypeLabel,
  getPlatformLabel,
  getTrustLevelColor,
  getDeviceIcon,
  type Device,
} from '../data/deviceData';
import {
  trustDevice,
  revokeDevice,
  getDeviceStats,
  requestPushPermission,
  subscribeToPush,
  isAppInstalled,
  showInstallPrompt,
  listenForInstallPrompt,
} from '../core/DeviceService';
import { DeviceInfo, ConnectivityIndicator } from '../components/DeviceCapabilities';

// ═══════════════════════════════════════════════════════════
// DEVICE MANAGEMENT PAGE — Part 21
// Route: /home/devices
// ═══════════════════════════════════════════════════════════

export function DeviceManagement() {
  // Current user (in production, this would come from auth context)
  const currentUserId = 'user-001';

  const [userDevices, setUserDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);

  useEffect(() => {
    // Load user devices
    setUserDevices(getDevicesByUser(currentUserId));

    // Check if app is installed
    if (!isAppInstalled()) {
      listenForInstallPrompt();
      setShowInstallBanner(true);
    }

    // Check push notification permission
    if ('Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }
  }, [currentUserId]);

  const stats = getDeviceStats();

  const handleTrustDevice = (deviceId: string) => {
    try {
      trustDevice(deviceId, currentUserId);
      setUserDevices(getDevicesByUser(currentUserId));
      alert('Device trusted successfully');
    } catch (error) {
      alert(`Failed to trust device: ${(error as Error).message}`);
    }
  };

  const handleRevokeDevice = (deviceId: string) => {
    const reason = prompt('Enter reason for revoking device:');
    if (!reason) return;

    try {
      revokeDevice(deviceId, currentUserId, reason);
      setUserDevices(getDevicesByUser(currentUserId));
      alert('Device revoked successfully');
    } catch (error) {
      alert(`Failed to revoke device: ${(error as Error).message}`);
    }
  };

  const handleEnablePush = async () => {
    const granted = await requestPushPermission();
    if (granted) {
      const subscription = await subscribeToPush();
      if (subscription) {
        setPushEnabled(true);
        alert('Push notifications enabled');
      }
    } else {
      alert('Push notification permission denied');
    }
  };

  const handleInstall = async () => {
    const installed = await showInstallPrompt();
    if (installed) {
      setShowInstallBanner(false);
    }
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          Device Management
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage your registered devices and app settings
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Install Banner */}
        {showInstallBanner && (
          <div className="p-4 rounded-xl border" style={{ background: 'var(--info-50)', borderColor: 'var(--info-200)' }}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <Plus size={20} style={{ color: 'var(--info-700)' }} />
                <div>
                  <div className="text-sm font-semibold mb-1" style={{ color: 'var(--info-700)' }}>
                    Install as App
                  </div>
                  <div className="text-xs" style={{ color: 'var(--info-600)' }}>
                    Install Construction ERP on your device for quick access and offline support
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleInstall}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                  style={{ background: 'var(--info-600)', color: '#fff' }}
                >
                  Install
                </button>
                <button
                  onClick={() => setShowInstallBanner(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Connectivity Status */}
        <ConnectivityIndicator />

        {/* Device Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
              Total Devices
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
              {stats.total_devices}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--success-50)', borderColor: 'var(--success-200)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--success-700)' }}>
              Trusted
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--success-700)' }}>
              {stats.trusted_devices}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--warning-50)', borderColor: 'var(--warning-200)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--warning-700)' }}>
              Untrusted
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--warning-700)' }}>
              {stats.untrusted_devices}
            </div>
          </div>
          <div className="p-4 rounded-xl border" style={{ background: 'var(--error-50)', borderColor: 'var(--error-200)' }}>
            <div className="text-xs font-medium mb-1" style={{ color: 'var(--error-700)' }}>
              Revoked
            </div>
            <div className="text-2xl font-bold tabular-nums" style={{ color: 'var(--error-700)' }}>
              {stats.revoked_devices}
            </div>
          </div>
        </div>

        {/* Device List */}
        <div>
          <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Your Devices
          </h2>
          <div className="space-y-3">
            {userDevices.map((device) => (
              <DeviceCard
                key={device.id}
                device={device}
                isSelected={selectedDevice?.id === device.id}
                onClick={() => setSelectedDevice(device)}
                onTrust={() => handleTrustDevice(device.id)}
                onRevoke={() => handleRevokeDevice(device.id)}
              />
            ))}
          </div>
        </div>

        {/* Device Details */}
        {selectedDevice && (
          <DeviceDetailPanel
            device={selectedDevice}
            onClose={() => setSelectedDevice(null)}
            onTrust={() => handleTrustDevice(selectedDevice.id)}
            onRevoke={() => handleRevokeDevice(selectedDevice.id)}
          />
        )}

        {/* Push Notifications */}
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <Bell size={20} style={{ color: 'var(--brand-600)' }} />
              <div>
                <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Push Notifications
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Receive real-time alerts and updates
                </div>
              </div>
            </div>
            {pushEnabled ? (
              <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                Enabled
              </span>
            ) : (
              <button
                onClick={handleEnablePush}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
                style={{ background: 'var(--brand-600)', color: '#fff' }}
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Device Info */}
        <DeviceInfo />

        {/* Capabilities */}
        <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Device Capabilities
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <CapabilityItem icon={Camera} label="Camera" available={true} />
            <CapabilityItem icon={MapPin} label="GPS" available={true} />
            <CapabilityItem icon={QrCode} label="QR Scanner" available={true} />
            <CapabilityItem icon={Wifi} label="Offline Storage" available={true} />
            <CapabilityItem icon={Bell} label="Push Notifications" available={pushEnabled} />
            <CapabilityItem icon={Shield} label="Biometric" available={false} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEVICE CARD
// ═══════════════════════════════════════════════════════════

function DeviceCard({
  device,
  isSelected,
  onClick,
  onTrust,
  onRevoke,
}: {
  device: Device;
  isSelected: boolean;
  onClick: () => void;
  onTrust: () => void;
  onRevoke: () => void;
}) {
  const getDeviceTypeIcon = () => {
    switch (device.device_type) {
      case 'mobile':
        return <Smartphone size={20} />;
      case 'tablet':
        return <Tablet size={20} />;
      case 'desktop':
        return <Monitor size={20} />;
    }
  };

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
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}
          >
            {getDeviceTypeIcon()}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              {getDeviceTypeLabel(device.device_type)}
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {getPlatformLabel(device.platform)} • {device.browser}
            </div>
          </div>
        </div>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{
            background: getTrustLevelColor(device.trust_level) + '20',
            color: getTrustLevelColor(device.trust_level),
          }}
        >
          {device.trust_level}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Last Seen</span>
          <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {new Date(device.last_seen_at).toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Registered</span>
          <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
            {new Date(device.registered_at).toLocaleDateString()}
          </span>
        </div>
        {device.revoked_at && (
          <div className="flex justify-between text-xs">
            <span style={{ color: 'var(--text-muted)' }}>Revoked</span>
            <span className="tabular-nums" style={{ color: 'var(--error-600)' }}>
              {new Date(device.revoked_at).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {device.trust_level === 'untrusted' && (
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTrust();
            }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--success-600)', color: '#fff' }}
          >
            <Shield size={12} />
            Trust
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRevoke();
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}
          >
            <XCircle size={12} />
            Revoke
          </button>
        </div>
      )}

      {device.trust_level === 'trusted' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRevoke();
          }}
          className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
          style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}
        >
          <ShieldOff size={12} />
          Revoke Device
        </button>
      )}

      {device.trust_level === 'revoked' && (
        <div className="text-xs p-2 rounded" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
          {device.revoke_reason || 'Device revoked'}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEVICE DETAIL PANEL
// ═══════════════════════════════════════════════════════════

function DeviceDetailPanel({
  device,
  onClose,
  onTrust,
  onRevoke,
}: {
  device: Device;
  onClose: () => void;
  onTrust: () => void;
  onRevoke: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
            Device Details
          </h3>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {device.id}
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-[var(--nav-hover)]">
          <XCircle size={16} style={{ color: 'var(--text-muted)' }} />
        </button>
      </div>

      <div className="space-y-3">
        <DetailRow label="Device Type" value={getDeviceTypeLabel(device.device_type)} />
        <DetailRow label="Platform" value={getPlatformLabel(device.platform)} />
        <DetailRow label="Browser" value={device.browser || '—'} />
        <DetailRow label="OS Version" value={device.os_version || '—'} />
        <DetailRow label="App Version" value={device.app_version || '—'} />
        <DetailRow label="Trust Level" value={device.trust_level} />
        <DetailRow label="Registered" value={new Date(device.registered_at).toLocaleString()} />
        <DetailRow label="Last Seen" value={new Date(device.last_seen_at).toLocaleString()} />
        {device.revoked_at && (
          <>
            <DetailRow label="Revoked At" value={new Date(device.revoked_at).toLocaleString()} />
            <DetailRow label="Revoked By" value={device.revoked_by || '—'} />
            <DetailRow label="Reason" value={device.revoke_reason || '—'} />
          </>
        )}
      </div>

      <div className="mt-4 pt-4 border-t flex gap-2" style={{ borderColor: 'var(--border-subtle)' }}>
        {device.trust_level === 'untrusted' && (
          <button
            onClick={onTrust}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90"
            style={{ background: 'var(--success-600)', color: '#fff' }}
          >
            <Shield size={12} />
            Trust Device
          </button>
        )}
        {device.trust_level !== 'revoked' && (
          <button
            onClick={onRevoke}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}
          >
            <ShieldOff size={12} />
            Revoke Device
          </button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CAPABILITY ITEM
// ═══════════════════════════════════════════════════════════

function CapabilityItem({ icon: Icon, label, available }: { icon: any; label: string; available: boolean }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
      <Icon size={14} style={{ color: available ? 'var(--success-600)' : 'var(--text-muted)' }} />
      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </span>
      {available ? (
        <CheckCircle size={12} className="ml-auto" style={{ color: 'var(--success-600)' }} />
      ) : (
        <XCircle size={12} className="ml-auto" style={{ color: 'var(--text-muted)' }} />
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
