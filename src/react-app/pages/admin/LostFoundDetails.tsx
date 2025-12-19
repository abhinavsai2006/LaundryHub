import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Package, CheckCircle, XCircle, Eye, Camera, AlertTriangle, MessageSquare, Upload } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { LostItem } from '@/shared/laundry-types';

export default function LostFoundDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { lostItems, updateLostItem } = useData();
  const { toasts, showToast, removeToast } = useToast();

  const itemId = searchParams.get('itemId');
  const [selectedItem, setSelectedItem] = useState<LostItem | null>(null);
  const [disputeHistory, setDisputeHistory] = useState<{[key: string]: {date: string, note: string, escalated: boolean}[]}>({});
  const [escalationNote, setEscalationNote] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [newDisputeNote, setNewDisputeNote] = useState('');

  useEffect(() => {
    if (itemId) {
      const item = lostItems.find(i => i.id === itemId);
      if (item) {
        setSelectedItem(item);
      }
    }
  }, [itemId, lostItems]);

  const handleApproval = (approved: boolean) => {
    if (!selectedItem) return;
    updateLostItem(selectedItem.id, { status: approved ? 'approved' : 'rejected' });
    showToast(`Item ${approved ? 'approved' : 'rejected'}`, 'success');
    setSelectedItem(prev => prev ? { ...prev, status: approved ? 'approved' : 'rejected' } : null);
  };

  const handleReturn = () => {
    if (!selectedItem) return;
    updateLostItem(selectedItem.id, { status: 'returned' });
    showToast('Item marked as returned', 'success');
    setSelectedItem(prev => prev ? { ...prev, status: 'returned' } : null);
  };

  const toggleVisibility = () => {
    if (!selectedItem) return;
    updateLostItem(selectedItem.id, { visible: !selectedItem.visible });
    setSelectedItem(prev => prev ? { ...prev, visible: !prev.visible } : null);
  };

  const handlePhotoUpload = () => {
    // In a real app, this would upload to a server
    showToast('Photo uploaded successfully', 'success');
    setPhotoFile(null);
  };

  const addDisputeNote = (note: string) => {
    if (!selectedItem || !note.trim()) return;

    const newDispute = {
      date: new Date().toISOString(),
      note: note.trim(),
      escalated: false
    };

    setDisputeHistory(prev => ({
      ...prev,
      [selectedItem.id]: [...(prev[selectedItem.id] || []), newDispute]
    }));

    showToast('Dispute note added', 'success');
  };

  const handleEscalation = () => {
    if (!selectedItem || !escalationNote.trim()) {
      showToast('Please add an escalation note', 'error');
      return;
    }

    const newDispute = {
      date: new Date().toISOString(),
      note: escalationNote,
      escalated: true
    };

    setDisputeHistory(prev => ({
      ...prev,
      [selectedItem.id]: [...(prev[selectedItem.id] || []), newDispute]
    }));

    setEscalationNote('');
    showToast('Item escalated for review', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'returned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBack = () => {
    navigate('/admin/lost-found');
  };

  if (!selectedItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Item Not Found</h2>
          <p className="text-gray-500 mb-4">The requested lost item could not be found.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Lost & Found
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-md">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Lost Item Details</h1>
                  <p className="text-gray-600">{selectedItem.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getStatusColor(selectedItem.status)}`}>
                <span className="capitalize">{selectedItem.status}</span>
              </div>
              {selectedItem.status === 'reported' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApproval(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(false)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
              {selectedItem.status === 'approved' && (
                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Returned
                </button>
              )}
              <button
                onClick={toggleVisibility}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  selectedItem.visible
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                <Eye className="w-4 h-4" />
                {selectedItem.visible ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Item Information */}
          <GlassCard className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Item Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <p className="text-gray-900 font-medium">{selectedItem.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Found By</label>
                <p className="text-gray-900 font-medium">{selectedItem.foundBy}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hostel</label>
                <p className="text-gray-900 font-medium">{selectedItem.hostel}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Found</label>
                <p className="text-gray-900 font-medium">
                  {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Photo */}
            {selectedItem.photo && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>
                <div className="relative">
                  <img
                    src={selectedItem.photo}
                    alt="Lost item"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
          </GlassCard>

          {/* Photo Upload */}
          <GlassCard className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Photo Management
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Photo</label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  {photoFile && (
                    <button
                      onClick={() => handlePhotoUpload()}
                      className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Upload a clear photo of the lost item to help with identification
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Dispute History & Escalation */}
          <GlassCard className="p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Dispute History & Escalation
            </h2>

            {/* Existing Disputes */}
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-medium text-gray-900">Dispute History</h3>
              {disputeHistory[selectedItem.id]?.length > 0 ? (
                <div className="space-y-3">
                  {disputeHistory[selectedItem.id].map((dispute, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(dispute.date).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                        {dispute.escalated && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                            Escalated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700">{dispute.note}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No disputes recorded for this item</p>
              )}
            </div>

            {/* Add New Dispute Note */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add Dispute Note</h3>
              <div className="space-y-4">
                <textarea
                  value={newDisputeNote}
                  onChange={(e) => setNewDisputeNote(e.target.value)}
                  placeholder="Add a note about this dispute..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <button
                  onClick={() => {
                    if (newDisputeNote.trim()) {
                      addDisputeNote(newDisputeNote);
                      setNewDisputeNote('');
                    }
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Note
                </button>
              </div>
            </div>

            {/* Escalation */}
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Escalate for Review
              </h3>
              <div className="space-y-4">
                <textarea
                  value={escalationNote}
                  onChange={(e) => setEscalationNote(e.target.value)}
                  placeholder="Add escalation note for review..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  rows={3}
                />
                <button
                  onClick={handleEscalation}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Escalate for Review
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}