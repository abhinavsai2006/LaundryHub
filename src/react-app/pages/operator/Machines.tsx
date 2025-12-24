import { useState } from 'react';
import { useData } from '@/react-app/contexts/DataContext';
import { WashingMachine, Wind, Settings, X, Eye, User, Package, MapPin, Mail, Phone } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { Machine } from '@/shared/laundry-types';

export default function Machines() {
  const { machines, laundryItems, users } = useData();
  const [showMachineDetails, setShowMachineDetails] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handleViewMachineDetails = (machine: Machine) => {
    setSelectedMachine(machine);
    setShowMachineDetails(true);
  };

  const getCurrentLaundryAssignment = (machineId: string) => {
    return laundryItems.find(item => item.machineId === machineId && 
      (item.status === 'washing' || item.status === 'drying' || item.status === 'picked_up'));
  };

  const getStudentInfo = (studentId: string) => {
    return users?.find(user => user.id === studentId);
  };

  const getMachineStatus = (machine: Machine) => {
    const currentAssignment = getCurrentLaundryAssignment(machine.id);
    if (currentAssignment) {
      return 'in-use';
    }
    return machine.status || 'available';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-700';
      case 'in-use':
        return 'bg-orange-100 text-orange-700';
      case 'maintenance':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getMachineIcon = (type: string) => {
    return type === 'washer' ? WashingMachine : Wind;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
            Machines
          </h1>
          <p className="text-sm sm:text-base text-gray-600">View and manage washing machines</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {machines.map(machine => {
            const MachineIcon = getMachineIcon(machine.type);
            return (
              <GlassCard key={machine.id} className="p-4 sm:p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0" onClick={() => handleViewMachineDetails(machine)}>
                    <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                      machine.type === 'washer' 
                        ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-br from-purple-500 to-purple-600'
                    }`}>
                      <MachineIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{machine.name}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 capitalize">{machine.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewMachineDetails(machine)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(getMachineStatus(machine))}`}>
                      <span className="capitalize">{getMachineStatus(machine)}</span>
                    </div>
                  </div>

                  {machine.currentQR && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Current QR</p>
                      <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{machine.currentQR}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                    <p className="text-xs sm:text-sm text-gray-700">
                      {machine.lastUpdated ? new Date(machine.lastUpdated).toLocaleString() : 'Never'}
                    </p>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {machines.length === 0 && (
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No machines available</p>
          </div>
        )}
      </div>

      {/* Machine Details Modal */}
      {showMachineDetails && selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className={`p-2 sm:p-3 rounded-xl flex-shrink-0 ${
                    selectedMachine.type === 'washer' 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-600'
                  }`}>
                    {selectedMachine.type === 'washer' ? 
                      <WashingMachine className="w-5 h-5 sm:w-6 sm:h-6 text-white" /> : 
                      <Wind className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    }
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{selectedMachine.name}</h2>
                    <p className="text-sm text-gray-600 capitalize">{selectedMachine.type} Machine Details</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowMachineDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Machine Status */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  Machine Status
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Current Status</p>
                    <div className={`inline-flex items-center gap-2 px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(getMachineStatus(selectedMachine))}`}>
                      <span className="capitalize">{getMachineStatus(selectedMachine)}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Last Updated</p>
                    <p className="text-sm sm:text-base text-gray-900">{selectedMachine.lastUpdated ? new Date(selectedMachine.lastUpdated).toLocaleString() : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Machine Type</p>
                    <p className="text-sm sm:text-base text-gray-900 capitalize">{selectedMachine.type}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500 mb-2">Machine ID</p>
                    <p className="text-xs sm:text-sm text-gray-900 font-mono break-all">{selectedMachine.id}</p>
                  </div>
                </div>
              </div>

              {/* Current Laundry Assignment */}
              {(() => {
                const currentAssignment = getCurrentLaundryAssignment(selectedMachine.id);
                if (!currentAssignment) {
                  return (
                    <div className="bg-green-50 rounded-lg p-6">
                      <div className="text-center">
                        <Package className="w-12 h-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Machine Available</h3>
                        <p className="text-gray-600">This machine is currently not assigned to any laundry order.</p>
                      </div>
                    </div>
                  );
                }

                const studentInfo = getStudentInfo(currentAssignment.studentId);

                return (
                  <div className="space-y-6">
                    {/* Current Assignment Header */}
                    <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        Current Laundry Assignment
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2">Order ID</p>
                          <p className="text-sm sm:text-base text-gray-900 font-mono">#{currentAssignment.id.slice(-8).toUpperCase()}</p>
                        </div>
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2">Current Status</p>
                          <div className={`inline-flex px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-medium ${getStatusColor(currentAssignment.status)}`}>
                            {currentAssignment.status.replace('_', ' ').toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Student Information */}
                    {studentInfo && (
                      <div className="bg-indigo-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                          Student Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="space-y-2 sm:space-y-3">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                              <p className="text-base sm:text-lg font-medium text-gray-900">{studentInfo.name}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                <Mail className="w-3 h-3 sm:w-4 sm:h-4" />
                                Email Address
                              </p>
                              <p className="text-sm sm:text-base text-gray-900 break-words">{studentInfo.email}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3 sm:w-4 sm:h-4" />
                                Mobile Number
                              </p>
                              <p className="text-sm sm:text-base text-gray-900">{studentInfo.phone || 'Not available'}</p>
                            </div>
                          </div>
                          <div className="space-y-2 sm:space-y-3">
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                                <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                                Hostel & Room
                              </p>
                              <p className="text-sm sm:text-base text-gray-900">
                                {studentInfo.hostel || 'Not specified'} - 
                                Room {studentInfo.room || 'Not specified'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500">Roll Number</p>
                              <p className="text-sm sm:text-base text-gray-900">{studentInfo.rollNumber || 'Not available'}</p>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                              <p className="text-sm sm:text-base text-gray-900">{studentInfo.gender || 'Not specified'}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Laundry Details */}
                    <div className="bg-green-50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Laundry Bag Details</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-500 mb-2">Items ({currentAssignment.items.length})</p>
                          <div className="space-y-2">
                            {currentAssignment.items.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-2 sm:p-3 border border-green-200">
                                <Package className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
                                <span className="text-xs sm:text-sm font-medium text-gray-900">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3 sm:space-y-4">
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">Bag Status</p>
                            <div className="bg-white rounded-lg p-3 sm:p-4 border border-green-200">
                              <div className="flex items-center justify-between mb-2 sm:mb-3">
                                <span className="text-xs sm:text-sm font-medium text-gray-900">Current Status</span>
                                <div className={`px-2 sm:px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(currentAssignment.status)}`}>
                                  {currentAssignment.status.replace('_', ' ').toUpperCase()}
                                </div>
                              </div>
                              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Progress:</span>
                                  <span className="font-medium">
                                    {currentAssignment.status === 'washing' ? '75%' :
                                     currentAssignment.status === 'drying' ? '90%' :
                                     currentAssignment.status === 'ready' ? '100%' : '50%'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Assigned Machine:</span>
                                  <span className="font-medium">{selectedMachine.name}</span>
                                </div>
                                {currentAssignment.operatorName && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">Operator:</span>
                                    <span className="font-medium">{currentAssignment.operatorName}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm text-gray-500 mb-2">QR Codes</p>
                            <div className="space-y-2">
                              {currentAssignment.qrCode && (
                                <div>
                                  <p className="text-xs text-gray-500">Student QR</p>
                                  <p className="text-xs sm:text-sm font-mono bg-white px-2 sm:px-3 py-2 rounded border break-all">{currentAssignment.qrCode}</p>
                                </div>
                              )}
                              {currentAssignment.bagQRCode && (
                                <div>
                                  <p className="text-xs text-gray-500">Bag QR</p>
                                  <p className="text-xs sm:text-sm font-mono bg-white px-2 sm:px-3 py-2 rounded border break-all">{currentAssignment.bagQRCode}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Complete Status Timeline */}
                    <div className="bg-blue-50 rounded-lg p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Complete Bag Status Timeline</h3>
                      <div className="space-y-2 sm:space-y-3">
                        {[
                          { status: 'submitted', label: 'Submitted', time: currentAssignment.submittedAt, icon: Package },
                          { status: 'picked_up', label: 'Picked Up', time: currentAssignment.pickedUpAt, icon: Package },
                          { status: 'washing', label: 'Washing', time: currentAssignment.washingStartedAt, icon: WashingMachine },
                          { status: 'drying', label: 'Drying', time: currentAssignment.dryingStartedAt, icon: Wind },
                          { status: 'ready', label: 'Ready for Pickup', time: currentAssignment.readyAt, icon: Package },
                          { status: 'delivered', label: 'Delivered', time: currentAssignment.deliveredAt, icon: Package }
                        ].map((step) => {
                          const isCompleted = step.time !== undefined;
                          const isCurrent = currentAssignment.status === step.status;
                          const IconComponent = step.icon;

                          return (
                            <div key={step.status} className={`flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg ${
                              isCurrent ? 'bg-blue-100 border-2 border-blue-300' :
                              isCompleted ? 'bg-green-100' : 'bg-gray-100'
                            }`}>
                              <div className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                                isCurrent ? 'bg-blue-500' :
                                isCompleted ? 'bg-green-500' : 'bg-gray-300'
                              }`}>
                                <IconComponent className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  isCurrent || isCompleted ? 'text-white' : 'text-gray-500'
                                }`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className={`font-medium text-sm sm:text-base ${
                                    isCurrent ? 'text-blue-900' :
                                    isCompleted ? 'text-green-900' : 'text-gray-500'
                                  }`}>
                                    {step.label}
                                  </span>
                                  {step.time && (
                                    <span className="text-xs sm:text-sm text-gray-600 ml-2 flex-shrink-0">
                                      {new Date(step.time).toLocaleString()}
                                    </span>
                                  )}
                                </div>
                                {isCurrent && (
                                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                                    Currently in progress on {selectedMachine.name}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Special Instructions */}
                    {currentAssignment.specialInstructions && (
                      <div className="bg-yellow-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Special Instructions</h3>
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-yellow-200">
                          <p className="text-sm sm:text-base text-gray-900">{currentAssignment.specialInstructions}</p>
                        </div>
                      </div>
                    )}

                    {/* Student Notes */}
                    {currentAssignment.studentNotes && (
                      <div className="bg-purple-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Student Notes</h3>
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-purple-200">
                          <p className="text-sm sm:text-base text-gray-900">{currentAssignment.studentNotes}</p>
                        </div>
                      </div>
                    )}

                    {/* Bag Photo */}
                    {currentAssignment.bagPhoto && (
                      <div className="bg-pink-50 rounded-lg p-4 sm:p-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Bag Photo</h3>
                        <div className="bg-white rounded-lg p-3 sm:p-4 border border-pink-200">
                          <img 
                            src={currentAssignment.bagPhoto} 
                            alt="Laundry bag" 
                            className="max-w-full h-auto rounded-lg shadow-sm"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => setShowMachineDetails(false)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-3 sm:py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium min-h-[44px] flex items-center justify-center"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
