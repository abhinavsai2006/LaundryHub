import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, QrCode, CheckCircle, Clock, AlertCircle, Calendar, User, Settings } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';
import type { QRCode as QRCodeType } from '@/shared/laundry-types';

export default function QRDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { qrCodes } = useData();

  const qrId = searchParams.get('qrId');
  const [selectedQR, setSelectedQR] = useState<QRCodeType | null>(null);

  useEffect(() => {
    if (qrId) {
      const qr = qrCodes.find(q => q.id === qrId);
      if (qr) {
        setSelectedQR(qr);
      }
    }
  }, [qrId, qrCodes]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Clock className="w-6 h-6 text-gray-500" />;
      case 'assigned':
        return <CheckCircle className="w-6 h-6 text-blue-500" />;
      case 'verified':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'in-use':
        return <AlertCircle className="w-6 h-6 text-orange-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'assigned':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'verified':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'in-use':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleBack = () => {
    navigate('/admin/qr-codes');
  };

  if (!selectedQR) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">QR Code Not Found</h2>
          <p className="text-gray-500 mb-4">The requested QR code could not be found.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to QR Codes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-md">
                  <QrCode className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">QR Code Details</h1>
                  <p className="text-gray-600">{selectedQR.code}</p>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedQR.status)}`}>
              {getStatusIcon(selectedQR.status)}
              <span className="capitalize">{selectedQR.status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code Display */}
            <GlassCard className="p-8">
              <div className="text-center">
                <div className="inline-block p-8 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6">
                  <QrCode className="w-24 h-24 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedQR.code}</h2>
                <p className="text-gray-600">Scan this code to verify laundry sessions</p>
              </div>
            </GlassCard>

            {/* Details */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Code Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedQR.status)}`}>
                    {getStatusIcon(selectedQR.status)}
                    <span className="capitalize">{selectedQR.status}</span>
                  </div>
                </div>

                {selectedQR.assignedTo ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Assigned To
                      </label>
                      <p className="text-lg font-semibold text-gray-900">{selectedQR.assignedToName || '—'}</p>
                    </div>

                    {selectedQR.machineName && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Machine</label>
                        <p className="text-lg font-semibold text-gray-900">{selectedQR.machineName}</p>
                      </div>
                    )}

                    {selectedQR.assignedAt && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Assigned On
                        </label>
                        <p className="text-gray-700">
                          {new Date(selectedQR.assignedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(selectedQR.assignedAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-600 text-center">
                      This QR code is currently unassigned and available for use.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Usage History (Mock Data) */}
          <GlassCard className="mt-8 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Usage History</h3>
            <div className="space-y-4">
              {selectedQR.assignedTo ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Usage history will be displayed here</p>
                  <p className="text-sm text-gray-400 mt-2">Feature coming soon</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No usage history available</p>
                  <p className="text-sm text-gray-400 mt-2">QR code has not been used yet</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}