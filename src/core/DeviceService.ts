// ═══════════════════════════════════════════════════════════
// DEVICE SERVICE — Part 21
// Mobile + Tablet + Desktop Experience
// ═══════════════════════════════════════════════════════════

import {
  Device,
  DeviceRegistration,
  DeviceCapabilities,
  devices,
  getDevicesByUser,
  getDeviceById,
  detectDeviceType,
  detectPlatform,
  getDeviceCapabilities,
} from '../data/deviceData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// DEVICE REGISTRATION
// ═══════════════════════════════════════════════════════════

/**
 * Register a new device for a user
 */
export function registerDevice(userId: string, registration: DeviceRegistration): Device {
  const correlation = getCurrentCorrelation();

  const device: Device = {
    id: `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    user_id: userId,
    platform: registration.platform,
    device_type: registration.device_type,
    browser: registration.browser,
    os_version: registration.os_version,
    app_version: registration.app_version,
    push_token: registration.push_token,
    registered_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    trust_level: 'untrusted',
    is_trusted: false,
  };

  devices.push(device);

  // Audit log
  writeAuditEntry({
    userId,
    userName: 'Device Registration',
    userEmail: '',
    action: 'CREATE',
    entityType: 'Device',
    entityId: device.id,
    entityName: `Registered ${registration.device_type} device`,
    after: device,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'device.registered',
    company_id: 'company-001',
    actor_id: userId,
    payload: {
      device_id: device.id,
      device_type: device.device_type,
      platform: device.platform,
    },
  });

  return device;
}

/**
 * Auto-register current device if not already registered
 */
export function autoRegisterCurrentDevice(userId: string): Device | null {
  const deviceType = detectDeviceType();
  const platform = detectPlatform();
  
  // Check if device already exists
  const userDevices = getDevicesByUser(userId);
  const existingDevice = userDevices.find(d => 
    d.device_type === deviceType && 
    d.platform === platform &&
    d.browser === navigator.userAgent.split(' ')[0]
  );

  if (existingDevice) {
    // Update last seen
    existingDevice.last_seen_at = new Date().toISOString();
    return existingDevice;
  }

  // Register new device
  const capabilities = getDeviceCapabilities();
  
  return registerDevice(userId, {
    platform,
    device_type: deviceType,
    browser: navigator.userAgent.split(' ')[0],
    os_version: navigator.platform,
    app_version: '1.0.0',
    push_token: capabilities.push_notifications ? 'pending' : undefined,
  });
}

/**
 * Update device last seen timestamp
 */
export function updateDeviceLastSeen(deviceId: string): void {
  const device = getDeviceById(deviceId);
  if (device) {
    device.last_seen_at = new Date().toISOString();
  }
}

// ═══════════════════════════════════════════════════════════
// DEVICE TRUST MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Trust a device
 */
export function trustDevice(deviceId: string, trustedBy: string): Device {
  const correlation = getCurrentCorrelation();

  const device = getDeviceById(deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  const before = { ...device };
  device.trust_level = 'trusted';
  device.is_trusted = true;

  // Audit log
  writeAuditEntry({
    userId: trustedBy,
    userName: 'Device Trust',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'Device',
    entityId: device.id,
    entityName: `Trusted device: ${device.device_type}`,
    before,
    after: device,
    correlationId: correlation?.correlation_id || '',
  });

  return device;
}

/**
 * Revoke device trust
 */
export function revokeDevice(deviceId: string, revokedBy: string, reason: string): Device {
  const correlation = getCurrentCorrelation();

  const device = getDeviceById(deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  const before = { ...device };
  device.trust_level = 'revoked';
  device.is_trusted = false;
  device.revoked_at = new Date().toISOString();
  device.revoked_by = revokedBy;
  device.revoke_reason = reason;

  // Audit log
  writeAuditEntry({
    userId: revokedBy,
    userName: 'Device Revocation',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'Device',
    entityId: device.id,
    entityName: `Revoked device: ${device.device_type}`,
    before,
    after: device,
    correlationId: correlation?.correlation_id || '',
  });

  // Publish event
  publishEvent({
    event_type: 'device.revoked',
    company_id: 'company-001',
    actor_id: revokedBy,
    payload: {
      device_id: device.id,
      reason,
    },
  });

  return device;
}

// ═══════════════════════════════════════════════════════════
// PUSH NOTIFICATION MANAGEMENT
// ═══════════════════════════════════════════════════════════

/**
 * Update device push token
 */
export function updatePushToken(deviceId: string, pushToken: string): void {
  const device = getDeviceById(deviceId);
  if (device) {
    device.push_token = pushToken;
  }
}

/**
 * Request push notification permission
 */
export async function requestPushPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Push notifications not supported');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Failed to request push permission:', error);
    return false;
  }
}

/**
 * Subscribe to push notifications
 */
export async function subscribeToPush(): Promise<string | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'YOUR_VAPID_PUBLIC_KEY', // Replace with actual VAPID key
    });

    return JSON.stringify(subscription);
  } catch (error) {
    console.error('Failed to subscribe to push:', error);
    return null;
  }
}

// ═══════════════════════════════════════════════════════════
// DEVICE CAPABILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Check if device has specific capability
 */
export function hasCapability(capability: keyof DeviceCapabilities): boolean {
  const capabilities = getDeviceCapabilities();
  return capabilities[capability];
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<MediaStream | null> {
  if (!hasCapability('camera')) {
    console.warn('Camera not available');
    return null;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
    return stream;
  } catch (error) {
    console.error('Failed to get camera permission:', error);
    return null;
  }
}

/**
 * Request GPS permission and get current location
 */
export async function requestGPSPosition(): Promise<GeolocationPosition | null> {
  if (!hasCapability('gps')) {
    console.warn('GPS not available');
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => {
        console.error('Failed to get GPS position:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
}

/**
 * Request file picker
 */
export function openFilePicker(accept?: string, multiple: boolean = false): Promise<FileList | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept || '*/*';
    input.multiple = multiple;

    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      resolve(target.files);
    };

    input.click();
  });
}

// ═══════════════════════════════════════════════════════════
// OFFLINE DETECTION
// ═══════════════════════════════════════════════════════════

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine;
}

/**
 * Add online/offline event listeners
 */
export function addConnectivityListeners(
  onOnline: () => void,
  onOffline: () => void
): () => void {
  if (typeof window === 'undefined') return () => {};

  window.addEventListener('online', onOnline);
  window.addEventListener('offline', onOffline);

  return () => {
    window.removeEventListener('online', onOnline);
    window.removeEventListener('offline', onOffline);
  };
}

// ═══════════════════════════════════════════════════════════
// PWA INSTALLATION
// ═══════════════════════════════════════════════════════════

let deferredPrompt: any = null;

/**
 * Listen for PWA install prompt
 */
export function listenForInstallPrompt(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
}

/**
 * Show PWA install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (!deferredPrompt) {
    console.warn('Install prompt not available');
    return false;
  }

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;

  return outcome === 'accepted';
}

/**
 * Check if app is installed
 */
export function isAppInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches;
}

// ═══════════════════════════════════════════════════════════
// DEVICE STATISTICS
// ═══════════════════════════════════════════════════════════

export interface DeviceStats {
  total_devices: number;
  trusted_devices: number;
  untrusted_devices: number;
  revoked_devices: number;
  by_type: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  by_platform: {
    web: number;
    android: number;
    ios: number;
    windows: number;
    macos: number;
    linux: number;
  };
}

/**
 * Get device statistics
 */
export function getDeviceStats(): DeviceStats {
  const stats: DeviceStats = {
    total_devices: devices.length,
    trusted_devices: devices.filter(d => d.trust_level === 'trusted').length,
    untrusted_devices: devices.filter(d => d.trust_level === 'untrusted').length,
    revoked_devices: devices.filter(d => d.trust_level === 'revoked').length,
    by_type: {
      mobile: devices.filter(d => d.device_type === 'mobile').length,
      tablet: devices.filter(d => d.device_type === 'tablet').length,
      desktop: devices.filter(d => d.device_type === 'desktop').length,
    },
    by_platform: {
      web: devices.filter(d => d.platform === 'web').length,
      android: devices.filter(d => d.platform === 'android').length,
      ios: devices.filter(d => d.platform === 'ios').length,
      windows: devices.filter(d => d.platform === 'windows').length,
      macos: devices.filter(d => d.platform === 'macos').length,
      linux: devices.filter(d => d.platform === 'linux').length,
    },
  };

  return stats;
}
