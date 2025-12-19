import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, Plus, Search, Eye, CheckCircle, User, MapPin } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function OperatorLostFound() {
  const { lostItems, updateLostItem } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const { toasts, showToast, removeToast } = useToast();

  const handleMarkClaimed = (id: string) => {
    updateLostItem(id, {
      status: 'claimed',
      claimedAt: new Date().toISOString(),
      claimedBy: user?.id,
      claimedByName: user?.name
    });
    showToast('Item marked as claimed', 'success');
  };

  const filteredItems = lostItems.filter(item =>
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-orange-600" />
            Lost & Found
          </h1>
          <p className="text-gray-600">Manage lost and found items</p>
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
            onClick={() => navigate('/operator/lost-found/add')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Found Item
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <GlassCard key={item.id} className="p-6">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`inline-flex px-3 py-1 rounded-lg text-xs font-medium ${
                    item.status === 'found' ? 'bg-orange-100 text-orange-700' :
                    item.status === 'claimed' ? 'bg-green-100 text-green-700' :
                    item.status === 'approved' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    item.status === 'returned' ? 'bg-purple-100 text-purple-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </div>
                  {item.priority && (
                    <div className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority}
                    </div>
                  )}
                </div>
                <p className="text-gray-900 font-medium mb-2">{item.description}</p>

                {item.photo && (
                  <div className="mb-3">
                    <img
                      src={item.photo}
                      alt="Lost item"
                      className="w-full h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{item.reportedByName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{item.hostel}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/operator/lost-found/${item.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {item.status === 'found' && (
                  <button
                    onClick={() => handleMarkClaimed(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Claimed
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
    </div>
  );
}
