import { useState, useEffect } from 'react';
import { Bell, X, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useData } from '@/react-app/contexts/DataContext';
import { useAuth } from '@/react-app/contexts/AuthContext';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationBell() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { laundryItems, qrCodes } = useData();
  const { user } = useAuth();

  useEffect(() => {
    const storedNotifications = localStorage.getItem(`notifications_${user?.id}`);
    if (storedNotifications) {
      setNotifications(JSON.parse(storedNotifications));
    } else {
      // Generate initial notifications based on user role
      const initialNotifications: Notification[] = [];
      
      if (user?.role === 'student') {
        const myOrders = laundryItems.filter(item => item.studentId === user?.id);
        const recentOrders = myOrders.filter(item => {
          const orderDate = new Date(item.submittedAt);
          const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
          return orderDate > dayAgo;
        });

        recentOrders.forEach(order => {
          if (order.status === 'ready') {
            initialNotifications.push({
              id: `notif_${order.id}`,
              type: 'success',
              title: 'Laundry Ready',
              message: `Your laundry order #${order.id.slice(-8).toUpperCase()} is ready for collection!`,
              timestamp: order.deliveredAt || order.readyAt || new Date().toISOString(),
              read: false
            });
          }
        });

        const myQR = qrCodes.find(qr => qr.assignedTo === user?.id);
        if (myQR && myQR.status === 'assigned') {
          initialNotifications.push({
            id: `notif_qr_${myQR.id}`,
            type: 'info',
            title: 'QR Code Assigned',
            message: 'A QR code has been assigned to you. Please verify it.',
            timestamp: myQR.assignedAt || new Date().toISOString(),
            read: false
          });
        }
      } else if (user?.role === 'operator') {
        const myOrders = laundryItems.filter(item => item.status === 'submitted');
        if (myOrders.length > 0) {
          initialNotifications.push({
            id: `notif_pending`,
            type: 'warning',
            title: 'Pending Assignments',
            message: `You have ${myOrders.length} laundry request${myOrders.length !== 1 ? 's' : ''} waiting for assignment.`,
            timestamp: new Date().toISOString(),
            read: false
          });
        }
      }

      setNotifications(initialNotifications);
      if (initialNotifications.length > 0) {
        localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(initialNotifications));
      }
    }
  }, [user, laundryItems, qrCodes]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const clearNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    setNotifications(updatedNotifications);
    localStorage.setItem(`notifications_${user?.id}`, JSON.stringify(updatedNotifications));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Package className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowNotifications(false)}
          />
          <div className="fixed left-2 right-2 top-16 z-50 max-h-[80vh] overflow-hidden flex flex-col bg-white rounded-xl shadow-2xl border border-gray-200 sm:absolute sm:right-0 sm:mt-2 sm:left-auto sm:top-auto sm:w-96 sm:max-w-[calc(100vw-2rem)]">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.read ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <p className="font-semibold text-gray-900 text-sm">
                              {notification.title}
                            </p>
                            <button
                              onClick={() => clearNotification(notification.id)}
                              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                            {!notification.read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                              >
                                Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
