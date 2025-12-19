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
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Student Management
          </h1>
          <p className="text-gray-600">Monitor student participation</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel</label>
              <select
                value={hostelFilter}
                onChange={(e) => setHostelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Hostels</option>
                <option value="MH">MH</option>
                <option value="LH">LH</option>
              </select>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showMasked}
                  onChange={(e) => setShowMasked(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mask sensitive data</span>
              </label>
            </div>
          </div>
        </GlassCard>

        {/* Students Table */}
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Reg No</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hostel & Room</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">QR Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Laundry Frequency</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Flags</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map(student => {
                  const frequency = getLaundryFrequency(student.id);
                  const suspiciousPatterns = detectSuspiciousPatterns(student.id);
                  return (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{maskRollNumber(student.rollNumber)}</td>
                      <td className="py-3 px-4 text-gray-900">{maskName(student.name)}</td>
                      <td className="py-3 px-4 text-gray-900">{student.hostel} {student.room}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          getQRStatus(student) === 'Verified' ? 'bg-green-100 text-green-800' :
                          getQRStatus(student) === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {getQRStatus(student)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">
                          <p className="font-medium">{frequency.thisWeek}/week</p>
                          <p className="text-gray-500">{frequency.thisMonth}/month</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {suspiciousPatterns.length > 0 ? (
                          <div className="flex items-center gap-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              {suspiciousPatterns.length} flag{suspiciousPatterns.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-sm">None</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => navigate(`/admin/students/${student.id}`)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
