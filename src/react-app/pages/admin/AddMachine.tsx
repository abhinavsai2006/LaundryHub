import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '@/react-app/contexts/DataContext';
import { useToast } from '@/react-app/hooks/useToast';
import { ArrowLeft, Settings, Shirt, CheckCircle } from 'lucide-react';

export default function AddMachinePage() {
  const navigate = useNavigate();
  const { addMachine } = useData();
  const { showToast } = useToast();

  const [newMachine, setNewMachine] = useState({
    name: '',
    type: 'washer' as 'washer' | 'dryer',
    hostel: 'MH',
    status: 'available' as 'available' | 'in-use' | 'maintenance'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMachine.name.trim()) {
      showToast('Please enter a machine name', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      addMachine(newMachine);
      showToast('Machine added successfully', 'success');
      navigate('/admin/machines');
    } catch (error) {
      showToast('Failed to add machine', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const machineTypes = [
    {
      value: 'washer' as const,
      label: 'Washer',
      icon: Shirt,
      description: 'Washing machine for laundry'
    },
    {
      value: 'dryer' as const,
      label: 'Dryer',
      icon: Settings,
      description: 'Drying machine for laundry'
    }
  ];

  const hostels = [
    { value: 'MH', label: 'Men\'s Hostel' },
    { value: 'LH', label: 'Ladies\' Hostel' }
  ];

  const statuses = [
    { value: 'available' as const, label: 'Available', color: 'text-green-600', bgColor: 'bg-green-100' },
    { value: 'in-use' as const, label: 'In Use', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { value: 'maintenance' as const, label: 'Maintenance', color: 'text-orange-600', bgColor: 'bg-orange-100' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-3 md:py-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => navigate('/admin/machines')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">Add New Machine</h1>
                <p className="text-gray-600 text-sm md:text-base hidden sm:block">Configure laundry machine settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 lg:px-8 py-4 md:py-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="p-4 md:p-8">
            <div className="mb-6 md:mb-8">
              <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-2">Machine Details</h2>
              <p className="text-gray-600 text-sm md:text-base">Configure the new laundry machine settings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Machine Name */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Machine Name *
                </label>
                <input
                  type="text"
                  value={newMachine.name}
                  onChange={(e) => setNewMachine(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Washer #1, Ground Floor Dryer"
                  className="w-full px-3 md:px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm md:text-base"
                  required
                />
                <p className="text-xs md:text-sm text-gray-500">Choose a descriptive name that includes location</p>
              </div>

              {/* Machine Type */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Machine Type *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {machineTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => setNewMachine(prev => ({ ...prev, type: type.value }))}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all min-h-[80px] md:min-h-[100px] flex items-center ${
                        newMachine.type === type.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <type.icon className={`w-6 h-6 md:w-8 md:h-8 flex-shrink-0 ${
                          newMachine.type === type.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <div className="min-w-0 flex-1">
                          <h3 className={`font-medium text-sm md:text-base ${
                            newMachine.type === type.value ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {type.label}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-500">{type.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hostel Assignment */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Assign to Hostel *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  {hostels.map((hostel) => (
                    <div
                      key={hostel.value}
                      onClick={() => setNewMachine(prev => ({ ...prev, hostel: hostel.value }))}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all min-h-[60px] md:min-h-[72px] flex items-center ${
                        newMachine.hostel === hostel.value
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${
                          newMachine.hostel === hostel.value ? 'bg-purple-500' : 'bg-gray-300'
                        }`}></div>
                        <span className={`font-medium text-sm md:text-base ${
                          newMachine.hostel === hostel.value ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                          {hostel.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Initial Status */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-900">
                  Initial Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {statuses.map((status) => (
                    <div
                      key={status.value}
                      onClick={() => setNewMachine(prev => ({ ...prev, status: status.value }))}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all min-h-[60px] md:min-h-[72px] flex items-center ${
                        newMachine.status === status.value
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <div className={`w-4 h-4 rounded-full flex-shrink-0 ${status.bgColor}`}></div>
                        <span className={`font-medium text-sm md:text-base ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs md:text-sm text-gray-500">You can change the status later from the machines list</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate('/admin/machines')}
                  className="flex-1 px-4 md:px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm md:text-base min-h-[48px] md:min-h-[52px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 md:px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base min-h-[48px] md:min-h-[52px]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm md:text-base">Adding Machine...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />
                      <span className="text-sm md:text-base">Add Machine</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 md:mt-8 bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
          <h3 className="text-base md:text-lg font-semibold text-blue-900 mb-3">💡 Tips for Adding Machines</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">Use descriptive names that include location (e.g., "Washer #1 - Ground Floor")</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">Assign machines to the correct hostel for proper organization</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="text-sm md:text-base">Set initial status to "Available" unless the machine needs maintenance</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}