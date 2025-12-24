import { useData } from '@/react-app/contexts/DataContext';
import { Package, TrendingUp, Activity, AlertCircle, CheckCircle, Bell, Clock, AlertTriangle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useState } from 'react';
import { User } from '@/shared/laundry-types';

export default function AdminDashboard() {
  const { laundryItems, machines } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const usersData = JSON.parse(localStorage.getItem('users') || '[]');

  // Filter orders for selected date
  const todaysOrders = laundryItems.filter(item => {
    const itemDate = new Date(item.submittedAt).toISOString().split('T')[0];
    return itemDate === selectedDate;
  });

  const pendingOrders = todaysOrders.filter(item => item.status === 'submitted');
  const inProgressOrders = todaysOrders.filter(item => ['picked_up', 'washing', 'drying'].includes(item.status));
  const readyOrders = todaysOrders.filter(item => item.status === 'ready');
  const delayedOrders = todaysOrders.filter(item => {
    // Assume delayed if submitted more than 2 days ago and not delivered
    const submittedDate = new Date(item.submittedAt);
    const now = new Date();
    const daysDiff = (now.getTime() - submittedDate.getTime()) / (1000 * 3600 * 24);
    return daysDiff > 2 && item.status !== 'delivered';
  });

  // Hostel-wise summary
  const mhOrders = todaysOrders.filter(item => {
    const student = usersData.find((u: User) => u.id === item.studentId);
    return student?.hostel === 'MH';
  });
  const lhOrders = todaysOrders.filter(item => {
    const student = usersData.find((u: User) => u.id === item.studentId);
    return student?.hostel === 'LH';
  });

  // Alerts
  const delayAlerts = delayedOrders.length;
  const machineDowntime = machines.filter(m => m.status === 'maintenance').length;
  const highLoadWarnings = todaysOrders.length > 50 ? 1 : 0; // arbitrary threshold

  const kpiCards = [
    {
      icon: Package,
      label: 'Total Laundry Bags Today',
      value: todaysOrders.length,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: Clock,
      label: 'Pending',
      value: pendingOrders.length,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    },
    {
      icon: Activity,
      label: 'In Progress',
      value: inProgressOrders.length,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      label: 'Ready for Collection',
      value: readyOrders.length,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      icon: AlertTriangle,
      label: 'Delayed',
      value: delayedOrders.length,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    }
  ];

  const alerts = [
    { type: 'delay', message: `${delayAlerts} orders delayed`, icon: AlertTriangle, color: 'text-red-600' },
    { type: 'machine', message: `${machineDowntime} machines down`, icon: AlertCircle, color: 'text-orange-600' },
    { type: 'load', message: highLoadWarnings ? 'High load warning' : 'Normal load', icon: TrendingUp, color: highLoadWarnings ? 'text-yellow-600' : 'text-green-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20 md:pb-0">
      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="mb-4 md:mb-8">
          <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">Admin Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600">Quick operational overview</p>
        </div>

        {/* Date Selector */}
        <GlassCard className="p-3 md:p-4 lg:p-6 mb-4 md:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-4">
            <label htmlFor="date" className="text-sm font-medium text-gray-700 min-w-fit">Select Date:</label>
            <input
              type="date"
              id="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base min-h-[44px]"
            />
          </div>
        </GlassCard>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-4 md:mb-6 lg:mb-8">
          {kpiCards.map((card, index) => (
            <GlassCard key={index} className="p-3 md:p-4 lg:p-6">
              <div className="flex items-center justify-between gap-2 md:gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-xs md:text-sm text-gray-600 mb-1 truncate">{card.label}</p>
                  <p className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`p-2 md:p-3 lg:p-4 ${card.bgColor} rounded-lg md:rounded-xl flex-shrink-0`}>
                  <card.icon className={`w-4 h-4 md:w-6 md:h-6 lg:w-8 lg:h-8 ${card.textColor}`} />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Hostel-wise Summary */}
        <GlassCard className="p-3 md:p-4 lg:p-6 mb-4 md:mb-6 lg:mb-8">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 lg:mb-6">Hostel-wise Summary</h2>
          <div className="grid grid-cols-2 gap-3 md:gap-4 lg:gap-6">
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg md:rounded-xl">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1 md:mb-2">MH Hostel</h3>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">{mhOrders.length}</p>
              <p className="text-xs md:text-sm text-gray-600">Orders Today</p>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg md:rounded-xl">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-1 md:mb-2">LH Hostel</h3>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-green-600">{lhOrders.length}</p>
              <p className="text-xs md:text-sm text-gray-600">Orders Today</p>
            </div>
          </div>
        </GlassCard>

        {/* Alerts Panel */}
        <GlassCard className="p-3 md:p-4 lg:p-6">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            <Bell className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
            Alerts
          </h2>
          <div className="space-y-2 md:space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-white/50 rounded-lg md:rounded-xl min-h-[44px]">
                <alert.icon className={`w-4 h-4 md:w-5 md:h-5 ${alert.color} flex-shrink-0`} />
                <span className="text-xs md:text-sm text-gray-700 truncate">{alert.message}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
