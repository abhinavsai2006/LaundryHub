import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Bell, Moon, Lock, Globe, Trash2, Shirt, Pause, Heart, Smartphone, Users, Shield } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useData } from '@/react-app/contexts/DataContext';

export default function Settings() {
  const { toasts, showToast, removeToast } = useToast();
  const { user } = useAuth();
  const { updateUser } = useData();

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false
  });

  const [preferences, setPreferences] = useState({
    darkMode: false,
    language: 'en'
  });

  const [laundryPreferences, setLaundryPreferences] = useState({
    gentleWash: false,
    separateWhites: false,
    extraRinse: false,
    dryCleaning: false,
    foldOnly: false,
    noStarch: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    hideProfilePhoto: false,
    maskRoomNumber: false,
    hideContactInfo: false,
    allowRoommateView: false
  });

  const [laundryPause, setLaundryPause] = useState({
    paused: false,
    until: ''
  });

  const [roommateSharing, setRoommateSharing] = useState({
    enabled: false,
    roommateId: ''
  });

  // Load user settings on component mount
  useEffect(() => {
    if (user) {
      if (user.laundryPreferences) {
        setLaundryPreferences(user.laundryPreferences);
      }
      if (user.privacySettings) {
        setPrivacySettings(user.privacySettings);
      }
      if (user.laundryPaused !== undefined) {
        setLaundryPause({
          paused: user.laundryPaused,
          until: user.laundryPausedUntil || ''
        });
      }
      if (user.roommateSharing !== undefined) {
        setRoommateSharing({
          enabled: user.roommateSharing,
          roommateId: user.sharedWithRoommate || ''
        });
      }
    }
  }, [user]);

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    showToast('Notification preferences updated', 'success');
  };

  const handleDarkModeToggle = () => {
    setPreferences(prev => ({
      ...prev,
      darkMode: !prev.darkMode
    }));
    showToast('Theme preference updated', 'success');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences(prev => ({
      ...prev,
      language: e.target.value
    }));
    showToast('Language preference updated', 'success');
  };

  const handleLaundryPreferenceToggle = (preference: keyof typeof laundryPreferences) => {
    const newPreferences = {
      ...laundryPreferences,
      [preference]: !laundryPreferences[preference]
    };
    setLaundryPreferences(newPreferences);

    if (user && updateUser) {
      updateUser(user.id, { laundryPreferences: newPreferences } as any); // Type assertion if needed
      showToast('Laundry preferences updated', 'success');
    }
  };

  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    const newPrivacySettings = {
      ...privacySettings,
      [setting]: !privacySettings[setting]
    };
    setPrivacySettings(newPrivacySettings);

    if (user && updateUser) {
      updateUser(user.id, { privacySettings: newPrivacySettings } as any);
      showToast('Privacy settings updated', 'success');
    }
  };

  const handleLaundryPauseToggle = () => {
    const newPaused = !laundryPause.paused;
    setLaundryPause(prev => ({ ...prev, paused: newPaused }));

    if (user) {
      updateUser(user.id, {
        laundryPaused: newPaused,
        laundryPausedUntil: newPaused ? laundryPause.until : undefined
      });
      showToast(newPaused ? 'Laundry submissions paused' : 'Laundry submissions resumed', 'success');
    }
  };

  const handlePauseUntilChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const until = e.target.value;
    setLaundryPause(prev => ({ ...prev, until }));

    if (user && laundryPause.paused) {
      updateUser(user.id, { laundryPausedUntil: until });
    }
  };

  const handleRoommateSharingToggle = () => {
    const newEnabled = !roommateSharing.enabled;
    setRoommateSharing(prev => ({ ...prev, enabled: newEnabled }));

    if (user) {
      updateUser(user.id, {
        roommateSharing: newEnabled,
        sharedWithRoommate: newEnabled ? roommateSharing.roommateId : undefined
      });
      showToast(newEnabled ? 'Roommate sharing enabled' : 'Roommate sharing disabled', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <SettingsIcon className="w-8 h-8 text-blue-600" />
              Settings
            </h1>
            <p className="text-gray-600">Manage your app preferences</p>
          </div>

          {/* Notifications */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications.email ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive push notifications</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('push')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.push ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications.push ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">SMS Notifications</p>
                  <p className="text-sm text-gray-600">Receive SMS updates</p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('sms')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    notifications.sms ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications.sms ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Laundry Preferences */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shirt className="w-5 h-5 text-blue-600" />
              Laundry Preferences
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(laundryPreferences).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleLaundryPreferenceToggle(key as keyof typeof laundryPreferences)}
                    className={`relative w-14 h-7 rounded-full transition-colors ${
                      value ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                        value ? 'translate-x-7' : ''
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              These preferences will be automatically applied to your future laundry submissions.
            </p>
          </GlassCard>

          {/* Privacy & Visibility Controls */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Privacy & Visibility
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Hide Profile Photo</p>
                  <p className="text-sm text-gray-600">Don't show your photo to operators</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('hideProfilePhoto')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    privacySettings.hideProfilePhoto ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      privacySettings.hideProfilePhoto ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Mask Room Number</p>
                  <p className="text-sm text-gray-600">Hide your room number from operators</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('maskRoomNumber')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    privacySettings.maskRoomNumber ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      privacySettings.maskRoomNumber ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Hide Contact Info</p>
                  <p className="text-sm text-gray-600">Don't share contact details</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('hideContactInfo')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    privacySettings.hideContactInfo ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      privacySettings.hideContactInfo ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-gray-900">Allow Roommate View</p>
                  <p className="text-sm text-gray-600">Let your roommate see your laundry status</p>
                </div>
                <button
                  onClick={() => handlePrivacyToggle('allowRoommateView')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    privacySettings.allowRoommateView ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      privacySettings.allowRoommateView ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Laundry Pause Management */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Pause className="w-5 h-5 text-blue-600" />
              Laundry Pause
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Pause Laundry Submissions</p>
                  <p className="text-sm text-gray-600">Temporarily stop accepting new laundry</p>
                </div>
                <button
                  onClick={handleLaundryPauseToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    laundryPause.paused ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      laundryPause.paused ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              {laundryPause.paused && (
                <div className="py-3">
                  <label className="block font-medium text-gray-900 mb-2">
                    Pause Until (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={laundryPause.until}
                    onChange={handlePauseUntilChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}

              {laundryPause.paused && (
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-800">
                    🚫 Your laundry submissions are currently paused. No new orders will be accepted until you resume.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Favorite Setups */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-blue-600" />
              Favorite Setups
            </h2>
            {user?.favoriteSetups && user.favoriteSetups.length > 0 ? (
              <div className="space-y-3">
                {user.favoriteSetups.map((setup) => (
                  <div key={setup.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{setup.name}</h3>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Use This Setup
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {setup.items.join(', ')}
                    </p>
                    {setup.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {setup.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No favorite setups yet</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Create Your First Setup
                </button>
              </div>
            )}
          </GlassCard>

          {/* Device Sessions */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-600" />
              Active Sessions
            </h2>
            {user?.deviceSessions && user.deviceSessions.length > 0 ? (
              <div className="space-y-3">
                {user.deviceSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{session.deviceName}</p>
                        <p className="text-sm text-gray-600">
                          {session.deviceType} • Last active {new Date(session.lastActive).toLocaleDateString()}
                        </p>
                        {session.isCurrent && (
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full mt-1">
                            Current Session
                          </span>
                        )}
                      </div>
                    </div>
                    {!session.isCurrent && (
                      <button className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium border border-red-200 rounded hover:bg-red-50">
                        Logout
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No active sessions</p>
            )}
          </GlassCard>

          {/* Roommate Sharing */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Roommate Sharing
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Enable Roommate View</p>
                  <p className="text-sm text-gray-600">Share your laundry status with roommate</p>
                </div>
                <button
                  onClick={handleRoommateSharingToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    roommateSharing.enabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      roommateSharing.enabled ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              {roommateSharing.enabled && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800 mb-3">
                    👀 Your roommate can now view your laundry status and coordinate pickups.
                  </p>
                  <p className="text-xs text-blue-600">
                    This helps avoid conflicts and ensures smooth laundry operations for shared spaces.
                  </p>
                </div>
              )}
            </div>
          </GlassCard>
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Moon className="w-5 h-5 text-blue-600" />
              Appearance
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-900">Dark Mode</p>
                  <p className="text-sm text-gray-600">Enable dark theme</p>
                </div>
                <button
                  onClick={handleDarkModeToggle}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    preferences.darkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      preferences.darkMode ? 'translate-x-7' : ''
                    }`}
                  />
                </button>
              </div>

              <div className="py-3">
                <label className="block font-medium text-gray-900 mb-2">
                  <Globe className="inline w-4 h-4 mr-2" />
                  Language
                </label>
                <select
                  value={preferences.language}
                  onChange={handleLanguageChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
          </GlassCard>

          {/* Security */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" />
              Security
            </h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-600">Update your password</p>
              </button>
              <button className="w-full px-4 py-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all">
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security</p>
              </button>
            </div>
          </GlassCard>

          {/* Danger Zone */}
          <GlassCard className="p-6 border-red-200 bg-red-50/50">
            <h2 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-red-600" />
              Danger Zone
            </h2>
            <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
              Delete Account
            </button>
            <p className="text-sm text-red-800 mt-2">
              Once you delete your account, there is no going back. Please be certain.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
