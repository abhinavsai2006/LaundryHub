import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Clock, TrendingUp, Bell, CheckCircle, Send } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import type { Alert } from './AdminAlerts';

export default function AlertDetails() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();

  const alertId = searchParams.get('alertId');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [escalationNote, setEscalationNote] = useState('');

  // Mock alerts data - in a real app, this would come from context or API
  const mockAlerts: Alert[] = [
    {
      id: 'delay_1',
      type: 'delay',
      title: 'Excessive Delays Detected',
      message: '3 orders have been delayed beyond the threshold',
      severity: 'high',
      timestamp: new Date().toISOString(),
      resolved: false,
      escalated: false
    },
    {
      id: 'machine_1',
      type: 'machine',
      title: 'Machine Downtime Alert',
      message: 'Washer #3 is currently in maintenance mode',
      severity: 'medium',
      timestamp: new Date().toISOString(),
      resolved: false,
      escalated: false
    }
  ];

  useEffect(() => {
    if (alertId) {
      const alert = mockAlerts.find(a => a.id === alertId);
      if (alert) {
        setSelectedAlert(alert);
      }
    }
  }, [alertId]);

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'high':
        return <TrendingUp className="w-6 h-6 text-orange-500" />;
      case 'medium':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'low':
        return <Bell className="w-6 h-6 text-blue-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <Clock className="w-5 h-5 text-blue-500" />;
      case 'machine':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'operator':
        return <Bell className="w-5 h-5 text-purple-500" />;
      case 'usage':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleBack = () => {
    navigate('/admin/alerts');
  };

  const escalateAlert = () => {
    if (!selectedAlert || !escalationNote.trim()) {
      showToast('Please provide escalation notes', 'error');
      return;
    }

    // In a real app, this would make an API call
    showToast('Alert escalated successfully', 'success');
    navigate('/admin/alerts');
  };

  if (!selectedAlert) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Alert Not Found</h2>
          <p className="text-gray-500 mb-4">The requested alert could not be found.</p>
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Alerts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
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
                <div className="p-2 bg-red-100 rounded-md">
                  {getSeverityIcon(selectedAlert.severity)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Alert Details</h1>
                  <p className="text-gray-600">{selectedAlert.title}</p>
                </div>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border ${getSeverityColor(selectedAlert.severity)}`}>
              {getSeverityIcon(selectedAlert.severity)}
              <span className="capitalize">{selectedAlert.severity}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Alert Information */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                {getTypeIcon(selectedAlert.type)}
                Alert Information
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(selectedAlert.type)}
                    <span className="text-lg font-semibold text-gray-900 capitalize">{selectedAlert.type}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedAlert.message}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timestamp</label>
                  <p className="text-gray-700">
                    {new Date(selectedAlert.timestamp).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(selectedAlert.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <div className="flex items-center gap-2">
                    {selectedAlert.resolved ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="text-green-700 font-medium">Resolved</span>
                      </>
                    ) : selectedAlert.escalated ? (
                      <>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <span className="text-red-700 font-medium">Escalated</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="text-orange-700 font-medium">Active</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Escalation Actions */}
            <GlassCard className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Send className="w-5 h-5 text-red-500" />
                Escalation Actions
              </h3>

              {!selectedAlert.resolved && !selectedAlert.escalated && (
                <div className="space-y-6">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-800 mb-1">Escalate Alert</h4>
                        <p className="text-sm text-red-700">
                          This action will notify higher management and create an escalation record.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Escalation Notes *
                    </label>
                    <textarea
                      value={escalationNote}
                      onChange={(e) => setEscalationNote(e.target.value)}
                      placeholder="Describe the escalation reason and required actions..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                      rows={6}
                    />
                  </div>

                  <button
                    onClick={escalateAlert}
                    className="w-full px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium"
                  >
                    <Send className="w-4 h-4" />
                    Escalate Alert
                  </button>
                </div>
              )}

              {selectedAlert.escalated && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800 mb-1">Alert Escalated</h4>
                      <p className="text-sm text-green-700">
                        This alert has been escalated and is being handled by management.
                      </p>
                      {selectedAlert.escalationNotes && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm text-gray-700">{selectedAlert.escalationNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {selectedAlert.resolved && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800 mb-1">Alert Resolved</h4>
                      <p className="text-sm text-blue-700">
                        This alert has been resolved and no further action is required.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}