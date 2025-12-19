import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { ArrowLeft, Package, Plus } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function ReportLostItem() {
  const navigate = useNavigate();
  const { addLostItem } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      showToast('Please enter item description', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      addLostItem({
        description: description.trim(),
        reportedBy: user?.id || '',
        reportedByName: user?.name || 'Unknown',
        status: 'reported',
        hostel: user?.hostel || 'all',
        visible: true
      });

      showToast('Lost item reported successfully', 'success');
      navigate('/student/lost-found');
    } catch (error) {
      showToast('Failed to report lost item', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/student/lost-found')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-orange-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Report Lost Item
                </h1>
                <p className="text-gray-600">Help us find your lost laundry items</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Report a Lost Item</h2>
              <p className="text-gray-600">
                Provide details about your lost item so our team can help locate it.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the lost item in detail (e.g., 'Blue t-shirt with white stripes', 'Black jeans size 32', 'Red hoodie with college logo')"
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be as specific as possible to help us identify your item.
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-medium text-orange-900 mb-2">What happens next?</h3>
                <ul className="text-sm text-orange-800 space-y-1">
                  <li>• Your report will be visible to all operators</li>
                  <li>• Operators will check found items against your description</li>
                  <li>• You'll be notified if a matching item is found</li>
                  <li>• You can claim your item from the Lost & Found section</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/student/lost-found')}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isSubmitting ? 'Reporting...' : 'Report Item'}
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}