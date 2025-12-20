import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, X, Camera, CheckCircle, AlertCircle, Shirt } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import CameraScanner from '@/react-app/components/CameraScanner';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

const clothesCategories = [
  { id: 'shirts', name: 'Shirts/T-Shirts', icon: '👕' },
  { id: 'pants', name: 'Pants/Trousers', icon: '👖' },
  { id: 'shorts', name: 'Shorts', icon: '🩳' },
  { id: 'dresses', name: 'Dresses/Skirts', icon: '👗' },
  { id: 'jackets', name: 'Jackets/Coats', icon: '🧥' },
  { id: 'underwear', name: 'Underwear/Socks', icon: '🧦' },
  { id: 'bedding', name: 'Bedding/Towels', icon: '🛏️' },
  { id: 'other', name: 'Other Items', icon: '👚' }
];

const fabricTypes = [
  'Cotton',
  'Polyester',
  'Wool',
  'Silk',
  'Denim',
  'Linen',
  'Nylon',
  'Rayon',
  'Spandex',
  'Mixed'
];

export default function SubmitLaundry() {
  const [laundryItems, setLaundryItems] = useState<Array<{
    category: string;
    count: number;
    fabricType: string;
  }>>([]);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [bagPhoto, setBagPhoto] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [qrVerified, setQrVerified] = useState(false);
  const navigate = useNavigate();
  const { addLaundryItem, qrCodes } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const myQRCode = qrCodes.find(qr => qr.assignedTo === user?.id && qr.status === 'verified');

  const addClothingItem = (category: string, count: number, fabricType: string) => {
    if (count > 0) {
      setLaundryItems(prev => [...prev, { category, count, fabricType }]);
    }
  };

  const removeLaundryItem = (index: number) => {
    setLaundryItems(prev => prev.filter((_, i) => i !== index));
  };

  const getTotalItems = () => {
    return laundryItems.reduce((total, item) => total + item.count, 0);
  };

  const handleQRScan = (data: string) => {
    if (myQRCode && data === myQRCode.code) {
      setQrCode(data);
      setQrVerified(true);
      setShowScanner(false);
      showToast('QR code verified successfully', 'success');
    } else {
      showToast('Invalid QR code. Please scan your assigned QR code.', 'error');
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setBagPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!qrVerified) {
      showToast('Please verify your QR code first', 'error');
      return;
    }

    if (laundryItems.length === 0) {
      showToast('Please add at least one clothing item', 'error');
      return;
    }

    const itemsDescription = laundryItems.map(item => 
      `${item.count} ${item.category} (${item.fabricType})`
    );

    addLaundryItem({
      studentId: user?.id || '',
      studentName: user?.name || 'Unknown',
      qrCode: qrCode,
      items: itemsDescription,
      specialInstructions: specialInstructions || undefined,
      status: 'submitted'
    });

    showToast('Laundry request submitted successfully', 'success');
    
    setTimeout(() => {
      navigate('/student');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              Submit Laundry
            </h1>
            <p className="text-gray-600">Select items and scan your laundry bag QR code</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* QR Code Verification */}
            <GlassCard className="p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Verify Your QR Code
              </h3>
              
              {!qrVerified ? (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-900">
                        <p className="font-medium mb-1">Required Step</p>
                        <p className="text-blue-800">Please scan your assigned QR code to proceed with laundry submission.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={qrCode}
                      onChange={(e) => setQrCode(e.target.value)}
                      placeholder="Scan or enter your QR code"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowScanner(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="hidden sm:inline">Scan QR</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3 flex-1">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-900 mb-1">QR Code Verified</p>
                        <p className="text-sm text-green-700 font-mono">{qrCode}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQrCode('');
                        setQrVerified(false);
                      }}
                      className="text-green-700 hover:text-green-900 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </GlassCard>

            {qrVerified && (
              <>
                {/* Laundry Details */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-blue-600" />
                    Laundry Details
                  </h3>

                  {/* Add New Item Form */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Add Clothing Items</h4>
                    <div className="grid md:grid-cols-3 gap-3 mb-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Category
                        </label>
                        <select
                          id="new-category"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select category</option>
                          {clothesCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                              {cat.icon} {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Count
                        </label>
                        <input
                          id="new-count"
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Fabric Type
                        </label>
                        <select
                          id="new-fabric"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="">Select fabric</option>
                          {fabricTypes.map(fabric => (
                            <option key={fabric} value={fabric}>{fabric}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const categorySelect = document.getElementById('new-category') as HTMLSelectElement;
                        const countInput = document.getElementById('new-count') as HTMLInputElement;
                        const fabricSelect = document.getElementById('new-fabric') as HTMLSelectElement;
                        
                        const category = categorySelect.value;
                        const count = parseInt(countInput.value) || 0;
                        const fabricType = fabricSelect.value;
                        
                        if (!category || count <= 0 || !fabricType) {
                          showToast('Please fill all fields for the new item', 'error');
                          return;
                        }
                        
                        const categoryName = clothesCategories.find(c => c.id === category)?.name || category;
                        addClothingItem(categoryName, count, fabricType);
                        
                        // Reset form
                        categorySelect.value = '';
                        countInput.value = '';
                        fabricSelect.value = '';
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                      Add Item
                    </button>
                  </div>

                  {/* Items List */}
                  {laundryItems.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Your Laundry Items</h4>
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          Total: {getTotalItems()} items
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        {laundryItems.map((item, index) => (
                          <div key={index} className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">
                                {clothesCategories.find(c => c.name === item.category)?.icon || '👚'}
                              </span>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {item.count} × {item.category}
                                </p>
                                <p className="text-sm text-gray-600">{item.fabricType}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeLaundryItem(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {laundryItems.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Shirt className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>No items added yet. Add your first clothing item above.</p>
                    </div>
                  )}
                </GlassCard>

                {/* Special Instructions */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Special Notes</h3>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    placeholder="Any special care instructions..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </GlassCard>

                {/* Bag Photo */}
                <GlassCard className="p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">Bag Photo</h3>
                  <div className="space-y-4">
                    <input
                      type="file"
                      onChange={handlePhotoUpload}
                      accept="image/*"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {bagPhoto && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Preview:</p>
                        <img
                          src={bagPhoto}
                          alt="Bag preview"
                          className="w-full max-w-sm h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </GlassCard>

                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium text-lg"
                >
                  Submit Laundry Request
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {showScanner && (
        <CameraScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}
