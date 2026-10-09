import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal, AlertCircle } from 'lucide-react';
import { getConnectivity, onConnectivityChange, isOnline, isOffline } from '../core/ResponsiveService';
import { ConnectivityInfo } from '../data/responsiveData';

// ═══════════════════════════════════════════════════════════
// CONNECTIVITY INDICATOR COMPONENT — Part 21
// ═══════════════════════════════════════════════════════════

interface ConnectivityIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function ConnectivityIndicator({
  showDetails = false,
  className = '',
}: ConnectivityIndicatorProps) {
  const [connectivity, setConnectivity] = useState<ConnectivityInfo>(getConnectivity());

  useEffect(() => {
    const unsubscribe = onConnectivityChange((status) => {
      setConnectivity(status);
    });

    return unsubscribe;
  }, []);

  const getStatusColor = (): string => {
    switch (connectivity.status) {
      case 'online':
        return 'var(--success-600)';
      case 'offline':
        return 'var(--error-600)';
      case 'slow':
        return 'var(--warning-600)';
      case 'unstable':
        return 'var(--warning-600)';
      default:
        return 'var(--text-muted)';
    }
  };

  const getStatusIcon = () => {
    switch (connectivity.status) {
      case 'online':
        return <Wifi size={16} />;
      case 'offline':
        return <WifiOff size={16} />;
      case 'slow':
      case 'unstable':
        return <Signal size={16} />;
      default:
        return <Wifi size={16} />;
    }
  };

  const getStatusText = (): string => {
    switch (connectivity.status) {
      case 'online':
        return 'Online';
      case 'offline':
        return 'Offline';
      case 'slow':
        return 'Slow Connection';
      case 'unstable':
        return 'Unstable';
      default:
        return 'Unknown';
    }
  };

  const getConnectionType = (): string => {
    switch (connectivity.type) {
      case 'wifi':
        return 'Wi-Fi';
      case 'cellular':
        return 'Cellular';
      case 'ethernet':
        return 'Ethernet';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {/* Status Badge */}
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium"
        style={{
          background: getStatusColor() + '20',
          color: getStatusColor(),
        }}
      >
        {getStatusIcon()}
        <span>{getStatusText()}</span>
      </div>

      {/* Details (optional) */}
      {showDetails && connectivity.status !== 'offline' && (
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
          <span>{getConnectionType()}</span>
          {connectivity.downlink && (
            <span className="ml-2">↓{connectivity.downlink.toFixed(1)} Mbps</span>
          )}
          {connectivity.rtt && (
            <span className="ml-2">{connectivity.rtt}ms</span>
          )}
          {connectivity.saveData && (
            <span className="ml-2 px-1.5 py-0.5 rounded" style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}>
              Data Saver
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// OFFLINE BANNER COMPONENT — Part 21
// ═══════════════════════════════════════════════════════════

interface OfflineBannerProps {
  className?: string;
}

export function OfflineBanner({ className = '' }: OfflineBannerProps) {
  const [isOfflineNow, setIsOfflineNow] = useState(isOffline());

  useEffect(() => {
    const unsubscribe = onConnectivityChange((status) => {
      setIsOfflineNow(status.status === 'offline');
    });

    return unsubscribe;
  }, []);

  if (!isOfflineNow) return null;

  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg border-2 ${className}`}
      style={{
        background: 'var(--warning-50)',
        borderColor: 'var(--warning-200)',
      }}
    >
      <WifiOff size={20} style={{ color: 'var(--warning-700)' }} />
      <div className="flex-1">
        <div className="text-sm font-semibold" style={{ color: 'var(--warning-800)' }}>
          You're Offline
        </div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--warning-700)' }}>
          Some features may be unavailable. Changes will be saved locally and synced when you're back online.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// CONNECTION QUALITY INDICATOR — Part 21
// ═══════════════════════════════════════════════════════════

interface ConnectionQualityProps {
  className?: string;
}

export function ConnectionQuality({ className = '' }: ConnectionQualityProps) {
  const [connectivity, setConnectivity] = useState<ConnectivityInfo>(getConnectivity());

  useEffect(() => {
    const unsubscribe = onConnectivityChange((status) => {
      setConnectivity(status);
    });

    return unsubscribe;
  }, []);

  const getQualityLevel = (): 'excellent' | 'good' | 'fair' | 'poor' => {
    if (connectivity.status === 'offline') return 'poor';
    if (connectivity.status === 'slow') return 'poor';
    if (connectivity.status === 'unstable') return 'fair';
    
    if (connectivity.downlink) {
      if (connectivity.downlink >= 10) return 'excellent';
      if (connectivity.downlink >= 5) return 'good';
      if (connectivity.downlink >= 1) return 'fair';
      return 'poor';
    }
    
    return 'good';
  };

  const getQualityColor = (): string => {
    switch (getQualityLevel()) {
      case 'excellent':
        return 'var(--success-600)';
      case 'good':
        return 'var(--success-500)';
      case 'fair':
        return 'var(--warning-600)';
      case 'poor':
        return 'var(--error-600)';
    }
  };

  const getBars = (): number => {
    switch (getQualityLevel()) {
      case 'excellent':
        return 4;
      case 'good':
        return 3;
      case 'fair':
        return 2;
      case 'poor':
        return 1;
    }
  };

  return (
    <div className={`flex items-center gap-1 ${className}`} title={`Connection quality: ${getQualityLevel()}`}>
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className="w-1 rounded-full transition-all"
          style={{
            height: `${bar * 4 + 4}px`,
            background: bar <= getBars() ? getQualityColor() : 'var(--border-subtle)',
          }}
        />
      ))}
    </div>
  );
}
