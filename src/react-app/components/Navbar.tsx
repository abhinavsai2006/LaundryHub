import { Link, useNavigate } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { LogOut, Menu, X, Shirt } from 'lucide-react';
import { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const getNavLinks = () => {
    if (!user) return [];

    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', label: 'Dashboard' },
          { to: '/admin/analytics', label: 'Analytics' },
          { to: '/admin/operators', label: 'Operators' },
          { to: '/admin/students', label: 'Students' },
          { to: '/admin/qr-codes', label: 'QR Codes' },
          { to: '/admin/machines', label: 'Machines' },
          { to: '/admin/lost-found', label: 'Lost & Found' },
          { to: '/admin/announcements', label: 'Announcements' },
          { to: '/admin/reports', label: 'Reports' },
          { to: '/admin/alerts', label: 'Alerts' },
          { to: '/admin/roles', label: 'Roles' },
          { to: '/admin/time-slots', label: 'Time Slots' },
          { to: '/admin/rules', label: 'Rules' },
          { to: '/admin/incidents', label: 'Incidents' },
          { to: '/admin/settings', label: 'Settings' }
        ];
      case 'operator':
        return [
          { to: '/operator', label: 'Dashboard' },
          { to: '/operator/scan', label: 'Scan QR' },
          { to: '/operator/orders', label: 'Orders' },
          { to: '/operator/machines', label: 'Machines' },
          { to: '/operator/lost-found', label: 'Lost & Found' },
          { to: '/operator/help', label: 'Help & Support' },
          { to: '/operator/anomaly-reporting', label: 'Anomaly Reporting' },
          { to: '/operator/digital-signature', label: 'Digital Signature' },
          { to: '/operator/bag-label-replacement', label: 'Bag Labels' },
          { to: '/operator/manual-receipt', label: 'Receipts' },
          { to: '/operator/profile', label: 'Profile' }
        ];
      case 'student':
        return [
          { to: '/student', label: 'Dashboard' },
          { to: '/student/submit', label: 'Submit Laundry' },
          { to: '/student/history', label: 'History' },
          { to: '/student/help', label: 'Help & Support' },
          { to: '/student/settings', label: 'Settings' },
          { to: '/student/profile', label: 'Profile' }
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
                    onClick={() => setSideMenuOpen(true)}
                    className="flex items-center gap-2 px-3 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                    aria-label="More sections"
                  >
                    <Menu className="w-4 h-4" />
                    <span className="hidden lg:inline">More</span>
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
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-all"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </>
          )}
        </div>

        {mobileMenuOpen && user && (
          <div className="md:hidden py-4 space-y-2 border-t border-white/10">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        )}

        {/* Desktop sidebar for extra links */}
        <>
          <div
            className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-200 ${
              sideMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setSideMenuOpen(false)}
          />

          <aside
            className={`fixed left-0 top-0 h-full w-72 bg-white shadow-xl z-50 p-4 transform transition-transform duration-300 ease-out ${
              sideMenuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            aria-hidden={!sideMenuOpen}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="font-semibold">More Sections</div>
              <button onClick={() => setSideMenuOpen(false)} className="p-2 text-gray-600 hover:bg-gray-100 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {moreLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setSideMenuOpen(false)}
                  className="block px-3 py-2 rounded hover:bg-gray-50 text-gray-700"
                >
                  {link.label}
                </Link>
              ))}
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
