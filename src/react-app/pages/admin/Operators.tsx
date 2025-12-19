import { useState, useEffect, useCallback } from 'react';
import { User } from '@/shared/laundry-types';
import { Users, Search, Filter, Eye, CheckCircle, XCircle, UserCheck, UserX, Award, Clock, Activity } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

type OperatorStatus = 'pending' | 'active' | 'suspended';

interface OperatorWithStatus extends User {
  status: OperatorStatus;
  approvedAt?: string;
  suspendedAt?: string;
  performanceScore?: number;
}

export default function Operators() {
  const { laundryItems } = useData();
  const { toasts, showToast, removeToast } = useToast();
  const [operators, setOperators] = useState<OperatorWithStatus[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOperator, setSelectedOperator] = useState<OperatorWithStatus | null>(null);

  const calculatePerformanceScore = useCallback((operatorId: string): number => {
    const operatorOrders = laundryItems.filter(item => item.operatorId === operatorId);
    const completedOrders = operatorOrders.filter(item => item.status === 'delivered');
    const onTimeDeliveries = completedOrders.filter(() => {
      // Mock on-time calculation - in real app, compare estimated vs actual delivery time
      return Math.random() > 0.2; // 80% on-time rate mock
    });
    return completedOrders.length > 0 ? Math.round((onTimeDeliveries.length / completedOrders.length) * 100) : 0;
  }, [laundryItems]);

  useEffect(() => {
    const usersData = localStorage.getItem('users');
    let allUsers: User[] = [];
    
    if (usersData) {
      allUsers = JSON.parse(usersData);
    } else {
      // Mock operators data
      allUsers = [
        {
          id: 'op_1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@laundryhub.com',
          rollNumber: 'OP001',
          hostel: 'MH-A',
          role: 'operator',
          password: 'defaultpassword',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'op_2',
          name: 'Priya Sharma',
          email: 'priya.sharma@laundryhub.com',
          rollNumber: 'OP002',
          hostel: 'MH-B',
          role: 'operator',
          password: 'defaultpassword',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'op_3',
          name: 'Amit Singh',
          email: 'amit.singh@laundryhub.com',
          rollNumber: 'OP003',
          hostel: 'LH-A',
          role: 'operator',
          password: 'defaultpassword',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'op_4',
          name: 'Sneha Patel',
          email: 'sneha.patel@laundryhub.com',
          rollNumber: 'OP004',
          hostel: 'LH-B',
          role: 'operator',
          password: 'defaultpassword',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'op_5',
          name: 'Vikram Joshi',
          email: 'vikram.joshi@laundryhub.com',
          rollNumber: 'OP005',
          hostel: 'MH-C',
          role: 'operator',
          password: 'defaultpassword',
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('users', JSON.stringify(allUsers));
    }

    const operatorsWithStatus: OperatorWithStatus[] = allUsers
      .filter(u => u.role === 'operator')
      .map(op => ({
        ...op,
        status: (op as OperatorWithStatus).status || 'active',
        approvedAt: (op as OperatorWithStatus).approvedAt || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        suspendedAt: (op as OperatorWithStatus).suspendedAt,
        performanceScore: calculatePerformanceScore(op.id)
      }));
    setOperators(operatorsWithStatus);
  }, [calculatePerformanceScore]);

  const getOperatorStats = (operatorId: string) => {
    const today = new Date().toDateString();
    const scansToday = laundryItems.filter(item => item.operatorId === operatorId && new Date(item.submittedAt).toDateString() === today).length;
    return { scansToday };
  };

  const filteredOperators = operators.filter(op => {
    const matchesSearch = op.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHostel = hostelFilter === 'all' || op.hostel === hostelFilter;
    const matchesStatus = statusFilter === 'all' || op.status === statusFilter;
    return matchesSearch && matchesHostel && matchesStatus;
  });

  const handleApproveOperator = (operatorId: string) => {
    const updated = operators.map(op =>
      op.id === operatorId
        ? { ...op, status: 'active' as OperatorStatus, approvedAt: new Date().toISOString() }
        : op
    );
    setOperators(updated);
    updateOperatorInStorage(updated.find(op => op.id === operatorId)!);
    showToast('Operator approved successfully', 'success');
  };

  const handleRejectOperator = (operatorId: string) => {
    const updated = operators.filter(op => op.id !== operatorId);
    setOperators(updated);
    // Remove from storage
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const filteredUsers = usersData.filter((u: User) => u.id !== operatorId);
    localStorage.setItem('users', JSON.stringify(filteredUsers));
    showToast('Operator rejected and removed', 'success');
  };

  const handleSuspendOperator = (operatorId: string) => {
    const updated = operators.map(op =>
      op.id === operatorId
        ? { ...op, status: 'suspended' as OperatorStatus, suspendedAt: new Date().toISOString() }
        : op
    );
    setOperators(updated);
    updateOperatorInStorage(updated.find(op => op.id === operatorId)!);
    showToast('Operator suspended', 'warning');
  };

  const handleAssignHostel = (operatorId: string, hostel: string) => {
    const updated = operators.map(op =>
      op.id === operatorId ? { ...op, hostel } : op
    );
    setOperators(updated);
    updateOperatorInStorage(updated.find(op => op.id === operatorId)!);
    showToast(`Operator assigned to ${hostel}`, 'success');
  };

  const updateOperatorInStorage = (operator: OperatorWithStatus) => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = usersData.map((u: User) =>
      u.id === operator.id ? { ...u, ...operator } : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  const getStatusIcon = (status: OperatorStatus) => {
    switch (status) {
      case 'active':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'suspended':
        return <UserX className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (status: OperatorStatus) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-purple-600" />
            Operator Management
          </h1>
          <p className="text-gray-600">Monitor operator activity & workload</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending Approval</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Hostels</option>
                <option value="MH">MH</option>
                <option value="LH">LH</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search operators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </GlassCard>

        {/* Operators Table */}
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Assigned Hostel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Performance</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Scans Today</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOperators.map(operator => {
                  const stats = getOperatorStats(operator.id);
                  return (
                    <tr key={operator.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{operator.name}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(operator.status)}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(operator.status)}`}>
                            {operator.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{operator.hostel || 'Unassigned'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Award className={`w-4 h-4 ${operator.performanceScore && operator.performanceScore >= 90 ? 'text-green-600' : operator.performanceScore && operator.performanceScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`} />
                          <span className="text-sm text-gray-900">{operator.performanceScore}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-900">{stats.scansToday}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1">
                          {operator.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveOperator(operator.id)}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectOperator(operator.id)}
                                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {operator.status === 'active' && (
                            <button
                              onClick={() => handleSuspendOperator(operator.id)}
                              className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded"
                              title="Suspend"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedOperator(operator)}
                            className="p-1 text-purple-600 hover:text-purple-800 hover:bg-purple-100 rounded"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>

        {/* Operator Activity Modal */}
        {selectedOperator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Operator Details & Scan Logs</h2>
                <button onClick={() => setSelectedOperator(null)} className="p-2 rounded hover:bg-gray-100">
                  ×
                </button>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{selectedOperator.name}</h3>
                      <p className="text-sm text-gray-600">{selectedOperator.email}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOperator.status)}`}>
                          {getStatusIcon(selectedOperator.status)}
                          <span className="ml-1">{selectedOperator.status}</span>
                        </span>
                        <span className="text-sm text-gray-600">
                          Performance: {selectedOperator.performanceScore}%
                        </span>
                      </div>
                    </div>
                    {selectedOperator.status === 'active' && (
                      <div className="flex items-center gap-2">
                        <select
                          value={selectedOperator.hostel || ''}
                          onChange={(e) => handleAssignHostel(selectedOperator.id, e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          <option value="">Unassigned</option>
                          <option value="MH">MH</option>
                          <option value="LH">LH</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Recent Scan Logs</h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {laundryItems
                      .filter(item => item.operatorId === selectedOperator.id)
                      .slice(0, 20)
                      .map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Activity className="w-4 h-4 text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.studentName}</p>
                              <p className="text-xs text-gray-600">QR: {item.qrCode || 'N/A'}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">{item.status}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    {laundryItems.filter(item => item.operatorId === selectedOperator.id).length === 0 && (
                      <p className="text-gray-500 text-center py-4">No scan logs available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
