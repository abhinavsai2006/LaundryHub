import { useState } from 'react';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Tag, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface LabelReplacement {
  id: string;
  originalQrId: string;
  studentName: string;
  reason: 'damaged' | 'missing' | 'illegible';
  newQrId: string;
  replacedBy: string;
  replacedByName: string;
  replacedAt: string;
  status: 'active' | 'inactive';
}

export default function BagLabelReplacement() {
  const { laundryItems } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [showReplacementForm, setShowReplacementForm] = useState(false);
  const [selectedLaundry, setSelectedLaundry] = useState('');
  const [reason, setReason] = useState<LabelReplacement['reason']>('damaged');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock replacement records
  const [replacements, setReplacements] = useState<LabelReplacement[]>([
    {
      id: '1',
      originalQrId: 'qr_001',
      studentName: 'John Doe',
      reason: 'damaged',
      newQrId: 'qr_001_v2',
      replacedBy: 'op_1',
      replacedByName: 'Rajesh Kumar',
      replacedAt: '2025-12-18T14:30:00Z',
      status: 'active'
    }
  ]);

  const filteredLaundry = laundryItems.filter(item =>
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateNewQrId = (originalId: string) => {
    const baseId = originalId.replace(/_v\d+$/, '');
    const existingVersions = replacements
      .filter(r => r.originalQrId === baseId)
      .map(r => {
        const match = r.newQrId.match(/_v(\d+)$/);
        return match ? parseInt(match[1]) : 1;
      });

    const nextVersion = existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 2;
    return `${baseId}_v${nextVersion}`;
  };

  const handleReplacement = () => {
    if (!selectedLaundry) {
      showToast('Please select a laundry item', 'error');
      return;
    }

    const selectedItem = laundryItems.find(item => item.id === selectedLaundry);
    if (!selectedItem) return;

    const newQrId = generateNewQrId(selectedLaundry);

    const newReplacement: LabelReplacement = {
      id: Date.now().toString(),
      originalQrId: selectedLaundry,
      studentName: selectedItem.studentName || 'Unknown',
      reason,
      newQrId,
      replacedBy: user?.id || '',
      replacedByName: user?.name || 'Unknown',
      replacedAt: new Date().toISOString(),
      status: 'active'
    };

    setReplacements([newReplacement, ...replacements]);
    showToast('Bag label replaced successfully', 'success');
    setSelectedLaundry('');
    setSearchTerm('');
    setShowReplacementForm(false);
  };

  const getReasonLabel = (reason: string) => {
    switch (reason) {
      case 'damaged': return 'Damaged';
      case 'missing': return 'Missing';
      case 'illegible': return 'Illegible';
      default: return reason;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Tag className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600" />
              Bag Label Replacement
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Replace damaged or missing bag labels</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600">Damaged</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {replacements.filter(r => r.reason === 'damaged').length}
              </p>
            </GlassCard>

            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600">Missing</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {replacements.filter(r => r.reason === 'missing').length}
              </p>
            </GlassCard>

            <GlassCard className="p-4 sm:p-6">
              <div className="flex items-center gap-2 sm:gap-3 mb-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                <p className="text-xs sm:text-sm text-gray-600">Total Replacements</p>
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {replacements.length}
              </p>
            </GlassCard>
          </div>

          <div className="mb-4 sm:mb-6">
            <button
              onClick={() => setShowReplacementForm(!showReplacementForm)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg min-h-[44px]"
            >
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Replace Bag Label
            </button>
          </div>

          {showReplacementForm && (
            <GlassCard className="p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-base sm:text-lg">Replace Bag Label</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Laundry Item
                  </label>
                  <input
                    type="text"
                    placeholder="Search by student name or QR ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  />
                </div>

                {searchTerm && (
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg mb-4">
                    {filteredLaundry.slice(0, 5).map(item => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setSelectedLaundry(item.id);
                          setSearchTerm(item.studentName || item.id);
                        }}
                        className="w-full text-left px-3 sm:px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 min-h-[44px] flex flex-col justify-center"
                      >
                        <p className="font-medium text-gray-900 text-sm sm:text-base">{item.studentName || 'Unknown'}</p>
                        <p className="text-xs sm:text-sm text-gray-600">ID: {item.id}</p>
                      </button>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Replacement
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as LabelReplacement['reason'])}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base min-h-[44px]"
                  >
                    <option value="damaged">Damaged</option>
                    <option value="missing">Missing</option>
                    <option value="illegible">Illegible</option>
                  </select>
                </div>

                {selectedLaundry && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Selected:</strong> {laundryItems.find(item => item.id === selectedLaundry)?.studentName || 'Unknown'} (ID: {selectedLaundry})
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      New QR ID will be: {generateNewQrId(selectedLaundry)}
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleReplacement}
                    disabled={!selectedLaundry}
                    className="flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Replace Label
                  </button>
                  <button
                    onClick={() => {
                      setShowReplacementForm(false);
                      setSelectedLaundry('');
                      setSearchTerm('');
                    }}
                    className="px-4 sm:px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all min-h-[44px] font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </GlassCard>
          )}

          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Replacement History</h2>

            {replacements.map(replacement => (
              <GlassCard key={replacement.id} className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <Tag className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 ${replacement.status === 'active' ? 'text-green-500' : 'text-gray-400'}`} />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{replacement.studentName}</h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          Replaced by {replacement.replacedByName} • {new Date(replacement.replacedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Original QR ID</p>
                        <p className="text-gray-900 font-mono text-xs sm:text-sm break-all">{replacement.originalQrId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">New QR ID</p>
                        <p className="text-gray-900 font-mono text-xs sm:text-sm break-all">{replacement.newQrId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Reason</p>
                        <p className="text-gray-900 text-sm">{getReasonLabel(replacement.reason)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs sm:text-sm">Status</p>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          replacement.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {replacement.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {replacements.length === 0 && (
            <GlassCard className="p-8 sm:p-12 text-center">
              <Tag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Replacements Yet</h3>
              <p className="text-sm sm:text-base text-gray-600">Bag label replacement history will appear here.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}