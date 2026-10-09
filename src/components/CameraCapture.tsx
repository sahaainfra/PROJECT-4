import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Check, RotateCw, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { requestCameraPermission, checkCameraAvailability } from '../core/ResponsiveService';
import { captureConfigs } from '../data/responsiveData';

// ═══════════════════════════════════════════════════════════
// CAMERA CAPTURE COMPONENT — Part 21
// ═══════════════════════════════════════════════════════════

interface CameraCaptureProps {
  onCapture: (photos: string[]) => void;
  maxPhotos?: number;
  allowMultiple?: boolean;
  className?: string;
}

export function CameraCapture({
  onCapture,
  maxPhotos = captureConfigs.camera.maxPhotos,
  allowMultiple = true,
  className = '',
}: CameraCaptureProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkPermission();
    return () => {
      stopCamera();
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

  const startCamera = async () => {
    if (!hasPermission) {
      await checkPermission();
      if (!hasPermission) return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: captureConfigs.camera.maxDimension },
          height: { ideal: captureConfigs.camera.maxDimension },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCapturing(true);
        setError(null);
      }
    } catch (err) {
      setError('Failed to start camera');
      console.error('Camera error:', err);
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

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Compress and convert to base64
    const quality = captureConfigs.camera.compressionQuality;
    const dataUrl = canvas.toDataURL('image/jpeg', quality);

    // Add to photos array
    const newPhotos = [...photos, dataUrl];
    setPhotos(newPhotos);

    // Check if we've reached the max
    if (newPhotos.length >= maxPhotos || !allowMultiple) {
      stopCamera();
      onCapture(newPhotos);
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);
  };

  const retakePhoto = () => {
    setPhotos([]);
    startCamera();
  };

  const confirmPhotos = () => {
    stopCamera();
    onCapture(photos);
  };

  if (error) {
    return (
      <div className={`p-4 rounded-lg border-2 ${className}`} style={{ borderColor: 'var(--error-200)', background: 'var(--error-50)' }}>
        <div className="flex items-start gap-3">
          <AlertCircle size={20} style={{ color: 'var(--error-600)' }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--error-700)' }}>
              Camera Error
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
      {/* Camera View */}
      {isCapturing && (
        <div className="relative bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-auto"
            style={{ maxHeight: '400px' }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Capture Button */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <button
              onClick={capturePhoto}
              className="w-16 h-16 rounded-full bg-white shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              style={{ border: '4px solid var(--brand-600)' }}
            >
              <div className="w-12 h-12 rounded-full" style={{ background: 'var(--brand-600)' }} />
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={stopCamera}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <X size={20} color="white" />
          </button>
        </div>
      )}

      {/* Photo Preview */}
      {photos.length > 0 && !isCapturing && (
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2" style={{ borderColor: 'var(--border-subtle)' }}>
                <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
                >
                  <X size={14} color="white" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={retakePhoto}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 transition-colors hover:bg-[var(--card-hover)]"
              style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <RotateCw size={16} />
              Retake
            </button>
            <button
              onClick={confirmPhotos}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors hover:opacity-90"
              style={{ background: 'var(--success-600)', color: '#fff' }}
            >
              <Check size={16} />
              Confirm ({photos.length})
            </button>
          </div>
        </div>
      )}

      {/* Start Camera Button */}
      {!isCapturing && photos.length === 0 && (
        <button
          onClick={startCamera}
          className="w-full p-6 flex flex-col items-center gap-3 hover:bg-[var(--card-hover)] transition-colors"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'var(--brand-50)' }}>
            <Camera size={32} style={{ color: 'var(--brand-600)' }} />
          </div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            Take Photo
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {allowMultiple ? `Up to ${maxPhotos} photos` : 'Single photo'}
          </div>
        </button>
      )}
    </div>
  );
}
