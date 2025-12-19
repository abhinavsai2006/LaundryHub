import { useState } from 'react';

import { Bell, Plus, Trash2, Send } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface Announcement {
  id: string;
  title: string;
  message: string;
  hostel?: string;
  gender?: string;
  priority: 'normal' | 'high' | 'urgent';
  createdAt: string;
  active: boolean;
  scheduledFor?: string;
  expiresAt?: string;
}

export default function Announcements() {
  const { toasts, showToast, removeToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('announcements');
    if (saved) return JSON.parse(saved);
    
    // Mock data
    return [
      {
        id: 'announcement_1',
        title: 'Laundry Service Maintenance',
        message: 'The laundry service will be undergoing maintenance from 2 AM to 4 AM tonight. Please plan your laundry accordingly.',
        hostel: 'MH-A',
        gender: undefined,
        priority: 'high' as const,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        active: true,
        scheduledFor: undefined,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'announcement_2',
        title: 'New Laundry Guidelines',
        message: 'Please ensure all clothes are properly sorted by color before submitting. This helps maintain quality and prevents color bleeding.',
        hostel: undefined,
        gender: 'female',
        priority: 'normal' as const,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        active: true,
        scheduledFor: undefined,
        expiresAt: undefined
      },
      {
        id: 'announcement_3',
        title: 'Urgent: Lost Item Found',
        message: 'A blue hoodie was found in the laundry room. Please contact the operator to claim it.',
        hostel: 'LH-B',
        gender: undefined,
        priority: 'urgent' as const,
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        active: true,
        scheduledFor: undefined,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'announcement_4',
        title: 'Holiday Schedule Update',
        message: 'Laundry services will be available 24/7 during the upcoming festival holidays. No changes to regular operations.',
        hostel: undefined,
        gender: undefined,
        priority: 'normal' as const,
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        active: false,
        scheduledFor: undefined,
        expiresAt: undefined
      },
      {
        id: 'announcement_5',
        title: 'Operator Training Session',
        message: 'All male students are requested to attend the laundry safety training session tomorrow at 5 PM in the common area.',
        hostel: undefined,
        gender: 'male',
        priority: 'high' as const,
        createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
        active: true,
        scheduledFor: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 30 * 60 * 60 * 1000).toISOString()
      }
    ];
  });

  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    hostel: 'all',
    gender: 'all',
    priority: 'normal',
    scheduledFor: '',
    expiresAt: ''
  });

  const genders = ['all', 'male', 'female'];

  const saveAnnouncements = (updated: Announcement[]) => {
    setAnnouncements(updated);
    localStorage.setItem('announcements', JSON.stringify(updated));
  };

  const handleCreate = () => {
    if (!newAnnouncement.title.trim() || !newAnnouncement.message.trim()) {
      showToast('Please fill in both title and message', 'error');
      return;
    }

    const announcement: Announcement = {
      id: `announcement_${Date.now()}`,
      title: newAnnouncement.title,
      message: newAnnouncement.message,
      hostel: newAnnouncement.hostel === 'all' ? undefined : newAnnouncement.hostel,
      gender: newAnnouncement.gender === 'all' ? undefined : newAnnouncement.gender,
      priority: newAnnouncement.priority as 'normal' | 'high' | 'urgent',
      createdAt: new Date().toISOString(),
      active: true,
      scheduledFor: newAnnouncement.scheduledFor || undefined,
      expiresAt: newAnnouncement.expiresAt || undefined
    };

    const updated = [announcement, ...announcements];
    saveAnnouncements(updated);

    setNewAnnouncement({ title: '', message: '', hostel: 'all', gender: 'all', priority: 'normal', scheduledFor: '', expiresAt: '' });
    showToast('Announcement created successfully', 'success');
  };

  const handleDelete = (id: string) => {
    const updated = announcements.filter(a => a.id !== id);
    saveAnnouncements(updated);
    showToast('Announcement deleted', 'success');
  };

  const toggleActive = (id: string) => {
    const updated = announcements.map(a =>
      a.id === id ? { ...a, active: !a.active } : a
    );
    saveAnnouncements(updated);
    showToast('Announcement status updated', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Bell className="w-8 h-8 text-blue-600" />
              Hostel Announcements
            </h1>
            <p className="text-gray-600">Create and manage announcements for students</p>
          </div>

          {/* Create Announcement */}
          <GlassCard className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Create New Announcement
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Announcement title"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Announcement message"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Gender
                </label>
                <select
                  value={newAnnouncement.gender}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {genders.map(gender => (
                    <option key={gender} value={gender}>
                      {gender === 'all' ? 'All Genders' : gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Schedule For (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newAnnouncement.scheduledFor}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expires At (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={newAnnouncement.expiresAt}
                    onChange={(e) => setNewAnnouncement(prev => ({ ...prev, expiresAt: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
              >
                <Send className="w-5 h-5" />
                Create Announcement
              </button>
            </div>
          </GlassCard>

          {/* Announcements List */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Active Announcements</h2>
            
            <div className="space-y-4">
              {announcements.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No announcements yet</p>
              ) : (
                announcements.map(announcement => (
                  <div
                    key={announcement.id}
                    className={`border rounded-xl p-4 transition-all ${
                      announcement.active 
                        ? 'border-blue-200 bg-blue-50/50' 
                        : 'border-gray-200 bg-gray-50/50 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            announcement.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                            announcement.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {announcement.priority}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            announcement.active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {announcement.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">{announcement.message}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>
                            {announcement.hostel ? `Hostel: ${announcement.hostel}` : 'All Hostels'}
                          </span>
                          <span>
                            {announcement.gender ? `Gender: ${announcement.gender}` : 'All Genders'}
                          </span>
                          <span>
                            {new Date(announcement.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleActive(announcement.id)}
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            announcement.active
                              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {announcement.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDelete(announcement.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}