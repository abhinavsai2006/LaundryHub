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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <User className="w-8 h-8 text-blue-600" />
              Operator Profile
            </h1>
            <p className="text-gray-600">Manage your profile and view performance</p>
          </div>

          <GlassCard className="p-6 mb-6">
            <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-white hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="mt-2 inline-flex px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium capitalize">
                  Operator
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Profile Photo</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Operator Details
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Operator ID
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <IdCard className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">{user?.operatorId || 'OP-2024-001'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Hostel
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Building className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">{user?.assignedHostel || 'MH-1'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Status
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Shield className="w-5 h-5 text-purple-600" />
                    <span className={`font-medium capitalize ${
                      (user?.accountStatus || 'active') === 'active' ? 'text-green-700' :
                      (user?.accountStatus || 'active') === 'suspended' ? 'text-red-700' :
                      'text-yellow-700'
                    }`}>
                      {(user?.accountStatus || 'active') === 'pending_approval' ? 'Pending Approval' : (user?.accountStatus || 'active')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-gray-900 font-medium">Laundry Operator</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Joining Date
                  </label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <span className="text-gray-900 font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Performance Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Orders Handled</span>
                <span className="text-gray-900 font-medium">{myAssignedOrders.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Completed Orders</span>
                <span className="text-gray-900 font-medium">{completedOrders.length}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Active Orders</span>
                <span className="text-gray-900 font-medium">{activeOrders.length}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Member Since</span>
                <span className="text-gray-900 font-medium">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
