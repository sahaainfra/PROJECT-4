import React, { useState, useRef, useEffect } from 'react';
import { QrCode, X, Check, AlertCircle, Flashlight, FlashlightOff } from 'lucide-react';
import { requestCameraPermission, checkCameraAvailability } from '../core/ResponsiveService';
import { captureConfigs } from '../data/responsiveData';

// ═══════════════════════════════════════════════════════════
// QR SCANNER COMPONENT — Part 21
// ═══════════════════════════════════════════════════════════

interface QRScannerProps {
  onScan: (code: string, format: string) => void;
  supportedFormats?: string[];
  className?: string;
}

export function QRScanner({
  onScan,
  supportedFormats = captureConfigs.qrScanner.supportedFormats,
  className = '',
}: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    checkPermission();
    return () => {
      stopScanner();
    };
  }, []);

  const checkPermission = async () => {
    const available = await checkCameraAvailability();
    if (!available) {
      setError('Camera not available on this device');
      setHasPermission(false);
      return;
    }

    const granted = await requestCameraPermission();
    setHasPermission(granted);
    if (!granted) {
      setError('Camera permission denied');
    }
  };

  const startScanner = async () => {
    if (!hasPermission) {
      await checkPermission();
      if (!hasPermission) return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsScanning(true);
        setError(null);
        setScannedCode(null);

        // Start scanning loop
        startScanningLoop();
      }
    } catch (err) {
      setError('Failed to start scanner');
      console.error('Scanner error:', err);
    }
  };

  const stopScanner = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsScanning(false);
  };

  const startScanningLoop = () => {
    const scan = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrameRef.current = requestAnimationFrame(scan);
        return;
      }

      // Set canvas size to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // In a real implementation, you would use a QR scanning library here
      // For now, we'll simulate scanning with a timeout
      // Libraries like jsQR, html5-qrcode, or @zxing/library can be used
      
      // Simulate scanning (replace with actual QR detection)
      // This is a placeholder - in production, use a proper QR scanning library
      animationFrameRef.current = requestAnimationFrame(scan);
    };

    scan();
  };

  const toggleFlash = async () => {
    if (!streamRef.current) return;

    const track = streamRef.current.getVideoTracks()[0];
    const capabilities = track.getCapabilities() as any;

    if (capabilities.torch) {
      try {
        await track.applyConstraints({
          advanced: [{ torch: !flashOn } as any],
        });
        setFlashOn(!flashOn);
      } catch (err) {
        console.error('Flash toggle error:', err);
      }
    }
  };

  const handleManualEntry = () => {
    const code = prompt('Enter code manually:');
    if (code) {
      setScannedCode(code);
      stopScanner();
      onScan(code, 'MANUAL');
    }
  };

  const simulateScan = (code: string, format: string = 'QR_CODE') => {
    // This is for testing - in production, use actual QR detection
    setScannedCode(code);
    stopScanner();
    onScan(code, format);
  };

  const resetScanner = () => {
    setScannedCode(null);
    setError(null);
    startScanner();
  };

  if (error && !isScanning && !scannedCode) {
    return (
      <div className={`p-4 rounded-lg border-2 ${className}`} style={{ borderColor: 'var(--error-200)', background: 'var(--error-50)' }}>
        <div className="flex items-start gap-3">
          <AlertCircle size={20} style={{ color: 'var(--error-600)' }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--error-700)' }}>
              Scanner Error
            </div>
            <div className="text-xs mt-1" style={{ color: 'var(--error-600)' }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border-2 overflow-hidden ${className}`} style={{ borderColor: 'var(--border-subtle)', background: 'var(--card-bg)' }}>
      {/* Scanner View */}
      {isScanning && (
        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-auto"
            style={{ maxHeight: '400px' }}
          />
          <canvas ref={canvasRef} className="hidden" />

          {/* Viewfinder Overlay */}
          {captureConfigs.qrScanner.showViewfinder && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-4 rounded-lg" style={{ borderColor: 'rgba(255, 255, 255, 0.5)' }}>
                <div className="w-full h-full border-2 rounded-lg" style={{ borderColor: 'var(--brand-600)' }} />
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
            <button
              onClick={toggleFlash}
              className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              {flashOn ? (
                <Flashlight size={24} color="white" />
              ) : (
                <FlashlightOff size={24} color="white" />
              )}
            </button>
            <button
              onClick={stopScanner}
              className="p-3 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            >
              <X size={24} color="white" />
            </button>
          </div>

          {/* Scanning Indicator */}
          <div className="absolute top-4 left-0 right-0 text-center">
            <div className="inline-block px-4 py-2 rounded-full bg-black/50 text-white text-sm">
              Scanning...
            </div>
          </div>

          {/* Test Buttons (Remove in production) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button
              onClick={() => simulateScan('TEST-QR-123', 'QR_CODE')}
              className="px-3 py-1 rounded bg-blue-500 text-white text-xs hover:bg-blue-600"
            >
              Test QR
            </button>
            <button
              onClick={() => simulateScan('1234567890123', 'EAN_13')}
              className="px-3 py-1 rounded bg-green-500 text-white text-xs hover:bg-green-600"
            >
              Test Barcode
            </button>
          </div>
        </div>
      )}

      {/* Code Captured */}
      {scannedCode && (
        <div className="p-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success-50)' }}>
              <Check size={24} style={{ color: 'var(--success-600)' }} />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Code Scanned
              </div>
              <div className="text-xs font-mono p-2 rounded" style={{ background: 'var(--surface-sunken)', color: 'var(--text-secondary)' }}>
                {scannedCode}
              </div>
            </div>
          </div>

          <button
            onClick={resetScanner}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors hover:bg-[var(--card-hover)]"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Scan Another
          </button>
        </div>
      )}

      {/* Start Scanner Button */}
      {!isScanning && !scannedCode && (
        <div className="p-4">
          <button
            onClick={startScanner}
            className="w-full p-6 flex flex-col items-center gap-3 hover:bg-[var(--card-hover)] transition-colors rounded-lg border-2"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
              <QrCode size={32} style={{ color: 'var(--brand-600)' }} />
            </div>
            <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              Scan QR Code or Barcode
            </div>
            <div className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
              Supported: {supportedFormats.slice(0, 3).join(', ')}...
            </div>
          </button>

          <button
            onClick={handleManualEntry}
            className="w-full mt-3 px-4 py-2 rounded-lg border-2 transition-colors hover:bg-[var(--card-hover)] text-sm"
            style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            Enter Code Manually
          </button>
        </div>
      )}
    </div>
  );
}
