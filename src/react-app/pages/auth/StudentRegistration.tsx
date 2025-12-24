import { useState, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '@/react-app/contexts/ToastContext';
import { User, Mail, Phone, Hash, Home, CheckCircle, Loader2, ArrowLeft, GraduationCap } from 'lucide-react';

export default function StudentRegistration() {
  const { needsProfileCompletion, completeProfile, loading, user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    rollNumber: '',
    phone: '',
    gender: '',
    hostel: '',
    room: ''
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
        role: 'student',
        rollNumber: formData.rollNumber,
        phone: formData.phone,
        gender: formData.gender,
        hostel: formData.hostel,
        room: formData.room,
        profileCompleted: true
      });

      console.log('Profile completion result:', result);

      if (result.success) {
        if (result.offline) {
          showToast('You appear to be offline. Profile saved locally and will sync when connection returns.', 'warning');
        } else if (result.usedFallback) {
          showToast('Profile saved locally due to connection issues. Data will be synced to Firebase when connection improves.', 'warning');
        } else {
          showToast('🎉 Welcome to LaundryHub! Your student account has been created successfully.', 'success');
        }

        setTimeout(() => {
          const dashboardPath = '/student';
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

  const getHostelsForGender = (gender: string) => {
    if (gender === 'male') {
      return ['MH-A', 'MH-B', 'MH-C'];
    } else if (gender === 'female') {
      return ['LH-A', 'LH-B'];
    }
    return [];
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
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Student Registration</h1>
            <p className="text-slate-300">Complete your student account setup</p>
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
                {/* Roll Number */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Roll Number</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <Hash className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                      <input
                        type="text"
                        id="rollNumber"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="2021001"
                      />
                    </div>
                  </div>
                </div>

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

                {/* Gender and Hostel Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">Gender</label>
                    <select
                      id="gender"
                      name="gender"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value, hostel: '' })}
                      required
                      className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-300">Hostel</label>
                    <select
                      id="hostel"
                      name="hostel"
                      value={formData.hostel}
                      onChange={(e) => setFormData({ ...formData, hostel: e.target.value })}
                      required
                      disabled={!formData.gender}
                      className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">Select</option>
                      {getHostelsForGender(formData.gender).map(hostel => (
                        <option key={hostel} value={hostel}>{hostel}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Room */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-300">Room Number</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center">
                      <Home className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                      <input
                        type="text"
                        id="room"
                        name="room"
                        value={formData.room}
                        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                        placeholder="101"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-700 text-white rounded-xl hover:from-blue-700 hover:to-cyan-800 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </div>
                  ) : (
                    'Complete Student Registration'
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