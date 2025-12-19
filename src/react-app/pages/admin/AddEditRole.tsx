import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Shield, Save, X } from 'lucide-react';
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

export default function AddEditRole() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toasts, showToast, removeToast } = useToast();

  const roleId = searchParams.get('roleId');
  const isEditing = !!roleId;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  // Mock data - in real app, this would come from context/API
  const mockRoles: Role[] = [
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
  ];

  useEffect(() => {
    if (isEditing) {
      const role = mockRoles.find(r => r.id === roleId);
      if (role) {
        setFormData({
          name: role.name,
          description: role.description,
          permissions: role.permissions
        });
      }
    }
  }, [roleId, isEditing]);

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      showToast('Role name is required', 'error');
      return;
    }

    // In real app, this would call an API or update context
    if (isEditing) {
      showToast('Role updated successfully', 'success');
    } else {
      showToast('Role created successfully', 'success');
    }

    // Navigate back to role management
    navigate('/admin/roles');
  };

  const handleCancel = () => {
    navigate('/admin/roles');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" />
                  {isEditing ? 'Edit Role' : 'Create New Role'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Modify role permissions and settings' : 'Configure a new role with specific permissions'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
              >
                <Save className="w-4 h-4" />
                {isEditing ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Role Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="e.g., Hostel Admin"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Brief description of the role"
                    />
                  </div>
                </div>
              </div>

              {/* Permissions */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Permissions</h2>
                <p className="text-gray-600 mb-6">
                  Select the permissions this role should have. Users with this role will be able to perform these actions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availablePermissions.map(permission => (
                    <label key={permission} className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => togglePermission(permission)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {permission.replace('_', ' ')}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">
                          {getPermissionDescription(permission)}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Role Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Selected Permissions:</span>
                    <span className="ml-2 font-medium text-gray-900">{formData.permissions.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Role Type:</span>
                    <span className="ml-2 font-medium text-gray-900">
                      {formData.permissions.length === availablePermissions.length ? 'Full Access' :
                       formData.permissions.length > 5 ? 'Extended Access' : 'Limited Access'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className="ml-2 font-medium text-green-600">Ready to {isEditing ? 'Update' : 'Create'}</span>
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

function getPermissionDescription(permission: string): string {
  const descriptions: Record<string, string> = {
    'view_dashboard': 'Access main dashboard and overview',
    'manage_operators': 'Add, edit, and remove operators',
    'manage_students': 'Manage student accounts and profiles',
    'manage_qr_codes': 'Generate and manage QR codes',
    'manage_machines': 'Configure and maintain laundry machines',
    'manage_lost_found': 'Handle lost and found items',
    'view_analytics': 'Access analytics and reports',
    'manage_announcements': 'Create and manage announcements',
    'view_reports': 'View detailed system reports',
    'manage_alerts': 'Handle system alerts and notifications',
    'manage_settings': 'Configure system settings',
    'manage_roles': 'Create and manage user roles'
  };
  return descriptions[permission] || 'Permission description';
}