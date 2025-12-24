import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, TrendingUp, Bell, CheckCircle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';

export interface Alert {
  id: string;
  type: 'delay' | 'machine' | 'operator' | 'usage';
  title: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  resolved: boolean;
  escalated: boolean;
  escalationNotes?: string;
}

export default function AdminAlerts() {
  const { laundryItems, machines } = useData();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const generateAlerts = useCallback(() => {
    const newAlerts: Alert[] = [];

    // Delay alerts
    const delayedOrders = laundryItems.filter(item => {
      const submittedDate = new Date(item.submittedAt);
      const now = new Date();
      const daysDiff = (now.getTime() - submittedDate.getTime()) / (1000 * 3600 * 24);
      return daysDiff > 2 && item.status !== 'delivered';
    });

    if (delayedOrders.length > 0) {
      newAlerts.push({
        id: `delay_${Date.now()}`,
        type: 'delay',
        title: 'Excessive Delays Detected',
        message: `${delayedOrders.length} orders have been delayed beyond the threshold`,
        severity: delayedOrders.length > 5 ? 'critical' : 'high',
        timestamp: new Date().toISOString(),
        resolved: false,
        escalated: false
      });
    }

    // Machine downtime alerts
    const downMachines = machines.filter(m => m.status === 'maintenance');
    if (downMachines.length > 0) {
      newAlerts.push({
        id: `machine_${Date.now()}`,
        type: 'machine',
        title: 'Machine Downtime',
        message: `${downMachines.length} machines are currently down for maintenance`,
        severity: downMachines.length > 2 ? 'high' : 'medium',
        timestamp: new Date().toISOString(),
        resolved: false,
        escalated: false
      });
    }

    // Operator performance alerts (mock)
    const lowPerformingOperators = Math.random() > 0.7 ? 1 : 0; // Mock low performance detection
    if (lowPerformingOperators > 0) {
      newAlerts.push({
        id: `operator_${Date.now()}`,
        type: 'operator',
        title: 'Operator Performance Issue',
        message: 'Operator performance below acceptable threshold',
        severity: 'medium',
        timestamp: new Date().toISOString(),
        resolved: false,
        escalated: false
      });
    }

    // High usage alerts
    const todaysOrders = laundryItems.filter(item => {
      const itemDate = new Date(item.submittedAt).toDateString();
      const today = new Date().toDateString();
      return itemDate === today;
    });

    if (todaysOrders.length > 50) { // Arbitrary high load threshold
      newAlerts.push({
        id: `usage_${Date.now()}`,
        type: 'usage',
        title: 'High System Usage',
        message: `System experiencing high load: ${todaysOrders.length} orders today`,
        severity: todaysOrders.length > 75 ? 'critical' : 'medium',
        timestamp: new Date().toISOString(),
        resolved: false,
        escalated: false
      });
    }

    setAlerts(newAlerts);
  }, [laundryItems, machines]);

  useEffect(() => {
    generateAlerts();
  }, [generateAlerts]);

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'delay': return <Clock className="w-5 h-5" />;
      case 'machine': return <AlertTriangle className="w-5 h-5" />;
      case 'operator': return <TrendingUp className="w-5 h-5" />;
      case 'usage': return <Bell className="w-5 h-5" />;
      default: return <Bell className="w-5 h-5" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 md:py-8">
        <div className="mb-6 md:mb-8">
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Bell className="w-6 h-6 md:w-8 md:h-8 text-red-600 flex-shrink-0" />
            <span className="truncate">Admin Alerts & Escalations</span>
          </h1>
          <p className="text-gray-600 text-sm md:text-base">Monitor system health and critical issues</p>
        </div>

        {/* Alert Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <GlassCard className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-red-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-red-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Critical</p>
                <p className="text-lg md:text-2xl font-bold text-red-600">
                  {activeAlerts.filter(a => a.severity === 'critical').length}
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-orange-100 rounded-lg flex-shrink-0">
                <AlertTriangle className="w-4 h-4 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">High</p>
                <p className="text-lg md:text-2xl font-bold text-orange-600">
                  {activeAlerts.filter(a => a.severity === 'high').length}
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-yellow-100 rounded-lg flex-shrink-0">
                <Clock className="w-4 h-4 md:w-6 md:h-6 text-yellow-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Medium</p>
                <p className="text-lg md:text-2xl font-bold text-yellow-600">
                  {activeAlerts.filter(a => a.severity === 'medium').length}
                </p>
              </div>
            </div>
          </GlassCard>
          <GlassCard className="p-3 md:p-6">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <CheckCircle className="w-4 h-4 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-600">Resolved</p>
                <p className="text-lg md:text-2xl font-bold text-blue-600">{resolvedAlerts.length}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Active Alerts */}
        <GlassCard className="p-4 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Active Alerts</h2>
          <div className="space-y-3 md:space-y-4">
            {activeAlerts.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <CheckCircle className="w-12 h-12 md:w-16 md:h-16 text-green-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm md:text-base">No active alerts</p>
              </div>
            ) : (
              activeAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`border-2 rounded-xl p-3 md:p-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="p-2 bg-white rounded-lg flex-shrink-0">
                        {getTypeIcon(alert.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1 text-sm md:text-base">{alert.title}</h3>
                        <p className="text-xs md:text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-gray-600">
                          <span>{new Date(alert.timestamp).toLocaleString()}</span>
                          {alert.escalated && (
                            <span className="px-2 py-1 bg-red-200 text-red-800 rounded text-xs">Escalated</span>
                          )}
                        </div>
                        {alert.escalationNotes && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-xs md:text-sm text-red-700">
                            <strong>Escalation Note:</strong> {alert.escalationNotes}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => resolveAlert(alert.id)}
                        className="px-3 md:px-4 py-2 bg-green-600 text-white text-xs md:text-sm rounded hover:bg-green-700 transition-colors min-h-[36px] md:min-h-[40px] flex items-center justify-center"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => navigate(`/admin/alerts/details?alertId=${alert.id}`)}
                        className="px-3 md:px-4 py-2 bg-red-600 text-white text-xs md:text-sm rounded hover:bg-red-700 transition-colors min-h-[36px] md:min-h-[40px] flex items-center justify-center"
                      >
                        Escalate
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </GlassCard>

        {/* Resolved Alerts */}
        {resolvedAlerts.length > 0 && (
          <GlassCard className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Recently Resolved</h2>
            <div className="space-y-2 md:space-y-3">
              {resolvedAlerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg min-h-[60px] md:min-h-[72px]">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600 flex-shrink-0 mt-1" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 text-sm md:text-base">{alert.title}</p>
                    <p className="text-xs md:text-sm text-gray-600">{alert.message}</p>
                  </div>
                  <span className="text-xs text-gray-500 flex-shrink-0">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}