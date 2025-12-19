import { useState } from 'react';
import { Settings, Save, Bell, ToggleLeft, ToggleRight } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface SettingsType {
  capacityPerHostel: number;
  enableStatusStages: boolean;
  delayThreshold: number;
  notificationsEnabled: boolean;
  autoAssignQRCodes: boolean;
  maxLaundryPerStudentPerWeek: number;
  enableQRVerification: boolean;
  enableOperatorAssignment: boolean;
  enableLostAndFound: boolean;
}

export default function SystemSettings() {
  const { toasts, showToast, removeToast } = useToast();
  const [settings, setSettings] = useState<SettingsType>(() => {
    const saved = localStorage.getItem('systemSettings');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock default settings
    return {
      capacityPerHostel: 100,
      enableStatusStages: true,
      delayThreshold: 2,
      notificationsEnabled: true,
      autoAssignQRCodes: false,
      maxLaundryPerStudentPerWeek: 7,
      enableQRVerification: true,
      enableOperatorAssignment: true,
      enableLostAndFound: true
    };
  });

  const handleSave = () => {
    // Mock save to localStorage
    localStorage.setItem('systemSettings', JSON.stringify(settings));
    showToast('Settings saved successfully', 'success');
  };

  const updateSetting = <K extends keyof SettingsType>(key: K, value: SettingsType[K]) => {
    setSettings((prev: SettingsType) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Settings className="w-8 h-8 text-purple-600" />
              System Settings
            </h1>
            <p className="text-gray-600">Configuration control</p>
          </div>

          <div className="space-y-6">
            {/* Laundry Capacity */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Laundry Capacity</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity per Hostel/Day
                  </label>
                  <input
                    type="number"
                    value={settings.capacityPerHostel}
                    onChange={(e) => updateSetting('capacityPerHostel', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum laundry bags accepted per hostel per day</p>
                </div>
              </div>
            </GlassCard>

            {/* Laundry Limits */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Laundry Limits</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Laundry per Student per Week
                  </label>
                  <input
                    type="number"
                    value={settings.maxLaundryPerStudentPerWeek}
                    onChange={(e) => updateSetting('maxLaundryPerStudentPerWeek', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum laundry submissions allowed per student per week</p>
                </div>
              </div>
            </GlassCard>

            {/* Process Steps */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Process Steps</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable Status Stages</h3>
                    <p className="text-sm text-gray-600">Allow tracking through submitted, picked up, washing, drying, ready, delivered</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableStatusStages', !settings.enableStatusStages)}
                    className={`p-2 rounded-full ${settings.enableStatusStages ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    {settings.enableStatusStages ? (
                      <ToggleRight className="w-6 h-6 text-white" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable QR Verification</h3>
                    <p className="text-sm text-gray-600">Require QR code scanning for laundry submission and collection</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableQRVerification', !settings.enableQRVerification)}
                    className={`p-2 rounded-full ${settings.enableQRVerification ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    {settings.enableQRVerification ? (
                      <ToggleRight className="w-6 h-6 text-white" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable Operator Assignment</h3>
                    <p className="text-sm text-gray-600">Allow operators to be assigned to laundry sessions</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableOperatorAssignment', !settings.enableOperatorAssignment)}
                    className={`p-2 rounded-full ${settings.enableOperatorAssignment ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    {settings.enableOperatorAssignment ? (
                      <ToggleRight className="w-6 h-6 text-white" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable Lost & Found</h3>
                    <p className="text-sm text-gray-600">Allow students to report and claim lost items</p>
                  </div>
                  <button
                    onClick={() => updateSetting('enableLostAndFound', !settings.enableLostAndFound)}
                    className={`p-2 rounded-full ${settings.enableLostAndFound ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    {settings.enableLostAndFound ? (
                      <ToggleRight className="w-6 h-6 text-white" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delay Threshold (hours)
                  </label>
                  <input
                    type="number"
                    value={settings.delayThreshold}
                    onChange={(e) => updateSetting('delayThreshold', parseInt(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">Hours after submission to mark as delayed</p>
                </div>
              </div>
            </GlassCard>

            {/* Notifications */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-purple-600" />
                Notification Settings
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Enable Notifications</h3>
                    <p className="text-sm text-gray-600">Send alerts for delays, maintenance, and high load</p>
                  </div>
                  <button
                    onClick={() => updateSetting('notificationsEnabled', !settings.notificationsEnabled)}
                    className={`p-2 rounded-full ${settings.notificationsEnabled ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    {settings.notificationsEnabled ? (
                      <ToggleRight className="w-6 h-6 text-white" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* QR Code Management */}
            <GlassCard className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">QR Code Management</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Auto-assign QR Codes</h3>
                    <p className="text-sm text-gray-600">Automatically assign QR codes to new laundry submissions</p>
                  </div>
                  <button
                    onClick={() => updateSetting('autoAssignQRCodes', !settings.autoAssignQRCodes)}
                    className={`p-2 rounded-full ${settings.autoAssignQRCodes ? 'bg-purple-600' : 'bg-gray-300'}`}
                  >
                    {settings.autoAssignQRCodes ? (
                      <ToggleRight className="w-6 h-6 text-white" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <button className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors mr-3">
                    Reissue QR Codes
                  </button>
                  <p className="text-xs text-gray-500">Generate new QR codes for all students (keeps assignments)</p>
                  <br />
                  <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mr-3">
                    Reset All QR Codes
                  </button>
                  <p className="text-xs text-gray-500">This will unassign all QR codes and reset the system</p>
                </div>
              </div>
            </GlassCard>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all shadow-lg font-medium"
              >
                <Save className="w-5 h-5" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}