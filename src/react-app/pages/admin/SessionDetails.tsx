import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Activity, Clock, CheckCircle, AlertTriangle, User, MapPin, QrCode, Package, Settings } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';
import { User as UserType } from '@/shared/laundry-types';

interface LaundrySession {
  id: string;
  studentId: string;
  studentName: string;
  operatorId?: string;
  operatorName?: string;
  qrCode?: string;
  bagQRCode?: string;
  status: string;
  hostel: string;
  submittedAt: string;
  pickedUpAt?: string;
  washingStartedAt?: string;
  dryingStartedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  estimatedReadyTime?: string;
  items: string[];
  specialInstructions?: string;
}

export default function SessionDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { laundryItems } = useData();

  const sessionId = searchParams.get('sessionId');
  const [selectedSession, setSelectedSession] = useState<LaundrySession | null>(null);

  useEffect(() => {
    if (sessionId) {
      const usersData = JSON.parse(localStorage.getItem('users') || '[]');
      const session = laundryItems.find(item => item.id === sessionId);
      if (session) {
        const student = usersData.find((u: UserType) => u.id === session.studentId);
        const operator = usersData.find((u: UserType) => u.id === session.operatorId);
        const sessionData: LaundrySession = {
          ...session,
          studentName: student?.name || 'Unknown',
          operatorName: operator?.name,
          hostel: student?.hostel || 'Unknown'
        };
        setSelectedSession(sessionData);
      }
    }
  }, [sessionId, laundryItems]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'picked_up': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'washing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'drying': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ready': return 'bg-green-100 text-green-700 border-green-200';
      case 'delivered': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getQRLifecycle = (session: LaundrySession) => {
    const events = [
      { label: 'Submitted', timestamp: session.submittedAt, status: 'completed' },
      { label: 'Picked Up', timestamp: session.pickedUpAt, status: session.pickedUpAt ? 'completed' : 'pending' },
      { label: 'Washing Started', timestamp: session.washingStartedAt, status: session.washingStartedAt ? 'completed' : 'pending' },
      { label: 'Drying Started', timestamp: session.dryingStartedAt, status: session.dryingStartedAt ? 'completed' : 'pending' },
      { label: 'Ready for Pickup', timestamp: session.readyAt, status: session.readyAt ? 'completed' : 'pending' },
      { label: 'Delivered', timestamp: session.deliveredAt, status: session.deliveredAt ? 'completed' : 'pending' }
    ];
    return events;
  };

  const calculateDuration = (start: string, end: string) => {
    const diff = new Date(end).getTime() - new Date(start).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleBack = () => {
    navigate('/admin/sessions');
  };

  const applyManualOverride = () => {
    // In a real app, this would make an API call
    alert('Manual override applied successfully');
  };

  if (!selectedSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Session Not Found</h2>
          <p className="text-gray-500 mb-4">The requested laundry session could not be found.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Sessions
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
                <div className="p-2 bg-blue-100 rounded-md">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Session Details</h1>
                  <p className="text-gray-600">{selectedSession.id}</p>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedSession.status)}`}>
              <Activity className="w-4 h-4" />
              <span className="capitalize">{selectedSession.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Session Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-500" />
                Session Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Student</p>
                    <p className="font-medium text-gray-900">{selectedSession.studentName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Hostel</p>
                    <p className="font-medium text-gray-900">{selectedSession.hostel}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Settings className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Operator</p>
                    <p className="font-medium text-gray-900">{selectedSession.operatorName || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <QrCode className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">QR Code</p>
                    <p className="font-medium text-gray-900 font-mono">{selectedSession.qrCode || 'N/A'}</p>
                  </div>
                </div>

                {selectedSession.bagQRCode && (
                  <div className="flex items-center gap-3">
                    <Package className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Bag QR Code</p>
                      <p className="font-medium text-gray-900 font-mono">{selectedSession.bagQRCode}</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="w-5 h-5 text-green-500" />
                Items & Instructions
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Laundry Items</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.items.map((item, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedSession.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Special Instructions</p>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <p className="text-yellow-800">{selectedSession.specialInstructions}</p>
                    </div>
                  </div>
                )}

                {selectedSession.estimatedReadyTime && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Estimated Ready Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(selectedSession.estimatedReadyTime).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* QR Lifecycle Timeline */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-purple-500" />
              QR Lifecycle & Timeline
            </h3>

            <div className="space-y-4">
              {getQRLifecycle(selectedSession).map((event, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    event.status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {event.status === 'completed' ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{event.label}</h4>
                      {event.timestamp && (
                        <span className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {event.timestamp && index > 0 && event.status === 'completed' && (
                      <p className="text-sm text-gray-600 mt-1">
                        Duration: {calculateDuration(getQRLifecycle(selectedSession)[index-1].timestamp!, event.timestamp)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Manual Override Section */}
          <GlassCard className="p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Manual Override (Admin Only)
            </h3>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-800 mb-1">Administrative Action Required</h4>
                  <p className="text-sm text-red-700">
                    Use this section to manually adjust session status or reassign operators.
                    All manual overrides are logged and audited for compliance.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Status
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Select new status...</option>
                  <option value="picked_up">Mark as Picked Up</option>
                  <option value="washing">Start Washing</option>
                  <option value="drying">Start Drying</option>
                  <option value="ready">Mark as Ready</option>
                  <option value="delivered">Mark as Delivered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign Operator
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent">
                  <option value="">Select operator...</option>
                  <option value="op1">John Smith</option>
                  <option value="op2">Sarah Johnson</option>
                  <option value="op3">Mike Davis</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={applyManualOverride}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium"
              >
                <AlertTriangle className="w-4 h-4" />
                Apply Manual Override
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}