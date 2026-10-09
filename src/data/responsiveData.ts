// ═══════════════════════════════════════════════════════════
// RESPONSIVE SHELL DATA MODEL — Part 21
// Mobile + Tablet + Desktop Experience
// ═══════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════
// DEVICE TYPES
// ═══════════════════════════════════════════════════════════

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

export interface DeviceInfo {
  type: DeviceType;
  orientation: Orientation;
  width: number;
  height: number;
  pixelRatio: number;
  touchCapable: boolean;
  cameraAvailable: boolean;
  gpsAvailable: boolean;
  qrScannerAvailable: boolean;
  pushEnabled: boolean;
  offlineCapable: boolean;
}

// ═══════════════════════════════════════════════════════════
// BREAKPOINTS
// ═══════════════════════════════════════════════════════════

export const BREAKPOINTS = {
  mobile: { min: 0, max: 767 },
  tablet: { min: 768, max: 1023 },
  desktop: { min: 1024, max: Infinity },
};

export function getDeviceType(width: number): DeviceType {
  if (width < BREAKPOINTS.tablet.min) return 'mobile';
  if (width < BREAKPOINTS.desktop.min) return 'tablet';
  return 'desktop';
}

export function getOrientation(width: number, height: number): Orientation {
  return width >= height ? 'landscape' : 'portrait';
}

// ═══════════════════════════════════════════════════════════
// NAVIGATION CONFIGURATIONS
// ═══════════════════════════════════════════════════════════

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  permission?: string;
}

export interface NavigationConfig {
  mobile: {
    bottomNav: NavItem[];
    moreMenu: NavItem[];
  };
  tablet: {
    rail: NavItem[];
    secondaryPane?: NavItem[];
  };
  desktop: {
    sidebar: NavItem[];
    header: NavItem[];
  };
}

export const defaultNavigationConfig: NavigationConfig = {
  mobile: {
    bottomNav: [
      { id: 'home', label: 'Home', icon: 'Home', route: '/' },
      { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', route: '/tasks' },
      { id: 'approvals', label: 'Approvals', icon: 'CheckCircle', route: '/approvals', badge: 5 },
      { id: 'notifications', label: 'Alerts', icon: 'Bell', route: '/notifications', badge: 12 },
      { id: 'more', label: 'More', icon: 'MoreHorizontal', route: '/more' },
    ],
    moreMenu: [
      { id: 'projects', label: 'Projects', icon: 'Building2', route: '/projects' },
      { id: 'documents', label: 'Documents', icon: 'FileText', route: '/documents' },
      { id: 'reports', label: 'Reports', icon: 'BarChart3', route: '/reports' },
      { id: 'settings', label: 'Settings', icon: 'Settings', route: '/settings' },
    ],
  },
  tablet: {
    rail: [
      { id: 'home', label: 'Home', icon: 'Home', route: '/' },
      { id: 'projects', label: 'Projects', icon: 'Building2', route: '/projects' },
      { id: 'tasks', label: 'Tasks', icon: 'CheckSquare', route: '/tasks' },
      { id: 'approvals', label: 'Approvals', icon: 'CheckCircle', route: '/approvals' },
      { id: 'documents', label: 'Documents', icon: 'FileText', route: '/documents' },
      { id: 'reports', label: 'Reports', icon: 'BarChart3', route: '/reports' },
    ],
  },
  desktop: {
    sidebar: [
      { id: 'home', label: 'Home', icon: 'Home', route: '/' },
      { id: 'dashboard', label: 'Dashboard', icon: 'LayoutDashboard', route: '/dashboard' },
      { id: 'projects', label: 'Projects', icon: 'Building2', route: '/projects' },
      { id: 'procurement', label: 'Procurement', icon: 'ShoppingCart', route: '/procurement' },
      { id: 'inventory', label: 'Inventory', icon: 'Package', route: '/inventory' },
      { id: 'finance', label: 'Finance', icon: 'DollarSign', route: '/finance' },
      { id: 'hr', label: 'HR', icon: 'Users', route: '/hr' },
      { id: 'reports', label: 'Reports', icon: 'BarChart3', route: '/reports' },
    ],
    header: [
      { id: 'search', label: 'Search', icon: 'Search', route: '/search' },
      { id: 'notifications', label: 'Notifications', icon: 'Bell', route: '/notifications', badge: 12 },
      { id: 'profile', label: 'Profile', icon: 'User', route: '/profile' },
    ],
  },
};

// ═══════════════════════════════════════════════════════════
// DEVICE REGISTRATION
// ═══════════════════════════════════════════════════════════

export interface RegisteredDevice {
  id: string;
  user_id: string;
  device_id: string;
  platform: string;
  app_version: string;
  push_token?: string;
  registered_at: string;
  last_seen_at: string;
  is_trusted: boolean;
  revoked_at?: string;
}

export const registeredDevices: RegisteredDevice[] = [
  {
    id: 'dev-001',
    user_id: 'user-001',
    device_id: 'device-001',
    platform: 'Windows Chrome',
    app_version: '1.0.0',
    registered_at: '2024-01-01T00:00:00Z',
    last_seen_at: '2024-01-16T12:00:00Z',
    is_trusted: true,
  },
  {
    id: 'dev-002',
    user_id: 'user-001',
    device_id: 'device-002',
    platform: 'iOS Safari',
    app_version: '1.0.0',
    push_token: 'ios-push-token-123',
    registered_at: '2024-01-05T00:00:00Z',
    last_seen_at: '2024-01-16T10:00:00Z',
    is_trusted: true,
  },
  {
    id: 'dev-003',
    user_id: 'user-001',
    device_id: 'device-003',
    platform: 'Android Chrome',
    app_version: '1.0.0',
    push_token: 'android-push-token-456',
    registered_at: '2024-01-10T00:00:00Z',
    last_seen_at: '2024-01-16T11:00:00Z',
    is_trusted: false,
  },
];

// ═══════════════════════════════════════════════════════════
// PWA CONFIGURATION
// ═══════════════════════════════════════════════════════════

export interface PWAConfig {
  name: string;
  short_name: string;
  description: string;
  start_url: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  theme_color: string;
  background_color: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose?: string;
  }>;
}

export const pwaConfig: PWAConfig = {
  name: 'Construction ERP',
  short_name: 'ConstrERP',
  description: 'Integrated Construction ERP System',
  start_url: '/',
  display: 'standalone',
  orientation: 'any',
  theme_color: '#1D4F91',
  background_color: '#F8FAFC',
  icons: [
    {
      src: '/icons/icon-72x72.png',
      sizes: '72x72',
      type: 'image/png',
    },
    {
      src: '/icons/icon-96x96.png',
      sizes: '96x96',
      type: 'image/png',
    },
    {
      src: '/icons/icon-128x128.png',
      sizes: '128x128',
      type: 'image/png',
    },
    {
      src: '/icons/icon-144x144.png',
      sizes: '144x144',
      type: 'image/png',
    },
    {
      src: '/icons/icon-152x152.png',
      sizes: '152x152',
      type: 'image/png',
    },
    {
      src: '/icons/icon-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable',
    },
    {
      src: '/icons/icon-384x384.png',
      sizes: '384x384',
      type: 'image/png',
    },
    {
      src: '/icons/icon-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable',
    },
  ],
};

// ═══════════════════════════════════════════════════════════
// CAPTURE COMPONENTS CONFIG
// ═══════════════════════════════════════════════════════════

export interface CameraConfig {
  maxPhotos: number;
  compressionQuality: number;
  maxDimension: number;
  allowAnnotation: boolean;
}

export interface GPSConfig {
  accuracyThreshold: number;
  showAccuracy: boolean;
  detectMockLocation: boolean;
}

export interface QRScannerConfig {
  supportedFormats: string[];
  showViewfinder: boolean;
  autoZoom: boolean;
}

export const captureConfigs = {
  camera: {
    maxPhotos: 10,
    compressionQuality: 0.8,
    maxDimension: 1600,
    allowAnnotation: true,
  } as CameraConfig,
  gps: {
    accuracyThreshold: 50,
    showAccuracy: true,
    detectMockLocation: true,
  } as GPSConfig,
  qrScanner: {
    supportedFormats: ['QR_CODE', 'DATA_MATRIX', 'PDF_417', 'AZTEC', 'CODABAR', 'CODE_39', 'CODE_93', 'CODE_128', 'EAN_8', 'EAN_13', 'ITF', 'UPC_A', 'UPC_E'],
    showViewfinder: true,
    autoZoom: true,
  } as QRScannerConfig,
};

// ═══════════════════════════════════════════════════════════
// CONNECTIVITY STATUS
// ═══════════════════════════════════════════════════════════

export type ConnectionStatus = 'online' | 'offline' | 'slow' | 'unstable';

export interface ConnectivityInfo {
  status: ConnectionStatus;
  type: 'wifi' | 'cellular' | 'ethernet' | 'unknown';
  downlink?: number;
  rtt?: number;
  saveData: boolean;
}

// ═══════════════════════════════════════════════════════════
// RESPONSIVE LAYOUT CONFIG
// ═══════════════════════════════════════════════════════════

export interface LayoutConfig {
  columns: number;
  gap: string;
  padding: string;
  maxContentWidth?: string;
}

export const layoutConfigs: Record<DeviceType, LayoutConfig> = {
  mobile: {
    columns: 1,
    gap: '16px',
    padding: '16px',
  },
  tablet: {
    columns: 2,
    gap: '20px',
    padding: '20px',
  },
  desktop: {
    columns: 3,
    gap: '24px',
    padding: '24px',
    maxContentWidth: '1600px',
  },
};

// ═══════════════════════════════════════════════════════════
// TOUCH TARGET SIZES
// ═══════════════════════════════════════════════════════════

export const TOUCH_TARGETS = {
  minimum: 44, // WCAG 2.1 AA minimum
  comfortable: 48,
  large: 56,
};

// ═══════════════════════════════════════════════════════════
// PERFORMANCE BUDGETS
// ═══════════════════════════════════════════════════════════

export interface PerformanceBudget {
  firstLoad: number; // ms
  routeChange: number; // ms
  apiResponse: number; // ms
  bundleSize: number; // KB
}

export const performanceBudgets: Record<DeviceType, PerformanceBudget> = {
  mobile: {
    firstLoad: 3000,
    routeChange: 500,
    apiResponse: 1000,
    bundleSize: 500,
  },
  tablet: {
    firstLoad: 2500,
    routeChange: 400,
    apiResponse: 800,
    bundleSize: 800,
  },
  desktop: {
    firstLoad: 2000,
    routeChange: 300,
    apiResponse: 500,
    bundleSize: 1500,
  },
};

// ═══════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════

export function getDeviceByDeviceId(deviceId: string): RegisteredDevice | undefined {
  return registeredDevices.find(d => d.device_id === deviceId);
}

export function getDevicesByUser(userId: string): RegisteredDevice[] {
  return registeredDevices.filter(d => d.user_id === userId);
}

export function getTrustedDevices(userId: string): RegisteredDevice[] {
  return registeredDevices.filter(d => d.user_id === userId && d.is_trusted);
}

export function getNavigationForDevice(device: DeviceType): NavItem[] {
  switch (device) {
    case 'mobile':
      return defaultNavigationConfig.mobile.bottomNav;
    case 'tablet':
      return defaultNavigationConfig.tablet.rail;
    case 'desktop':
      return defaultNavigationConfig.desktop.sidebar;
    default:
      return [];
  }
}

export function getLayoutForDevice(device: DeviceType): LayoutConfig {
  return layoutConfigs[device];
}

export function getPerformanceBudget(device: DeviceType): PerformanceBudget {
  return performanceBudgets[device];
}

export function isTouchDevice(): boolean {
  return typeof window !== 'undefined' && (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0
  );
}

export function getConnectionStatus(): ConnectionStatus {
  if (typeof navigator === 'undefined') return 'online';
  
  if (!navigator.onLine) return 'offline';
  
  const connection = (navigator as any).connection;
  if (!connection) return 'online';
  
  if (connection.saveData) return 'slow';
  if (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g') return 'slow';
  if (connection.rtt > 200) return 'unstable';
  
  return 'online';
}

export function getDeviceInfo(): DeviceInfo {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const height = typeof window !== 'undefined' ? window.innerHeight : 768;
  
  return {
    type: getDeviceType(width),
    orientation: getOrientation(width, height),
    width,
    height,
    pixelRatio: typeof window !== 'undefined' ? window.devicePixelRatio : 1,
    touchCapable: isTouchDevice(),
    cameraAvailable: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
    gpsAvailable: typeof navigator !== 'undefined' && 'geolocation' in navigator,
    qrScannerAvailable: typeof navigator !== 'undefined' && 'mediaDevices' in navigator,
    pushEnabled: typeof window !== 'undefined' && 'PushManager' in window,
    offlineCapable: typeof window !== 'undefined' && 'serviceWorker' in navigator,
  };
}
