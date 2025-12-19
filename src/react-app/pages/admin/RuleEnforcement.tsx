import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Shield, Users, Flag } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface Rule {
  id: string;
  name: string;
  description: string;
  type: 'max_clothes' | 'max_weekly' | 'prohibited_items';
  value: number | string[];
  isActive: boolean;
  violationAction: 'warning' | 'restriction' | 'block';
}

interface Violation {
  id: string;
  studentId: string;
  studentName: string;
  ruleId: string;
  ruleName: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'escalated';
  actionTaken?: string;
}

export default function RuleEnforcement() {
  const { toasts, showToast, removeToast } = useToast();
  const navigate = useNavigate();

  const [rules, setRules] = useState<Rule[]>([
    {
      id: '1',
      name: 'Max Clothes per Cycle',
      description: 'Students cannot submit more than 10 items per laundry cycle',
      type: 'max_clothes',
      value: 10,
      isActive: true,
      violationAction: 'warning'
    },
    {
      id: '2',
      name: 'Max Weekly Submissions',
      description: 'Students cannot submit more than 7 times per week',
      type: 'max_weekly',
      value: 7,
      isActive: true,
      violationAction: 'restriction'
    },
    {
      id: '3',
      name: 'Prohibited Items',
      description: 'Certain items are not allowed for laundry',
      type: 'prohibited_items',
      value: ['underwear', 'socks', 'bedding'],
      isActive: true,
      violationAction: 'block'
    }
  ]);

  const [violations, setViolations] = useState<Violation[]>([
    {
      id: '1',
      studentId: 'student_1',
      studentName: 'John Doe',
      ruleId: '1',
      ruleName: 'Max Clothes per Cycle',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'pending'
    },
    {
      id: '2',
      studentId: 'student_2',
      studentName: 'Jane Smith',
      ruleId: '2',
      ruleName: 'Max Weekly Submissions',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      actionTaken: 'Warning issued'
    }
  ]);

  const handleRuleToggle = (ruleId: string, isActive: boolean) => {
    setRules(rules.map(rule =>
      rule.id === ruleId ? { ...rule, isActive } : rule
    ));
    showToast(`Rule ${isActive ? 'activated' : 'deactivated'}`, 'success');
  };

  const handleViolationAction = (violationId: string, action: string) => {
    setViolations(violations.map(v =>
      v.id === violationId
        ? { ...v, status: 'resolved', actionTaken: action }
        : v
    ));
    showToast('Violation resolved', 'success');
  };

  const escalateViolation = (violationId: string) => {
    setViolations(violations.map(v =>
      v.id === violationId ? { ...v, status: 'escalated' } : v
    ));
    showToast('Violation escalated', 'warning');
  };

  const getViolationsByStatus = (status: string) => {
    return violations.filter(v => v.status === status);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Shield className="w-8 h-8 text-red-600" />
            Rule Enforcement & Policy Engine
          </h1>
          <p className="text-gray-600">Monitor violations and enforce laundry policies</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{getViolationsByStatus('pending').length}</p>
                <p className="text-sm text-gray-600">Pending Violations</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <Flag className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{getViolationsByStatus('resolved').length}</p>
                <p className="text-sm text-gray-600">Resolved Violations</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{rules.filter(r => r.isActive).length}</p>
                <p className="text-sm text-gray-600">Active Rules</p>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Rules Management */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Laundry Rules</h2>
              <button
                onClick={() => navigate('/admin/rules/create')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Add Rule
              </button>
            </div>

            <div className="space-y-4">
              {rules.map(rule => (
                <GlassCard key={rule.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                      <p className="text-sm text-gray-600">{rule.description}</p>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={rule.isActive}
                        onChange={(e) => handleRuleToggle(rule.id, e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Type: {rule.type.replace('_', ' ')}</span>
                    <span className="text-gray-600">
                      Action: {rule.violationAction}
                    </span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Violations Management */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Violations</h2>

            <div className="space-y-4">
              {violations.map(violation => (
                <GlassCard key={violation.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{violation.studentName}</h3>
                      <p className="text-sm text-gray-600">{violation.ruleName}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(violation.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      violation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      violation.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {violation.status}
                    </span>
                  </div>

                  {violation.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViolationAction(violation.id, 'Warning issued')}
                        className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                      >
                        Warn
                      </button>
                      <button
                        onClick={() => handleViolationAction(violation.id, 'Temporary restriction')}
                        className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
                      >
                        Restrict
                      </button>
                      <button
                        onClick={() => escalateViolation(violation.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Escalate
                      </button>
                    </div>
                  )}

                  {violation.actionTaken && (
                    <p className="text-sm text-green-600 mt-2">Action: {violation.actionTaken}</p>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}