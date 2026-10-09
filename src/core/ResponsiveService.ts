// ═══════════════════════════════════════════════════════════
// RESPONSIVE SHELL SERVICE — Part 21
// Mobile + Tablet + Desktop Experience
// ═══════════════════════════════════════════════════════════

import {
  DeviceInfo,
  DeviceType,
  RegisteredDevice,
  ConnectivityInfo,
  ConnectionStatus,
  registeredDevices,
  getDeviceInfo,
  getDeviceType,
  getOrientation,
  getConnectionStatus,
  BREAKPOINTS,
} from '../data/responsiveData';
import { getCurrentCorrelation } from './ObservabilityService';
import { writeAuditEntry } from './AuditService';
import { publishEvent } from './EventBusService';

// ═══════════════════════════════════════════════════════════
// DEVICE DETECTION & TRACKING
// ═══════════════════════════════════════════════════════════

let currentDeviceInfo: DeviceInfo | null = null;
let deviceChangeListeners: Array<(device: DeviceInfo) => void> = [];

/**
 * Initialize device detection and tracking
 */
export function initializeDeviceTracking(): DeviceInfo {
  currentDeviceInfo = getDeviceInfo();
  
  // Listen for window resize
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
  }
  
  return currentDeviceInfo;
}

/**
 * Handle window resize
 */
function handleResize(): void {
  if (!currentDeviceInfo) return;
  
  const newType = getDeviceType(window.innerWidth);
  const newOrientation = getOrientation(window.innerWidth, window.innerHeight);
  
  if (newType !== currentDeviceInfo.type || newOrientation !== currentDeviceInfo.orientation) {
    currentDeviceInfo = {
      ...currentDeviceInfo,
      type: newType,
      orientation: newOrientation,
      width: window.innerWidth,
      height: window.innerHeight,
    };
    
    notifyDeviceChange();
  }
}

/**
 * Handle orientation change
 */
function handleOrientationChange(): void {
  setTimeout(handleResize, 100); // Delay to allow layout to settle
}

/**
 * Notify listeners of device change
 */
function notifyDeviceChange(): void {
  if (!currentDeviceInfo) return;
  
  deviceChangeListeners.forEach(listener => {
    try {
      listener(currentDeviceInfo!);
    } catch (error) {
      console.error('Error in device change listener:', error);
    }
  });
}

/**
 * Subscribe to device changes
 */
export function onDeviceChange(listener: (device: DeviceInfo) => void): () => void {
  deviceChangeListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    deviceChangeListeners = deviceChangeListeners.filter(l => l !== listener);
  };
}

/**
 * Get current device info
 */
export function getCurrentDevice(): DeviceInfo {
  if (!currentDeviceInfo) {
    return initializeDeviceTracking();
  }
  return currentDeviceInfo;
}

/**
 * Check if current device matches type
 */
export function isDeviceType(type: DeviceType): boolean {
  return getCurrentDevice().type === type;
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return isDeviceType('mobile');
}

/**
 * Check if device is tablet
 */
export function isTablet(): boolean {
  return isDeviceType('tablet');
}

/**
 * Check if device is desktop
 */
export function isDesktop(): boolean {
  return isDeviceType('desktop');
}

// ═══════════════════════════════════════════════════════════
// DEVICE REGISTRATION
// ═══════════════════════════════════════════════════════════

export interface RegisterDeviceInput {
  user_id: string;
  device_id: string;
  platform: string;
  app_version: string;
  push_token?: string;
}

/**
 * Register a new device
 */
export function registerDevice(input: RegisterDeviceInput): RegisteredDevice {
  const correlation = getCurrentCorrelation();
  
  // Check if device already exists
  const existing = registeredDevices.find(d => d.device_id === input.device_id);
  if (existing) {
    // Update existing device
    existing.last_seen_at = new Date().toISOString();
    existing.app_version = input.app_version;
    if (input.push_token) {
      existing.push_token = input.push_token;
    }
    
    // Audit log
    writeAuditEntry({
      userId: input.user_id,
      userName: 'Device Registration',
      userEmail: '',
      action: 'UPDATE',
      entityType: 'RegisteredDevice',
      entityId: existing.id,
      entityName: `Updated device: ${existing.device_id}`,
      before: { last_seen_at: existing.last_seen_at },
      after: { last_seen_at: existing.last_seen_at, app_version: input.app_version },
      correlationId: correlation?.correlation_id || '',
    });
    
    return existing;
  }
  
  // Create new device
  const device: RegisteredDevice = {
    id: `dev-${Date.now()}`,
    user_id: input.user_id,
    device_id: input.device_id,
    platform: input.platform,
    app_version: input.app_version,
    push_token: input.push_token,
    registered_at: new Date().toISOString(),
    last_seen_at: new Date().toISOString(),
    is_trusted: false,
  };
  
  registeredDevices.push(device);
  
  // Audit log
  writeAuditEntry({
    userId: input.user_id,
    userName: 'Device Registration',
    userEmail: '',
    action: 'CREATE',
    entityType: 'RegisteredDevice',
    entityId: device.id,
    entityName: `Registered device: ${device.device_id}`,
    after: device,
    correlationId: correlation?.correlation_id || '',
  });
  
  // Publish event
  publishEvent({
    event_type: 'device.registered',
    company_id: 'company-001',
    actor_id: input.user_id,
    payload: {
      device_id: device.id,
      platform: device.platform,
    },
  });
  
  return device;
}

/**
 * Revoke a device
 */
export function revokeDevice(deviceId: string, revokedBy: string, reason: string): RegisteredDevice {
  const correlation = getCurrentCorrelation();
  
  const device = registeredDevices.find(d => d.id === deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }
  
  const before = { ...device };
  device.revoked_at = new Date().toISOString();
  device.is_trusted = false;
  
  // Audit log
  writeAuditEntry({
    userId: revokedBy,
    userName: 'Device Revocation',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'RegisteredDevice',
    entityId: device.id,
    entityName: `Revoked device: ${device.device_id}`,
    before,
    after: device,
    reason,
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

/**
 * Trust a device
 */
export function trustDevice(deviceId: string, trustedBy: string): RegisteredDevice {
  const correlation = getCurrentCorrelation();
  
  const device = registeredDevices.find(d => d.id === deviceId);
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }
  
  const before = { ...device };
  device.is_trusted = true;
  
  // Audit log
  writeAuditEntry({
    userId: trustedBy,
    userName: 'Device Trust',
    userEmail: '',
    action: 'UPDATE',
    entityType: 'RegisteredDevice',
    entityId: device.id,
    entityName: `Trusted device: ${device.device_id}`,
    before,
    after: device,
    correlationId: correlation?.correlation_id || '',
  });
  
  return device;
}

// ═══════════════════════════════════════════════════════════
// CONNECTIVITY MONITORING
// ═══════════════════════════════════════════════════════════

let connectivityListeners: Array<(status: ConnectivityInfo) => void> = [];
let currentConnectivity: ConnectivityInfo | null = null;

/**
 * Initialize connectivity monitoring
 */
export function initializeConnectivityMonitoring(): ConnectivityInfo {
  currentConnectivity = {
    status: getConnectionStatus(),
    type: 'unknown',
    saveData: false,
  };
  
  if (typeof window !== 'undefined') {
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
      updateConnectivityInfo();
    }
  }
  
  return currentConnectivity;
}

/**
 * Handle online event
 */
function handleOnline(): void {
  updateConnectivityInfo();
  notifyConnectivityChange();
}

/**
 * Handle offline event
 */
function handleOffline(): void {
  updateConnectivityInfo();
  notifyConnectivityChange();
}

/**
 * Handle connection change
 */
function handleConnectionChange(): void {
  updateConnectivityInfo();
  notifyConnectivityChange();
}

/**
 * Update connectivity info
 */
function updateConnectivityInfo(): void {
  if (typeof navigator === 'undefined') return;
  
  const connection = (navigator as any).connection;
  
  currentConnectivity = {
    status: getConnectionStatus(),
    type: connection?.type || 'unknown',
    downlink: connection?.downlink,
    rtt: connection?.rtt,
    saveData: connection?.saveData || false,
  };
}

/**
 * Notify connectivity listeners
 */
function notifyConnectivityChange(): void {
  if (!currentConnectivity) return;
  
  connectivityListeners.forEach(listener => {
    try {
      listener(currentConnectivity!);
    } catch (error) {
      console.error('Error in connectivity listener:', error);
    }
  });
}

/**
 * Subscribe to connectivity changes
 */
export function onConnectivityChange(listener: (status: ConnectivityInfo) => void): () => void {
  connectivityListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    connectivityListeners = connectivityListeners.filter(l => l !== listener);
  };
}

/**
 * Get current connectivity status
 */
export function getConnectivity(): ConnectivityInfo {
  if (!currentConnectivity) {
    return initializeConnectivityMonitoring();
  }
  return currentConnectivity;
}

/**
 * Check if online
 */
export function isOnline(): boolean {
  return getConnectivity().status === 'online';
}

/**
 * Check if offline
 */
export function isOffline(): boolean {
  return getConnectivity().status === 'offline';
}

// ═══════════════════════════════════════════════════════════
// DEVICE CAPABILITIES
// ═══════════════════════════════════════════════════════════

/**
 * Check camera availability
 */
export async function checkCameraAvailability(): Promise<boolean> {
  try {
    if (typeof navigator === 'undefined' || !('mediaDevices' in navigator)) {
      return false;
    }
    
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error checking camera availability:', error);
    return false;
  }
}

/**
 * Check GPS availability
 */
export function checkGPSAvailability(): boolean {
  return typeof navigator !== 'undefined' && 'geolocation' in navigator;
}

/**
 * Check QR scanner availability
 */
export async function checkQRScannerAvailability(): Promise<boolean> {
  return await checkCameraAvailability();
}

/**
 * Check push notification support
 */
export function checkPushSupport(): boolean {
  return typeof window !== 'undefined' && 'PushManager' in window && 'serviceWorker' in navigator;
}

/**
 * Request camera permission
 */
export async function requestCameraPermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    stream.getTracks().forEach(track => track.stop());
    return true;
  } catch (error) {
    console.error('Camera permission denied:', error);
    return false;
  }
}

/**
 * Request GPS permission
 */
export async function requestGPSPermission(): Promise<boolean> {
  return new Promise((resolve) => {
    if (!checkGPSAvailability()) {
      resolve(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 5000 }
    );
  });
}

/**
 * Get current GPS position
 */
export async function getCurrentPosition(): Promise<{
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
} | null> {
  return new Promise((resolve) => {
    if (!checkGPSAvailability()) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        });
      },
      (error) => {
        console.error('GPS error:', error);
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

// ═══════════════════════════════════════════════════════════
// PWA SUPPORT
// ═══════════════════════════════════════════════════════════

/**
 * Check if app is installed as PWA
 */
export function isPWAInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

/**
 * Show install prompt
 */
export async function showInstallPrompt(): Promise<boolean> {
  if (typeof window === 'undefined') return false;
  
  const beforeInstallEvent = await new Promise<any>((resolve) => {
    window.addEventListener('beforeinstallprompt', resolve, { once: true });
  });
  
  if (beforeInstallEvent) {
    beforeInstallEvent.prompt();
    const { outcome } = await beforeInstallEvent.userChoice;
    return outcome === 'accepted';
  }
  
  return false;
}

/**
 * Register service worker
 */
export async function registerServiceWorker(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration);
    return true;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════
// RESPONSIVE LAYOUT HELPERS
// ═══════════════════════════════════════════════════════════

/**
 * Get responsive grid columns
 */
export function getGridColumns(device?: DeviceType): number {
  const currentDevice = device || getCurrentDevice().type;
  
  switch (currentDevice) {
    case 'mobile':
      return 1;
    case 'tablet':
      return 2;
    case 'desktop':
      return 3;
    default:
      return 1;
  }
}

/**
 * Get responsive spacing
 */
export function getResponsiveSpacing(device?: DeviceType): string {
  const currentDevice = device || getCurrentDevice().type;
  
  switch (currentDevice) {
    case 'mobile':
      return '16px';
    case 'tablet':
      return '20px';
    case 'desktop':
      return '24px';
    default:
      return '16px';
  }
}

/**
 * Get responsive font size
 */
export function getResponsiveFontSize(baseSize: number, device?: DeviceType): string {
  const currentDevice = device || getCurrentDevice().type;
  
  switch (currentDevice) {
    case 'mobile':
      return `${baseSize}px`;
    case 'tablet':
      return `${baseSize * 1.1}px`;
    case 'desktop':
      return `${baseSize * 1.2}px`;
    default:
      return `${baseSize}px`;
  }
}

/**
 * Check if should show compact view
 */
export function shouldShowCompactView(): boolean {
  const device = getCurrentDevice();
  return device.type === 'mobile' && device.width < 480;
}

/**
 * Check if should show expanded view
 */
export function shouldShowExpandedView(): boolean {
  const device = getCurrentDevice();
  return device.type === 'desktop' && device.width >= 1440;
}

// ═══════════════════════════════════════════════════════════
// PERFORMANCE MONITORING
// ═══════════════════════════════════════════════════════════

/**
 * Measure performance
 */
export function measurePerformance(label: string): () => void {
  const start = performance.now();
  
  return () => {
    const end = performance.now();
    const duration = end - start;
    
    console.log(`[PERF] ${label}: ${duration.toFixed(2)}ms`);
    
    // In production, send to analytics
    if (duration > 1000) {
      console.warn(`[PERF] Slow operation: ${label} took ${duration.toFixed(2)}ms`);
    }
  };
}

/**
 * Check if performance is within budget
 */
export function isWithinBudget(metric: string, value: number, device?: DeviceType): boolean {
  const currentDevice = device || getCurrentDevice().type;
  
  const budgets: Record<string, Record<DeviceType, number>> = {
    firstLoad: { mobile: 3000, tablet: 2500, desktop: 2000 },
    routeChange: { mobile: 500, tablet: 400, desktop: 300 },
    apiResponse: { mobile: 1000, tablet: 800, desktop: 500 },
  };
  
  const budget = budgets[metric]?.[currentDevice];
  if (!budget) return true;
  
  return value <= budget;
}

// ═══════════════════════════════════════════════════════════
// CLEANUP
// ═══════════════════════════════════════════════════════════

/**
 * Cleanup listeners
 */
export function cleanupResponsiveService(): void {
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('orientationchange', handleOrientationChange);
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  }
  
  deviceChangeListeners = [];
  connectivityListeners = [];
}
