import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, Search, Filter, CheckCircle, Clock, Play, Eye, User, Calendar, MapPin, FileText } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { LaundryItem, LaundryStatus } from '@/shared/laundry-types';

export default function ManageOrders() {
  const { laundryItems, updateLaundryItem, machines } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedMachine, setSelectedMachine] = useState('');

  const filteredOrders = laundryItems.filter(item => {
    const matchesSearch = item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (orderId: string, newStatus: LaundryStatus) => {
    updateLaundryItem(orderId, {
      status: newStatus,
      [newStatus === 'ready' ? 'readyAt' : newStatus === 'delivered' ? 'deliveredAt' : '']: new Date().toISOString()
    });
    showToast(`Order marked as ${newStatus}`, 'success');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-4 h-4" />;
      case 'ready':
        return <Clock className="w-4 h-4" />;
      case 'processing':
        return <Play className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusProgress = (status: string) => {
    switch (status) {
      case 'submitted':
        return 20;
      case 'picked_up':
        return 40;
      case 'washing':
      case 'processing':
        return 60;
      case 'drying':
        return 80;
      case 'ready':
        return 90;
      case 'delivered':
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const handleViewOrderDetails = (order: LaundryItem) => {
    navigate(`/operator/orders/${order.id}`);
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

  const handleAssignMachine = (orderId: string) => {
    const machine = machines.find(m => m.id === selectedMachine);
    if (machine) {
      updateLaundryItem(orderId, {
        status: 'picked_up',
        machineName: machine.name,
        operatorName: user?.name || 'Unknown Operator',
        pickedUpAt: new Date().toISOString()
      });
      showToast('Machine assigned successfully', 'success');
      setSelectedOrder(null);
      setSelectedMachine('');
    } else {
      showToast('Please select a machine', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-blue-600" />
            Manage Orders
          </h1>
          <p className="text-gray-600">Assign machines and update order status</p>
        </div>

        <GlassCard className="p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name or order ID..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="picked_up">Picked Up</option>
                <option value="washing">Washing</option>
                <option value="drying">Drying</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
          </div>
        </GlassCard>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Found</h3>
              <p className="text-gray-600">No laundry orders match your search criteria.</p>
            </GlassCard>
          ) : (
            filteredOrders.map(order => (
              <GlassCard key={order.id} className="p-6 cursor-pointer hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 hover:border-l-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Main Order Info */}
                  <div className="flex-1" onClick={() => handleViewOrderDetails(order)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Order #{order.id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {order.studentName}
                          </p>
                        </div>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid md:grid-cols-3 gap-6 mb-4">
                      {/* Items Section */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Items ({order.items.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                            >
                              {item}
                            </span>
                          ))}
                          {order.items.length > 3 && (
                            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Timeline Section */}
                      <div className="bg-green-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Timeline
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Submitted:</span>
                            <span className="font-medium text-gray-900">
                              {new Date(order.submittedAt).toLocaleDateString()}
                            </span>
                          </div>
                          {order.estimatedReadyTime && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Est. Ready:</span>
                              <span className="font-medium text-green-700">
                                {new Date(order.estimatedReadyTime).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                          <div className="text-xs text-gray-500 mt-2">
                            {new Date(order.submittedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>

                      {/* Assignment Section */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Assignment
                        </h4>
                        <div className="space-y-2 text-sm">
                          {order.bagQRCode && (
                            <div>
                              <span className="text-gray-600">Bag QR:</span>
                              <div className="font-mono text-xs bg-white px-2 py-1 rounded border mt-1">
                                {order.bagQRCode}
                              </div>
                            </div>
                          )}
                          {order.machineName && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine:</span>
                              <span className="font-medium text-purple-700">{order.machineName}</span>
                            </div>
                          )}
                          {order.operatorName && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Operator:</span>
                              <span className="font-medium text-purple-700">{order.operatorName}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {order.specialInstructions && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Special Instructions
                        </h4>
                        <p className="text-sm text-yellow-900">{order.specialInstructions}</p>
                      </div>
                    )}

                    {/* Status Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{getStatusProgress(order.status)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${getStatusProgress(order.status)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3 lg:w-48">
                    <button
                      onClick={() => handleViewOrderDetails(order)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                    
                    {order.status === 'submitted' && !selectedOrder && (
                      <button
                        onClick={() => setSelectedOrder(order.id)}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm"
                      >
                        <Play className="w-4 h-4" />
                        Assign Machine
                      </button>
                    )}
                    
                    {order.status === 'washing' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'ready')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium shadow-sm"
                      >
                        <Clock className="w-4 h-4" />
                        Mark Ready
                      </button>
                    )}
                    
                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Mark Completed
                      </button>
                    )}
                  </div>
                </div>

                {/* Machine Assignment Panel */}
                {selectedOrder === order.id && order.status === 'submitted' && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Assign Machine
                    </h4>
                    <div className="flex gap-3">
                      <select
                        value={selectedMachine}
                        onChange={(e) => setSelectedMachine(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select machine</option>
                        {machines.filter(m => m.status === 'available').map(machine => (
                          <option key={machine.id} value={machine.id}>
                            {machine.name} ({machine.type})
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleAssignMachine(order.id)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => {
                          setSelectedOrder(null);
                          setSelectedMachine('');
                        }}
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </GlassCard>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
