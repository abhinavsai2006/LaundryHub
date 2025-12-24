import { useRef, useEffect, useState } from 'react';
import jsQR from 'jsqr';
import { Camera, X, Zap } from 'lucide-react';
import { ML_KIT_CONFIG } from '@/react-app/config/google-services';

interface CameraScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
  useMLKit?: boolean; // Enable Google ML Kit for enhanced scanning
}

export default function CameraScanner({ onScan, onClose, useMLKit = false }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string>('');
  const [isScanning, setIsScanning] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [useEnhancedScanning, setUseEnhancedScanning] = useState(useMLKit);
  const scanWithMLKit = async (imageData: ImageData): Promise<string | null> => {
    try {
      // Convert ImageData to base64
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.putImageData(imageData, 0, 0);
      const base64Image = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];

      // Call Google ML Kit Vision API
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${ML_KIT_CONFIG.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [{
            image: {
              content: base64Image
            },
            features: [{
              type: 'BARCODE_DETECTION',
              maxResults: 1
            }]
          }]
        })
      });

      const result = await response.json();

      if (result.responses && result.responses[0]?.barcodeAnnotations?.length > 0) {
        const barcode = result.responses[0].barcodeAnnotations[0];
        return barcode.displayValue || barcode.rawValue;
      }

      return null;
    } catch (error) {
      console.warn('ML Kit scanning failed, falling back to jsQR:', error);
      return null;
    }
  };

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationId: number;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsScanning(true);
          scanQRCode();
        }
      } catch (_err) {
        setError('Camera access denied. Please enter QR code manually.');
      }
    };

    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      const scan = () => {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, canvas.width, canvas.height);

          if (code) {
            onScan(code.data);
            return;
          }

          // Try ML Kit enhanced scanning if enabled
          if (useEnhancedScanning) {
            scanWithMLKit(imageData).then(mlKitResult => {
              if (mlKitResult) {
                onScan(mlKitResult);
                return;
              }
            }).catch(() => {
              // ML Kit failed, continue with jsQR
            });
          }
        }
        animationId = requestAnimationFrame(scan);
      };

      scan();
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onScan]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Scan QR Code</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          ) : (
            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                playsInline
              />
              <canvas ref={canvasRef} className="hidden" />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 border-4 border-white/50 rounded-2xl"></div>
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-600">Enhanced scanning with AI:</p>
              <button
                onClick={() => setUseEnhancedScanning(!useEnhancedScanning)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  useEnhancedScanning ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    useEnhancedScanning ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {useEnhancedScanning && (
              <div className="flex items-center gap-2 mb-3 p-2 bg-blue-50 rounded-lg">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-blue-700">AI-powered scanning enabled</span>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-3">Or enter QR code manually:</p>
            <form onSubmit={handleManualSubmit} className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder="Enter QR code"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]"
              />
              <button
                type="submit"
                className="px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] whitespace-nowrap"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
