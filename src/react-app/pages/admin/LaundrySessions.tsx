import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/shared/laundry-types';
import { Activity, Search, Filter, Eye } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useData } from '@/react-app/contexts/DataContext';

interface LaundrySession {
  id: string;
  studentId: string;
  studentName: string;
  operatorId?: string;
  operatorName?: string;
  qrCode?: string;
  bagQRCode?: string;
  status: string;
  hostel: string;
  submittedAt: string;
  pickedUpAt?: string;
  washingStartedAt?: string;
  dryingStartedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  estimatedReadyTime?: string;
  items: string[];
  specialInstructions?: string;
}

export default function LaundrySessions() {
  const { laundryItems } = useData();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<LaundrySession[]>([]);
  const [filteredSessions, setFilteredSessions] = useState<LaundrySession[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [operatorFilter, setOperatorFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    const sessionsData: LaundrySession[] = laundryItems.map(item => {
      const student = usersData.find((u: User) => u.id === item.studentId);
      const operator = usersData.find((u: User) => u.id === item.operatorId);
      return {
        ...item,
        studentName: student?.name || 'Unknown',
        operatorName: operator?.name,
        hostel: student?.hostel || 'Unknown'
      };
    });
    setSessions(sessionsData);
    setFilteredSessions(sessionsData);
  }, [laundryItems]);

  useEffect(() => {
    let filtered = sessions;

    if (searchTerm) {
      filtered = filtered.filter(session =>
        session.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.qrCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (hostelFilter !== 'all') {
      filtered = filtered.filter(session => session.hostel === hostelFilter);
    }

    if (operatorFilter !== 'all') {
      filtered = filtered.filter(session => session.operatorId === operatorFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(session => session.status === statusFilter);
    }

    if (dateFilter) {
      filtered = filtered.filter(session =>
        new Date(session.submittedAt).toDateString() === new Date(dateFilter).toDateString()
      );
    }

    setFilteredSessions(filtered);
  }, [sessions, searchTerm, hostelFilter, operatorFilter, statusFilter, dateFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'washing': return 'bg-purple-100 text-purple-800';
      case 'drying': return 'bg-indigo-100 text-indigo-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOperators = () => {
    const usersData = JSON.parse(localStorage.getItem('users') || '[]');
    return usersData.filter((u: User) => u.role === 'operator');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Activity className="w-8 h-8 text-blue-600" />
            Laundry Session Management
          </h1>
          <p className="text-gray-600">Full traceability of laundry operations</p>
        </div>

        {/* Filters */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
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
            <div>
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Operators</option>
                {getOperators().map((op: User) => (
                  <option key={op.id} value={op.id}>{op.name}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="submitted">Submitted</option>
                <option value="picked_up">Picked Up</option>
                <option value="washing">Washing</option>
                <option value="drying">Drying</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>
            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setHostelFilter('all');
                  setOperatorFilter('all');
                  setStatusFilter('all');
                  setDateFilter('');
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Sessions Table */}
        <GlassCard className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Session ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Student</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Hostel</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Operator</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Submitted</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map(session => (
                  <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900 font-mono text-sm">{session.id.slice(-8)}</td>
                    <td className="py-3 px-4 text-gray-900">{session.studentName}</td>
                    <td className="py-3 px-4 text-gray-900">{session.hostel}</td>
                    <td className="py-3 px-4 text-gray-900">{session.operatorName || 'Unassigned'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-900 text-sm">
                      {new Date(session.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => navigate(`/admin/sessions/details?sessionId=${session.id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSessions.length === 0 && (
            <div className="text-center py-12">
              <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No laundry sessions found</p>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}