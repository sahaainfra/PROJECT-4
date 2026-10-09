// ═══════════════════════════════════════════════════════════
// DEVICE DATA MODEL — Part 21
// Mobile + Tablet + Desktop Experience
// ═══════════════════════════════════════════════════════════

export type DevicePlatform = 'web' | 'android' | 'ios' | 'windows' | 'macos' | 'linux';
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DeviceTrustLevel = 'trusted' | 'untrusted' | 'revoked';

export interface Device {
  id: string;
  user_id: string;
  platform: DevicePlatform;
  device_type: DeviceType;
  browser?: string;
  os_version?: string;
  app_version?: string;
  push_token?: string;
  registered_at: string;
  last_seen_at: string;
  trust_level: DeviceTrustLevel;
  is_trusted: boolean;
  revoked_at?: string;
  revoked_by?: string;
  revoke_reason?: string;
}

export interface DeviceRegistration {
  platform: DevicePlatform;
  device_type: DeviceType;
  browser?: string;
  os_version?: string;
  app_version?: string;
  push_token?: string;
}

export interface DeviceCapabilities {
  camera: boolean;
  gps: boolean;
  qr_scanner: boolean;
  file_picker: boolean;
  signature_pad: boolean;
  voice_to_text: boolean;
  biometric: boolean;
  offline_storage: boolean;
  push_notifications: boolean;
}

// ═══════════════════════════════════════════════════════════
// SAMPLE DATA
// ═══════════════════════════════════════════════════════════

export const devices: Device[] = [
  {
    id: 'device-001',
    user_id: 'user-001',
    platform: 'web',
    device_type: 'desktop',
    browser: 'Chrome 120',
    os_version: 'Windows 11',
    app_version: '1.0.0',
    registered_at: '2024-01-01T00:00:00Z',
    last_seen_at: '2024-01-16T12:00:00Z',
    trust_level: 'trusted',
    is_trusted: true,
  },
  {
    id: 'device-002',
    user_id: 'user-001',
    platform: 'android',
    device_type: 'mobile',
    browser: 'Chrome Mobile 120',
    os_version: 'Android 14',
    app_version: '1.0.0',
    push_token: 'fcm-token-001',
    registered_at: '2024-01-05T00:00:00Z',
    last_seen_at: '2024-01-16T11:30:00Z',
    trust_level: 'trusted',
    is_trusted: true,
  },
  {
    id: 'device-003',
    user_id: 'user-010',
    platform: 'ios',
    device_type: 'tablet',
    browser: 'Safari 17',
    os_version: 'iPadOS 17',
    app_version: '1.0.0',
    push_token: 'apns-token-001',
    registered_at: '2024-01-10T00:00:00Z',
    last_seen_at: '2024-01-16T10:00:00Z',
    trust_level: 'trusted',
    is_trusted: true,
  },
  {
    id: 'device-004',
    user_id: 'user-017',
    platform: 'android',
    device_type: 'mobile',
    browser: 'Chrome Mobile 119',
    os_version: 'Android 13',
    app_version: '1.0.0',
    registered_at: '2024-01-08T00:00:00Z',
    last_seen_at: '2024-01-15T18:00:00Z',
    trust_level: 'untrusted',
    is_trusted: false,
  },
  {
    id: 'device-005',
    user_id: 'user-001',
    platform: 'web',
    device_type: 'mobile',
    browser: 'Safari Mobile 17',
    os_version: 'iOS 17',
    app_version: '1.0.0',
    registered_at: '2023-12-01T00:00:00Z',
    last_seen_at: '2024-01-10T15:00:00Z',
    trust_level: 'revoked',
    is_trusted: false,
    revoked_at: '2024-01-12T00:00:00Z',
    revoked_by: 'user-001',
    revoke_reason: 'Device lost',
  },
];

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getDevicesByUser(userId: string): Device[] {
  return devices.filter(d => d.user_id === userId);
}

export function getTrustedDevices(userId: string): Device[] {
  return devices.filter(d => d.user_id === userId && d.is_trusted);
}

export function getDeviceById(id: string): Device | undefined {
  return devices.find(d => d.id === id);
}

export function getDeviceTypeLabel(type: DeviceType): string {
  const labels: Record<DeviceType, string> = {
    mobile: 'Mobile',
    tablet: 'Tablet',
    desktop: 'Desktop',
  };
  return labels[type];
}

export function getPlatformLabel(platform: DevicePlatform): string {
  const labels: Record<DevicePlatform, string> = {
    web: 'Web Browser',
    android: 'Android',
    ios: 'iOS',
    windows: 'Windows',
    macos: 'macOS',
    linux: 'Linux',
  };
  return labels[platform];
}

export function getTrustLevelColor(trustLevel: DeviceTrustLevel): string {
  const colors: Record<DeviceTrustLevel, string> = {
    trusted: 'var(--success-600)',
    untrusted: 'var(--warning-600)',
    revoked: 'var(--error-600)',
  };
  return colors[trustLevel];
}

export function getDeviceIcon(type: DeviceType): string {
  const icons: Record<DeviceType, string> = {
    mobile: '📱',
    tablet: '📱',
    desktop: '💻',
  };
  return icons[type];
}

export function detectDeviceType(): DeviceType {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/mobile|android|iphone|ipod/.test(userAgent) && width < 768) {
    return 'mobile';
  }
  
  if (/ipad|tablet|playbook/.test(userAgent) || (width >= 768 && width < 1024)) {
    return 'tablet';
  }
  
  return 'desktop';
}

export function detectPlatform(): DevicePlatform {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/windows/.test(userAgent)) return 'windows';
  if (/macintosh|mac os x/.test(userAgent)) return 'macos';
  if (/linux/.test(userAgent)) return 'linux';
  
  return 'web';
}

export function getDeviceCapabilities(): DeviceCapabilities {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      camera: false,
      gps: false,
      qr_scanner: false,
      file_picker: false,
      signature_pad: false,
      voice_to_text: false,
      biometric: false,
      offline_storage: false,
      push_notifications: false,
    };
  }
  
  return {
    camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    gps: 'geolocation' in navigator,
    qr_scanner: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
    file_picker: 'File' in window,
    signature_pad: true, // Canvas-based, always available
    voice_to_text: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
    biometric: 'credentials' in navigator,
    offline_storage: 'serviceWorker' in navigator && 'IndexedDB' in window,
    push_notifications: 'PushManager' in window && 'Notification' in window,
  };
}
