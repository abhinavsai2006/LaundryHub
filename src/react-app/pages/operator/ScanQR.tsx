import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { QrCode, Camera, CheckCircle, Package, Sparkles, TrendingUp, Bell, ArrowRight } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { LaundryItem, Machine, LaundryStatus } from '@/shared/laundry-types';

const statusFlow = [
  { key: 'submitted', label: 'Submitted', icon: Package, next: 'picked_up', description: 'Laundry submitted by student' },
  { key: 'picked_up', label: 'Picked Up', icon: CheckCircle, next: 'washing', description: 'Laundry collected from student' },
  { key: 'washing', label: 'Washing', icon: Sparkles, next: 'drying', description: 'Washing cycle in progress' },
  { key: 'drying', label: 'Drying', icon: TrendingUp, next: 'ready', description: 'Drying cycle in progress' },
  { key: 'ready', label: 'Ready', icon: Bell, next: 'delivered', description: 'Laundry ready for pickup' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, next: null, description: 'Laundry delivered to student' }
];

export default function ScanQR() {
  const navigate = useNavigate();
  const location = useLocation();
  const [scannedCode, setScannedCode] = useState('');
  const [currentOrder, setCurrentOrder] = useState<LaundryItem | null>(null);
  const [selectedMachineId, setSelectedMachineId] = useState('');
  const [availableMachines, setAvailableMachines] = useState<Machine[]>([]);
  const { laundryItems, updateLaundryItem, machines } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  // Check if we returned from camera scanner with scanned data
  useEffect(() => {
    if (location.state?.scannedCode) {
      setScannedCode(location.state.scannedCode);
      processScannedCode(location.state.scannedCode);
      // Clear the state to prevent re-processing
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Filter machines based on current order's hostel (if available)
  useEffect(() => {
    if (currentOrder) {
      // For now, show all machines. In a real app, you'd filter by hostel
      setAvailableMachines(machines.filter(m => m.status === 'available'));
    } else {
      setAvailableMachines([]);
    }
  }, [currentOrder, machines]);

  const handleOpenScanner = () => {
    navigate('/operator/scan/camera', {
      state: { returnPath: '/operator/scan' }
    });
  };

  const processScannedCode = (code: string) => {
    // Find laundry item by QR code (bag QR or regular QR)
    const order = laundryItems.find(item => item.qrCode === code || item.bagQRCode === code);

    if (!order) {
      showToast('No laundry order found for this QR code', 'error');
      setCurrentOrder(null);
      return;
    }

    // Validate QR is assigned and verified
    // For demo purposes, we'll allow processing even if not verified
    // In production, you'd check if the QR code status is 'verified'

    setCurrentOrder(order);
    setSelectedMachineId(''); // Reset machine selection
    showToast('Laundry order found! Ready to update status.', 'success');
  };

  const handleManualScan = () => {
    if (scannedCode.trim()) {
      processScannedCode(scannedCode.trim());
    }
  };

  const getCurrentStatusInfo = () => {
    if (!currentOrder) return null;
    return statusFlow.find(step => step.key === currentOrder.status);
  };

  const getNextStatusInfo = () => {
    if (!currentOrder) return null;
    const currentIndex = statusFlow.findIndex(step => step.key === currentOrder.status);
    return statusFlow[currentIndex + 1] || null;
  };

  const handleStatusUpdate = () => {
    if (!currentOrder) return;

    const currentStatusIndex = statusFlow.findIndex(step => step.key === currentOrder.status);
    const nextStatus = statusFlow[currentStatusIndex]?.next;

    if (!nextStatus) {
      showToast('Order is already completed', 'info');
      return;
    }

    const updateData: Partial<LaundryItem> = {
      status: nextStatus as LaundryStatus,
      operatorId: user?.id,
      operatorName: user?.name
    };

    const now = new Date().toISOString();

    // Set timestamp for the new status
    switch (nextStatus) {
      case 'picked_up':
        updateData.pickedUpAt = now;
        break;
      case 'washing':
        updateData.washingStartedAt = now;
        if (selectedMachineId) {
          const machine = machines.find(m => m.id === selectedMachineId);
          updateData.machineId = selectedMachineId;
          updateData.machineName = machine?.name;
        }
        break;
      case 'drying':
        updateData.dryingStartedAt = now;
        if (selectedMachineId) {
          const machine = machines.find(m => m.id === selectedMachineId);
          updateData.machineId = selectedMachineId;
          updateData.machineName = machine?.name;
        }
        break;
      case 'ready':
        updateData.readyAt = now;
        break;
      case 'delivered':
        updateData.deliveredAt = now;
        break;
    }

    updateLaundryItem(currentOrder.id, updateData);
    setCurrentOrder({ ...currentOrder, ...updateData });

    const nextStatusInfo = getNextStatusInfo();
    showToast(`Status updated to ${nextStatusInfo?.label || 'Completed'}`, 'success');

    // Reset for next scan
    setScannedCode('');
    setCurrentOrder(null);
    setSelectedMachineId('');
  };

  const currentStatusInfo = getCurrentStatusInfo();
  const nextStatusInfo = getNextStatusInfo();
  const CurrentIconComponent = currentStatusInfo?.icon;
  const NextIconComponent = nextStatusInfo?.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <QrCode className="w-8 h-8 text-blue-600" />
              Scan QR Code
            </h1>
            <p className="text-gray-600">Scan laundry bag QR to update status</p>
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="space-y-6">
              {/* QR Code Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  QR Code
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={scannedCode}
                    onChange={(e) => setScannedCode(e.target.value)}
                    placeholder="Enter or scan QR code"
                    className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleOpenScanner}
                    className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    Scan
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-2">
                  <button
                    onClick={handleManualScan}
                    disabled={!scannedCode.trim()}
                    className="w-full sm:flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Process QR Code
                  </button>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.reload();
                    }}
                    className="w-full sm:w-auto px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                  >
                    Reset Data
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Order Details and Status Update */}
          {currentOrder && (
            <GlassCard className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h3>

                  {/* Student Information */}
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Student Name</p>
                        <p className="font-medium text-gray-900">{currentOrder.studentName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Items</p>
                        <p className="font-medium text-gray-900">
                          {Array.isArray(currentOrder.items) ? currentOrder.items.join(', ') : currentOrder.items}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status Information */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Current Status</p>
                        <div className="flex items-center gap-2">
                          {currentStatusInfo && (
                            <>
                              {CurrentIconComponent && <CurrentIconComponent className="w-5 h-5 text-blue-600" />}
                              <div>
                                <span className="font-medium text-gray-900">{currentStatusInfo.label}</span>
                                <p className="text-xs text-gray-500">{currentStatusInfo.description}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Next Status</p>
                        <div className="flex items-center gap-2">
                          {nextStatusInfo ? (
                            <>
                              {NextIconComponent && <NextIconComponent className="w-5 h-5 text-green-600" />}
                              <div>
                                <span className="font-medium text-gray-900">{nextStatusInfo.label}</span>
                                <p className="text-xs text-gray-500">{nextStatusInfo.description}</p>
                              </div>
                            </>
                          ) : (
                            <span className="text-gray-500">Order Completed</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Machine Selection (Optional) */}
                  {(nextStatusInfo?.key === 'washing' || nextStatusInfo?.key === 'drying') && availableMachines.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Machine (Optional)
                      </label>
                      <select
                        value={selectedMachineId}
                        onChange={(e) => setSelectedMachineId(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select machine (optional)</option>
                        {availableMachines.map(machine => (
                          <option key={machine.id} value={machine.id}>
                            {machine.name} ({machine.type}) - {machine.status}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        Recommended for {nextStatusInfo.key} status updates
                      </p>
                    </div>
                  )}

                  {/* Status Update Button */}
                  {nextStatusInfo && (
                    <button
                      onClick={handleStatusUpdate}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg flex items-center justify-center gap-2 font-medium"
                    >
                      <ArrowRight className="w-5 h-5" />
                      Update to {nextStatusInfo.label}
                      {selectedMachineId && (
                        <span className="text-sm">
                          (with {machines.find(m => m.id === selectedMachineId)?.name})
                        </span>
                      )}
                    </button>
                  )}

                  {!nextStatusInfo && (
                    <div className="text-center py-4">
                      <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                      <p className="text-gray-600">This order has been completed and delivered.</p>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}
