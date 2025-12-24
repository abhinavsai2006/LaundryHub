import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, CheckCircle, Loader2, ArrowLeft, Shield } from 'lucide-react';
import { useToastContext } from '@/react-app/contexts/ToastContext';

export default function AdminRegistration() {
  const { needsProfileCompletion, completeProfile, loading, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    phone: '',
    adminLevel: 'standard' as 'standard' | 'super'
  });

  useEffect(() => {
    if (!needsProfileCompletion && !loading && user) {
      const dashboardPath = `/${user.role}`;
      navigate(dashboardPath);
    }
  }, [needsProfileCompletion, loading, user, navigate]);

  if (loading || !needsProfileCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await completeProfile({
        role: 'admin',
        phone: formData.phone,
        adminLevel: formData.adminLevel,
        accountStatus: 'active', // Admins are active by default
        profileCompleted: true
      });

      console.log('Profile completion result:', result);

      if (result.success) {
        if (result.offline) {
          showToast('You appear to be offline. Profile saved locally and will sync when connection returns.', 'warning');
        } else if (result.usedFallback) {
          showToast('Profile saved locally due to connection issues. Data will be synced to Firebase when connection improves.', 'warning');
        } else {
          showToast('🎉 Welcome to LaundryHub! Your admin account has been created successfully.', 'success');
        }

        setTimeout(() => {
          const dashboardPath = '/admin';
          navigate(dashboardPath);
        }, 1500);
      } else {
        setError('Failed to complete profile. Please try again.');
      }
    } catch (_err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Login
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Admin Registration</h1>
            <p className="text-slate-300">Complete your admin account setup</p>
          </div>

          {/* Form */}
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl"></div>

            <div className="relative p-8">
              {/* Pre-filled Info */}
              <div className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Your Google Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300">{needsProfileCompletion.email}</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-blue-400" />
                    <span className="text-slate-300">{needsProfileCompletion.name}</span>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/20 border border-red-400/30 text-red-300 rounded-2xl backdrop-blur-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Phone Number</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <Phone className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="+91 9876543210"
                      />
                    </div>
                  </div>
                </div>

                {/* Admin Level */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Admin Level</label>
                  <select
                    id="adminLevel"
                    name="adminLevel"
                    value={formData.adminLevel}
                    onChange={(e) => setFormData({ ...formData, adminLevel: e.target.value as 'standard' | 'super' })}
                    required
                    className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                  >
                    <option value="standard">Standard Admin</option>
                    <option value="super">Super Admin</option>
                  </select>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-green-500/20 border border-green-400/30 text-green-300 rounded-2xl backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 text-green-400 mt-0.5">✅</div>
                    <div>
                      <h4 className="font-semibold mb-1">Admin Access</h4>
                      <p className="text-sm">
                        As an admin, you'll have full access to system management, user oversight,
                        and all administrative features once your account is activated.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-700 text-white rounded-xl hover:from-purple-700 hover:to-pink-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    'Complete Admin Registration'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}