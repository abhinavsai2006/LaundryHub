import { useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, CheckCircle, Loader2, GraduationCap, Users, Shield } from 'lucide-react';
import { Role } from '@/shared/laundry-types';

export default function GoogleRegistration() {
  const { needsProfileCompletion, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!needsProfileCompletion && !loading) {
      // If profile is already complete, this shouldn't render
      navigate('/');
    }
  }, [needsProfileCompletion, loading, navigate]);

  if (loading || !needsProfileCompletion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  const handleRoleSelection = (role: Role) => {
    // Navigate to role-specific registration page
    navigate(`/register/${role}`);
  };

  const roles = [
    {
      value: 'student' as Role,
      label: 'Student',
      icon: GraduationCap,
      color: 'from-blue-400 to-cyan-500',
      description: 'Access your laundry services'
    },
    {
      value: 'operator' as Role,
      label: 'Operator',
      icon: Users,
      color: 'from-emerald-400 to-green-500',
      description: 'Manage laundry operations'
    },
    {
      value: 'admin' as Role,
      label: 'Admin',
      icon: Shield,
      color: 'from-purple-400 to-pink-500',
      description: 'Full system administration'
    }
  ];

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
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Choose Your Role</h1>
            <p className="text-slate-300">Select how you'd like to access LaundryHub</p>
          </div>

          {/* Google Account Info */}
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

          {/* Role Selection */}
          <div className="space-y-4">
            {roles.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.value}
                  onClick={() => handleRoleSelection(role.value)}
                  className="w-full p-6 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 transition-all backdrop-blur-sm text-left group"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${role.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{role.label}</h3>
                      <p className="text-slate-300">{role.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Back to Login */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}