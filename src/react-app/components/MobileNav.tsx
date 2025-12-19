import { Link, useLocation } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Home, QrCode, History, Package, Users, Settings, BarChart3, Cog, Search, Megaphone, FileText } from 'lucide-react';

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: Home },
          { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/admin/operators', label: 'Operators', icon: Users },
          { to: '/admin/students', label: 'Students', icon: Users },
          { to: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
          { to: '/admin/machines', label: 'Machines', icon: Cog },
          { to: '/admin/lost-found', label: 'Lost & Found', icon: Search },
          { to: '/admin/announcements', label: 'Announce', icon: Megaphone },
          { to: '/admin/reports', label: 'Reports', icon: FileText },
          { to: '/admin/settings', label: 'Settings', icon: Settings }
        ];
      case 'operator':
        return [
          { to: '/operator', label: 'Dashboard', icon: Home },
          { to: '/operator/scan', label: 'Scan', icon: QrCode },
          { to: '/operator/orders', label: 'Orders', icon: Package },
          { to: '/operator/lost-found', label: 'Lost', icon: Search },
          { to: '/operator/help', label: 'Help', icon: Settings }
        ];
      case 'student':
        return [
          { to: '/student', label: 'Home', icon: Home },
          { to: '/student/submit', label: 'Submit', icon: Package },
          { to: '/student/history', label: 'History', icon: History },
          { to: '/student/help', label: 'Help', icon: Settings },
          { to: '/student/settings', label: 'Settings', icon: Cog },
          { to: '/student/profile', label: 'Profile', icon: Settings }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
