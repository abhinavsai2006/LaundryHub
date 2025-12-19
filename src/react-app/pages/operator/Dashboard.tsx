import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, QrCode, AlertCircle, CheckCircle, Users, TrendingUp, Bell, Play, Square, Droplets, Zap, HelpCircle, Pause, RotateCcw, Flag, AlertTriangle, PenTool, RefreshCw } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { Link } from 'react-router';
import { useState, useMemo, useCallback } from 'react';

export default function OperatorDashboard() {
  const { laundryItems } = useData();
  const { user } = useAuth();

  // Mock active operators in same hostel
  const activeOperators = [
    { id: 'op_1', name: 'Rajesh Kumar', status: 'active', lastSeen: '2 min ago' },
    { id: 'op_2', name: 'Priya Sharma', status: 'active', lastSeen: '5 min ago' }
  ];

  // Performance metrics
  const todayStats = {
    bagsHandled: 12,
    avgHandlingTime: '8 min',
    delays: 1,
    efficiency: 92
  };

  // Mock data for coordination
  const myAssignments = [
    { id: 'qr_001', student: 'John Doe', status: 'pending', machine: 'W-01' },
    { id: 'qr_002', student: 'Jane Smith', status: 'processing', machine: 'D-02' },
    { id: 'qr_003', student: 'Bob Johnson', status: 'ready', machine: 'W-03' }
  ];

  const availableMachines = 8;
  const pendingOrders = 5;

  // State declarations
  const [shiftActive, setShiftActive] = useState(false);
  const [shiftStartTime, setShiftStartTime] = useState<Date | null>(null);
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'warning', message: 'Machine W-01 needs maintenance', priority: 'high' },
    { id: 2, type: 'info', message: '3 bags ready for delivery', priority: 'medium' },
    { id: 3, type: 'urgent', message: 'Overload warning: 5 pending pickups', priority: 'high' }
  ]);
  const [waterIssue, setWaterIssue] = useState(false);
  const [powerIssue, setPowerIssue] = useState(false);
  const [workloadLevel] = useState(65); // percentage
  const [showHelpPanel, setShowHelpPanel] = useState(false);
  const [currentContext] = useState('dashboard');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date());
    // In real app, this would refresh data from API
  }, []);

  const handleShiftToggle = useCallback(() => {
    if (!shiftActive) {
      setShiftActive(true);
      setShiftStartTime(new Date());
    } else {
      setShiftActive(false);
      setShiftStartTime(null);
    }
  }, [shiftActive]);

  const acknowledgeAlert = useCallback((alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  }, [alerts]);

  const getShiftDuration = useCallback(() => {
    if (!shiftStartTime) return '0h 0m';
    const now = new Date();
    const diff = now.getTime() - shiftStartTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }, [shiftStartTime]);

  // New feature functions
  const handleWaterIssueToggle = useCallback(() => {
    setWaterIssue(!waterIssue);
    // In real app, this would trigger a global notice to students
  }, [waterIssue]);

  const handlePowerIssueToggle = useCallback(() => {
    setPowerIssue(!powerIssue);
    // In real app, this would trigger a global notice to students
  }, [powerIssue]);

  // Additional button handlers
  const handleScanAndWash = useCallback(() => {
    // Navigate to scan page with wash action - in real app this would pass state
    alert('Navigating to Scan QR page with "Wash" action pre-selected. This would start the washing process immediately after scanning.');
  }, []);

  const handleScanAndReady = useCallback(() => {
    // Navigate to scan page with ready action - in real app this would pass state
    alert('Navigating to Scan QR page with "Ready" action pre-selected. This would mark the bag as ready for pickup immediately after scanning.');
  }, []);

  const handleHoldPauseCycle = useCallback(() => {
    // In real app, this would pause the laundry cycle
    alert('Laundry cycle paused. This would notify all operators and students.');
  }, []);

  const handleUnclaimedLaundry = useCallback(() => {
    // Navigate to lost/found page or open modal - for now show alert
    alert('Opening Unclaimed Laundry management. This would show bags that haven\'t been picked up and allow marking them as lost.');
  }, []);

  const handleBagConditionCheck = useCallback(() => {
    // Navigate to scan page for condition check - for now show alert
    alert('Opening Bag Condition Check. This would guide you through checking bag integrity and condition before processing.');
  }, []);

  const handleZoneTracking = useCallback(() => {
    // For now, show alert - in real app, this would navigate to zone tracking page
    alert('Zone Tracking feature coming soon! This would show real-time bag locations across different zones.');
  }, []);

  const getWorkloadStatus = () => {
    if (workloadLevel >= 90) return { status: 'Overloaded', color: 'text-red-600', bg: 'bg-red-100' };
    if (workloadLevel >= 70) return { status: 'High', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { status: 'Normal', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const getContextualHelp = () => {
    switch (currentContext) {
      case 'dashboard':
        return 'Monitor your shift status, check alerts, and review performance metrics. Use Quick Actions for common tasks.';
      case 'scan':
        return 'Scan QR codes to update laundry status. Confirm bag ownership first, then check bag condition.';
      case 'assign':
        return 'Assign new QR codes to students. Ensure correct student details before assignment.';
      default:
        return 'Navigate through your tasks efficiently. Check workload balancer for capacity management.';
    }
  };

  const pendingItems = useMemo(() => laundryItems.filter(item => item.status === 'submitted'), [laundryItems]);
  const washingItems = useMemo(() => laundryItems.filter(item => item.status === 'washing'), [laundryItems]);
  const readyItems = useMemo(() => laundryItems.filter(item => item.status === 'ready'), [laundryItems]);

  const stats = useMemo(() => [
    {
      icon: QrCode,
      label: 'QR Codes Assigned',
      value: myAssignments.length,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Package,
      label: 'Pending Pickups',
      value: pendingItems.length,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      icon: AlertCircle,
      label: 'Washing',
      value: washingItems.length,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: CheckCircle,
      label: 'Ready for Delivery',
      value: readyItems.length,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    }
  ], [myAssignments.length, pendingItems.length, washingItems.length, readyItems.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Operator Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
              <p className="text-xs text-gray-500 mt-1">Last updated: {lastRefresh.toLocaleTimeString()}</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-left sm:text-right">
                <p className="text-sm text-gray-600">Shift Status</p>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium ${
                  shiftActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full ${shiftActive ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                  {shiftActive ? 'Active' : 'Inactive'}
                </div>
                {shiftActive && (
                  <p className="text-xs text-gray-500 mt-1">{getShiftDuration()}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors min-h-[44px]"
                  title="Refresh dashboard"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Refresh</span>
                </button>
                <button
                  onClick={handleShiftToggle}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium min-h-[44px] w-full sm:w-auto ${
                    shiftActive 
                      ? 'bg-red-600 text-white hover:bg-red-700' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {shiftActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {shiftActive ? 'End Shift' : 'Start Shift'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          {stats.map((stat, index) => (
            <GlassCard key={index} className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">{stat.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-2 md:p-4 ${stat.bgColor} rounded-xl flex-shrink-0`}>
                  <stat.icon className={`w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`} style={{ WebkitTextFillColor: 'transparent' }} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <GlassCard className="p-4 md:p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Active Alerts</h2>
            </div>
            <div className="space-y-3">
              {alerts.map(alert => (
                <div key={alert.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border-l-4 gap-2 ${
                  alert.priority === 'high' ? 'border-red-500 bg-red-50' :
                  alert.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{alert.message}</p>
                    <p className="text-xs text-gray-600 capitalize">{alert.priority} priority</p>
                  </div>
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 text-sm min-h-[36px] w-full sm:w-auto"
                  >
                    Acknowledge
                  </button>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Performance Section */}
        <GlassCard className="p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Today's Performance</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-blue-600">{todayStats.bagsHandled}</p>
              <p className="text-xs md:text-sm text-gray-600">Bags Handled</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-green-600">{todayStats.avgHandlingTime}</p>
              <p className="text-xs md:text-sm text-gray-600">Avg Time</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-red-600">{todayStats.delays}</p>
              <p className="text-xs md:text-sm text-gray-600">Delays</p>
            </div>
            <div className="text-center">
              <p className="text-xl md:text-2xl font-bold text-purple-600">{todayStats.efficiency}%</p>
              <p className="text-xs md:text-sm text-gray-600">Efficiency</p>
            </div>
          </div>
        </GlassCard>

        {/* Multi-Operator Coordination */}
        <GlassCard className="p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Team Coordination</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
              <div>
                <p className="font-medium text-gray-900">Active Operators</p>
                <p className="text-sm text-gray-600">{activeOperators.length} operators on duty</p>
              </div>
              <div className="flex -space-x-2 justify-center sm:justify-end">
                {activeOperators.slice(0, 3).map((operator) => (
                  <div key={operator.id} className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    {operator.name.charAt(0)}
                  </div>
                ))}
                {activeOperators.length > 3 && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-white">
                    +{activeOperators.length - 3}
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <p className="text-sm font-medium text-green-800">Available Machines</p>
                <p className="text-lg md:text-xl font-bold text-green-900">{availableMachines}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <p className="text-sm font-medium text-yellow-800">Pending Orders</p>
                <p className="text-lg md:text-xl font-bold text-yellow-900">{pendingOrders}</p>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Workload Balancer */}
        <GlassCard className="p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Workload Balancer</h2>
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-sm font-medium text-gray-700">Current Load</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getWorkloadStatus().bg} ${getWorkloadStatus().color}`}>
                {getWorkloadStatus().status}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  workloadLevel >= 90 ? 'bg-red-500' : 
                  workloadLevel >= 70 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${workloadLevel}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {workloadLevel >= 90 ? 'Consider pausing new pickups to manage capacity.' : 
               workloadLevel >= 70 ? 'Monitor closely and prepare for peak hours.' : 
               'Capacity available for normal operations.'}
            </p>
          </div>
        </GlassCard>

        {/* Issue Flags */}
        <GlassCard className="p-4 md:p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Flag className="w-5 h-5 text-red-600" />
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Facility Issues</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleWaterIssueToggle}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all min-h-[60px] ${
                waterIssue 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
              }`}
            >
              <Droplets className={`w-6 h-6 flex-shrink-0 ${waterIssue ? 'text-red-600' : 'text-blue-500'}`} />
              <div className="text-left min-w-0">
                <p className="font-semibold">Water Shortage</p>
                <p className="text-sm">{waterIssue ? 'Active - Students notified' : 'Tap to flag issue'}</p>
              </div>
            </button>
            <button
              onClick={handlePowerIssueToggle}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all min-h-[60px] ${
                powerIssue 
                  ? 'border-red-500 bg-red-50 text-red-700' 
                  : 'border-gray-200 bg-white hover:border-blue-300 text-gray-700'
              }`}
            >
              <Zap className={`w-6 h-6 flex-shrink-0 ${powerIssue ? 'text-red-600' : 'text-yellow-500'}`} />
              <div className="text-left min-w-0">
                <p className="font-semibold">Power Cut</p>
                <p className="text-sm">{powerIssue ? 'Active - Students notified' : 'Tap to flag issue'}</p>
              </div>
            </button>
          </div>
        </GlassCard>

        {/* Contextual Help Panel */}
        <GlassCard className="p-4 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg md:text-xl font-bold text-gray-900">Contextual Help</h2>
            </div>
            <button
              onClick={() => setShowHelpPanel(!showHelpPanel)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium px-3 py-1 rounded hover:bg-blue-50 min-h-[36px]"
            >
              {showHelpPanel ? 'Hide' : 'Show'} Help
            </button>
          </div>
          {showHelpPanel && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">{getContextualHelp()}</p>
            </div>
          )}
        </GlassCard>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/operator/scan"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg min-h-[60px]"
              >
                <QrCode className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">Scan QR Code</p>
                  <p className="text-sm text-blue-100">Update laundry status</p>
                </div>
              </Link>
              <Link
                to="/operator/assign"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg min-h-[60px]"
              >
                <QrCode className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">Assign QR Code</p>
                  <p className="text-sm text-purple-100">Assign to new student</p>
                </div>
              </Link>
              <Link
                to="/operator/orders"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg min-h-[60px]"
              >
                <Package className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">Manage Orders</p>
                  <p className="text-sm text-green-100">Assign and track orders</p>
                </div>
              </Link>
              <div className="pt-2 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Shortcuts</p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={handleScanAndWash}
                    className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-md text-sm min-h-[44px]"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Scan & Wash</span>
                  </button>
                  <button 
                    onClick={handleScanAndReady}
                    className="flex items-center justify-center gap-2 p-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all shadow-md text-sm min-h-[44px]"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Scan & Ready</span>
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">Recent Assignments</h2>
            <div className="space-y-3">
              {myAssignments.slice(0, 5).map((qr) => (
                <div
                  key={qr.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-white/50 rounded-xl border border-gray-100 gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{qr.student} <span className="text-sm text-gray-500">· {qr.machine}</span></p>
                    <p className="text-sm text-gray-600">ID: {qr.id}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-lg text-xs font-medium min-w-fit ${
                    qr.status === 'ready' ? 'bg-green-100 text-green-700' :
                    qr.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {qr.status}
                  </div>
                </div>
              ))}
              {myAssignments.length === 0 && (
                <p className="text-gray-500 text-center py-8">No assignments yet</p>
              )}
            </div>
          </GlassCard>
        </div>

        {/* Advanced Operator Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6">
          <GlassCard className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h3 className="text-base md:text-lg font-bold text-gray-900">Issue Reporting</h3>
            </div>
            <div className="space-y-2">
              <Link
                to="/operator/anomaly-reporting"
                className="block w-full text-left p-3 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-red-800">Report Anomaly</p>
                <p className="text-xs text-red-600">Self-report missed scans or errors</p>
              </Link>
              <button 
                onClick={handleUnclaimedLaundry}
                className="w-full text-left p-3 bg-yellow-50 hover:bg-yellow-100 rounded-lg border border-yellow-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-yellow-800">Unclaimed Laundry</p>
                <p className="text-xs text-yellow-600">Mark bags as unclaimed</p>
              </button>
            </div>
          </GlassCard>

          <GlassCard className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pause className="w-5 h-5 text-purple-600" />
              <h3 className="text-base md:text-lg font-bold text-gray-900">Laundry Control</h3>
            </div>
            <div className="space-y-2">
              <button 
                onClick={handleHoldPauseCycle}
                className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-purple-800">Hold/Pause Cycle</p>
                <p className="text-xs text-purple-600">Temporarily pause laundry</p>
              </button>
              <Link
                to="/operator/manual-receipt"
                className="block w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-indigo-800">Generate Receipt</p>
                <p className="text-xs text-indigo-600">Create digital receipt</p>
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="text-base md:text-lg font-bold text-gray-900">Quality Control</h3>
            </div>
            <div className="space-y-2">
              <button 
                onClick={handleBagConditionCheck}
                className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg border border-green-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-green-800">Bag Condition Check</p>
                <p className="text-xs text-green-600">Verify bag integrity</p>
              </button>
              <Link
                to="/operator/bag-label-replacement"
                className="block w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-blue-800">Bag Label Replacement</p>
                <p className="text-xs text-blue-600">Replace damaged labels</p>
              </Link>
            </div>
          </GlassCard>

          <GlassCard className="p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <PenTool className="w-5 h-5 text-teal-600" />
              <h3 className="text-base md:text-lg font-bold text-gray-900">Digital Tools</h3>
            </div>
            <div className="space-y-2">
              <Link
                to="/operator/digital-signature"
                className="block w-full text-left p-3 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-teal-800">Digital Signature</p>
                <p className="text-xs text-teal-600">Capture signatures</p>
              </Link>
              <button 
                onClick={handleZoneTracking}
                className="w-full text-left p-3 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 transition-colors min-h-[48px]"
              >
                <p className="text-sm font-medium text-cyan-800">Zone Tracking</p>
                <p className="text-xs text-cyan-600">Track bag locations</p>
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
