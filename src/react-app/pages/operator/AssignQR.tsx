import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { QrCode, Camera, AlertCircle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import CameraScanner from '@/react-app/components/CameraScanner';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function AssignQR() {
  const [showScanner, setShowScanner] = useState(false);
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

  const handleScan = (data: string) => {
    setScannedCode(data);
    setShowScanner(false);
    showToast('QR Code scanned successfully', 'success');
  };

  const handleAssign = async () => {
    if (!scannedCode || !studentDetails.name || !studentDetails.rollNumber) {
      showToast('Please scan QR code and fill all required fields', 'error');
      return;
    }

    let qr = qrCodes.find(q => q.code === scannedCode);
    
    if (!qr) {
      // Create new QR code if it doesn't exist
      qr = addQRCode({
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <QrCode className="w-8 h-8 text-blue-600" />
              Assign QR Code
            </h1>
            <p className="text-gray-600">Scan physical QR tag and assign to student</p>
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="space-y-6">
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                  <button
                    onClick={() => setShowScanner(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                  >
                    <Camera className="w-5 h-5" />
                    <span className="hidden sm:inline">Scan</span>
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    value={studentDetails.name}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter student name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={studentDetails.gender}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, gender: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select hostel</option>
                    {hostels.map(hostel => (
                      <option key={hostel} value={hostel}>{hostel}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={studentDetails.room}
                    onChange={(e) => setStudentDetails(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g., 101"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleAssign}
                disabled={!scannedCode || !studentDetails.name || !studentDetails.rollNumber}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                Assign QR Code to Student
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-4 bg-blue-50/50 border-blue-200">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">Instructions:</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-800">
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

      {showScanner && (
        <CameraScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}