import { useState, useRef, useEffect } from 'react';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { PenTool, Download, Search } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface SignatureRecord {
  id: string;
  laundryId: string;
  studentName: string;
  action: 'pickup' | 'delivery';
  signature: string; // base64 image
  timestamp: string;
  operatorId: string;
  operatorName: string;
}

export default function DigitalSignature() {
  const { laundryItems } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedLaundry, setSelectedLaundry] = useState<string>('');
  const [actionType, setActionType] = useState<'pickup' | 'delivery'>('pickup');
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up drawing properties for smooth signatures
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Mock signature records
  const [signatures, setSignatures] = useState<SignatureRecord[]>([
    {
      id: '1',
      laundryId: 'qr_001',
      studentName: 'John Doe',
      action: 'pickup',
      signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
      timestamp: '2025-12-19T09:30:00Z',
      operatorId: 'op_1',
      operatorName: 'Rajesh Kumar'
    }
  ]);

  const filteredLaundry = laundryItems.filter(item =>
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEventCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      // Touch event
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      // Mouse event
      return {
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getEventCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const captureSignature = () => {
    if (!selectedLaundry) {
      showToast('Please select a laundry item', 'error');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const signature = canvas.toDataURL('image/png');
    const selectedItem = laundryItems.find(item => item.id === selectedLaundry);

    if (!selectedItem) return;

    const newSignature: SignatureRecord = {
      id: Date.now().toString(),
      laundryId: selectedLaundry,
      studentName: selectedItem.studentName || 'Unknown',
      action: actionType,
      signature,
      timestamp: new Date().toISOString(),
      operatorId: user?.id || '',
      operatorName: user?.name || 'Unknown'
    };

    setSignatures([newSignature, ...signatures]);
    showToast('Signature captured successfully', 'success');
    clearSignature();
    setSelectedLaundry('');
  };

  const downloadSignature = (signature: SignatureRecord) => {
    const link = document.createElement('a');
    link.href = signature.signature;
    link.download = `signature_${signature.laundryId}_${signature.action}.png`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <PenTool className="w-6 h-6 md:w-8 md:h-8 text-purple-600" />
              Digital Signature Capture
            </h1>
            <p className="text-sm md:text-base text-gray-600">Capture and manage digital signatures for accountability</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
            {/* Signature Capture Section */}
            <div className="space-y-4 md:space-y-6">
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Capture New Signature</h2>

                <div className="space-y-3 md:space-y-4 mb-4 md:mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Search Laundry Item
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by student name or QR ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {searchTerm && (
                    <div className="max-h-32 md:max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                      {filteredLaundry.slice(0, 5).map(item => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setSelectedLaundry(item.id);
                            setSearchTerm(item.studentName || item.id);
                          }}
                          className="w-full text-left px-3 md:px-4 py-3 md:py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="font-medium text-gray-900 text-sm md:text-base">{item.studentName || 'Unknown'}</p>
                          <p className="text-xs md:text-sm text-gray-600">ID: {item.id}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                      Action Type
                    </label>
                    <select
                      value={actionType}
                      onChange={(e) => setActionType(e.target.value as 'pickup' | 'delivery')}
                      className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="pickup">Pickup</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 md:p-4 mb-3 md:mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs md:text-sm text-gray-600">Signature Area</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <PenTool className="w-3 h-3" />
                      <span className="hidden sm:inline">Use mouse or</span>
                      <span>Touch to sign</span>
                    </div>
                  </div>
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={150}
                    className="border border-gray-200 rounded bg-white cursor-crosshair w-full touch-manipulation min-h-[120px] md:min-h-[200px]"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    style={{ touchAction: 'none' }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                  <button
                    onClick={clearSignature}
                    className="px-4 py-3 md:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm md:text-base font-medium"
                  >
                    Clear
                  </button>
                  <button
                    onClick={captureSignature}
                    className="flex-1 px-4 py-3 md:py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all text-sm md:text-base font-medium"
                  >
                    Capture Signature
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Signature Records Section */}
            <div className="space-y-4 md:space-y-6">
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">Signature Records</h2>

                <div className="space-y-3 md:space-y-4">
                  {signatures.map(signature => (
                    <div key={signature.id} className="border border-gray-200 rounded-lg p-3 md:p-4">
                      <div className="flex items-start justify-between gap-3 md:gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm md:text-base truncate">{signature.studentName}</p>
                          <p className="text-xs md:text-sm text-gray-600">
                            {signature.action} • {new Date(signature.timestamp).toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">ID: {signature.laundryId}</p>
                        </div>
                        <button
                          onClick={() => downloadSignature(signature)}
                          className="p-2 md:p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex-shrink-0"
                          title="Download signature"
                        >
                          <Download className="w-4 h-4 md:w-4 md:h-4" />
                        </button>
                      </div>

                      <div className="bg-gray-50 rounded p-2 md:p-2">
                        <img
                          src={signature.signature}
                          alt="Signature"
                          className="max-w-full h-auto border border-gray-200 rounded"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {signatures.length === 0 && (
                  <div className="text-center py-6 md:py-8">
                    <PenTool className="w-10 h-10 md:w-12 md:h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm md:text-base text-gray-500">No signatures captured yet</p>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}