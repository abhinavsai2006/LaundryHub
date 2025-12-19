import { useState } from 'react';
import { useData } from '@/react-app/contexts/DataContext';
import { FileText, Download, Filter } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { User } from '@/shared/laundry-types';

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  details: string;
  operator?: string;
}

export default function Reports() {
  const { laundryItems } = useData();
  const { toasts, showToast, removeToast } = useToast();
  const [reportType, setReportType] = useState('daily');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showAuditTrail, setShowAuditTrail] = useState(false);

  const handleExport = (format: string) => {
    // Mock export functionality
    showToast(`Exporting ${reportType} report as ${format.toUpperCase()}...`, 'success');
    // In a real app, this would generate and download the file
  };

  const filteredItems = laundryItems.filter(item => {
    const user = JSON.parse(localStorage.getItem('users') || '[]').find((u: User) => u.id === item.studentId);
    const hostelMatch = hostelFilter === 'all' || user?.hostel === hostelFilter;
    const dateMatch = (!dateRange.start || new Date(item.submittedAt) >= new Date(dateRange.start)) &&
                      (!dateRange.end || new Date(item.submittedAt) <= new Date(dateRange.end));
    return hostelMatch && dateMatch;
  });

  const generateAuditTrail = () => {
    const auditEvents: AuditEvent[] = [];

    // Mock audit events - in real app, this would come from a logging system
    filteredItems.forEach(item => {
      auditEvents.push({
        id: `audit_${item.id}_submitted`,
        timestamp: item.submittedAt,
        action: 'Laundry Submitted',
        user: item.studentName,
        details: `Bag submitted with ${item.items.length} items`,
        operator: item.operatorName || 'Auto-assigned'
      });

      if (item.pickedUpAt) {
        auditEvents.push({
          id: `audit_${item.id}_pickedup`,
          timestamp: item.pickedUpAt,
          action: 'Laundry Picked Up',
          user: item.studentName,
          details: 'Laundry bag collected by operator',
          operator: item.operatorName
        });
      }

      if (item.washingStartedAt) {
        auditEvents.push({
          id: `audit_${item.id}_washing`,
          timestamp: item.washingStartedAt,
          action: 'Washing Started',
          user: item.studentName,
          details: `Started washing on ${item.machineName}`,
          operator: item.operatorName
        });
      }

      // Add more audit events...
    });

    return auditEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const auditTrail = generateAuditTrail();

  const reportData = {
    totalOrders: filteredItems.length,
    completedOrders: filteredItems.filter(item => item.pickedUpAt).length,
    pendingOrders: filteredItems.filter(item => !item.washingStartedAt).length,
    inProgressOrders: filteredItems.filter(item => item.washingStartedAt && !item.pickedUpAt).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <FileText className="w-8 h-8 text-green-600" />
            Reports & Exports
          </h1>
          <p className="text-gray-600">Hostel office documentation</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Report Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="daily">Daily Report</option>
                <option value="weekly">Weekly Summary</option>
                <option value="monthly">Monthly Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="all">All Hostels</option>
                <option value="MH">MH</option>
                <option value="LH">LH</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </GlassCard>

        {/* Report Preview */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Report Preview</h2>
            <button
              onClick={() => setShowAuditTrail(!showAuditTrail)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showAuditTrail ? 'Hide Audit Trail' : 'Show Audit Trail'}
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{reportData.totalOrders}</p>
              <p className="text-sm text-gray-600">Total Orders</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{reportData.completedOrders}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{reportData.pendingOrders}</p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{reportData.inProgressOrders}</p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>

          {/* Audit Trail */}
          {showAuditTrail && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditTrail.map(event => (
                  <div key={event.id} className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-gray-900">{event.action}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">{event.details}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>User: {event.user}</span>
                        {event.operator && <span>Operator: {event.operator}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </GlassCard>

        {/* Export Options */}
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Download className="w-5 h-5 text-green-600" />
            Export Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">CSV Format</h3>
              <p className="text-sm text-gray-600 mb-4">
                Export data in CSV format for spreadsheet applications
              </p>
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export as CSV
              </button>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">PDF Format</h3>
              <p className="text-sm text-gray-600 mb-4">
                Generate a formatted PDF report
              </p>
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export as PDF
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}