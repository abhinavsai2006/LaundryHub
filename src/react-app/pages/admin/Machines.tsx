import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '@/react-app/contexts/DataContext';
import { Settings, Search, Wrench, CheckCircle, XCircle, AlertTriangle, Plus, Trash2, Calendar, BarChart3 } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

export default function Machines() {
  const { machines, updateMachine } = useData();
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [hostelFilter, setHostelFilter] = useState('all');
  const [maintenanceSchedule, setMaintenanceSchedule] = useState<{[key: string]: string}>({});
  const [downtimeTracking, setDowntimeTracking] = useState<{[key: string]: {start: string, reason: string}[]}>({});

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesHostel = hostelFilter === 'all' || machine.hostel === hostelFilter;
    return matchesSearch && matchesHostel;
  });

  const handleRemoveMachine = (machineId: string) => {
    // In a real app, this would remove from the data context
    // For now, just show a toast with the machine ID
    showToast(`Machine ${machineId} removal not implemented in demo`, 'warning');
  };

  const handleStatusToggle = (machineId: string, newStatus: 'available' | 'in-use' | 'maintenance') => {
    updateMachine(machineId, { status: newStatus });
    if (newStatus === 'maintenance') {
      const now = new Date().toISOString();
      setDowntimeTracking(prev => ({
        ...prev,
        [machineId]: [...(prev[machineId] || []), { start: now, reason: 'Maintenance' }]
      }));
    }
    showToast(`Machine status updated to ${newStatus}`, 'success');
  };

  const scheduleMaintenance = (machineId: string, date: string) => {
    setMaintenanceSchedule(prev => ({ ...prev, [machineId]: date }));
    showToast('Maintenance scheduled', 'success');
  };

  const getUtilizationData = (machineId: string) => {
    // Mock utilization data - in real app, this would be calculated from usage logs
    const utilization = Math.floor(Math.random() * 100);
    const downtime = downtimeTracking[machineId]?.length || 0;
    return { utilization, downtime };
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-use':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-red-600" />;
      default:
        return <XCircle className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'in-use':
        return 'bg-yellow-100 text-yellow-800';
      case 'maintenance':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Settings className="w-8 h-8 text-blue-600" />
            Washing Machine Management
          </h1>
          <p className="text-gray-600">Operational readiness</p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex items-center justify-between mb-6">
          <GlassCard className="p-6 flex-1 mr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search machines..."
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
            </div>
          </GlassCard>
          <button
            onClick={() => navigate('/admin/machines/add')}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Machine
          </button>
        </div>

        {/* Machines Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMachines.map(machine => {
            const utilization = getUtilizationData(machine.id);
            return (
              <GlassCard key={machine.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{machine.name}</h3>
                      <button
                        onClick={() => handleRemoveMachine(machine.id)}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title="Remove Machine"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600">ID: {machine.id}</p>
                    <p className="text-sm text-gray-600">Type: {machine.type}</p>
                    <p className="text-sm text-gray-600">Hostel: {machine.hostel}</p>
                  </div>
                  {getStatusIcon(machine.status)}
                </div>

                <div className="mb-4">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(machine.status)}`}>
                    {machine.status}
                  </span>
                </div>

                {/* Status Toggle */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={machine.status}
                    onChange={(e) => handleStatusToggle(machine.id, e.target.value as 'available' | 'in-use' | 'maintenance')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="available">Available</option>
                    <option value="in-use">In Use</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Maintenance Scheduling */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Schedule Maintenance
                  </label>
                  <input
                    type="datetime-local"
                    value={maintenanceSchedule[machine.id] || ''}
                    onChange={(e) => scheduleMaintenance(machine.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Utilization View */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Utilization</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${utilization.utilization}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">Current utilization: {utilization.utilization}%</p>
                  <p className="text-xs text-gray-500">Downtime incidents: {utilization.downtime}</p>
                </div>

                {/* Maintenance Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Maintenance Notes</label>
                  <textarea
                    placeholder="Add maintenance notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={3}
                    defaultValue={machine.notes || ''}
                    onBlur={(e) => updateMachine(machine.id, { notes: e.target.value })}
                  />
                </div>
              </GlassCard>
            );
          })}
        </div>

      </div>
    </div>
  );
}