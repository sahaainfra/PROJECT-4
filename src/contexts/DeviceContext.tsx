import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// ═══════════════════════════════════════════════════════════
// DEVICE CONTEXT — Part 21
// Responsive shell device detection and capabilities
// ═══════════════════════════════════════════════════════════

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export interface DeviceCapabilities {
  camera: boolean;
  gps: boolean;
  qrScanner: boolean;
  filePicker: boolean;
  signaturePad: boolean;
  voiceToText: boolean;
  pushNotifications: boolean;
  offline: boolean;
}

interface DeviceContextType {
  device: DeviceType;
  capabilities: DeviceCapabilities;
  isOnline: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export function DeviceProvider({ children }: { children: ReactNode }) {
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    camera: false,
    gps: false,
    qrScanner: false,
    filePicker: false,
    signaturePad: false,
    voiceToText: false,
    pushNotifications: false,
    offline: false,
  });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
    window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  );

  useEffect(() => {
    const updateDevice = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setScreenHeight(window.innerHeight);
      setOrientation(width > window.innerHeight ? 'landscape' : 'portrait');

      if (width < 768) {
        setDevice('mobile');
      } else if (width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const detectCapabilities = async () => {
      const caps: DeviceCapabilities = {
        camera: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        gps: 'geolocation' in navigator,
        qrScanner: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
        filePicker: 'showOpenFilePicker' in window || 'input' in document.createElement('input'),
        signaturePad: true, // Canvas-based, always available
        voiceToText: 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window,
        pushNotifications: 'Notification' in window && 'serviceWorker' in navigator,
        offline: 'serviceWorker' in navigator,
      };
      setCapabilities(caps);
    };

    updateDevice();
    detectCapabilities();

    window.addEventListener('resize', updateDevice);
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    return () => {
      window.removeEventListener('resize', updateDevice);
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <DeviceContext.Provider value={{
      device,
      capabilities,
      isOnline,
      screenWidth,
      screenHeight,
      orientation,
    }}>
      {children}
    </DeviceContext.Provider>
  );
}

export function useDevice() {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevice must be used within DeviceProvider');
  }
  return context;
}
