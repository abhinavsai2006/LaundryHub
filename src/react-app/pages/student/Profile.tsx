import { useState } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { User, Mail, Phone, Home, Building2, Save, Camera } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { User as UserType } from '@/shared/laundry-types';

export default function Profile() {
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    rollNumber: user?.rollNumber || '',
    hostel: user?.hostel || '',
    room: user?.room || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const usersData = localStorage.getItem('users');
    if (!usersData) return;

    const users = JSON.parse(usersData);
    const updatedUsers = users.map((u: UserType) => 
      u.id === user?.id ? { ...u, ...formData } : u
    );

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    showToast('Profile updated successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              My Profile
            </h1>
            <p className="text-gray-600 text-sm md:text-base">Manage your personal information</p>
          </div>

          <GlassCard className="p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
              <div className="relative mx-auto sm:mx-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-1 md:p-2 bg-white rounded-full shadow-lg border-2 border-white hover:bg-gray-50 transition-colors">
                  <Camera className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600 text-sm md:text-base">{user?.email}</p>
                <div className="mt-2 inline-flex px-2 md:px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-medium capitalize">
                  {user?.role}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="2024-CS-001"
                    className="w-full px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Hostel
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="text"
                      name="hostel"
                      value={formData.hostel}
                      onChange={handleChange}
                      placeholder="Block A"
                      className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Room Number
                  </label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="text"
                      name="room"
                      value={formData.room}
                      onChange={handleChange}
                      placeholder="A-201"
                      className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium text-sm md:text-base min-h-[44px] md:min-h-[48px]"
              >
                <Save className="w-4 h-4 md:w-5 md:h-5" />
                Save Changes
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-4 md:p-6">
            <h3 className="font-semibold text-gray-900 mb-3 md:mb-4 text-base md:text-lg">Account Information</h3>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                <span className="text-gray-600">Account Created</span>
                <span className="text-gray-900 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 border-b border-gray-100 gap-1">
                <span className="text-gray-600">User ID</span>
                <span className="text-gray-900 font-mono text-xs md:text-sm break-all">{user?.id}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between py-2 gap-1">
                <span className="text-gray-600">Account Status</span>
                <span className="px-2 md:px-3 py-1 bg-green-100 text-green-700 rounded-lg font-medium text-xs md:text-sm self-start sm:self-auto">
                  Active
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
