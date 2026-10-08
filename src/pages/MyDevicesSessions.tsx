import React, { useState } from 'react';
import { Monitor, Smartphone, Tablet, Shield, CheckCircle, XCircle, LogOut, Plus } from 'lucide-react';
import { 
  devices, 
  mfaMethods,
  getDevicesByUser,
  getMFAMethodsByUser,
  getDeviceTrustColor,
  type Device,
  type MFAMethod
} from '../data/identitySodData';

// ═══════════════════════════════════════════════════════════
// MY DEVICES & SESSIONS — Part 09
// Route: /admin/idsod/my-devices
// ═══════════════════════════════════════════════════════════

export function MyDevicesSessions() {
  const [activeTab, setActiveTab] = useState<'devices' | 'mfa'>('devices');
  
  // In a real implementation, this would be the current user's ID
  const currentUserId = 'user-001';
  const userDevices = getDevicesByUser(currentUserId);
  const userMFAMethods = getMFAMethodsByUser(currentUserId);

  const getDeviceIcon = (type: Device['deviceType']) => {
    switch (type) {
      case 'desktop': return <Monitor size={20} />;
      case 'mobile': return <Smartphone size={20} />;
      case 'tablet': return <Tablet size={20} />;
    }
  };

  const getMFATypeLabel = (type: MFAMethod['type']) => {
    const labels: Record<MFAMethod['type'], string> = {
      totp: 'Authenticator App',
      webauthn: 'Security Key',
      sms: 'SMS',
      email: 'Email',
    };
    return labels[type];
  };

  return (
    <div className="h-full flex flex-col" style={{ background: 'var(--shell-bg)' }}>
      {/* Header */}
      <div className="p-6 border-b" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
        <h1 className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          My Devices & Sessions
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
          Manage your registered devices and multi-factor authentication
        </p>

        {/* Tabs */}
        <div className="flex gap-1 mt-4">
          <button
            onClick={() => setActiveTab('devices')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'devices' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'devices' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'devices' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            Devices ({userDevices.length})
          </button>
          <button
            onClick={() => setActiveTab('mfa')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'mfa' ? 'text-white' : 'hover:bg-[var(--nav-hover)]'
            }`}
            style={{
              background: activeTab === 'mfa' ? 'var(--brand-600)' : 'transparent',
              color: activeTab === 'mfa' ? '#fff' : 'var(--text-secondary)',
            }}
          >
            MFA Methods ({userMFAMethods.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'devices' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userDevices.map(device => (
              <div key={device.id} className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div>
                      <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                        {device.deviceName}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {device.platform} · {device.browser}
                      </div>
                    </div>
                  </div>
                  {device.status === 'active' ? (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                      Revoked
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Trust Level</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium"
                      style={{ 
                        background: getDeviceTrustColor(device.trustLevel) + '20', 
                        color: getDeviceTrustColor(device.trustLevel) 
                      }}>
                      {device.trustLevel}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>MFA Enabled</span>
                    <span style={{ color: device.mfaEnabled ? 'var(--success-600)' : 'var(--text-muted)' }}>
                      {device.mfaEnabled ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Last Seen</span>
                    <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      {new Date(device.lastSeenAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: 'var(--text-muted)' }}>Registered</span>
                    <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                      {new Date(device.registeredAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {device.status === 'active' ? (
                  <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                    style={{ borderColor: 'var(--error-600)', color: 'var(--error-600)' }}>
                    <LogOut size={12} />
                    Revoke Device
                  </button>
                ) : (
                  <div className="text-[10px] p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-muted)' }}>
                    Revoked: {device.revokeReason}
                  </div>
                )}
              </div>
            ))}

            {/* Add New Device */}
            <button className="p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', minHeight: '200px' }}>
              <Plus size={24} style={{ color: 'var(--text-muted)' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                Register New Device
              </span>
            </button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {userMFAMethods.map(method => (
                <div key={method.id} className="p-4 rounded-xl border" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {getMFATypeLabel(method.type)}
                        </div>
                        <div className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          {method.label}
                        </div>
                      </div>
                    </div>
                    {method.isDefault && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--brand-50)', color: 'var(--brand-700)' }}>
                        Default
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Status</span>
                      <span style={{ color: method.enabled ? 'var(--success-600)' : 'var(--text-muted)' }}>
                        {method.enabled ? '✓ Enabled' : '✗ Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span style={{ color: 'var(--text-muted)' }}>Enrolled</span>
                      <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {new Date(method.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                    {method.lastUsedAt && (
                      <div className="flex justify-between text-xs">
                        <span style={{ color: 'var(--text-muted)' }}>Last Used</span>
                        <span className="tabular-nums" style={{ color: 'var(--text-primary)' }}>
                          {new Date(method.lastUsedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!method.isDefault && method.enabled && (
                      <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                        style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                        Set as Default
                      </button>
                    )}
                    <button className="flex-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                      {method.enabled ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </div>
              ))}

              {/* Add New MFA Method */}
              <button className="p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 transition-colors hover:bg-[var(--card-hover)]"
                style={{ borderColor: 'var(--border-subtle)', minHeight: '200px' }}>
                <Plus size={24} style={{ color: 'var(--text-muted)' }} />
                <span className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>
                  Add MFA Method
                </span>
              </button>
            </div>

            {/* Security Notice */}
            <div className="p-4 rounded-xl border" style={{ background: 'var(--info-50)', borderColor: 'var(--info-200)' }}>
              <div className="flex items-start gap-3">
                <Shield size={20} style={{ color: 'var(--info-700)' }} />
                <div>
                  <div className="text-sm font-semibold mb-1" style={{ color: 'var(--info-700)' }}>
                    Multi-Factor Authentication Required
                  </div>
                  <div className="text-xs" style={{ color: 'var(--info-600)' }}>
                    Your account requires MFA for sensitive operations including payment approvals, 
                    permission changes, and large exports. Ensure you have at least one MFA method enabled.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
