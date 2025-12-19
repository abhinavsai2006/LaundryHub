import { useData } from '@/react-app/contexts/DataContext';
import { QrCode, Search, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QRCodes() {
  const { qrCodes } = useData();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // guard fields when filtering to avoid runtime errors if some QR entries are missing fields
  const filteredQRCodes = qrCodes.filter(qr =>
    (qr.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (qr.assignedToName && qr.assignedToName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <Clock className="w-5 h-5 text-gray-500" />;
      case 'assigned':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-use':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-gray-100 text-gray-700';
      case 'assigned':
        return 'bg-blue-100 text-blue-700';
      case 'verified':
        return 'bg-green-100 text-green-700';
      case 'in-use':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <QrCode className="w-8 h-8 text-green-600" />
            QR Codes
          </h1>
          <p className="text-gray-600">View all QR code assignments</p>
        </div>

        <GlassCard className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </GlassCard>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQRCodes.map(qr => (
            <GlassCard
              key={qr.id}
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/admin/qr-codes/details?qrId=${qr.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{qr.code}</h3>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium mt-1 ${getStatusColor(qr.status)}`}>
                      {getStatusIcon(qr.status)}
                      <span className="capitalize">{qr.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {qr.assignedTo && (
                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500">Assigned To</p>
                    <p className="text-sm font-medium text-gray-900">{qr.assignedToName}</p>
                  </div>
                  {qr.machineName && (
                    <div>
                      <p className="text-xs text-gray-500">Machine</p>
                      <p className="text-sm font-medium text-gray-900">{qr.machineName}</p>
                    </div>
                  )}
                  {qr.assignedAt && (
                    <div>
                      <p className="text-xs text-gray-500">Assigned On</p>
                      <p className="text-sm text-gray-700">
                        {new Date(qr.assignedAt).toLocaleDateString()} at{' '}
                        {new Date(qr.assignedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {!qr.assignedTo && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 italic">Not assigned yet</p>
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {filteredQRCodes.length === 0 && (
          <div className="text-center py-12">
            <QrCode className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No QR codes found</p>
          </div>
        )}
      </div>
    </div>
  );
}
