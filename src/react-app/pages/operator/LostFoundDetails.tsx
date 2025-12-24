import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { ArrowLeft, Package, CheckCircle, XCircle, MessageSquare, Image, User, MapPin, AlertTriangle, FileText, Clock } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { LostItem } from '@/shared/laundry-types';

export default function LostFoundDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { lostItems, updateLostItem } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [item, setItem] = useState<LostItem | null>(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (!id) {
      navigate('/operator/lost-found');
      return;
    }

    const foundItem = lostItems.find(item => item.id === id);
    if (foundItem) {
      setItem(foundItem);
    } else {
      showToast('Item not found', 'error');
      navigate('/operator/lost-found');
    }
  }, [id, lostItems, navigate, showToast]);

  const handleApproveItem = (itemId: string) => {
    updateLostItem(itemId, {
      status: 'approved',
      foundBy: user?.id,
      foundByName: user?.name,
      foundAt: new Date().toISOString()
    });
    setItem(prev => prev ? { ...prev, status: 'approved', foundBy: user?.id, foundByName: user?.name, foundAt: new Date().toISOString() } : null);
    showToast('Item approved and moved to found items', 'success');
  };

  const handleRejectItem = (itemId: string) => {
    updateLostItem(itemId, { status: 'rejected' });
    setItem(prev => prev ? { ...prev, status: 'rejected' } : null);
    showToast('Item rejected', 'warning');
  };

  const handleMarkClaimed = (itemId: string) => {
    updateLostItem(itemId, {
      status: 'claimed',
      claimedAt: new Date().toISOString(),
      claimedBy: user?.id,
      claimedByName: user?.name
    });
    setItem(prev => prev ? {
      ...prev,
      status: 'claimed',
      claimedAt: new Date().toISOString(),
      claimedBy: user?.id,
      claimedByName: user?.name
    } : null);
    showToast('Item marked as claimed', 'success');
  };

  const handleReturnToOwner = (itemId: string) => {
    updateLostItem(itemId, { status: 'returned' });
    setItem(prev => prev ? { ...prev, status: 'returned' } : null);
    showToast('Item marked as returned to owner', 'success');
  };

  const handleAddNote = (itemId: string) => {
    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      content: noteText.trim(),
      createdBy: user?.name || 'Unknown',
      createdAt: new Date().toISOString()
    };

    const existingNotes = item?.notes || [];
    const updatedNotes = [...existingNotes, newNote];

    updateLostItem(itemId, { notes: updatedNotes });
    setItem(prev => prev ? { ...prev, notes: updatedNotes } : null);
    setNoteText('');
    showToast('Note added successfully', 'success');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reported': return 'bg-yellow-100 text-yellow-800';
      case 'found': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'claimed': return 'bg-purple-100 text-purple-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <button
            onClick={() => navigate('/operator/lost-found')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-3 md:mb-4 min-h-[44px] px-2 py-2"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-sm md:text-base">Back to Lost & Found</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Item Details</h1>
                <p className="text-xs md:text-sm text-gray-600">ID: {item.id}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getStatusColor(item.status)}`}>
                {item.status}
              </span>
              {item.priority && (
                <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium ${getPriorityColor(item.priority)}`}>
                  {item.priority} priority
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
          {/* Left Column - Images and Basic Info */}
          <div className="space-y-6">
            {/* Images */}
            {(item.photos && item.photos.length > 0) ? (
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Image className="w-4 h-4 md:w-5 md:h-5" />
                  Images
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                  {item.photos.map((photo: string, index: number) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Item photo ${index + 1}`}
                      className="w-full h-24 md:h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(photo, '_blank')}
                    />
                  ))}
                </div>
              </GlassCard>
            ) : item.photo ? (
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <Image className="w-4 h-4 md:w-5 md:h-5" />
                  Image
                </h2>
                <img
                  src={item.photo}
                  alt="Lost item"
                  className="w-full h-48 md:h-64 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => window.open(item.photo, '_blank')}
                />
              </GlassCard>
            ) : null}

            {/* Basic Information */}
            <GlassCard className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5" />
                Basic Information
              </h2>
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                  <span className="text-gray-600 text-sm">Description</span>
                  <span className="font-medium text-gray-900 text-sm md:text-base text-left sm:text-right">{item.description}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                  <span className="text-gray-600 text-sm">Reported By</span>
                  <span className="font-medium text-gray-900 text-sm md:text-base">{item.reportedByName}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                  <span className="text-gray-600 text-sm">Hostel</span>
                  <span className="font-medium text-gray-900 text-sm md:text-base">{item.hostel}</span>
                </div>
                {item.location && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-600 flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      Location Found
                    </span>
                    <span className="font-medium text-gray-900 text-sm md:text-base">{item.location}</span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                  <span className="text-gray-600 flex items-center gap-2 text-sm">
                    <Clock className="w-3 h-3 md:w-4 md:h-4" />
                    Reported At
                  </span>
                  <span className="font-medium text-gray-900 text-sm md:text-base text-left sm:text-right">
                    {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                </div>
                {item.foundAt && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-600 text-sm">Found At</span>
                    <span className="font-medium text-gray-900 text-sm md:text-base text-left sm:text-right">
                      {new Date(item.foundAt).toLocaleDateString()} at {new Date(item.foundAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
                {item.claimedAt && (
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1">
                    <span className="text-gray-600 text-sm">Claimed At</span>
                    <span className="font-medium text-gray-900 text-sm md:text-base text-left sm:text-right">
                      {new Date(item.claimedAt).toLocaleDateString()} at {new Date(item.claimedAt).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </GlassCard>

            {/* Student Details */}
            {item.studentDetails && (
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 md:w-5 md:h-5" />
                  Student Details
                </h2>
                <div className="space-y-2 md:space-y-3">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-600 text-sm">Name</span>
                    <span className="font-medium text-gray-900 text-sm md:text-base">{item.studentDetails.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-600 text-sm">Student ID</span>
                    <span className="font-medium text-gray-900 text-sm md:text-base">{item.studentDetails.studentId}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-600 text-sm">Room Number</span>
                    <span className="font-medium text-gray-900 text-sm md:text-base">{item.studentDetails.roomNumber}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 border-b border-gray-100 gap-1">
                    <span className="text-gray-600 text-sm">Contact</span>
                    <span className="font-medium text-gray-900 text-sm md:text-base">{item.studentDetails.contactNumber}</span>
                  </div>
                  {item.studentDetails.email && (
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-2 gap-1">
                      <span className="text-gray-600 text-sm">Email</span>
                      <span className="font-medium text-gray-900 text-sm md:text-base break-all">{item.studentDetails.email}</span>
                    </div>
                  )}
                </div>
              </GlassCard>
            )}
          </div>

          {/* Right Column - Notes and Actions */}
          <div className="space-y-6">
            {/* Notes */}
            {item.notes && item.notes.length > 0 && (
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                  Notes
                </h2>
                <div className="space-y-2 md:space-y-3">
                  {item.notes.map((note: { id: string; content: string; createdBy: string; createdAt: string }, index: number) => (
                    <div key={index} className="bg-yellow-50 rounded-lg p-3 md:p-4 border border-yellow-200">
                      <p className="text-yellow-900 text-sm">{note.content}</p>
                      <p className="text-yellow-600 text-xs mt-2">
                        {note.createdBy} • {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Add Note */}
            <GlassCard className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4">Add Note</h2>
              <div className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Add a note about this item..."
                  rows={3}
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleAddNote(item.id)}
                  disabled={!noteText.trim()}
                  className="w-full sm:w-auto px-4 py-2 md:py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base font-medium min-h-[44px]"
                >
                  Add Note
                </button>
              </div>
            </GlassCard>

            {/* Actions */}
            <GlassCard className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5" />
                Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.status === 'reported' && (
                  <>
                    <button
                      onClick={() => handleApproveItem(item.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectItem(item.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}

                {item.status === 'found' && (
                  <>
                    <button
                      onClick={() => handleMarkClaimed(item.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Claimed
                    </button>
                    <button
                      onClick={() => handleReturnToOwner(item.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium min-h-[44px]"
                    >
                      <Package className="w-4 h-4" />
                      Returned
                    </button>
                  </>
                )}

                {item.status === 'claimed' && (
                  <button
                    onClick={() => handleReturnToOwner(item.id)}
                    className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium min-h-[44px]"
                  >
                    <Package className="w-4 h-4" />
                    Mark as Returned to Owner
                  </button>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}