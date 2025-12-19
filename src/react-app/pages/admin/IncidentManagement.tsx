import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, AlertCircle, User } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface Complaint {
  id: string;
  studentId: string;
  studentName: string;
  category: 'delay' | 'missing_clothes' | 'damage' | 'operator_behavior' | 'other';
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  assignedTo?: string;
  resolution?: string;
  adminRemarks?: string;
}

export default function IncidentManagement() {
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      studentId: 'student_1',
      studentName: 'John Doe',
      category: 'delay',
      description: 'Laundry took more than 48 hours to complete',
      status: 'investigating',
      priority: 'medium',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'admin'
    },
    {
      id: '2',
      studentId: 'student_2',
      studentName: 'Jane Smith',
      category: 'missing_clothes',
      description: 'One shirt is missing from my laundry bag',
      status: 'open',
      priority: 'high',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      studentId: 'student_3',
      studentName: 'Bob Johnson',
      category: 'damage',
      description: 'Clothes came back with stains',
      status: 'resolved',
      priority: 'medium',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      resolution: 'Compensation provided',
      adminRemarks: 'Stains were pre-existing'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || complaint.category === filterCategory;
    return matchesStatus && matchesCategory;
  });

  const handleStatusUpdate = (complaintId: string, newStatus: Complaint['status']) => {
    setComplaints(complaints.map(c =>
      c.id === complaintId ? { ...c, status: newStatus } : c
    ));
    showToast(`Complaint status updated to ${newStatus}`, 'success');
  };

  const handleAssign = (complaintId: string, assignedTo: string) => {
    setComplaints(complaints.map(c =>
      c.id === complaintId ? { ...c, assignedTo } : c
    ));
    showToast('Complaint assigned successfully', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-purple-600" />
            Incident & Complaint Management
          </h1>
          <p className="text-gray-600">Handle student complaints and resolve issues</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <AlertCircle className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="delay">Delay</option>
                <option value="missing_clothes">Missing Clothes</option>
                <option value="damage">Damage</option>
                <option value="operator_behavior">Operator Behavior</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Complaints List */}
        <div className="space-y-4">
          {filteredComplaints.map(complaint => (
            <GlassCard key={complaint.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="w-5 h-5 text-purple-600" />
                    <h3 className="font-semibold text-gray-900">{complaint.studentName}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Category:</strong> {complaint.category.replace('_', ' ')}
                  </p>
                  <p className="text-gray-700 mb-2">{complaint.description}</p>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                  {complaint.assignedTo && (
                    <p className="text-xs text-blue-600 mt-1">
                      Assigned to: {complaint.assignedTo}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/incidents/${complaint.id}`)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  {complaint.status === 'open' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(complaint.id, 'investigating')}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleAssign(complaint.id, 'admin')}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Assign to Me
                      </button>
                    </>
                  )}
                  {complaint.status === 'investigating' && (
                    <button
                      onClick={() => navigate(`/admin/incidents/${complaint.id}`)}
                      className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                    >
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              {complaint.resolution && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm font-medium text-green-800 mb-1">Resolution</p>
                  <p className="text-sm text-green-700">{complaint.resolution}</p>
                  {complaint.adminRemarks && (
                    <p className="text-sm text-green-600 mt-1">
                      <strong>Admin Remarks:</strong> {complaint.adminRemarks}
                    </p>
                  )}
                </div>
              )}
            </GlassCard>
          ))}
        </div>

        {filteredComplaints.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No complaints found</p>
          </div>
        )}
      </div>
    </div>
  );
}