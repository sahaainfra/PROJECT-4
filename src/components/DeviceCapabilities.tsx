import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Check, RefreshCw, MapPin, Wifi, WifiOff, Battery, BatteryLow, Signal } from 'lucide-react';
import { getDeviceCapabilities, detectDeviceType } from '../data/deviceData';
import { requestCameraPermission, requestGPSPosition, isOnline, addConnectivityListeners } from '../core/DeviceService';

// ═══════════════════════════════════════════════════════════
// CAMERA CAPTURE COMPONENT
// ═══════════════════════════════════════════════════════════

interface CameraCaptureProps {
  onCapture: (photos: string[]) => void;
  maxPhotos?: number;
  compress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

export function CameraCapture({ onCapture, maxPhotos = 5, compress = true, maxWidth = 1600, maxHeight = 1600 }: CameraCaptureProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const capabilities = getDeviceCapabilities();

  const startCamera = async () => {
    setError(null);
    setIsCapturing(true);

    try {
      const stream = await requestCameraPermission();
      if (!stream) {
        setError('Camera permission denied or not available');
        setIsCapturing(false);
        return;
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      setError('Failed to start camera');
      setIsCapturing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to video size
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0);

    // Compress if needed
    let photoData = canvas.toDataURL('image/jpeg', compress ? 0.8 : 1.0);

    // Resize if needed
    if (compress && (canvas.width > maxWidth || canvas.height > maxHeight)) {
      const ratio = Math.min(maxWidth / canvas.width, maxHeight / canvas.height);
      const newWidth = canvas.width * ratio;
      const newHeight = canvas.height * ratio;

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      const tempContext = tempCanvas.getContext('2d');

      if (tempContext) {
        tempContext.drawImage(canvas, 0, 0, newWidth, newHeight);
        photoData = tempCanvas.toDataURL('image/jpeg', 0.8);
      }
    }

    setPhotos([...photos, photoData]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleDone = () => {
    stopCamera();
    onCapture(photos);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  if (!capabilities.camera) {
    return (
      <div className="p-4 rounded-lg border" style={{ background: 'var(--warning-50)', borderColor: 'var(--warning-200)' }}>
        <div className="text-sm" style={{ color: 'var(--warning-700)' }}>
          Camera not available on this device
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-subtle)' }}>
              <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
              <button
                onClick={() => removePhoto(index)}
                className="absolute top-1 right-1 p-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Camera View */}
      {isCapturing ? (
        <div className="relative rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border-subtle)' }}>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full"
            style={{ maxHeight: '400px' }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Camera Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-center gap-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <button
              onClick={stopCamera}
              className="p-3 rounded-full"
              style={{ background: 'var(--error-600)', color: '#fff' }}
            >
              <X size={20} />
            </button>
            <button
              onClick={capturePhoto}
              disabled={photos.length >= maxPhotos}
              className="p-4 rounded-full disabled:opacity-50"
              style={{ background: '#fff', color: 'var(--text-primary)' }}
            >
              <Camera size={24} />
            </button>
            <button
              onClick={handleDone}
              disabled={photos.length === 0}
              className="p-3 rounded-full disabled:opacity-50"
              style={{ background: 'var(--success-600)', color: '#fff' }}
            >
              <Check size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={startCamera}
          disabled={photos.length >= maxPhotos}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--brand-600)', color: '#fff' }}
        >
          <Camera size={18} />
          {photos.length >= maxPhotos ? `Maximum ${maxPhotos} photos` : 'Take Photo'}
        </button>
      )}

      {error && (
        <div className="p-3 rounded-lg" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
          {error}
        </div>
      )}

      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
        {photos.length} / {maxPhotos} photos captured
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// GPS CAPTURE COMPONENT
// ═══════════════════════════════════════════════════════════

interface GPSCaptureProps {
  onCapture: (location: { latitude: number; longitude: number; accuracy: number }) => void;
  requiredAccuracy?: number;
}

export function GPSCapture({ onCapture, requiredAccuracy = 100 }: GPSCaptureProps) {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy: number } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const capabilities = getDeviceCapabilities();

  const captureLocation = async () => {
    setError(null);
    setIsCapturing(true);

    try {
      const position = await requestGPSPosition();
      if (!position) {
        setError('GPS permission denied or not available');
        setIsCapturing(false);
        return;
      }

      const loc = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      };

      setLocation(loc);
      setIsCapturing(false);

      if (loc.accuracy > requiredAccuracy) {
        setError(`GPS accuracy (${loc.accuracy.toFixed(0)}m) exceeds required accuracy (${requiredAccuracy}m)`);
      }
    } catch (err) {
      setError('Failed to get GPS location');
      setIsCapturing(false);
    }
  };

  const handleConfirm = () => {
    if (location) {
      onCapture(location);
    }
  };

  if (!capabilities.gps) {
    return (
      <div className="p-4 rounded-lg border" style={{ background: 'var(--warning-50)', borderColor: 'var(--warning-200)' }}>
        <div className="text-sm" style={{ color: 'var(--warning-700)' }}>
          GPS not available on this device
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {location ? (
        <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
          <div className="flex items-start gap-3">
            <MapPin size={20} style={{ color: 'var(--brand-600)' }} />
            <div className="flex-1">
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                Location Captured
              </div>
              <div className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                <div>Latitude: {location.latitude.toFixed(6)}</div>
                <div>Longitude: {location.longitude.toFixed(6)}</div>
                <div>Accuracy: {location.accuracy.toFixed(0)}m</div>
              </div>
              {location.accuracy > requiredAccuracy && (
                <div className="mt-2 text-xs" style={{ color: 'var(--warning-700)' }}>
                  ⚠️ Accuracy exceeds required threshold
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={captureLocation}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <RefreshCw size={12} />
              Recapture
            </button>
            <button
              onClick={handleConfirm}
              disabled={location.accuracy > requiredAccuracy}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors hover:opacity-90 disabled:opacity-50"
              style={{ background: 'var(--success-600)', color: '#fff' }}
            >
              <Check size={12} />
              Confirm
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={captureLocation}
          disabled={isCapturing}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors hover:opacity-90 disabled:opacity-50"
          style={{ background: 'var(--brand-600)', color: '#fff' }}
        >
          {isCapturing ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Capturing...
            </>
          ) : (
            <>
              <MapPin size={18} />
              Capture Location
            </>
          )}
        </button>
      )}

      {error && (
        <div className="p-3 rounded-lg" style={{ background: 'var(--error-50)', color: 'var(--error-700)' }}>
          {error}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONNECTIVITY INDICATOR
// ═══════════════════════════════════════════════════════════

export function ConnectivityIndicator() {
  const [online, setOnline] = useState(isOnline());
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [signalStrength, setSignalStrength] = useState<number | null>(null);

  useEffect(() => {
    const cleanup = addConnectivityListeners(
      () => setOnline(true),
      () => setOnline(false)
    );

    // Get battery level if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      });
    }

    // Get network information if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setSignalStrength(connection.downlink || null);

      connection.addEventListener('change', () => {
        setSignalStrength(connection.downlink || null);
      });
    }

    return cleanup;
  }, []);

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg" style={{ background: 'var(--surface-sunken)' }}>
      {/* Online/Offline Status */}
      <div className="flex items-center gap-1.5">
        {online ? (
          <Wifi size={14} style={{ color: 'var(--success-600)' }} />
        ) : (
          <WifiOff size={14} style={{ color: 'var(--error-600)' }} />
        )}
        <span className="text-xs font-medium" style={{ color: online ? 'var(--success-700)' : 'var(--error-700)' }}>
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Battery Level */}
      {batteryLevel !== null && (
        <div className="flex items-center gap-1">
          {batteryLevel < 20 ? (
            <BatteryLow size={14} style={{ color: 'var(--error-600)' }} />
          ) : (
            <Battery size={14} style={{ color: 'var(--text-muted)' }} />
          )}
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
            {batteryLevel}%
          </span>
        </div>
      )}

      {/* Signal Strength */}
      {signalStrength !== null && (
        <div className="flex items-center gap-1">
          <Signal size={14} style={{ color: 'var(--text-muted)' }} />
          <span className="text-xs tabular-nums" style={{ color: 'var(--text-secondary)' }}>
            {signalStrength.toFixed(1)} Mbps
          </span>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DEVICE INFO COMPONENT
// ═══════════════════════════════════════════════════════════

export function DeviceInfo() {
  const deviceType = detectDeviceType();
  const capabilities = getDeviceCapabilities();

  return (
    <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-bg)' }}>
      <div className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
        Device Information
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Device Type</span>
          <span className="font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
            {deviceType}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Platform</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {navigator.platform}
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span style={{ color: 'var(--text-muted)' }}>Browser</span>
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
            {navigator.userAgent.split(' ')[0]}
          </span>
        </div>
        <div className="pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="text-xs font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
            Capabilities
          </div>
          <div className="grid grid-cols-2 gap-1">
            {Object.entries(capabilities).map(([key, value]) => (
              <div key={key} className="flex items-center gap-1 text-[10px]">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: value ? 'var(--success-600)' : 'var(--text-muted)' }}
                />
                <span style={{ color: 'var(--text-secondary)' }}>
                  {key.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
