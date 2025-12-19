import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Clock, Package, CheckCircle, AlertCircle, User, WashingMachine, QrCode, Eye } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { LaundryItem } from '@/shared/laundry-types';

export default function History() {
  const { laundryItems } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();

  const myOrders = laundryItems
    .filter(item => item.studentId === user?.id)
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const handleViewOrderDetails = (order: LaundryItem) => {
    navigate(`/student/history/${order.id}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
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
      case 'processing':
      case 'ready':
        return 'bg-orange-100 text-orange-700';
      case 'verified':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-8 h-8 text-blue-600" />
            Laundry History
          </h1>
          <p className="text-gray-600">View all your laundry requests</p>
        </div>

        {myOrders.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Laundry History</h3>
            <p className="text-gray-600">You haven't submitted any laundry requests yet.</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {myOrders.map((order: LaundryItem) => (
              <GlassCard key={order.id} className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                  <div className="flex-1" onClick={() => handleViewOrderDetails(order)}>
                    {/* Header with Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <div className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(order.status)}`}>
                            {order.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Submitted</p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(order.submittedAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.submittedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Items Section */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="w-4 h-4 text-blue-600" />
                        <p className="text-sm font-medium text-gray-700">Items ({order.items.length})</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {order.operatorName && (
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-500">Operator</p>
                            <p className="text-sm font-medium text-gray-900">{order.operatorName}</p>
                          </div>
                        </div>
                      )}

                      {order.machineName && (
                        <div className="flex items-center gap-2">
                          <WashingMachine className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Machine</p>
                            <p className="text-sm font-medium text-gray-900">{order.machineName}</p>
                          </div>
                        </div>
                      )}

                      {order.bagQRCode && (
                        <div className="flex items-center gap-2">
                          <QrCode className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-gray-500">Bag QR Code</p>
                            <p className="text-sm font-mono font-medium text-gray-900">{order.bagQRCode}</p>
                          </div>
                        </div>
                      )}

                      {order.deliveredAt && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-500">Completed</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(order.deliveredAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-amber-800 mb-1">Special Instructions</p>
                            <p className="text-sm text-amber-900">{order.specialInstructions}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex flex-col gap-2 md:ml-4">
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="font-medium">View Details</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
