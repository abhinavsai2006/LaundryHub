import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { QrCode, CheckCircle, AlertCircle, Camera } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function VerifyQR() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scannedCode, setScannedCode] = useState('');
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null);
  const { qrCodes, updateQRCode } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const myQRCode = qrCodes.find(qr => qr.assignedTo === user?.id);

  // Check if we returned from camera scanner with scanned data
  useEffect(() => {
    if (location.state?.scannedCode) {
      setScannedCode(location.state.scannedCode);
      processScannedCode(location.state.scannedCode);
      // Clear the state to prevent re-processing
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  const handleOpenScanner = () => {
    navigate('/student/verify/camera', {
      state: { returnPath: '/student/verify' }
    });
  };

  const processScannedCode = (code: string) => {
    if (!myQRCode) {
      setVerificationResult('error');
      showToast('You do not have an assigned QR code', 'error');
      return;
    }

    if (code === myQRCode.code) {
      updateQRCode(myQRCode.id, {
        status: 'verified'
      });
      setVerificationResult('success');
      showToast('QR code verified successfully!', 'success');
    } else {
      setVerificationResult('error');
      showToast('QR code does not match your assignment', 'error');
    }
  };

  const handleManualVerify = () => {
    if (scannedCode.trim()) {
      processScannedCode(scannedCode.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <QrCode className="w-8 h-8 text-purple-600" />
              Verify QR Code
            </h1>
            <p className="text-gray-600">Scan your assigned QR code to verify</p>
          </div>

          {!myQRCode ? (
            <GlassCard className="p-8 text-center">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No QR Code Assigned</h3>
              <p className="text-gray-600">
                You don't have an assigned QR code yet. Please wait for an operator to assign one to you.
              </p>
            </GlassCard>
          ) : (
            <>
              <GlassCard className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-4">Your Assigned QR Code</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">QR Code</p>
                    <p className="text-lg font-semibold text-gray-900">{myQRCode.code}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Status</p>
                    <div className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${
                      myQRCode.status === 'verified' ? 'bg-green-100 text-green-700' :
                      myQRCode.status === 'in-use' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {myQRCode.status}
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Scan QR Code</h3>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={scannedCode}
                      onChange={(e) => setScannedCode(e.target.value)}
                      placeholder="Scanned QR code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleOpenScanner}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="hidden sm:inline">Scan</span>
                    </button>
                  </div>

                  <button
                    onClick={handleManualVerify}
                    disabled={!scannedCode.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    Verify QR Code
                  </button>
                </div>
              </GlassCard>

              {verificationResult && (
                <GlassCard className={`p-6 ${
                  verificationResult === 'success' 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center gap-3">
                    {verificationResult === 'success' ? (
                      <>
                        <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-green-900 mb-1">Verification Successful!</h3>
                          <p className="text-sm text-green-700">
                            Your QR code has been verified. You can now proceed with your laundry.
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-8 h-8 text-red-600 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-red-900 mb-1">Verification Failed</h3>
                          <p className="text-sm text-red-700">
                            The scanned QR code does not match your assignment. Please try again.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </GlassCard>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
