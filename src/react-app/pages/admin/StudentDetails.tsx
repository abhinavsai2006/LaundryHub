import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User } from '@/shared/laundry-types';
import { GraduationCap, ArrowLeft, Eye, EyeOff, AlertTriangle, Flag } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function StudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { laundryItems, qrCodes } = useData();
  const { toasts, showToast, removeToast } = useToast();
  const [student, setStudent] = useState<User | null>(null);
  const [suspiciousFlags, setSuspiciousFlags] = useState<string[]>([]);
  const [showMasked, setShowMasked] = useState(true);

  useEffect(() => {
    if (!id) {
      navigate('/admin/students');
      return;
    }

    const usersData = localStorage.getItem('users');
    if (usersData) {
      const allUsers: User[] = JSON.parse(usersData);
      const foundStudent = allUsers.find(u => u.id === id && u.role === 'student');
      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        showToast('Student not found', 'error');
        navigate('/admin/students');
      }
    }
  }, [id, navigate, showToast]);

  const getLaundryFrequency = (studentId: string) => {
    const studentOrders = laundryItems.filter(item => item.studentId === studentId);
    const thisWeek = studentOrders.filter(item => {
      const itemDate = new Date(item.submittedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate >= weekAgo;
    });
    const thisMonth = studentOrders.filter(item => {
      const itemDate = new Date(item.submittedAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return itemDate >= monthAgo;
    });

    return {
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      total: studentOrders.length,
      averagePerWeek: Math.round((thisMonth.length / 4) * 10) / 10
    };
  };

  const detectSuspiciousPatterns = (studentId: string) => {
    const frequency = getLaundryFrequency(studentId);
    const flags: string[] = [];

    if (frequency.thisWeek > 7) flags.push('High weekly frequency');
    if (frequency.averagePerWeek > 5) flags.push('Above average usage');
    if (frequency.thisMonth > 20) flags.push('Excessive monthly usage');

    // Check for unusual timing patterns
    const studentOrders = laundryItems.filter(item => item.studentId === studentId);
    const lateNightOrders = studentOrders.filter(item => {
      const hour = new Date(item.submittedAt).getHours();
      return hour >= 22 || hour <= 6;
    });
    if (lateNightOrders.length > studentOrders.length * 0.3) {
      flags.push('Frequent late-night submissions');
    }

    return flags;
  };

  const getQRStatus = (student: User) => {
    const studentQR = qrCodes.find(qr => qr.assignedTo === student.id);
    if (!studentQR) return 'No QR Assigned';
    return studentQR.status === 'assigned' || studentQR.status === 'in-use' || studentQR.status === 'verified' ? 'Active' : 'Inactive';
  };

  const flagSuspicious = (reason: string) => {
    setSuspiciousFlags(prev => [...prev, reason]);
    showToast('Student flagged manually', 'warning');
  };

  const maskName = (name: string) => {
    if (!showMasked) return name;
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  const maskRollNumber = (rollNumber?: string) => {
    if (!showMasked || !rollNumber) return rollNumber || '—';
    return rollNumber.substring(0, 2) + '*'.repeat(rollNumber.length - 4) + rollNumber.substring(rollNumber.length - 2);
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student details...</p>
        </div>
      </div>
    );
  }

  const frequency = getLaundryFrequency(student.id);
  const patterns = detectSuspiciousPatterns(student.id);
  const allFlags = [...patterns, ...suspiciousFlags];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/students')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Students
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {showMasked ? maskName(student.name) : student.name}
                </h1>
                <p className="text-gray-600">Student Profile & Activity</p>
              </div>
            </div>

            <button
              onClick={() => setShowMasked(!showMasked)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border hover:bg-gray-50"
            >
              {showMasked ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {showMasked ? 'Unmask' : 'Mask'} Data
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Full Name</span>
                <span className="font-medium text-gray-900">
                  {showMasked ? maskName(student.name) : student.name}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Email</span>
                <span className="font-medium text-gray-900">{student.email}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Registration Number</span>
                <span className="font-medium text-gray-900">
                  {showMasked ? maskRollNumber(student.rollNumber) : student.rollNumber || '—'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Hostel & Room</span>
                <span className="font-medium text-gray-900">{student.hostel} {student.room}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">QR Status</span>
                <span className={`font-medium ${getQRStatus(student) === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                  {getQRStatus(student)}
                </span>
              </div>
            </div>
          </GlassCard>

          {/* Laundry Frequency */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Laundry Frequency</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-blue-600">{frequency.thisWeek}</p>
                <p className="text-sm text-gray-600">This Week</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-3xl font-bold text-green-600">{frequency.thisMonth}</p>
                <p className="text-sm text-gray-600">This Month</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{frequency.averagePerWeek}</p>
                <p className="text-sm text-gray-600">Avg/Week</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-3xl font-bold text-gray-600">{frequency.total}</p>
                <p className="text-sm text-gray-600">Total Orders</p>
              </div>
            </div>
          </GlassCard>

          {/* Suspicious Patterns */}
          <GlassCard className="p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                Suspicious Patterns & Flags
              </h2>
              <button
                onClick={() => flagSuspicious('Manual flag')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Flag className="w-4 h-4" />
                Flag Manually
              </button>
            </div>

            {allFlags.length > 0 ? (
              <div className="space-y-3">
                {allFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <span className="text-red-700 font-medium">{flag}</span>
                    </div>
                    <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                      {patterns.includes(flag) ? 'Auto-detected' : 'Manual'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">No suspicious patterns detected</p>
                <p className="text-sm text-gray-500 mt-1">Student activity appears normal</p>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
}