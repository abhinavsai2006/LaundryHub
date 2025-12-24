import { useState } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useData } from '@/react-app/contexts/DataContext';
import { User, Mail, Phone, Save, Camera, IdCard, Building, Shield, Calendar } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { User as UserType } from '@/shared/laundry-types';

export default function Profile() {
  const { user } = useAuth();
  const { laundryItems } = useData();
  const { toasts, showToast, removeToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const myAssignedOrders = laundryItems.filter(item => item.operatorId === user?.id);
  const completedOrders = myAssignedOrders.filter(item => item.status === 'delivered');
  const activeOrders = myAssignedOrders.filter(item => item.status !== 'delivered');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-3 md:p-4 lg:p-6">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-3 md:px-4 lg:px-6 py-4 md:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-4 md:mb-6 lg:mb-8">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2 flex items-center gap-2">
              <User className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-blue-600" />
              Operator Profile
            </h1>
            <p className="text-sm md:text-base text-gray-600">Manage your profile and view performance</p>
          </div>

          <GlassCard className="p-4 md:p-6 mb-4 md:mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 md:gap-6 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-gray-200">
              <div className="relative">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full shadow-lg border-2 border-white hover:bg-gray-50 transition-colors flex items-center justify-center">
                  <Camera className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
                <p className="text-sm md:text-base text-gray-600 mb-2">{user?.email}</p>
                <div className="inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-medium capitalize mb-2">
                  Operator
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-500">Profile Photo</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div className="mb-4 md:mb-6">
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  Operator Details
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operator ID
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <IdCard className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium text-sm md:text-base">{user?.operatorId || 'OP-2024-001'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full pl-10 pr-4 py-3 md:py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Hostel
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <Building className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <span className="text-gray-900 font-medium text-sm md:text-base">{user?.assignedHostel || 'MH-1'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-purple-600" />
                    <span className={`font-medium capitalize text-sm md:text-base ${
                      (user?.accountStatus || 'active') === 'active' ? 'text-green-700' :
                      (user?.accountStatus || 'active') === 'suspended' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {(user?.accountStatus || 'active') === 'pending_approval' ? 'Pending Approval' : (user?.accountStatus || 'active')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <Shield className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium text-sm md:text-base">Laundry Operator</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 md:py-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <span className="text-gray-900 font-medium text-sm md:text-base">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 md:px-6 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium text-sm md:text-base min-h-[44px]"
              >
                <Save className="w-4 h-4 md:w-5 md:h-5" />
                Save Changes
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3 md:mb-4">Performance Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="bg-blue-50 p-3 md:p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-sm md:text-base">📦</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Total Orders</p>
                    <p className="text-lg md:text-xl font-bold text-blue-700">{myAssignedOrders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-3 md:p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm md:text-base">✅</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Completed</p>
                    <p className="text-lg md:text-xl font-bold text-green-700">{completedOrders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-3 md:p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <span className="text-yellow-600 font-bold text-sm md:text-base">⏳</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Active</p>
                    <p className="text-lg md:text-xl font-bold text-yellow-700">{activeOrders.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-3 md:p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 md:gap-3 mb-2">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-bold text-sm md:text-base">📅</span>
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-gray-600">Member Since</p>
                    <p className="text-sm md:text-base font-bold text-purple-700">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
