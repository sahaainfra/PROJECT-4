import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, AlertCircle, Check, RefreshCw } from 'lucide-react';
import { requestGPSPermission, checkGPSAvailability, getCurrentPosition } from '../core/ResponsiveService';
import { captureConfigs } from '../data/responsiveData';

// ═══════════════════════════════════════════════════════════
// GPS CAPTURE COMPONENT — Part 21
// ═══════════════════════════════════════════════════════════

interface GPSCaptureProps {
  onCapture: (location: {
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  }) => void;
  requiredAccuracy?: number;
  className?: string;
}

export function GPSCapture({
  onCapture,
  requiredAccuracy = captureConfigs.gps.accuracyThreshold,
  className = '',
}: GPSCaptureProps) {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    timestamp: number;
  } | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isMockLocation, setIsMockLocation] = useState(false);

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const available = checkGPSAvailability();
    if (!available) {
      setError('GPS not available on this device');
      setHasPermission(false);
      return;
    }

    const granted = await requestGPSPermission();
    setHasPermission(granted);
    if (!granted) {
      setError('Location permission denied');
    }
  };

  const captureLocation = async () => {
    if (!hasPermission) {
      await checkPermission();
      if (!hasPermission) return;
    }

    setIsCapturing(true);
    setError(null);

    try {
      const position = await getCurrentPosition();
      
      if (!position) {
        setError('Failed to get location');
        setIsCapturing(false);
        return;
      }

      // Check for mock location (basic detection)
      const mockDetected = position.accuracy > 1000 || 
                           (position.latitude === 0 && position.longitude === 0);
      setIsMockLocation(mockDetected);

      if (mockDetected && captureConfigs.gps.detectMockLocation) {
        setError('Mock location detected. Please disable location mocking.');
        setIsCapturing(false);
        return;
      }

      // Check accuracy
      if (position.accuracy > requiredAccuracy) {
        setError(`Location accuracy (${position.accuracy.toFixed(0)}m) exceeds required threshold (${requiredAccuracy}m). Please move to an open area.`);
        setLocation(position);
        setIsCapturing(false);
        return;
      }

      setLocation(position);
      setIsCapturing(false);
      onCapture(position);
    } catch (err) {
      setError('Failed to capture location');
      console.error('GPS error:', err);
      setIsCapturing(false);
    }
  };

  const retakeLocation = () => {
    setLocation(null);
    setError(null);
    setIsMockLocation(false);
  };

  const getAccuracyColor = (accuracy: number): string => {
    if (accuracy <= 10) return 'var(--success-600)';
    if (accuracy <= 50) return 'var(--warning-600)';
    return 'var(--error-600)';
  };

  if (error && !location) {
    return (
      <div className={`p-4 rounded-lg border-2 ${className}`} style={{ borderColor: 'var(--error-200)', background: 'var(--error-50)' }}>
        <div className="flex items-start gap-3">
          <AlertCircle size={20} style={{ color: 'var(--error-600)' }} />
          <div className="flex-1">
            <div className="text-sm font-semibold" style={{ color: 'var(--error-700)' }}>
              Location Error
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--error-600)' }}>
              {error}
            </div>
            <button
              onClick={captureLocation}
              className="mt-3 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-90"
              style={{ background: 'var(--error-600)', color: '#fff' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 overflow-hidden ${className}`} style={{ borderColor: 'var(--border-subtle)', background: 'var(--card-bg)' }}>
      {/* Location Captured */}
      {location && (
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success-50)' }}>
              <Check size={24} style={{ color: 'var(--success-600)' }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Location Captured
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={12} />
                  <span className="tabular-nums">
                    {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                  </span>
                </div>
                {captureConfigs.gps.showAccuracy && (
                  <div className="flex items-center gap-2 text-xs">
                    <Navigation size={12} style={{ color: getAccuracyColor(location.accuracy) }} />
                    <span style={{ color: getAccuracyColor(location.accuracy) }}>
                      Accuracy: ±{location.accuracy.toFixed(0)}m
                    </span>
                  </div>
                )}
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {new Date(location.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg mb-3" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-200)' }}>
              <div className="flex items-start gap-2">
                <AlertCircle size={14} style={{ color: 'var(--warning-700)' }} />
                <div className="text-xs" style={{ color: 'var(--warning-700)' }}>
                  {error}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={retakeLocation}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <RefreshCw size={16} />
            Recapture Location
          </button>
        </div>
      )}

      {/* Capture Button */}
      {!location && (
        <button
          onClick={captureLocation}
          disabled={isCapturing}
          className="w-full p-6 flex flex-col items-center gap-3 hover:bg-[var(--card-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
            {isCapturing ? (
              <RefreshCw size={32} className="animate-spin" style={{ color: 'var(--brand-600)' }} />
            ) : (
              <MapPin size={32} style={{ color: 'var(--brand-600)' }} />
            )}
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            {isCapturing ? 'Capturing Location...' : 'Capture Location'}
          </div>
          <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            {captureConfigs.gps.showAccuracy && `Required accuracy: ±${requiredAccuracy}m`}
          </div>
        </button>
      )}
    </div>
  );
}
