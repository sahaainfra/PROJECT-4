import React, { useState, useEffect } from 'react';
import {
  Smartphone, Tablet, Monitor, Camera, MapPin, QrCode, Wifi, WifiOff,
  CheckCircle, AlertCircle, Info, Download, Bell, Battery, Cpu, HardDrive
} from 'lucide-react';
import {
  DeviceInfo,
  DeviceType,
  getDeviceInfo,
  BREAKPOINTS,
  pwaConfig,
  registeredDevices,
} from '../data/responsiveData';
import {
  getCurrentDevice,
  onDeviceChange,
  isMobile,
  isTablet,
  isDesktop,
  isOnline,
  isOffline,
  getConnectivity,
  checkCameraAvailability,
  checkGPSAvailability,
  checkPushSupport,
  isPWAInstalled,
} from '../core/ResponsiveService';
import { CameraCapture } from '../components/CameraCapture';
import { GPSCapture } from '../components/GPSCapture';
import { QRScanner } from '../components/QRScanner';
import { ConnectivityIndicator, OfflineBanner, ConnectionQuality } from '../components/ConnectivityIndicator';

// ═══════════════════════════════════════════════════════════
// RESPONSIVE SHELL DEMO — Part 21
// Route: /home/rsp
// ═══════════════════════════════════════════════════════════

export function ResponsiveShellDemo() {
  const [device, setDevice] = useState<DeviceInfo>(getCurrentDevice());
  const [cameraAvailable, setCameraAvailable] = useState(false);
  const [gpsAvailable, setGpsAvailable] = useState(false);
  const [pushSupported, setPushSupported] = useState(false);
  const [pwaInstalled, setPwaInstalled] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [capturedLocation, setCapturedLocation] = useState<any>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  useEffect(() => {
    // Initialize device tracking
    const unsubscribe = onDeviceChange((deviceInfo) => {
      setDevice(deviceInfo);
    });

    // Check capabilities
    checkCapabilities();

    // Check PWA installation
    setPwaInstalled(isPWAInstalled());

    return unsubscribe;
  }, []);

  const checkCapabilities = async () => {
    setCameraAvailable(await checkCameraAvailability());
    setGpsAvailable(checkGPSAvailability());
    setPushSupported(checkPushSupport());
  };

  const handlePhotoCapture = (photos: string[]) => {
    setCapturedPhotos(photos);
    console.log('Photos captured:', photos.length);
  };

  const handleLocationCapture = (location: any) => {
    setCapturedLocation(location);
    console.log('Location captured:', location);
  };

  const handleQRScan = (code: string, format: string) => {
    setScannedCode(code);
    console.log('QR scanned:', code, 'Format:', format);
  };

  return (
    <div className="h-full overflow-y-auto" style={{ background: 'var(--shell-bg)' }}>
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Smartphone size={28} style={{ color: 'var(--brand-600)' }} />
            Responsive Shell Demo
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            Mobile + Tablet + Desktop Experience (Part 21)
          </p>
        </div>

        {/* Offline Banner */}
        <OfflineBanner />

        {/* Device Information */}
        <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Monitor size={18} style={{ color: 'var(--brand-600)' }} />
              Device Information
            </h2>
            <ConnectivityIndicator showDetails />
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard
                icon={device.type === 'mobile' ? <Smartphone size={20} /> : 
                      device.type === 'tablet' ? <Tablet size={20} /> : 
                      <Monitor size={20} />}
                label="Device Type"
                value={device.type.charAt(0).toUpperCase() + device.type.slice(1)}
                color="var(--brand-600)"
              />
              <InfoCard
                icon={<Info size={20} />}
                label="Screen Size"
                value={`${device.width}×${device.height}`}
                color="var(--info-600)"
              />
              <InfoCard
                icon={<Cpu size={20} />}
                label="Pixel Ratio"
                value={`${device.pixelRatio}x`}
                color="var(--warning-600)"
              />
              <InfoCard
                icon={<Battery size={20} />}
                label="Orientation"
                value={device.orientation.charAt(0).toUpperCase() + device.orientation.slice(1)}
                color="var(--success-600)"
              />
            </div>

            {/* Capabilities */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
                DEVICE CAPABILITIES
              </div>
              <div className="flex flex-wrap gap-2">
                <CapabilityBadge label="Touch" available={device.touchCapable} />
                <CapabilityBadge label="Camera" available={cameraAvailable} />
                <CapabilityBadge label="GPS" available={gpsAvailable} />
                <CapabilityBadge label="QR Scanner" available={device.qrScannerAvailable} />
                <CapabilityBadge label="Push Notifications" available={pushSupported} />
                <CapabilityBadge label="Offline Capable" available={device.offlineCapable} />
                <CapabilityBadge label="PWA Installed" available={pwaInstalled} />
              </div>
            </div>
          </div>
        </div>

        {/* Connection Quality */}
        <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Wifi size={18} style={{ color: 'var(--brand-600)' }} />
              Connection Quality
            </h2>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                  Current Status: {isOnline() ? 'Online' : 'Offline'}
                </div>
                <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                  Quality: <ConnectionQuality />
                </div>
              </div>
              <ConnectivityIndicator />
            </div>

            {isOffline() && (
              <div className="p-3 rounded-lg" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
                <div className="flex items-start gap-2">
                  <WifiOff size={16} style={{ color: 'var(--warning-700)' }} />
                  <div className="text-xs" style={{ color: 'var(--warning-700)' }}>
                    You are currently offline. Some features may be limited.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Device Capabilities Demo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Camera Capture */}
          <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Camera size={18} style={{ color: 'var(--brand-600)' }} />
                Camera Capture
              </h2>
            </div>
            <div className="p-5">
              <CameraCapture
                onCapture={handlePhotoCapture}
                maxPhotos={5}
                allowMultiple={true}
              />
              {capturedPhotos.length > 0 && (
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>
                      {capturedPhotos.length} photo(s) captured
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* GPS Capture */}
          <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MapPin size={18} style={{ color: 'var(--brand-600)' }} />
                GPS Capture
              </h2>
            </div>
            <div className="p-5">
              <GPSCapture
                onCapture={handleLocationCapture}
                requiredAccuracy={50}
              />
              {capturedLocation && (
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>
                      Location captured: {capturedLocation.latitude.toFixed(4)}, {capturedLocation.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* QR Scanner */}
          <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <QrCode size={18} style={{ color: 'var(--brand-600)' }} />
                QR/Barcode Scanner
              </h2>
            </div>
            <div className="p-5">
              <QRScanner onScan={handleQRScan} />
              {scannedCode && (
                <div className="mt-4 p-3 rounded-lg" style={{ background: 'var(--success-50)', border: '1px solid var(--success-200)' }}>
                  <div className="flex items-center gap-2">
                    <CheckCircle size={16} style={{ color: 'var(--success-600)' }} />
                    <span className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>
                      Code scanned: {scannedCode}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PWA Information */}
          <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
              <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Download size={18} style={{ color: 'var(--brand-600)' }} />
                PWA Information
              </h2>
            </div>
            <div className="p-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>App Name</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{pwaConfig.name}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Display Mode</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{pwaConfig.display}</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Installed</div>
                    <div className="text-sm font-semibold flex items-center gap-1" style={{ color: pwaInstalled ? 'var(--success-600)' : 'var(--text-muted)' }}>
                      {pwaInstalled ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      {pwaInstalled ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
                  <div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Icons</div>
                    <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{pwaConfig.icons.length} sizes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Devices */}
        <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <HardDrive size={18} style={{ color: 'var(--brand-600)' }} />
              Registered Devices
            </h2>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {registeredDevices.map((device) => (
                <div key={device.id} className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
                      {device.platform.includes('Windows') && <Monitor size={20} style={{ color: 'var(--brand-600)' }} />}
                      {device.platform.includes('iOS') && <Smartphone size={20} style={{ color: 'var(--brand-600)' }} />}
                      {device.platform.includes('Android') && <Smartphone size={20} style={{ color: 'var(--brand-600)' }} />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {device.platform}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        v{device.app_version} • Last seen: {new Date(device.last_seen_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {device.is_trusted && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: 'var(--success-50)', color: 'var(--success-700)' }}>
                        Trusted
                      </span>
                    )}
                    {device.push_token && (
                      <Bell size={14} style={{ color: 'var(--brand-600)' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Breakpoints Reference */}
        <div className="rounded-xl border-2 overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <h2 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Info size={18} style={{ color: 'var(--brand-600)' }} />
              Responsive Breakpoints
            </h2>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-lg border-2" style={{ borderColor: device.type === 'mobile' ? 'var(--brand-600)' : 'var(--border-subtle)', background: device.type === 'mobile' ? 'var(--brand-50)' : 'var(--surface-sunken)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone size={16} style={{ color: device.type === 'mobile' ? 'var(--brand-600)' : 'var(--text-muted)' }} />
                  <span className="text-xs font-bold" style={{ color: device.type === 'mobile' ? 'var(--brand-600)' : 'var(--text-muted)' }}>
                    MOBILE
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {BREAKPOINTS.mobile.min}px - {BREAKPOINTS.mobile.max}px
                </div>
              </div>
              <div className="p-4 rounded-lg border-2" style={{ borderColor: device.type === 'tablet' ? 'var(--brand-600)' : 'var(--border-subtle)', background: device.type === 'tablet' ? 'var(--brand-50)' : 'var(--surface-sunken)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Tablet size={16} style={{ color: device.type === 'tablet' ? 'var(--brand-600)' : 'var(--text-muted)' }} />
                  <span className="text-xs font-bold" style={{ color: device.type === 'tablet' ? 'var(--brand-600)' : 'var(--text-muted)' }}>
                    TABLET
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {BREAKPOINTS.tablet.min}px - {BREAKPOINTS.tablet.max}px
                </div>
              </div>
              <div className="p-4 rounded-lg border-2" style={{ borderColor: device.type === 'desktop' ? 'var(--brand-600)' : 'var(--border-subtle)', background: device.type === 'desktop' ? 'var(--brand-50)' : 'var(--surface-sunken)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Monitor size={16} style={{ color: device.type === 'desktop' ? 'var(--brand-600)' : 'var(--text-muted)' }} />
                  <span className="text-xs font-bold" style={{ color: device.type === 'desktop' ? 'var(--brand-600)' : 'var(--text-muted)' }}>
                    DESKTOP
                  </span>
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {BREAKPOINTS.desktop.min}px+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════

function InfoCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: color + '20' }}>
          <div style={{ color }}>{icon}</div>
        </div>
      </div>
      <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
        {value}
      </div>
    </div>
  );
}

function CapabilityBadge({ label, available }: { label: string; available: boolean }) {
  return (
    <div
      className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
      style={{
        background: available ? 'var(--success-50)' : 'var(--surface-sunken)',
        color: available ? 'var(--success-700)' : 'var(--text-muted)',
        border: `1px solid ${available ? 'var(--success-200)' : 'var(--border-subtle)'}`,
      }}
    >
      {available ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
      {label}
    </div>
  );
}
