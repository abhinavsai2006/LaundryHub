import { useState } from 'react';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Receipt, Download, Search, CheckCircle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface ReceiptRecord {
  id: string;
  laundryId: string;
  studentName: string;
  qrId: string;
  pickupTime: string;
  operatorName: string;
  generatedAt: string;
}

export default function ManualReceipt() {
  const { laundryItems } = useData();
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [selectedLaundry, setSelectedLaundry] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock receipt records
  const [receipts, setReceipts] = useState<ReceiptRecord[]>([
    {
      id: '1',
      laundryId: 'item_001',
      studentName: 'John Doe',
      qrId: 'qr_001',
      pickupTime: '2025-12-19T09:30:00Z',
      operatorName: 'Rajesh Kumar',
      generatedAt: '2025-12-19T09:35:00Z'
    }
  ]);

  const filteredLaundry = laundryItems.filter(item =>
    item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const generateReceipt = () => {
    if (!selectedLaundry) {
      showToast('Please select a laundry item', 'error');
      return;
    }

    const selectedItem = laundryItems.find(item => item.id === selectedLaundry);
    if (!selectedItem) return;

    const newReceipt: ReceiptRecord = {
      id: Date.now().toString(),
      laundryId: selectedLaundry,
      studentName: selectedItem.studentName || 'Unknown',
      qrId: selectedItem.id,
      pickupTime: new Date().toISOString(),
      operatorName: user?.name || 'Unknown',
      generatedAt: new Date().toISOString()
    };

    setReceipts([newReceipt, ...receipts]);
    showToast('Receipt generated successfully', 'success');
    setSelectedLaundry('');
    setSearchTerm('');
  };

  const downloadReceipt = (receipt: ReceiptRecord) => {
    // Create a simple HTML receipt
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laundry Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .details { margin-bottom: 20px; }
            .detail-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .footer { text-align: center; font-size: 12px; color: #666; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>LaundryHub</h1>
            <p>Laundry Receipt</p>
          </div>

          <div class="details">
            <div class="detail-row">
              <strong>Receipt ID:</strong>
              <span>${receipt.id}</span>
            </div>
            <div class="detail-row">
              <strong>Student Name:</strong>
              <span>${receipt.studentName}</span>
            </div>
            <div class="detail-row">
              <strong>QR ID:</strong>
              <span>${receipt.qrId}</span>
            </div>
            <div class="detail-row">
              <strong>Pickup Time:</strong>
              <span>${new Date(receipt.pickupTime).toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <strong>Operator:</strong>
              <span>${receipt.operatorName}</span>
            </div>
            <div class="detail-row">
              <strong>Generated:</strong>
              <span>${new Date(receipt.generatedAt).toLocaleString()}</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for using LaundryHub!</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([receiptHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt_${receipt.id}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Receipt className="w-8 h-8 text-teal-600" />
              Manual Receipt Generation
            </h1>
            <p className="text-gray-600">Generate and manage digital receipts for laundry services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Receipt className="w-5 h-5 text-teal-600" />
                <p className="text-sm text-gray-600">Today's Receipts</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {receipts.filter(r => new Date(r.generatedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Total Receipts</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {receipts.length}
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Download className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Available for Download</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {receipts.length}
              </p>
            </GlassCard>
          </div>

          {/* Generate Receipt Section */}
          <GlassCard className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Generate New Receipt</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Laundry Item
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by student name or laundry ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
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
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <p className="font-medium text-gray-900">{item.studentName || 'Unknown'}</p>
                      <p className="text-sm text-gray-600">ID: {item.id}</p>
                    </button>
                  ))}
                </div>
              )}

              {selectedLaundry && (
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-teal-800">
                    <strong>Selected Item:</strong> {laundryItems.find(item => item.id === selectedLaundry)?.studentName || 'Unknown'}
                  </p>
                  <p className="text-sm text-teal-600">Laundry ID: {selectedLaundry}</p>
                </div>
              )}

              <button
                onClick={generateReceipt}
                disabled={!selectedLaundry}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Receipt className="w-5 h-5" />
                Generate Receipt
              </button>
            </div>
          </GlassCard>

          {/* Receipt History */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Receipt History</h2>

            {receipts.map(receipt => (
              <GlassCard key={receipt.id} className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Receipt className="w-5 h-5 text-teal-600" />
                      <div>
                        <h3 className="font-semibold text-gray-900">{receipt.studentName}</h3>
                        <p className="text-sm text-gray-600">
                          Generated by {receipt.operatorName} • {new Date(receipt.generatedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Receipt ID</p>
                        <p className="text-gray-900 font-mono">{receipt.id}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">QR ID</p>
                        <p className="text-gray-900 font-mono">{receipt.qrId}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Pickup Time</p>
                        <p className="text-gray-900">{new Date(receipt.pickupTime).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Laundry ID</p>
                        <p className="text-gray-900 font-mono">{receipt.laundryId}</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => downloadReceipt(receipt)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>

          {receipts.length === 0 && (
            <GlassCard className="p-12 text-center">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Receipts Generated</h3>
              <p className="text-gray-600">Generated receipts will appear here.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}