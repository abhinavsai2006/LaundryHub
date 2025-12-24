import { useState } from 'react';
import { Clock, Settings, Save } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface TimeSlot {
  id: string;
  hostel: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  maxCapacity: number;
  isActive: boolean;
}

export default function TimeSlotGovernance() {
  const { toasts, showToast, removeToast } = useToast();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: '1',
      hostel: 'MH-A',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '20:00',
      maxCapacity: 50,
      isActive: true
    },
    {
      id: '2',
      hostel: 'MH-B',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '20:00',
      maxCapacity: 45,
      isActive: true
    }
  ]);

  const [settings, setSettings] = useState({
    lateSubmissionAcceptance: true,
    lateSubmissionGraceHours: 2,
    autoCloseAfterCutoff: true,
    cutoffTime: '22:00',
    maxClothesPerCycle: 10,
    maxWeeklySubmissions: 7
  });

  const [selectedHostel, setSelectedHostel] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const filteredSlots = selectedHostel === 'all'
    ? timeSlots
    : timeSlots.filter(slot => slot.hostel === selectedHostel);

  const handleSlotUpdate = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(slots =>
      slots.map(slot => slot.id === id ? { ...slot, ...updates } : slot)
    );
    showToast('Time slot updated', 'success');
  };

  const handleSettingsUpdate = () => {
    // In a real app, save to backend
    showToast('Settings updated successfully', 'success');
    setShowSettings(false);
  };

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: Date.now().toString(),
      hostel: 'MH-A',
      dayOfWeek: 'Monday',
      startTime: '08:00',
      endTime: '20:00',
      maxCapacity: 50,
      isActive: true
    };
    setTimeSlots([...timeSlots, newSlot]);
    showToast('Time slot added', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
            Time & Slot Governance
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Configure collection windows and capacity limits</p>
        </div>

        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={selectedHostel}
                onChange={(e) => setSelectedHostel(e.target.value)}
                className="px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base min-h-[44px]"
              >
                <option value="all">All Hostels</option>
                <option value="MH-A">MH-A</option>
                <option value="MH-B">MH-B</option>
                <option value="LH-A">LH-A</option>
              </select>
              <button
                onClick={addTimeSlot}
                className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium min-h-[44px] w-full sm:w-auto"
              >
                Add Time Slot
              </button>
            </div>
            <div className="flex justify-end sm:ml-auto">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm sm:text-base">System Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* System Settings Panel */}
        {showSettings && (
          <GlassCard className="p-4 sm:p-6 mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">System Settings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.lateSubmissionAcceptance}
                    onChange={(e) => setSettings(prev => ({ ...prev, lateSubmissionAcceptance: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Accept Late Submissions</span>
                </label>
                {settings.lateSubmissionAcceptance && (
                  <input
                    type="number"
                    value={settings.lateSubmissionGraceHours}
                    onChange={(e) => setSettings(prev => ({ ...prev, lateSubmissionGraceHours: parseInt(e.target.value) }))}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    placeholder="Grace hours"
                  />
                )}
              </div>

              <div>
                <label className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoCloseAfterCutoff}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoCloseAfterCutoff: e.target.checked }))}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-close After Cutoff</span>
                </label>
                {settings.autoCloseAfterCutoff && (
                  <input
                    type="time"
                    value={settings.cutoffTime}
                    onChange={(e) => setSettings(prev => ({ ...prev, cutoffTime: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Clothes per Cycle</label>
                <input
                  type="number"
                  value={settings.maxClothesPerCycle}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxClothesPerCycle: parseInt(e.target.value) }))}
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Weekly Submissions</label>
                <input
                  type="number"
                  value={settings.maxWeeklySubmissions}
                  onChange={(e) => setSettings(prev => ({ ...prev, maxWeeklySubmissions: parseInt(e.target.value) }))}
                  className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                />
              </div>
            </div>

            <div className="mt-4 sm:mt-6 flex justify-center sm:justify-end">
              <button
                onClick={handleSettingsUpdate}
                className="w-full sm:w-auto px-6 py-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 min-h-[48px]"
              >
                <Save className="w-4 h-4" />
                <span className="text-sm sm:text-base">Save Settings</span>
              </button>
            </div>
          </GlassCard>
        )}

        {/* Time Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredSlots.map(slot => (
            <GlassCard key={slot.id} className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 sm:mb-4 gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{slot.hostel} - {slot.dayOfWeek}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {slot.startTime} - {slot.endTime}
                  </p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer self-start sm:self-center">
                  <input
                    type="checkbox"
                    checked={slot.isActive}
                    onChange={(e) => handleSlotUpdate(slot.id, { isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-xs sm:text-sm text-gray-700 whitespace-nowrap">Active</span>
                </label>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Max Capacity</label>
                  <input
                    type="number"
                    value={slot.maxCapacity}
                    onChange={(e) => handleSlotUpdate(slot.id, { maxCapacity: parseInt(e.target.value) })}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Start Time</label>
                    <input
                      type="time"
                      value={slot.startTime}
                      onChange={(e) => handleSlotUpdate(slot.id, { startTime: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">End Time</label>
                    <input
                      type="time"
                      value={slot.endTime}
                      onChange={(e) => handleSlotUpdate(slot.id, { endTime: e.target.value })}
                      className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-base"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}