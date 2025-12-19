import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { Shirt, LogIn, UserPlus, Eye, EyeOff, Mail, Lock, User, Shield, Users, GraduationCap, Sparkles, Zap, Star, Heart, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Role } from '@/shared/laundry-types';

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [selectedRole, setSelectedRole] = useState<Role>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuth();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    rollNumber: '',
    gender: '',
    hostel: '',
    room: ''
  });

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Floating animation elements
  const [floatingElements] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 10,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5
    }))
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const roles = [
    {
      value: 'student' as Role,
      label: 'Student',
      icon: GraduationCap,
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-700',
      description: 'Access your laundry services'
    },
    {
      value: 'operator' as Role,
      label: 'Operator',
      icon: Users,
      color: 'from-emerald-400 to-green-500',
      bgColor: 'from-emerald-50 to-green-50',
      borderColor: 'border-emerald-200',
      textColor: 'text-emerald-700',
      description: 'Manage laundry operations'
    },
    {
      value: 'admin' as Role,
      label: 'Admin',
      icon: Shield,
      color: 'from-purple-400 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-700',
      description: 'Full system administration'
    }
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        navigate(`/${user.role}`);
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const success = await register({
        ...registerData,
        role: selectedRole,
        profilePhoto: ''
      });
      if (success) {
        setSuccess('Account created successfully! You can now log in.');
        setActiveTab('login');
        setRegisterData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          phone: '',
          rollNumber: '',
          gender: '',
          hostel: '',
          room: ''
        });
      } else {
        setError('Email already exists');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock forgot password functionality
    setTimeout(() => {
      setSuccess('Password reset link sent to your email!');
      setForgotEmail('');
      setShowForgotPassword(false);
      setIsLoading(false);
    }, 2000);
  };

  const handleGoogleLogin = () => {
    // Mock Google login functionality
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Simulate successful Google login
      const mockUser = {
        id: 'google_user_' + Date.now(),
        name: 'Google User',
        email: 'google@example.com',
        role: selectedRole,
        rollNumber: 'GOOGLE001',
        hostel: 'MH-A',
        createdAt: new Date().toISOString()
      };

      localStorage.setItem('currentUser', JSON.stringify(mockUser));
      localStorage.setItem('isAuthenticated', 'true');
      navigate(`/${selectedRole}`);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Floating Elements */}
        {floatingElements.map((element) => (
          <div
            key={element.id}
            className="absolute animate-float opacity-10"
            style={{
              left: `${element.x}%`,
              top: `${element.y}%`,
              animationDuration: `${element.duration}s`,
              animationDelay: `${element.delay}s`
            }}
          >
            {element.id % 4 === 0 && <Sparkles className="w-6 h-6 text-yellow-400" />}
            {element.id % 4 === 1 && <Zap className="w-5 h-5 text-blue-400" />}
            {element.id % 4 === 2 && <Star className="w-4 h-4 text-purple-400" />}
            {element.id % 4 === 3 && <Heart className="w-5 h-5 text-pink-400" />}
          </div>
        ))}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Header Section */}
          <div className={`text-center mb-12 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl">
                <Shirt className="w-16 h-16 text-white drop-shadow-lg" />
              </div>
            </div>

            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-4 tracking-tight">
              LaundryHub
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide">
              Premium College Laundry Management
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Role Selector */}
            <div className={`space-y-6 transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Choose Your Role</h2>
                <p className="text-slate-400">Select how you'd like to access LaundryHub</p>
              </div>

              <div className="space-y-4">
                {roles.map((role, index) => (
                  <div
                    key={role.value}
                    onClick={() => setSelectedRole(role.value)}
                    className={`group relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl ${
                      selectedRole === role.value
                        ? `bg-gradient-to-r ${role.bgColor} border-transparent shadow-xl scale-105`
                        : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                    }`}
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    {/* Glow Effect */}
                    {selectedRole === role.value && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${role.color} rounded-2xl blur-xl opacity-20 animate-pulse`}></div>
                    )}

                    <div className="relative flex items-center space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${role.color} shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        <role.icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="flex-1">
                        <h3 className={`text-xl font-bold transition-colors duration-300 ${
                          selectedRole === role.value ? role.textColor : 'text-white group-hover:text-white'
                        }`}>
                          {role.label}
                        </h3>
                        <p className={`text-sm transition-colors duration-300 ${
                          selectedRole === role.value ? role.textColor.replace('700', '600') : 'text-slate-400 group-hover:text-slate-300'
                        }`}>
                          {role.description}
                        </p>
                      </div>

                      {selectedRole === role.value && (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className={`w-6 h-6 ${role.textColor}`} />
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                        </div>
                      )}
                    </div>

                    {/* Animated Border */}
                    {selectedRole === role.value && (
                      <div className="absolute inset-0 rounded-2xl border-2 border-white/30 animate-pulse"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Auth Form */}
            <div className={`transition-all duration-1000 delay-500 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                {/* Glass Card Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl backdrop-blur-xl border border-white/20 shadow-2xl"></div>

                <div className="relative p-8 md:p-10">
                  {/* Tab Navigation */}
                  <div className="flex mb-8 bg-slate-800/50 rounded-2xl p-1 backdrop-blur-sm border border-white/10">
                    <button
                      onClick={() => {
                        setActiveTab('login');
                        setError('');
                        setSuccess('');
                        setShowForgotPassword(false);
                      }}
                      className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        activeTab === 'login'
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('register');
                        setError('');
                        setSuccess('');
                        setShowForgotPassword(false);
                      }}
                      className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        activeTab === 'register'
                          ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>

                  {/* Success Message */}
                  {success && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 text-green-300 rounded-2xl backdrop-blur-sm animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <span className="font-medium">{success}</span>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {error && (
                    <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-400/30 text-red-300 rounded-2xl backdrop-blur-sm animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span className="font-medium">{error}</span>
                      </div>
                    </div>
                  )}

                  {/* Login Form */}
                  {activeTab === 'login' && !showForgotPassword && (
                    <form onSubmit={handleLoginSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-300">Email Address</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                            <input
                              type="email"
                              value={loginData.email}
                              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                              required
                              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-300">Password</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center">
                            <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-blue-400 transition-colors duration-300" />
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={loginData.password}
                              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                              required
                              className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 text-slate-400 hover:text-slate-300 transition-colors duration-300"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors duration-300"
                        >
                          Forgot password?
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <LogIn className="w-5 h-5" />
                        )}
                        Sign In
                      </button>
                    </form>
                  )}

                  {/* Register Form */}
                  {activeTab === 'register' && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Full Name</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center">
                              <User className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                              <input
                                type="text"
                                name="name"
                                value={registerData.name}
                                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="John Doe"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Email</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center">
                              <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                              <input
                                type="email"
                                name="email"
                                value={registerData.email}
                                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="you@example.com"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Password</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center">
                              <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={registerData.password}
                                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 text-slate-400 hover:text-slate-300 transition-colors duration-300"
                              >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Confirm Password</label>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center">
                              <Lock className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-green-400 transition-colors duration-300" />
                              <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={registerData.confirmPassword}
                                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                                required
                                className="w-full pl-12 pr-12 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 text-slate-400 hover:text-slate-300 transition-colors duration-300"
                              >
                                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Roll Number</label>
                          <input
                            type="text"
                            name="rollNumber"
                            value={registerData.rollNumber}
                            onChange={(e) => setRegisterData({ ...registerData, rollNumber: e.target.value })}
                            required
                            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="2021001"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={registerData.phone}
                            onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="+91 9876543210"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Gender</label>
                          <select
                            name="gender"
                            value={registerData.gender}
                            onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          >
                            <option value="" className="bg-slate-800">Select</option>
                            <option value="male" className="bg-slate-800">Male</option>
                            <option value="female" className="bg-slate-800">Female</option>
                            <option value="other" className="bg-slate-800">Other</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Hostel</label>
                          <select
                            name="hostel"
                            value={registerData.hostel}
                            onChange={(e) => setRegisterData({ ...registerData, hostel: e.target.value })}
                            required
                            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                          >
                            <option value="" className="bg-slate-800">Select</option>
                            <option value="MH-A" className="bg-slate-800">MH-A</option>
                            <option value="MH-B" className="bg-slate-800">MH-B</option>
                            <option value="MH-C" className="bg-slate-800">MH-C</option>
                            <option value="LH-A" className="bg-slate-800">LH-A</option>
                            <option value="LH-B" className="bg-slate-800">LH-B</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-semibold text-slate-300">Room</label>
                          <input
                            type="text"
                            name="room"
                            value={registerData.room}
                            onChange={(e) => setRegisterData({ ...registerData, room: e.target.value })}
                            className="w-full px-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                            placeholder="101"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <UserPlus className="w-5 h-5" />
                        )}
                        Create Account
                      </button>
                    </form>
                  )}

                  {/* Forgot Password Form */}
                  {showForgotPassword && (
                    <form onSubmit={handleForgotPassword} className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-slate-300">Email Address</label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative flex items-center">
                            <Mail className="absolute left-4 w-5 h-5 text-slate-400 group-focus-within:text-orange-400 transition-colors duration-300" />
                            <input
                              type="email"
                              value={forgotEmail}
                              onChange={(e) => setForgotEmail(e.target.value)}
                              required
                              className="w-full pl-12 pr-4 py-4 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300 backdrop-blur-sm"
                              placeholder="you@example.com"
                            />
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Mail className="w-5 h-5" />
                        )}
                        Send Reset Link
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(false)}
                        className="w-full py-3 text-sm text-slate-400 hover:text-white transition-colors duration-300"
                      >
                        Back to Sign In
                      </button>
                    </form>
                  )}

                  {/* Divider */}
                  {!showForgotPassword && (
                    <>
                      <div className="mt-8 mb-6">
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-600/50" />
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900 text-slate-400 font-medium">Or continue with</span>
                          </div>
                        </div>
                      </div>

                      {/* Google Login Button */}
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-4 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 backdrop-blur-sm"
                      >
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        )}
                        Continue with Google
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="mt-12 text-center">
            <div className="inline-block p-6 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
              <p className="text-sm text-slate-400 mb-3 font-medium">Demo Accounts</p>
              <div className="space-y-2 text-xs text-slate-300">
                <p><strong className="text-blue-400">Admin:</strong> admin@laundryhub.com / admin123</p>
                <p><strong className="text-green-400">Operator:</strong> operator@laundryhub.com / operator123</p>
                <p><strong className="text-purple-400">Student:</strong> student@laundryhub.com / student123</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
