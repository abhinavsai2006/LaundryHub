import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, Plus, Search } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function StudentLostFound() {
  const navigate = useNavigate();
  const { lostItems } = useData();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, removeToast } = useToast();

  const filteredItems = lostItems.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const foundItems = filteredItems.filter(item => item.status === 'found');
  const myReports = filteredItems.filter(item => item.reportedBy === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-orange-600" />
            Lost & Found
          </h1>
          <p className="text-gray-600">Report lost items or browse found items</p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <GlassCard className="flex-1 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </GlassCard>
          <button
            onClick={() => navigate('/student/lost-found/report')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Report Lost Item
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Found Items</h2>
            <div className="space-y-3">
              {foundItems.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No found items</p>
                </GlassCard>
              ) : (
                foundItems.map(item => (
                  <GlassCard key={item.id} className="p-4">
                    <div className="mb-2">
                      <div className="inline-flex px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 mb-2">
                        Found
                      </div>
                      <p className="text-gray-900 font-medium">{item.description}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Found on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </GlassCard>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">My Reports</h2>
            <div className="space-y-3">
              {myReports.length === 0 ? (
                <GlassCard className="p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No reported items</p>
                </GlassCard>
              ) : (
                myReports.map(item => (
                  <GlassCard key={item.id} className="p-4">
                    <div className="mb-2">
                      <div className={`inline-flex px-2 py-1 rounded-lg text-xs font-medium mb-2 ${
                        item.status === 'found' ? 'bg-green-100 text-green-700' :
                        item.status === 'claimed' ? 'bg-blue-100 text-blue-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {item.status}
                      </div>
                      <p className="text-gray-900 font-medium">{item.description}</p>
                    </div>
                    <p className="text-sm text-gray-500">
                      Reported on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </GlassCard>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
