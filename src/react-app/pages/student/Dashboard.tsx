import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Package, QrCode, Clock, CheckCircle, Sparkles, TrendingUp, Bell, MessageCircle, Search, AlertTriangle, Receipt, Settings, Zap, Pause, Users } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { Link } from 'react-router';
import { useState, useEffect, useMemo } from 'react';
import { NextActionGuidance, LaundryInsights, Announcement } from '@/shared/laundry-types';

const statusSteps = [
  { key: 'submitted', label: 'Submitted', icon: Package },
  { key: 'picked_up', label: 'Picked Up', icon: CheckCircle },
  { key: 'washing', label: 'Washing', icon: Sparkles },
  { key: 'drying', label: 'Drying', icon: TrendingUp },
  { key: 'ready', label: 'Ready', icon: Bell },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle }
];

export default function StudentDashboard() {
  const { qrCodes, laundryItems } = useData();
  const { user } = useAuth();

  const myQRCode = useMemo(() => qrCodes.find(qr => qr.assignedTo === user?.id), [qrCodes, user?.id]);
  const myLaundry = useMemo(() => laundryItems.filter(item => item.studentId === user?.id), [laundryItems, user?.id]);
  const activeOrders = useMemo(() => myLaundry.filter(item => !['delivered'].includes(item.status)), [myLaundry]);
  const completedOrders = useMemo(() => myLaundry.filter(item => item.status === 'delivered'), [myLaundry]);
  const readyOrders = useMemo(() => myLaundry.filter(item => item.status === 'ready'), [myLaundry]);

  const currentOrder = activeOrders.length > 0 ? activeOrders[0] : null;
  const currentStatusIndex = currentOrder ? statusSteps.findIndex(step => step.key === currentOrder.status) : -1;

  // New student features state
  const [nextAction, setNextAction] = useState<NextActionGuidance | null>(null);
  const [laundryInsights, setLaundryInsights] = useState<LaundryInsights | null>(null);

  // Calculate next action guidance
  useEffect(() => {
    if (!user) return;

    let action: NextActionGuidance | null = null;

    if (!myQRCode || myQRCode.status !== 'verified') {
      action = {
        action: 'Link QR Code',
        description: 'Link your assigned QR code to start submitting laundry',
        priority: 'high' as const,
        icon: 'QrCode',
        actionUrl: '/student/link-qr'
      };
    } else if (activeOrders.length === 0) {
      action = {
        action: 'Submit Laundry',
        description: 'Ready to submit new laundry? Create a new request',
        priority: 'medium' as const,
        icon: 'Package',
        actionUrl: '/student/submit'
      };
    }

    setNextAction(action);
  }, [user, myQRCode, readyOrders, activeOrders]);

  // Calculate laundry insights
  useEffect(() => {
    if (myLaundry.length === 0) return;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyLaundry = myLaundry.filter(item =>
      item.submittedAt.startsWith(currentMonth)
    );

    const dayCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    monthlyLaundry.forEach(item => {
      const day = new Date(item.submittedAt).getDay();
      dayCounts[day]++;
    });

    const peakDayIndex = dayCounts.indexOf(Math.max(...dayCounts));
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    setLaundryInsights({
      month: currentMonth,
      totalWashes: monthlyLaundry.length,
      peakDay: dayNames[peakDayIndex],
      averageItems: monthlyLaundry.length > 0 ?
        Math.round(monthlyLaundry.reduce((sum, item) => sum + item.items.length, 0) / monthlyLaundry.length) : 0
    });
  }, [myLaundry]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
      case 'ready':
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default:
        return <Clock className="w-5 h-5 text-blue-500" />;
    }
  };

  const recentOrders = myLaundry
    .slice()
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 3);

  // Get active announcements for this student
  const announcements: Announcement[] = JSON.parse(localStorage.getItem('announcements') || '[]');
  const myAnnouncements = announcements.filter((ann: Announcement) => 
    ann.active && (!ann.hostel || ann.hostel === user?.hostel)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-blue-600" />
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your laundry with ease</p>
        </div>

        {/* Announcements Banner */}
        {myAnnouncements.length > 0 && (
          <div className="mb-8">
            {myAnnouncements.slice(0, 2).map((announcement: Announcement) => (
              <GlassCard key={announcement.id} className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 mb-4">
                <div className="flex items-start gap-3">
                  <Bell className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1">{announcement.title}</h3>
                    <p className="text-yellow-800 text-sm">{announcement.message}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Laundry Paused Banner */}
        {user?.laundryPaused && (
          <GlassCard className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-red-200 mb-6">
            <div className="flex items-center gap-3">
              <Pause className="w-6 h-6 text-red-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900">Laundry Paused</h3>
                <p className="text-red-800 text-sm">
                  Your laundry submissions are currently paused
                  {user.laundryPausedUntil && ` until ${new Date(user.laundryPausedUntil).toLocaleDateString()}`}.
                </p>
              </div>
              <Link
                to="/student/settings"
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                Manage
              </Link>
            </div>
          </GlassCard>
        )}

        {/* Smart Next-Action Guidance */}
        {nextAction && (
          <GlassCard className={`p-6 mb-6 border-l-4 ${
            nextAction.priority === 'high' ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-400' :
            nextAction.priority === 'medium' ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400' :
            'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${
                nextAction.priority === 'high' ? 'bg-red-100' :
                nextAction.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
              }`}>
                {nextAction.icon === 'QrCode' && <QrCode className={`w-6 h-6 ${
                  nextAction.priority === 'high' ? 'text-red-600' :
                  nextAction.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />}
                {nextAction.icon === 'Bell' && <Bell className={`w-6 h-6 ${
                  nextAction.priority === 'high' ? 'text-red-600' :
                  nextAction.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />}
                {nextAction.icon === 'Package' && <Package className={`w-6 h-6 ${
                  nextAction.priority === 'high' ? 'text-red-600' :
                  nextAction.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />}
                {nextAction.icon === 'Clock' && <Clock className={`w-6 h-6 ${
                  nextAction.priority === 'high' ? 'text-red-600' :
                  nextAction.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                }`} />}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{nextAction.action}</h3>
                <p className="text-gray-700 mb-3">{nextAction.description}</p>
                {nextAction.actionUrl && (
                  <Link
                    to={nextAction.actionUrl}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      nextAction.priority === 'high' ? 'bg-red-600 text-white hover:bg-red-700' :
                      nextAction.priority === 'medium' ? 'bg-yellow-600 text-white hover:bg-yellow-700' :
                      'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    Take Action
                    <Zap className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </GlassCard>
        )}

        {/* Laundry Insights */}
        {laundryInsights && (
          <GlassCard className="p-6 mb-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-bold text-gray-900">This Month</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{laundryInsights.totalWashes}</p>
                <p className="text-sm text-gray-600">Washes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{laundryInsights.averageItems}</p>
                <p className="text-sm text-gray-600">Avg Items</p>
              </div>
              <div className="text-center col-span-2">
                <p className="text-sm text-gray-600 mb-1">Peak Day</p>
                <p className="font-semibold text-gray-900">{laundryInsights.peakDay}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/60 rounded-lg">
              <p className="text-sm text-gray-700">
                💡 <span className="font-medium">Insight:</span> You usually submit laundry on {laundryInsights.peakDay}s.
                Consider planning ahead for these days!
              </p>
            </div>
          </GlassCard>
        )}

        {/* Current Laundry Status Tracker */}
        {currentOrder && (
          <GlassCard className="p-6 mb-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-600" />
              Current Laundry Status
            </h2>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600">Order #{currentOrder.id.slice(-8)}</p>
                <p className="text-lg font-semibold text-gray-900">
                  {currentOrder.items.length} item{currentOrder.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              {currentOrder.estimatedReadyTime && (
                <div className="text-right">
                  <p className="text-sm text-gray-600">Estimated Ready</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {new Date(currentOrder.estimatedReadyTime).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const isCurrent = index === currentStatusIndex;
                const Icon = step.icon;
                
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all ${
                      isCompleted 
                        ? 'bg-green-500 text-white shadow-lg' 
                        : isCurrent 
                          ? 'bg-blue-500 text-white shadow-lg animate-pulse' 
                          : 'bg-gray-200 text-gray-400'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className={`text-xs text-center font-medium ${
                      isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{activeOrders.length}</p>
                <p className="text-xs text-gray-600">Active</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{readyOrders.length}</p>
                <p className="text-xs text-gray-600">Ready</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedOrders.length}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{myLaundry.length}</p>
                <p className="text-xs text-gray-600">Total</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {myQRCode && (
          <GlassCard className="p-6 mb-8 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-purple-600" />
              Your QR Code
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">QR Code</p>
                <p className="text-lg font-semibold text-gray-900">{myQRCode.code}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Status</p>
                <div className={`inline-flex px-3 py-1 rounded-lg text-sm font-medium ${
                  myQRCode.status === 'verified' ? 'bg-green-100 text-green-700' :
                  myQRCode.status === 'in-use' ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {myQRCode.status}
                </div>
              </div>
              {myQRCode.machineName && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned Machine</p>
                  <p className="text-lg font-semibold text-gray-900">{myQRCode.machineName}</p>
                </div>
              )}
            </div>
          </GlassCard>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/student/submit"
                className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg"
              >
                <Package className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Submit Laundry</p>
                  <p className="text-sm text-blue-100">Create new request</p>
                </div>
              </Link>
              {user?.favoriteSetups && user.favoriteSetups.length > 0 && (
                <Link
                  to="/student/submit"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg"
                >
                  <Zap className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Quick Submit</p>
                    <p className="text-sm text-green-100">Use favorites</p>
                  </div>
                </Link>
              )}
              {myQRCode && (
                <Link
                  to="/student/link-qr"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  <QrCode className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Link QR</p>
                    <p className="text-sm text-purple-100">Confirm assignment</p>
                  </div>
                </Link>
              )}
              {readyOrders.length > 0 && (
                <Link
                  to="/student/history"
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                >
                  <Receipt className="w-6 h-6" />
                  <div>
                    <p className="font-semibold">Pickup Receipt</p>
                    <p className="text-sm text-orange-100">Digital receipt</p>
                  </div>
                </Link>
              )}
              <Link
                to="/student/history"
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
              >
                <Clock className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">History</p>
                  <p className="text-sm text-gray-600">View past orders</p>
                </div>
              </Link>
              <Link
                to="/student/lost-found"
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
              >
                <Search className="w-6 h-6 text-orange-600" />
                <div>
                  <p className="font-semibold text-gray-900">Lost & Found</p>
                  <p className="text-sm text-gray-600">Report items</p>
                </div>
              </Link>
              <Link
                to="/student/help"
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
              >
                <MessageCircle className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Chat Support</p>
                  <p className="text-sm text-gray-600">Get help</p>
                </div>
              </Link>
              <Link
                to="/student/settings"
                className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md transition-all"
              >
                <Settings className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold text-gray-900">Settings</p>
                  <p className="text-sm text-gray-600">Preferences</p>
                </div>
              </Link>
            </div>

            {/* Roommate View */}
            {user?.roommateSharing && user.sharedWithRoommate && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Roommate View</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    👀 You can view your roommate's laundry status. This helps coordinate shared laundry sessions.
                  </p>
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              Recent Orders
            </h2>
            <div className="space-y-3">
              {recentOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              ) : (
                recentOrders.map(order => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-white/60 rounded-xl border border-gray-200 hover:bg-white/80 transition-all cursor-pointer"
                    onClick={() => {/* Could navigate to history or show details */}}
                  >
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="font-semibold text-gray-900">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">{order.status.replace('_', ' ')}</p>
                        <p className="text-xs text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {new Date(order.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
