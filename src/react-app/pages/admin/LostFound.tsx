import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { Package, Search, CheckCircle, XCircle, Eye, Filter } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function LostFound() {
  const { lostItems, updateLostItem } = useData();
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');

  const filteredItems = lostItems.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.foundBy && item.foundBy.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesHostel = hostelFilter === 'all' || item.hostel.startsWith(hostelFilter);
    return matchesSearch && matchesHostel;
  });

  const handleApproval = (itemId: string, approved: boolean) => {
    updateLostItem(itemId, { status: approved ? 'approved' : 'rejected' });
    showToast(`Item ${approved ? 'approved' : 'rejected'}`, 'success');
  };

  const handleReturn = (itemId: string) => {
    updateLostItem(itemId, { status: 'returned' });
    showToast('Item marked as returned', 'success');
  };

  const toggleVisibility = (itemId: string, visible: boolean) => {
    updateLostItem(itemId, { visible });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Package className="w-8 h-8 text-orange-600" />
            Lost & Found Approval
          </h1>
          <p className="text-gray-600">Control visibility & resolution</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Hostels</option>
                <option value="MH">MH</option>
                <option value="LH">LH</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.map(item => (
            <GlassCard key={item.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold text-gray-900">{item.description}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      item.status === 'reported' ? 'bg-yellow-100 text-yellow-800' :
                      item.status === 'approved' ? 'bg-green-100 text-green-800' :
                      item.status === 'returned' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Found by: {item.foundBy}</p>
                  <p className="text-sm text-gray-600 mb-2">Hostel: {item.hostel}</p>
                  <p className="text-xs text-gray-500">
                    Found on: {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/lost-found/details?itemId=${item.id}`)}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {item.status === 'reported' && (
                    <>
                      <button
                        onClick={() => handleApproval(item.id, true)}
                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleApproval(item.id, false)}
                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {item.status === 'approved' && (
                    <button
                      onClick={() => handleReturn(item.id)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Mark Returned
                    </button>
                  )}
                  <button
                    onClick={() => toggleVisibility(item.id, !item.visible)}
                    className={`px-3 py-1 text-sm rounded ${
                      item.visible ? 'bg-gray-600 text-white hover:bg-gray-700' : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {item.visible ? 'Hide' : 'Show'}
                  </button>
                  {(item.status === 'reported' || item.status === 'approved') && (
                    <button
                      onClick={() => navigate(`/admin/lost-found/details?itemId=${item.id}`)}
                      className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                    >
                      Review Disputes
                    </button>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No lost items found</p>
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No lost items found</p>
          </div>
        )}
      </div>
    </div>
  );
}