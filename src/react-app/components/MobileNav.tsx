import { Link, useLocation } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Home, QrCode, History, Package, Users, Cog, Search, FileText, HelpCircle, User } from 'lucide-react';

export default function MobileNav() {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: Home },
          { to: '/admin/students', label: 'Students', icon: Users },
          { to: '/admin/operators', label: 'Operators', icon: Users },
          { to: '/admin/machines', label: 'Machines', icon: Cog },
          { to: '/admin/reports', label: 'Reports', icon: FileText }
        ];
      case 'operator':
        return [
          { to: '/operator', label: 'Dashboard', icon: Home },
          { to: '/operator/scan', label: 'Scan', icon: QrCode },
          { to: '/operator/orders', label: 'Orders', icon: Package },
          { to: '/operator/lost-found', label: 'Lost', icon: Search },
          { to: '/operator/help', label: 'Help', icon: HelpCircle }
        ];
      case 'student':
        return [
          { to: '/student', label: 'Home', icon: Home },
          { to: '/student/submit', label: 'Submit', icon: Package },
          { to: '/student/history', label: 'History', icon: History },
          { to: '/student/help', label: 'Help', icon: HelpCircle },
          { to: '/student/settings', label: 'Settings', icon: Cog },
          { to: '/student/profile', label: 'Profile', icon: User }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  if (!user) return null;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around px-1 py-2 sm:px-2 sm:py-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-2 py-3 sm:px-3 sm:py-2 rounded-lg transition-all min-w-[60px] min-h-[60px] sm:min-w-[64px] sm:min-h-[64px] ${
                isActive
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-[10px] sm:text-xs font-medium text-center leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
