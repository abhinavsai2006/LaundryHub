import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { Package, ArrowLeft, User, Mail, Phone, MapPin, Clock, Calendar, FileText, Image } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';

export default function OrderDetailsPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { laundryItems, users } = useData();

  const order = laundryItems.find(item => item.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">The requested order could not be found.</p>
          <button
            onClick={() => navigate('/operator/orders')}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
          >
            Back to Orders
          </button>
        </GlassCard>
      </div>
    );
  }

  const getStudentInfo = (studentId: string) => {
    return users?.find(user => user.id === studentId);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'ready':
        return 'bg-blue-100 text-blue-700';
      case 'processing':
      case 'washing':
      case 'drying':
        return 'bg-orange-100 text-orange-700';
      case 'picked_up':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/operator/orders')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Order #{order.id.slice(-8).toUpperCase()}
              </h1>
              <p className="text-gray-600">Laundry Order Details</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Student Information */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <User className="w-6 h-6 text-blue-600" />
              Student Information
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="text-lg font-medium text-gray-900">{order.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </p>
                  <p className="text-gray-900">{getStudentInfo(order.studentId)?.email || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-4 h-4" />
                    Mobile Number
                  </p>
                  <p className="text-gray-900">{getStudentInfo(order.studentId)?.phone || 'Not available'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Hostel & Room
                  </p>
                  <p className="text-gray-900">
                    {getStudentInfo(order.studentId)?.hostel || 'Not specified'} -
                    Room {getStudentInfo(order.studentId)?.room || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Roll Number</p>
                  <p className="text-gray-900">{getStudentInfo(order.studentId)?.rollNumber || 'Not available'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  <p className="text-gray-900">{getStudentInfo(order.studentId)?.gender || 'Not specified'}</p>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Order Status & Timeline */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-gray-600" />
              Order Status & Timeline
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Submitted:</span>
                  <span className="text-sm text-gray-900">{new Date(order.submittedAt).toLocaleString()}</span>
                </div>
                {order.pickedUpAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Picked Up:</span>
                    <span className="text-sm text-gray-900">{new Date(order.pickedUpAt).toLocaleString()}</span>
                  </div>
                )}
                {order.washingStartedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Washing Started:</span>
                    <span className="text-sm text-gray-900">{new Date(order.washingStartedAt).toLocaleString()}</span>
                  </div>
                )}
                {order.dryingStartedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Drying Started:</span>
                    <span className="text-sm text-gray-900">{new Date(order.dryingStartedAt).toLocaleString()}</span>
                  </div>
                )}
                {order.readyAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Ready:</span>
                    <span className="text-sm text-gray-900">{new Date(order.readyAt).toLocaleString()}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">Delivered:</span>
                    <span className="text-sm text-gray-900">{new Date(order.deliveredAt).toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Laundry Items */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Laundry Items</h2>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Total Items: <span className="font-medium">{order.items.length}</span></p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {order.items.map((item, index) => (
                <div key={index} className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-900">{item}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Special Instructions & Notes */}
          {(order.specialInstructions || order.studentNotes) && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-yellow-600" />
                Instructions & Notes
              </h2>
              {order.specialInstructions && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Special Instructions:</p>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-900">{order.specialInstructions}</p>
                  </div>
                </div>
              )}
              {order.studentNotes && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Student Notes:</p>
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <p className="text-gray-900">{order.studentNotes}</p>
                  </div>
                </div>
              )}
            </GlassCard>
          )}

          {/* Bag Photo */}
          {order.bagPhoto && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Image className="w-6 h-6 text-purple-600" />
                Bag Photo
              </h2>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <img
                  src={order.bagPhoto}
                  alt="Laundry bag"
                  className="max-w-full h-auto rounded-lg shadow-sm"
                />
              </div>
            </GlassCard>
          )}

          {/* QR Codes & Assignment Info */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Assignment Details</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {order.qrCode && (
                <div>
                  <p className="text-sm text-gray-500">Student QR Code</p>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded border">{order.qrCode}</p>
                </div>
              )}
              {order.bagQRCode && (
                <div>
                  <p className="text-sm text-gray-500">Bag QR Code</p>
                  <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded border">{order.bagQRCode}</p>
                </div>
              )}
              {order.machineName && (
                <div>
                  <p className="text-sm text-gray-500">Assigned Machine</p>
                  <p className="text-gray-900">{order.machineName}</p>
                </div>
              )}
              {order.operatorName && (
                <div>
                  <p className="text-sm text-gray-500">Assigned Operator</p>
                  <p className="text-gray-900">{order.operatorName}</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}