import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/react-app/contexts/AuthContext';
import {
  Shirt,
  Shield,
  Users,
  GraduationCap,
  QrCode,
  BarChart3,
  Bell,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Zap,
  Heart,
  Award,
  Smartphone,
  Lock,
  TrendingUp,
  UserCheck,
  Settings,
  HeadphonesIcon,
  ChevronDown,
  ChevronUp,
  DollarSign,
  MessageSquare,
  Target,
  Rocket,
  Crown,
  Check,
  Menu,
  X as CloseIcon
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<number | null>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  // Enhanced floating animation elements
  const [floatingElements] = useState(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 10,
      duration: Math.random() * 30 + 20,
      delay: Math.random() * 8,
      type: i % 6
    }))
  );

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    // Auto-rotate testimonials
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(testimonialInterval);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: QrCode,
      title: "Smart QR Tracking",
      description: "Revolutionary QR code system for seamless laundry tracking from submission to delivery",
      details: "Each laundry bag gets a unique QR code. Track real-time status, get instant notifications, and verify pickup with digital signatures. No more lost laundry or confusion!",
      benefits: ["Real-time tracking", "Instant notifications", "Digital verification", "Lost prevention"],
      color: "from-blue-500 to-cyan-600",
      stats: "99.8% accuracy"
    },
    {
      icon: BarChart3,
      title: "AI-Powered Analytics",
      description: "Advanced analytics dashboard with predictive insights and performance metrics",
      details: "Machine learning algorithms predict peak hours, optimize scheduling, and provide actionable insights for better resource management and cost savings.",
      benefits: ["Predictive analytics", "Cost optimization", "Performance insights", "Automated reporting"],
      color: "from-purple-500 to-pink-600",
      stats: "35% efficiency boost"
    },
    {
      icon: Bell,
      title: "Intelligent Notifications",
      description: "Smart notification system that keeps everyone informed at the right time",
      details: "Context-aware notifications via app, SMS, and email. Customizable preferences, emergency alerts, and status updates tailored to user roles.",
      benefits: ["Multi-channel delivery", "Smart timing", "Customizable alerts", "Emergency notifications"],
      color: "from-emerald-500 to-teal-600",
      stats: "24/7 coverage"
    },
    {
      icon: Clock,
      title: "Dynamic Time Slots",
      description: "AI-optimized time slot management preventing overcrowding and ensuring fair access",
      details: "Dynamic scheduling based on real-time demand, user preferences, and historical data. Reserve slots, get reminders, and enjoy conflict-free laundry times.",
      benefits: ["AI optimization", "Conflict prevention", "Flexible booking", "Smart reminders"],
      color: "from-orange-500 to-red-600",
      stats: "60% less waiting"
    },
    {
      icon: Shield,
      title: "Secure Lost & Found",
      description: "Digital lost & found system with photo verification and secure claim process",
      details: "Report lost items with photos and descriptions. Advanced matching algorithm helps reunite owners with their belongings quickly and securely.",
      benefits: ["Photo verification", "Smart matching", "Secure claims", "Quick resolution"],
      color: "from-indigo-500 to-blue-600",
      stats: "95% recovery rate"
    },
    {
      icon: Lock,
      title: "Bank-Level Security",
      description: "Enterprise-grade security with end-to-end encryption and secure payment processing",
      details: "Military-grade encryption, secure payment gateways, GDPR compliance, and regular security audits ensure your data is always protected.",
      benefits: ["End-to-end encryption", "Secure payments", "GDPR compliant", "Regular audits"],
      color: "from-gray-700 to-gray-900",
      stats: "256-bit encryption"
    }
  ];

  const userRoles = [
    {
      role: "Student",
      icon: GraduationCap,
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      tagline: "Laundry made effortless",
      features: [
        "📱 One-tap laundry submission",
        "📍 Real-time location tracking",
        "⏰ Smart time slot booking",
        "💳 Secure digital payments",
        "🔔 Instant status updates",
        "📸 Photo verification",
        "⭐ Rate & review service",
        "📊 Usage history & analytics"
      ],
      stats: { users: "5,000+", satisfaction: "4.9/5" }
    },
    {
      role: "Operator",
      icon: Users,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50",
      tagline: "Streamline operations",
      features: [
        "📷 QR code scanning",
        "⚡ Real-time status updates",
        "💰 Digital payment processing",
        "🚨 Anomaly reporting",
        "📝 Digital signatures",
        "🔧 Maintenance tracking",
        "📈 Performance analytics",
        "🎯 Task prioritization"
      ],
      stats: { users: "50+", efficiency: "40% faster" }
    },
    {
      role: "Admin",
      icon: Shield,
      color: "from-purple-500 to-pink-600",
      bgColor: "from-purple-50 to-pink-50",
      tagline: "Complete control & insights",
      features: [
        "👥 User management",
        "📊 Advanced analytics",
        "⚙️ System configuration",
        "🚨 Emergency alerts",
        "📋 Policy enforcement",
        "💰 Revenue tracking",
        "🔍 Audit logs",
        "🎛️ Machine monitoring"
      ],
      stats: { users: "10+", savings: "$25K/year" }
    }
  ];

  const stats = [
    { number: "15,000+", label: "Happy Students", icon: Users, trend: "+23% this semester" },
    { number: "120+", label: "Laundry Machines", icon: Settings, trend: "99.9% uptime" },
    { number: "24/7", label: "Always Available", icon: Clock, trend: "Zero downtime" },
    { number: "4.9/5", label: "Student Rating", icon: Star, trend: "Top rated service" },
    { number: "35%", label: "Time Saved", icon: TrendingUp, trend: "Per student weekly" },
    { number: "$50K+", label: "Cost Savings", icon: DollarSign, trend: "Annual savings" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Computer Science Student",
      avatar: "SJ",
      content: "LaundryHub completely transformed my college experience! No more waiting in endless lines or worrying about my clothes. The QR tracking is genius - I know exactly where my laundry is at all times.",
      rating: 5,
      highlight: "Saved 3+ hours per week",
      course: "CS Major",
      joined: "2 years ago"
    },
    {
      name: "Mike Chen",
      role: "Engineering Student",
      avatar: "MC",
      content: "As someone who's always busy with projects, LaundryHub is a lifesaver. I submit laundry from my dorm, track it on my phone, and pick it up when it's ready. The notifications are perfect!",
      rating: 5,
      highlight: "Never missed a deadline",
      course: "Mechanical Engineering",
      joined: "1.5 years ago"
    },
    {
      name: "Emily Rodriguez",
      role: "Business Student",
      avatar: "ER",
      content: "The lost & found system saved me when I thought I'd lost my favorite hoodie forever. The staff was amazing and the digital verification made claiming it so easy. 10/10!",
      rating: 5,
      highlight: "Recovered lost items",
      course: "Business Administration",
      joined: "3 years ago"
    },
    {
      name: "David Park",
      role: "Laundry Operator",
      avatar: "DP",
      content: "Working here used to be chaotic, but LaundryHub made everything streamlined. The digital system reduced errors by 80% and customers love the transparency. Best upgrade ever!",
      rating: 5,
      highlight: "80% fewer errors",
      department: "Operations",
      experience: "3 years"
    },
    {
      name: "Dr. Lisa Thompson",
      role: "Campus Administrator",
      avatar: "LT",
      content: "The analytics provided by LaundryHub have helped us optimize our laundry operations significantly. We've reduced costs by 25% while improving student satisfaction. Highly recommend!",
      rating: 5,
      highlight: "$25K annual savings",
      position: "Facilities Director",
      tenure: "5 years"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

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
            {element.id % 5 === 0 && <Sparkles className="w-8 h-8 text-blue-400" />}
            {element.id % 5 === 1 && <Zap className="w-6 h-6 text-purple-400" />}
            {element.id % 5 === 2 && <Star className="w-5 h-5 text-pink-400" />}
            {element.id % 5 === 3 && <Heart className="w-7 h-7 text-red-400" />}
            {element.id % 5 === 4 && <Award className="w-6 h-6 text-yellow-400" />}
          </div>
        ))}
      </div>

      {/* Navigation */}
      <nav className={`relative z-20 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' : 'bg-white/80 backdrop-blur-md border-b border-gray-200/50'} sticky top-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                <Shirt className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LaundryHub
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Features</a>
              <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">About</a>
              <a href="#roles" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">User Roles</a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium">Reviews</a>
              <button
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Features</a>
                <a href="#about" className="text-gray-600 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="#roles" className="text-gray-600 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>User Roles</a>
                <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsMenuOpen(false)}>Reviews</a>
                <button
                  onClick={() => { navigate('/login'); setIsMenuOpen(false); }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium text-left"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative z-10 pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {/* Trust Badge */}
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mb-8 shadow-lg border border-gray-200/50">
                <Crown className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-gray-700">#1 College Laundry Platform</span>
                <div className="flex -space-x-1 ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Laundry Done
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Right
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Experience the future of college laundry with AI-powered tracking, instant notifications,
                and seamless digital management. Join <strong className="text-blue-600">15,000+</strong> students
                who've transformed their laundry experience.
              </p>

              {/* Key Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-12 text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Save 3+ hours weekly</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Never lose laundry again</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>24/7 tracking & support</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <button
                  onClick={() => navigate('/login')}
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 flex items-center gap-3"
                >
                  <Rocket className="w-6 h-6" />
                  Start Free Today
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="group border-2 border-gray-300 text-gray-700 px-10 py-4 rounded-2xl font-bold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-300 flex items-center gap-3 hover:shadow-lg">
                  <Play className="w-6 h-6" />
                  Watch Demo
                  <ChevronDown className="w-6 h-6 group-hover:translate-y-1 transition-transform" />
                </button>
              </div>

              {/* Enhanced Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 transition-all duration-1000 delay-${index * 100} hover:shadow-xl hover:scale-105`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center mb-3">
                      <stat.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {stat.number}
                    </div>
                    <div className="text-gray-600 font-medium text-sm mb-1">{stat.label}</div>
                    <div className="text-green-600 text-xs font-medium">{stat.trend}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              Powerful Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Modern Laundry Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets user-friendly design to create the ultimate laundry experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200/50 hover:border-blue-200/50 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="relative mb-6">
                  <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl w-fit group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${feature.color} text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg`}>
                    {feature.stats}
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors group-hover:scale-105 transform duration-200"
                >
                  Learn More
                  {expandedFeature === index ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {expandedFeature === index && (
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                    <p className="text-gray-700 leading-relaxed">{feature.details}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`text-white ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Revolutionizing College Laundry
              </h2>
              <p className="text-xl mb-8 leading-relaxed text-blue-100">
                LaundryHub brings the future of laundry management to your campus. Our comprehensive platform
                eliminates the frustrations of traditional laundry services while providing unprecedented control
                and efficiency for both students and staff.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Digital Transformation</h3>
                    <p className="text-blue-100">Replace manual processes with automated, digital workflows that save time and reduce errors.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Real-time Visibility</h3>
                    <p className="text-blue-100">Track every laundry bag from submission to pickup with complete transparency.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Scalable Solution</h3>
                    <p className="text-blue-100">Built to handle growing campuses with thousands of students and dozens of machines.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`relative ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-white/20 rounded-2xl p-6 mb-4">
                      <Smartphone className="w-12 h-12 text-white mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white">Mobile First</h3>
                    </div>
                    <p className="text-blue-100 text-sm">Access anywhere, anytime with our responsive mobile app</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-2xl p-6 mb-4">
                      <Lock className="w-12 h-12 text-white mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white">Secure</h3>
                    </div>
                    <p className="text-blue-100 text-sm">Bank-level security with encrypted data and secure payments</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-2xl p-6 mb-4">
                      <TrendingUp className="w-12 h-12 text-white mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white">Efficient</h3>
                    </div>
                    <p className="text-blue-100 text-sm">Streamlined processes that save time for everyone</p>
                  </div>

                  <div className="text-center">
                    <div className="bg-white/20 rounded-2xl p-6 mb-4">
                      <UserCheck className="w-12 h-12 text-white mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-white">User-Friendly</h3>
                    </div>
                    <p className="text-blue-100 text-sm">Intuitive interfaces designed for all user types</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section id="roles" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              User Roles & Permissions
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored experiences for every member of your campus community
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userRoles.map((userRole, index) => (
              <div
                key={index}
                className={`bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-gray-200/50 hover:border-blue-200/50 relative overflow-hidden ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${userRole.bgColor} rounded-full -mr-16 -mt-16 opacity-20`}></div>

                <div className={`bg-gradient-to-r ${userRole.color} p-4 rounded-2xl w-fit mb-6 relative z-10 shadow-lg`}>
                  <userRole.icon className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-3xl font-bold mb-2 text-gray-900 relative z-10">{userRole.role}</h3>
                <p className="text-blue-600 font-medium mb-6 relative z-10">{userRole.tagline}</p>

                {/* Stats */}
                <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-xl relative z-10">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userRole.stats.users}</div>
                    <div className="text-xs text-gray-600">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{userRole.stats.satisfaction || userRole.stats.efficiency || userRole.stats.savings}</div>
                    <div className="text-xs text-gray-600">
                      {userRole.stats.satisfaction ? 'Satisfaction' : userRole.stats.efficiency ? 'Efficiency' : 'Savings'}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-8 relative z-10">
                  {userRole.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className={`w-full bg-gradient-to-r ${userRole.color} text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 relative z-10 shadow-lg`}
                >
                  Access as {userRole.role}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, streamlined process from submission to pickup
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Submit Laundry",
                description: "Students submit laundry requests through the app with preferred time slots",
                icon: Shirt
              },
              {
                step: "2",
                title: "QR Code Generation",
                description: "Unique QR codes are generated for tracking and verification",
                icon: QrCode
              },
              {
                step: "3",
                title: "Processing & Tracking",
                description: "Operators scan codes and update status in real-time",
                icon: Settings
              },
              {
                step: "4",
                title: "Pickup & Payment",
                description: "Students receive notifications and complete secure pickup",
                icon: CheckCircle
              }
            ].map((step, index) => (
              <div
                key={index}
                className={`text-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="relative mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    {step.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 transform -translate-x-8"></div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-2xl mb-6">
                  <div className="bg-white p-4 rounded-xl">
                    <step.icon className="w-8 h-8 text-blue-600 mx-auto" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-4 text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 border border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              Success Stories
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Real experiences from students, operators, and administrators transforming their laundry experience
            </p>
          </div>

          {/* Featured Testimonial */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl text-white font-light leading-relaxed italic mb-8">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="flex items-center gap-4 mb-4 md:mb-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">
                      {testimonials[activeTestimonial].avatar}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-gray-300">{testimonials[activeTestimonial].role}</p>
                    <p className="text-blue-300 text-sm font-medium">{testimonials[activeTestimonial].highlight}</p>
                  </div>
                </div>

                {/* Testimonial Navigation */}
                <div className="flex items-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === activeTestimonial ? 'bg-blue-500 scale-125' : 'bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Testimonials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.slice(0, 4).map((testimonial, index) => (
              <div
                key={index}
                className={`bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 cursor-pointer ${
                  index === activeTestimonial % 4 ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setActiveTestimonial(index)}
              >
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-white text-sm mb-4 leading-relaxed line-clamp-3">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {testimonial.avatar}
                    </span>
                  </div>
                  <div>
                    <h5 className="text-white font-medium text-sm">{testimonial.name}</h5>
                    <p className="text-gray-400 text-xs">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-8">
            <Crown className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Laundry Experience?
              </span>
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join <strong>15,000+</strong> students who've revolutionized their laundry routine.
              Start your free trial today and experience the future of college laundry management.
            </p>
          </div>

          {/* Urgency Elements */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-white font-semibold">✨ Free 30-day trial</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-white font-semibold">🚀 Setup in 5 minutes</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-3">
              <span className="text-white font-semibold">💎 Premium support included</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <button
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3 group"
            >
              <Rocket className="w-7 h-7" />
              Start Free Trial Now
              <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="border-2 border-white text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center gap-3 group">
              <Play className="w-7 h-7" />
              Watch Demo
              <ChevronDown className="w-7 h-7 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              <span className="text-sm">Bank-level security</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="text-sm">GDPR compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm">99.9% uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <HeadphonesIcon className="w-5 h-5" />
              <span className="text-sm">24/7 support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-20 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-white rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                  <Shirt className="w-8 h-8 text-white" />
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  LaundryHub
                </span>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6 max-w-md">
                Revolutionizing college laundry management with cutting-edge technology,
                seamless user experiences, and comprehensive operational insights.
              </p>

              {/* Newsletter Signup */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-3">Stay Updated</h4>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                  />
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-2 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300">
                    Subscribe
                  </button>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {[
                  { icon: 'F', label: 'Facebook' },
                  { icon: 'T', label: 'Twitter' },
                  { icon: 'I', label: 'Instagram' },
                  { icon: 'L', label: 'LinkedIn' },
                  { icon: 'Y', label: 'YouTube' }
                ].map((social) => (
                  <div
                    key={social.label}
                    className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all duration-300 cursor-pointer group"
                    title={social.label}
                  >
                    <span className="text-sm font-bold group-hover:scale-110 transition-transform">
                      {social.icon}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Platform
              </h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Features
                </a></li>
                <li><a href="#about" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Target className="w-4 h-4" /> About
                </a></li>
                <li><a href="#roles" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Users className="w-4 h-4" /> User Roles
                </a></li>
                <li><a href="#testimonials" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Star className="w-4 h-4" /> Reviews
                </a></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Support
              </h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <HeadphonesIcon className="w-4 h-4" /> Help Center
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" /> Contact Us
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy Policy
                </a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Terms of Service
                </a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row items-center gap-6 text-gray-400 text-sm">
                <p>© 2025 LaundryHub. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span>Made with ❤️ for better college experiences</span>
                  <div className="flex items-center gap-1">
                    <span>Powered by</span>
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Zap className="w-3 h-3 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Lock className="w-4 h-4 text-green-400" />
                  <span>SSL Secured</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Award className="w-4 h-4 text-yellow-400" />
                  <span>Award Winning</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

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

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.6); }
        }

        @keyframes slide-in-left {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        /* Smooth scrolling for anchor links */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(45deg, #3b82f6, #8b5cf6);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(45deg, #2563eb, #7c3aed);
        }

        /* Selection styling */
        ::selection {
          background: rgba(59, 130, 246, 0.3);
          color: #1f2937;
        }

        /* Focus styles for accessibility */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }
      `}} />
    </div>
  );
}