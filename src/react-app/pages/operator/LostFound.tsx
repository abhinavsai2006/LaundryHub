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
      
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              Lost & Found
            </h1>
            <p className="text-sm md:text-base text-gray-600">Manage lost and found items</p>
          </div>

          <div className="mb-4 md:mb-6 flex flex-col gap-3 md:gap-4">
          <GlassCard className="p-3 md:p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
          </GlassCard>
          <button
            onClick={() => navigate('/operator/lost-found/add')}
            className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg min-h-[44px] text-sm md:text-base font-medium"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Add Found Item
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredItems.map(item => (
            <GlassCard key={item.id} className="p-4 md:p-6">
              <div className="mb-3 md:mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`inline-flex px-2 md:px-3 py-1 rounded-lg text-xs font-medium ${
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
                <p className="text-gray-900 font-medium mb-2 text-sm md:text-base line-clamp-2">{item.description}</p>

                {item.photo && (
                  <div className="mb-3">
                    <img
                      src={item.photo}
                      alt="Lost item"
                      className="w-full h-24 md:h-32 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                )}

                <div className="space-y-1 text-xs md:text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 truncate">{item.reportedByName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-gray-600 truncate">{item.hostel}</span>
                  </div>
                  <div className="text-gray-500 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => navigate(`/operator/lost-found/${item.id}`)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px]"
                >
                  <Eye className="w-3 h-3 md:w-4 md:h-4" />
                  View Details
                </button>
                {item.status === 'found' && (
                  <button
                    onClick={() => handleMarkClaimed(item.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium min-h-[44px]"
                  >
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4" />
                    Claimed
                  </button>
                )}
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <Package className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
            <p className="text-sm md:text-base text-gray-500">No items found</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
