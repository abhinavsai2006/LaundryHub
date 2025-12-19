import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { ArrowLeft, Package, CheckCircle, AlertCircle, Clock, WashingMachine, Calendar, FileText, User, QrCode, Receipt } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { LaundryItem } from '@/shared/laundry-types';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { laundryItems, users } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const [order, setOrder] = useState<LaundryItem | null>(null);

  useEffect(() => {
    if (id) {
      const foundOrder = laundryItems.find(item => item.id === id);
      if (foundOrder && foundOrder.studentId === user?.id) {
        setOrder(foundOrder);
      } else {
        showToast('Order not found', 'error');
        navigate('/student/history');
      }
    }
  }, [id, laundryItems, user?.id, navigate, showToast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'ready':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'ready':
        return 'bg-orange-100 text-orange-700';
      case 'delivered':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  const studentInfo = users?.find(user => user.id === order.studentId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/student/history')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Order #{order.id.slice(-8).toUpperCase()}
                </h1>
                <p className="text-gray-600">Laundry Order Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Order Status & Progress */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-600" />
              Order Status & Progress
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 mb-2">Current Status</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="capitalize">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="space-y-2">
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
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <WashingMachine className="w-5 h-5 text-blue-600" />
              Laundry Items
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {order.items?.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <span className="font-medium text-gray-900">{item}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Service Details */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              Service Details
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <p className="text-gray-900 font-medium">{order.items?.length || 0} items</p>
                </div>
                {order.machineName && (
                  <div>
                    <p className="text-sm text-gray-500">Machine</p>
                    <p className="text-gray-900 font-medium">{order.machineName}</p>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {order.specialInstructions && (
                  <div>
                    <p className="text-sm text-gray-500">Special Instructions</p>
                    <p className="text-gray-900">{order.specialInstructions}</p>
                  </div>
                )}
                {order.estimatedReadyTime && (
                  <div>
                    <p className="text-sm text-gray-500">Estimated Ready Time</p>
                    <p className="text-gray-900">{new Date(order.estimatedReadyTime).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>

          {/* Operator Information */}
          {order.operatorId && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-purple-600" />
                Operator Information
              </h2>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-purple-600">Operator Name</p>
                    <p className="text-purple-900 font-medium">{order.operatorName || 'Unknown'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-purple-600">Operator ID</p>
                      <p className="text-purple-900">{order.operatorId}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}

          {/* QR Code & Receipt */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* QR Code */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-600" />
                QR Code
              </h2>
              <div className="text-center">
                <div className="bg-gray-100 rounded-lg p-8 inline-block">
                  <QrCode className="w-32 h-32 text-gray-400 mx-auto" />
                </div>
                <p className="text-sm text-gray-500 mt-4">Scan to verify order</p>
              </div>
            </GlassCard>

            {/* Receipt */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                Receipt
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-mono text-sm">{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span>{new Date(order.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Items:</span>
                    <span>{order.items?.length || 0}</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Student Information */}
          {studentInfo && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Your Information
              </h2>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-blue-600">Name</p>
                    <p className="text-blue-900 font-medium">{studentInfo.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">Student ID</p>
                      <p className="text-blue-900">{studentInfo.rollNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Room</p>
                      <p className="text-blue-900">{studentInfo.room}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-600">Email</p>
                      <p className="text-blue-900">{studentInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-600">Phone</p>
                      <p className="text-blue-900">{studentInfo.phone}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}