import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Plus, Edit, Trash2, Users } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  createdAt: string;
}

const availablePermissions = [
  'view_dashboard',
  'manage_operators',
  'manage_students',
  'manage_qr_codes',
  'manage_machines',
  'manage_lost_found',
  'view_analytics',
  'manage_announcements',
  'view_reports',
  'manage_alerts',
  'manage_settings',
  'manage_roles'
];

export default function RoleManagement() {
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 'admin',
      name: 'Full Admin',
      description: 'Complete system access',
      permissions: availablePermissions,
      createdAt: new Date().toISOString()
    },
    {
      id: 'hostel_admin',
      name: 'Hostel Admin',
      description: 'Hostel-specific management',
      permissions: ['view_dashboard', 'manage_operators', 'manage_students', 'manage_machines', 'view_analytics'],
      createdAt: new Date().toISOString()
    }
  ]);

  const handleDelete = (roleId: string) => {
    if (roleId === 'admin') {
      showToast('Cannot delete admin role', 'error');
      return;
    }

    setRoles(roles.filter(role => role.id !== roleId));
    showToast('Role deleted successfully', 'success');
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            Role & Permission Management
          </h1>
          <p className="text-gray-600">Configure sub-admin roles and access controls</p>
        </div>

        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/roles/add')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Role
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map(role => (
            <GlassCard key={role.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate(`/admin/roles/edit?roleId=${role.id}`)}
                    className="p-1 text-gray-600 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {role.id !== 'admin' && (
                    <button
                      onClick={() => handleDelete(role.id)}
                      className="p-1 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Permissions ({role.permissions.length})</p>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.slice(0, 3).map(perm => (
                    <span key={perm} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {perm.replace('_', ' ')}
                    </span>
                  ))}
                  {role.permissions.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{role.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </div>
  );
}