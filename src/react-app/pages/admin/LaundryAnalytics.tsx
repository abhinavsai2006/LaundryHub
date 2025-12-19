import { useData } from '@/react-app/contexts/DataContext';
import { BarChart3, TrendingUp, Calendar, Users, Filter } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useState } from 'react';
import { User } from '@/shared/laundry-types';

export default function LaundryAnalytics() {
  const { laundryItems } = useData();
  const [hostelFilter, setHostelFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Filter data
  const filteredItems = laundryItems.filter(item => {
    const user = JSON.parse(localStorage.getItem('users') || '[]').find((u: User) => u.id === item.studentId);
    const hostelMatch = hostelFilter === 'all' || user?.hostel === hostelFilter;
    const dateMatch = (!dateRange.start || new Date(item.submittedAt) >= new Date(dateRange.start)) &&
                      (!dateRange.end || new Date(item.submittedAt) <= new Date(dateRange.end));
    return hostelMatch && dateMatch;
  });

  // Calculate analytics
  const totalOrders = filteredItems.length;
  const completedOrders = filteredItems.filter(item => item.status === 'delivered').length;
  const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

  // Daily volume (mock data for demo)
  const dailyVolume = [
    { day: 'Mon', orders: 12 },
    { day: 'Tue', orders: 15 },
    { day: 'Wed', orders: 8 },
    { day: 'Thu', orders: 20 },
    { day: 'Fri', orders: 18 },
    { day: 'Sat', orders: 10 },
    { day: 'Sun', orders: 5 }
  ];

  // Weekly trends (mock data)
  const weeklyTrends = [
    { week: 'Week 1', orders: 45 },
    { week: 'Week 2', orders: 52 },
    { week: 'Week 3', orders: 38 },
    { week: 'Week 4', orders: 61 }
  ];

  // Peak hours (mock data)
  const peakHours = [
    { hour: '8 AM', orders: 5 },
    { hour: '10 AM', orders: 12 },
    { hour: '12 PM', orders: 18 },
    { hour: '2 PM', orders: 15 },
    { hour: '4 PM', orders: 20 },
    { hour: '6 PM', orders: 25 },
    { hour: '8 PM', orders: 10 }
  ];

  // Status distribution
  const statusData = [
    { status: 'Delivered', count: completedOrders, color: 'bg-green-500' },
    { status: 'Ready', count: filteredItems.filter(item => item.status === 'ready').length, color: 'bg-blue-500' },
    { status: 'Processing', count: filteredItems.filter(item => ['washing', 'drying'].includes(item.status)).length, color: 'bg-orange-500' },
    { status: 'Pending', count: filteredItems.filter(item => item.status === 'submitted').length, color: 'bg-gray-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Laundry Analytics
          </h1>
          <p className="text-gray-600">Performance & trend analysis</p>
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </GlassCard>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg. Processing Time</p>
                <p className="text-3xl font-bold text-gray-900">4.2h</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Orders</p>
                <p className="text-3xl font-bold text-gray-900">
                  {laundryItems.filter(item => !['delivered'].includes(item.status)).length}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daily Volume Chart */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Daily Volume</h2>
            <div className="space-y-4">
              {dailyVolume.map((day) => (
                <div key={day.day} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-blue-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(day.orders / 20) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{day.orders}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Weekly Trends */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Weekly Trends</h2>
            <div className="space-y-4">
              {weeklyTrends.map((week) => (
                <div key={week.week} className="flex items-center gap-4">
                  <div className="w-16 text-sm font-medium text-gray-600">{week.week}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(week.orders / 65) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{week.orders}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Peak Hours */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Peak Hours</h2>
            <div className="space-y-4">
              {peakHours.map((hour) => (
                <div key={hour.hour} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{hour.hour}</div>
                  <div className="flex-1">
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-purple-500 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${(hour.orders / 25) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-8 text-sm font-medium text-gray-900">{hour.orders}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Status Distribution */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status Distribution</h2>
            <div className="space-y-4">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">{item.count}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Hostel Performance */}
          <GlassCard className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Hostel Performance</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">MH-A</span>
                <span className="text-lg font-bold text-gray-900">45 orders</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">MH-B</span>
                <span className="text-lg font-bold text-gray-900">32 orders</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">LH-A</span>
                <span className="text-lg font-bold text-gray-900">28 orders</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">LH-B</span>
                <span className="text-lg font-bold text-gray-900">21 orders</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}