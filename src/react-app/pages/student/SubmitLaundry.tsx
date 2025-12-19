import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, X, Camera, CheckCircle, AlertCircle, Shirt } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import CameraScanner from '@/react-app/components/CameraScanner';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

const clothesTypes = [
  'Cotton',
  'Wool',
  'Silk',
  'Synthetic',
  'Denim',
  'Linen'
];

export default function SubmitLaundry() {
  const [clothesCount, setClothesCount] = useState('');
  const [clothesType, setClothesType] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [bagPhoto, setBagPhoto] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [qrVerified, setQrVerified] = useState(false);
  const navigate = useNavigate();
  const { addLaundryItem, qrCodes } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const myQRCode = qrCodes.find(qr => qr.assignedTo === user?.id && qr.status === 'verified');

  const handleQRScan = (data: string) => {
    if (myQRCode && data === myQRCode.code) {
      setQrCode(data);
      setQrVerified(true);
      setShowScanner(false);
      showToast('QR code verified successfully', 'success');
    } else {
      showToast('Invalid QR code. Please scan your assigned QR code.', 'error');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBagPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrVerified) {
      showToast('Please verify your QR code first', 'error');
      return;
    }

    if (!clothesCount || !clothesType) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    addLaundryItem({
      studentId: user?.id || '',
      studentName: user?.name || 'Unknown',
      qrCode: qrCode,
      items: [`${clothesCount} ${clothesType} items`],
      specialInstructions: specialInstructions || undefined,
      status: 'submitted'
    });

    showToast('Laundry request submitted successfully', 'success');
    
    setTimeout(() => {
      navigate('/student');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              Submit Laundry
            </h1>
            <p className="text-gray-600">Select items and scan your laundry bag QR code</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* QR Code Verification */}
            <GlassCard className="p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Verify Your QR Code
              </h3>
              
              {!qrVerified ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Required Step</p>
                        <p className="text-blue-800">Please scan your assigned QR code to proceed with laundry submission.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="Scan or enter your QR code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="hidden sm:inline">Scan QR</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 flex-1">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900 mb-1">QR Code Verified</p>
                        <p className="text-sm text-green-700 font-mono">{qrCode}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQrCode('');
                        setQrVerified(false);
                      }}
                      className="text-green-700 hover:text-green-900 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>

            {qrVerified && (
              <>
                {/* Laundry Details */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-blue-600" />
                    Laundry Details
                  </h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clothes Count *
                      </label>
                      <input
                        type="number"
                        value={clothesCount}
                        onChange={(e) => setClothesCount(e.target.value)}
                        min="1"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Clothes Type *
                      </label>
                      <select
                        value={clothesType}
                        onChange={(e) => setClothesType(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select type</option>
                        {clothesTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </GlassCard>

                {/* Special Instructions */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Notes</h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special care instructions..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </GlassCard>

                {/* Bag Photo */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Bag Photo</h3>
                  <div className="space-y-4">
                    <input
                      type="file"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {bagPhoto && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={bagPhoto}
                          alt="Bag preview"
                          className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </GlassCard>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium text-lg"
                >
                  Submit Laundry Request
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {showScanner && (
        <CameraScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
