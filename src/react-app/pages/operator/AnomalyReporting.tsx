import { useState } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { AlertTriangle, CheckCircle, Clock, Send } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface AnomalyReport {
  id: string;
  type: 'missed_scan' | 'wrong_action' | 'other';
  description: string;
  reportedBy: string;
  reportedByName: string;
  status: 'pending' | 'reviewed' | 'resolved';
  createdAt: string;
  adminResponse?: string;
}

export default function AnomalyReporting() {
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportType, setReportType] = useState<AnomalyReport['type']>('missed_scan');
  const [description, setDescription] = useState('');

  // Mock data for existing reports
  const [reports, setReports] = useState<AnomalyReport[]>([
    {
      id: '1',
      type: 'missed_scan',
      description: 'Missed scanning QR code for bag W-001 due to system lag',
      reportedBy: 'op_1',
      reportedByName: 'Rajesh Kumar',
      status: 'resolved',
      createdAt: '2025-12-18T10:30:00Z',
      adminResponse: 'Issue acknowledged. System performance has been optimized.'
    },
    {
      id: '2',
      type: 'wrong_action',
      description: 'Accidentally marked bag as ready instead of washing',
      reportedBy: 'op_2',
      reportedByName: 'Priya Sharma',
      status: 'pending',
      createdAt: '2025-12-19T08:15:00Z'
    }
  ]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      showToast('Please provide a description', 'error');
      return;
    }

    const newReport: AnomalyReport = {
      id: Date.now().toString(),
      type: reportType,
      description: description.trim(),
      reportedBy: user?.id || '',
      reportedByName: user?.name || 'Unknown',
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setReports([newReport, ...reports]);
    showToast('Anomaly report submitted successfully', 'success');
    setDescription('');
    setShowReportForm(false);
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'missed_scan': return 'Missed Scan';
      case 'wrong_action': return 'Wrong Action';
      default: return 'Other';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'reviewed':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-orange-100 text-orange-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              Anomaly Self-Reporting
            </h1>
            <p className="text-gray-600">Report issues or mistakes transparently</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-600">Pending Review</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'reviewed').length}
              </p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="flex items-center gap-3 mb-2">
                <Send className="w-5 h-5 text-purple-600" />
                <p className="text-sm text-gray-600">Total Reports</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {reports.length}
              </p>
            </GlassCard>
          </div>

          <div className="mb-6">
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all shadow-lg"
            >
              <AlertTriangle className="w-5 h-5" />
              Report New Anomaly
            </button>
          </div>

          {showReportForm && (
            <GlassCard className="p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Report Anomaly</h3>
              <form onSubmit={handleSubmitReport} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type of Issue
                  </label>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as AnomalyReport['type'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="missed_scan">Missed Scan</option>
                    <option value="wrong_action">Wrong Action Taken</option>
                    <option value="other">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what happened and any relevant details..."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    Submit Report
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowReportForm(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          <div className="space-y-4">
            {reports.map(report => (
              <GlassCard key={report.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(report.status)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{getTypeLabel(report.type)}</h3>
                        <p className="text-sm text-gray-600">
                          Reported by {report.reportedByName} • {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-3">
                      <p className="text-sm text-gray-700">{report.description}</p>
                    </div>

                    {report.adminResponse && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-xs text-blue-600 mb-1 font-medium">Admin Response:</p>
                        <p className="text-sm text-blue-900">{report.adminResponse}</p>
                      </div>
                    )}
                  </div>

                  <div className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(report.status)}`}>
                    {report.status}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {reports.length === 0 && (
            <GlassCard className="p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Reports Yet</h3>
              <p className="text-gray-600">Self-reporting helps improve our processes.</p>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}