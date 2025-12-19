import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, User, Tag, MessageSquare, CheckCircle } from 'lucide-react';
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

function ResolutionForm({ onResolve }: { onResolve: (resolution: string, remarks: string) => void }) {
  const [resolution, setResolution] = useState('');
  const [remarks, setRemarks] = useState('');
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolution.trim()) {
      showToast('Please provide a resolution', 'error');
      return;
    }
    onResolve(resolution.trim(), remarks.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resolution <span className="text-red-500">*</span>
        </label>
        <textarea
          value={resolution}
          onChange={(e) => setResolution(e.target.value)}
          placeholder="Describe how this complaint was resolved..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={3}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Admin Remarks (Optional)
        </label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Additional notes or remarks..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          rows={2}
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        Resolve Complaint
      </button>
    </form>
  );
}

export default function ComplaintDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [complaint, setComplaint] = useState<Complaint | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/admin/incidents');
      return;
    }

    // In a real app, this would fetch from API
    const complaintsData = localStorage.getItem('complaints');
    if (complaintsData) {
      const allComplaints: Complaint[] = JSON.parse(complaintsData);
      const foundComplaint = allComplaints.find(c => c.id === id);
      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        showToast('Complaint not found', 'error');
        navigate('/admin/incidents');
      }
    } else {
      // Mock data for demo
      const mockComplaints: Complaint[] = [
        {
          id: '1',
          studentId: 'student_1',
          studentName: 'John Doe',
          category: 'delay',
          description: 'My laundry has been delayed for 3 days without any update.',
          status: 'investigating',
          priority: 'high',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          studentId: 'student_2',
          studentName: 'Jane Smith',
          category: 'missing_clothes',
          description: 'One of my shirts is missing from the laundry bag.',
          status: 'resolved',
          priority: 'medium',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          resolution: 'Item was found in lost and found. Returned to student.',
          adminRemarks: 'Clothing item was misplaced during sorting process.'
        }
      ];

      const foundComplaint = mockComplaints.find(c => c.id === id);
      if (foundComplaint) {
        setComplaint(foundComplaint);
      } else {
        showToast('Complaint not found', 'error');
        navigate('/admin/incidents');
      }
    }
  }, [id, navigate, showToast]);

  const handleResolution = (resolution: string, remarks: string) => {
    setComplaint(prev => prev ? {
      ...prev,
      status: 'resolved',
      resolution,
      adminRemarks: remarks
    } : null);
    showToast('Complaint resolved successfully', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-yellow-100 text-yellow-800';
      case 'investigating': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'delay': return <Clock className="w-5 h-5" />;
      case 'missing_clothes': return <AlertTriangle className="w-5 h-5" />;
      case 'damage': return <AlertTriangle className="w-5 h-5" />;
      case 'operator_behavior': return <User className="w-5 h-5" />;
      default: return <MessageSquare className="w-5 h-5" />;
    }
  };

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading complaint details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/incidents')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Incident Management
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                {getCategoryIcon(complaint.category)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
                <p className="text-gray-600">ID: {complaint.id}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority} priority
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Complaint Information */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Complaint Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student
                    </span>
                    <span className="font-medium text-gray-900">{complaint.studentName}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Category
                    </span>
                    <span className="font-medium text-gray-900">{complaint.category.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600">Priority</span>
                    <span className={`font-medium ${complaint.priority === 'urgent' ? 'text-red-600' : complaint.priority === 'high' ? 'text-orange-600' : 'text-gray-900'}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Created
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{complaint.description}</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Resolution Section */}
            {complaint.status === 'investigating' && (
              <GlassCard className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Resolve Complaint</h2>
                <ResolutionForm
                  onResolve={handleResolution}
                />
              </GlassCard>
            )}

            {/* Resolution Details */}
            {complaint.resolution && (
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Resolution</h2>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h3 className="font-medium text-green-900 mb-2">Resolution Summary</h3>
                    <p className="text-green-700">{complaint.resolution}</p>
                  </div>
                  {complaint.adminRemarks && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-900 mb-2">Admin Remarks</h3>
                      <p className="text-blue-700">{complaint.adminRemarks}</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Status Timeline */}
          <div>
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Status Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium text-gray-900">Complaint Submitted</p>
                    <p className="text-sm text-gray-600">
                      {new Date(complaint.createdAt).toLocaleDateString()} at {new Date(complaint.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {complaint.status !== 'open' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Investigation Started</p>
                      <p className="text-sm text-gray-600">Status changed to investigating</p>
                    </div>
                  </div>
                )}

                {complaint.status === 'resolved' && (
                  <div className="flex items-start gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium text-gray-900">Complaint Resolved</p>
                      <p className="text-sm text-gray-600">Resolution provided</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}