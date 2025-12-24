import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { QrCode, Camera, AlertCircle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function AssignQR() {
  const [scannedCode, setScannedCode] = useState('');
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    rollNumber: '',
    gender: '',
    hostel: '',
    room: ''
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { qrCodes, updateQRCode, addQRCode } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  // Handle prefilled QR code from navigation state
  useEffect(() => {
    if (location.state?.prefilledCode) {
      setScannedCode(location.state.prefilledCode);
    }
  }, [location.state]);

  // Check if we returned from camera scanner with scanned data
  useEffect(() => {
    if (location.state?.scannedCode) {
      setScannedCode(location.state.scannedCode);
      showToast('QR Code scanned successfully', 'success');
      // Clear the state to prevent re-processing
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname, showToast]);

  const handleAssign = async () => {
    if (!scannedCode || !studentDetails.name || !studentDetails.rollNumber) {
      showToast('Please scan QR code and fill all required fields', 'error');
      return;
    }

    let qr = qrCodes.find(q => q.code === scannedCode);

    if (!qr) {
      // Create new QR code if it doesn't exist
      qr = await addQRCode({
        code: scannedCode,
        status: 'assigned'
      });
    }

    updateQRCode(qr.id, {
      assignedTo: `temp_${Date.now()}`, // Temporary ID until student registers
      assignedToName: studentDetails.name,
      assignedBy: user?.id,
      assignedAt: new Date().toISOString(),
      status: 'assigned'
    });

    // Store student details for later matching
    const pendingAssignments = JSON.parse(localStorage.getItem('pendingAssignments') || '[]');
    pendingAssignments.push({
      qrCode: scannedCode,
      studentDetails,
      assignedBy: user?.id,
      assignedAt: new Date().toISOString()
    });
    localStorage.setItem('pendingAssignments', JSON.stringify(pendingAssignments));

    showToast(`QR Code assigned to ${studentDetails.name}`, 'success');
    
    setTimeout(() => {
      navigate('/operator');
    }, 1500);
  };

  const hostels = ['MH-A', 'MH-B', 'MH-C', 'MH-D', 'LH-A', 'LH-B', 'LH-C', 'LH-D'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <QrCode className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              Assign QR Code
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Scan physical QR tag and assign to student</p>
          </div>

          <GlassCard className="p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="Scanned QR code will appear here"
                    className="flex-1 px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                    readOnly
                  />
                  <button
                    onClick={() => navigate('/operator/scan/camera', {
                      state: { returnPath: '/operator/assign' }
                    })}
                    className="flex items-center justify-center gap-2 px-3 sm:px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg min-h-[44px] min-w-[44px] flex-shrink-0"
                  >
                    <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Scan</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={studentDetails.name}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter student name"
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registration Number *
                  </label>
                  <input
                    type="text"
                    value={studentDetails.rollNumber}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, rollNumber: e.target.value }))}
                    placeholder="e.g., 21BCE0001"
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={studentDetails.gender}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hostel
                  </label>
                  <select
                    value={studentDetails.hostel}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, hostel: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  >
                    <option value="">Select hostel</option>
                    {hostels.map(hostel => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={studentDetails.room}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., 101"
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  />
                </div>
              </div>

              <button
                onClick={handleAssign}
                disabled={!scannedCode || !studentDetails.name || !studentDetails.rollNumber}
                className="w-full px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium min-h-[44px] flex items-center justify-center"
              >
                Assign QR Code to Student
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-3 sm:p-4 bg-blue-50/50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800 text-xs sm:text-sm">
                  <li>Click "Scan" to open camera and scan physical QR tag</li>
                  <li>Fill in student details (name and registration number required)</li>
                  <li>Click "Assign" to link QR code to student</li>
                  <li>Student can verify QR code in their app once registered</li>
                </ol>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

    </div>
  );
}