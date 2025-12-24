import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/shared/laundry-types';
import { GraduationCap, Search, Filter, Eye } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';

export default function Students() {
  const { laundryItems, qrCodes } = useData();
  const navigate = useNavigate();
  const [students, setStudents] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [showMasked, setShowMasked] = useState(true);

  useEffect(() => {
    const usersData = localStorage.getItem('users');
    if (usersData) {
      const allUsers: User[] = JSON.parse(usersData);
      setStudents(allUsers.filter(u => u.role === 'student'));
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearchTerm(searchTerm), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  const filteredStudents = useMemo(() => {
    const q = debouncedSearchTerm.trim().toLowerCase();
    if (!q && hostelFilter === 'all') return students;

    return students.filter(student => {
      const matchesSearch = !q ||
        student.name.toLowerCase().includes(q) ||
        student.email.toLowerCase().includes(q) ||
        (student.rollNumber && student.rollNumber.toLowerCase().includes(q));
      const matchesHostel = hostelFilter === 'all' || student.hostel === hostelFilter;
      return matchesSearch && matchesHostel;
    });
  }, [students, debouncedSearchTerm, hostelFilter]);

  const getLaundryFrequency = (studentId: string) => {
    const studentOrders = laundryItems.filter(item => item.studentId === studentId);
    const thisWeek = studentOrders.filter(item => {
      const itemDate = new Date(item.submittedAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate >= weekAgo;
    });
    const thisMonth = studentOrders.filter(item => {
      const itemDate = new Date(item.submittedAt);
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return itemDate >= monthAgo;
    });

    return {
      thisWeek: thisWeek.length,
      thisMonth: thisMonth.length,
      total: studentOrders.length,
      averagePerWeek: Math.round((thisMonth.length / 4) * 10) / 10
    };
  };

  const detectSuspiciousPatterns = (studentId: string) => {
    const frequency = getLaundryFrequency(studentId);
    const flags: string[] = [];

    if (frequency.thisWeek > 7) flags.push('High weekly frequency');
    if (frequency.averagePerWeek > 5) flags.push('Above average usage');
    if (frequency.thisMonth > 20) flags.push('Excessive monthly usage');

    // Check for unusual timing patterns
    const studentOrders = laundryItems.filter(item => item.studentId === studentId);
    const lateNightOrders = studentOrders.filter(item => {
      const hour = new Date(item.submittedAt).getHours();
      return hour >= 22 || hour <= 6;
    });
    if (lateNightOrders.length > studentOrders.length * 0.3) {
      flags.push('Frequent late-night submissions');
    }

    return flags;
  };

  const maskName = (name: string) => {
    if (!showMasked) return name;
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  };

  const maskRollNumber = (rollNumber?: string) => {
    if (!showMasked || !rollNumber) return rollNumber;
    return rollNumber.substring(0, 2) + '*'.repeat(rollNumber.length - 4) + rollNumber.substring(rollNumber.length - 2);
  };

  const getQRStatus = (student: User) => {
    if (!student.qrCode) return 'Unassigned';
    const qr = qrCodes.find(q => q.code === student.qrCode);
    if (!qr) return 'Unassigned';
    return qr.status === 'verified' ? 'Verified' : 'Assigned';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
            Student Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Monitor student participation</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <span className="font-medium text-gray-900 text-sm sm:text-base">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">Hostel</label>
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              >
                <option value="all">All Hostels</option>
                <option value="MH">MH</option>
                <option value="LH">LH</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
            </div>
            <div className="flex items-center sm:col-span-2 lg:col-span-1">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMasked}
                  onChange={(e) => setShowMasked(e.target.checked)}
                  className="mr-2 sm:mr-3 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Mask sensitive data</span>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Students List */}
        <div className="space-y-3 sm:space-y-4">
          {filteredStudents.map(student => {
            const frequency = getLaundryFrequency(student.id);
            const suspiciousPatterns = detectSuspiciousPatterns(student.id);
            return (
              <GlassCard key={student.id} className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {maskName(student.name)}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium self-start sm:self-center whitespace-nowrap ${
                        getQRStatus(student) === 'Verified' ? 'bg-green-100 text-green-800' :
                        getQRStatus(student) === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getQRStatus(student)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Reg No:</span>
                        <span className="ml-2 font-medium text-gray-900">{maskRollNumber(student.rollNumber)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Hostel & Room:</span>
                        <span className="ml-2 font-medium text-gray-900">{student.hostel} {student.room}</span>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-gray-600">Laundry Frequency:</span>
                        <span className="ml-2 font-medium text-gray-900">
                          {frequency.thisWeek}/week, {frequency.thisMonth}/month
                        </span>
                      </div>
                    </div>
                    
                    {suspiciousPatterns.length > 0 && (
                      <div className="mt-3">
                        <span className="text-gray-600 text-sm">Flags:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {suspiciousPatterns.map((flag, idx) => (
                            <span key={idx} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {flag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => navigate(`/admin/students/${student.id}`)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors min-h-[44px]"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm sm:text-base">View Details</span>
                    </button>
                  </div>
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
