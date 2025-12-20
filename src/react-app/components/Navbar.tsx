import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { LogOut, Menu, X, Shirt, Home, BarChart3, Users, QrCode, Cog, Search, Megaphone, FileText, Bell, Shield, Clock, BookOpen, AlertTriangle, Settings, Package, History, User, Tag, Receipt, PenTool } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard', icon: Home },
          { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
          { to: '/admin/operators', label: 'Operators', icon: Users },
          { to: '/admin/students', label: 'Students', icon: Users },
          { to: '/admin/qr-codes', label: 'QR Codes', icon: QrCode },
          { to: '/admin/machines', label: 'Machines', icon: Cog },
          { to: '/admin/lost-found', label: 'Lost & Found', icon: Search },
          { to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
          { to: '/admin/reports', label: 'Reports', icon: FileText },
          { to: '/admin/alerts', label: 'Alerts', icon: Bell },
          { to: '/admin/roles', label: 'Roles', icon: Shield },
          { to: '/admin/time-slots', label: 'Time Slots', icon: Clock },
          { to: '/admin/rules', label: 'Rules', icon: BookOpen },
          { to: '/admin/incidents', label: 'Incidents', icon: AlertTriangle },
          { to: '/admin/settings', label: 'Settings', icon: Settings }
        ];
      case 'operator':
        return [
          { to: '/operator', label: 'Dashboard', icon: Home },
          { to: '/operator/scan', label: 'Scan QR', icon: QrCode },
          { to: '/operator/orders', label: 'Orders', icon: Package },
          { to: '/operator/machines', label: 'Machines', icon: Cog },
          { to: '/operator/lost-found', label: 'Lost & Found', icon: Search },
          { to: '/operator/help', label: 'Help & Support', icon: Settings },
          { to: '/operator/anomaly-reporting', label: 'Anomaly Reporting', icon: AlertTriangle },
          { to: '/operator/digital-signature', label: 'Digital Signature', icon: PenTool },
          { to: '/operator/bag-label-replacement', label: 'Bag Labels', icon: Tag },
          { to: '/operator/manual-receipt', label: 'Receipts', icon: Receipt },
          { to: '/operator/profile', label: 'Profile', icon: User }
        ];
      case 'student':
        return [
          { to: '/student', label: 'Dashboard', icon: Home },
          { to: '/student/link-qr', label: 'Link QR Code', icon: QrCode },
          { to: '/student/submit', label: 'Submit Laundry', icon: Package },
          { to: '/student/history', label: 'History', icon: History },
          { to: '/student/help', label: 'Help & Support', icon: Settings },
          { to: '/student/settings', label: 'Settings', icon: Cog },
          { to: '/student/profile', label: 'Profile', icon: User }
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const visibleLinks = navLinks.slice(0, 5);
  const moreLinks = navLinks.slice(5);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && sideMenuOpen) setSideMenuOpen(false);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sideMenuOpen]);

  return (
    <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to={user ? `/${user.role}` : '/'} className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Shirt className="w-6 h-6" />
            </div>
            <span className="hidden sm:inline">LaundryHub</span>
          </Link>

          {user && (
            <>
              <div className="hidden md:flex items-center gap-1">
                {visibleLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    {link.label}
                  </Link>
                ))}

                {moreLinks.length > 0 && (
                  <button
                    onClick={() => setSideMenuOpen(!sideMenuOpen)}
                    className="hidden md:flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    aria-label="More sections"
                  >
                    <Menu className="w-4 h-4" />
                    <span>More</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-4">
                <NotificationBell />
                <div className="hidden sm:block text-white text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-white/70 text-xs capitalize">{user.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
                <button
                  onClick={() => setSideMenuOpen(!sideMenuOpen)}
                  className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                  aria-label="Toggle navigation menu"
                >
                  {sideMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Sidebar navigation */}
        <>
          <div
            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
              sideMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setSideMenuOpen(false)}
          />

          <aside
            className={`fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 p-4 transform transition-transform duration-300 ease-out overflow-hidden flex flex-col ${
              sideMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            aria-hidden={!sideMenuOpen}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">Navigation</div>
              <button onClick={() => setSideMenuOpen(false)} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setSideMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 text-gray-700 whitespace-nowrap"
                  >
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 border-t pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-700 rounded"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </aside>
        </>
      </div>
    </nav>
  );
}
