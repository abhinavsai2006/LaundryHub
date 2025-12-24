import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield, AlertTriangle, Settings, Save, X } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';

interface Rule {
  id: string;
  name: string;
  description: string;
  type: 'max_clothes' | 'max_weekly' | 'prohibited_items';
  value: number | string[];
  isActive: boolean;
  violationAction: 'warning' | 'restriction' | 'block';
}

export default function CreateRule() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [ruleData, setRuleData] = useState({
    name: '',
    description: '',
    type: 'max_clothes' as Rule['type'],
    value: '',
    violationAction: 'warning' as Rule['violationAction']
  });

  const [prohibitedItems, setProhibitedItems] = useState<string[]>(['']);
  const [maxValue, setMaxValue] = useState<number>(10);

  const handleTypeChange = (type: Rule['type']) => {
    setRuleData(prev => ({ ...prev, type }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ruleData.name.trim() || !ruleData.description.trim()) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    let finalValue: number | string[];
    if (ruleData.type === 'prohibited_items') {
      finalValue = prohibitedItems.filter(item => item.trim() !== '');
      if (finalValue.length === 0) {
        showToast('Please add at least one prohibited item', 'error');
        return;
      }
    } else {
      finalValue = maxValue;
    }

    // In a real app, this would save to backend
    showToast('Rule created successfully', 'success');
    navigate('/admin/rules');
  };

  const addProhibitedItem = () => {
    setProhibitedItems(prev => [...prev, '']);
  };

  const updateProhibitedItem = (index: number, value: string) => {
    setProhibitedItems(prev => prev.map((item, i) => i === index ? value : item));
  };

  const removeProhibitedItem = (index: number) => {
    setProhibitedItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    navigate('/admin/rules');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-3 sm:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:gap-4 min-w-0 flex-1">
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              >
                <X className="w-4 h-4 md:w-5 md:h-5" />
              </button>
              <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                <div className="p-2 bg-red-100 rounded-md flex-shrink-0">
                  <Plus className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 truncate">Create New Rule</h1>
                  <p className="text-xs md:text-sm text-gray-600 truncate">Define laundry policy rules and enforcement actions</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 md:py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Basic Information */}
            <GlassCard className="p-4 md:p-6 lg:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 md:w-5 md:h-5 text-red-500 flex-shrink-0" />
                <span className="truncate">Basic Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Rule Name *
                  </label>
                  <input
                    type="text"
                    value={ruleData.name}
                    onChange={(e) => setRuleData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Max Clothes per Cycle"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base min-h-[44px]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Rule Type *
                  </label>
                  <select
                    value={ruleData.type}
                    onChange={(e) => handleTypeChange(e.target.value as Rule['type'])}
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base min-h-[44px]"
                  >
                    <option value="max_clothes">Maximum Clothes per Cycle</option>
                    <option value="max_weekly">Maximum Weekly Submissions</option>
                    <option value="prohibited_items">Prohibited Items</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 md:mt-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Description *
                </label>
                <textarea
                  value={ruleData.description}
                  onChange={(e) => setRuleData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this rule enforces and why it's important..."
                  className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm md:text-base min-h-[80px]"
                  rows={3}
                  required
                />
              </div>
            </GlassCard>

            {/* Rule Configuration */}
            <GlassCard className="p-4 md:p-6 lg:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <Settings className="w-4 h-4 md:w-5 md:h-5 text-blue-500 flex-shrink-0" />
                <span className="truncate">Rule Configuration</span>
              </h3>

              {ruleData.type === 'max_clothes' && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Maximum Items per Cycle
                  </label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    min="1"
                    max="50"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base min-h-[44px]"
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Students cannot submit more than this many items in a single laundry cycle.
                  </p>
                </div>
              )}

              {ruleData.type === 'max_weekly' && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">
                    Maximum Weekly Submissions
                  </label>
                  <input
                    type="number"
                    value={maxValue}
                    onChange={(e) => setMaxValue(Number(e.target.value))}
                    min="1"
                    max="20"
                    className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base min-h-[44px]"
                  />
                  <p className="text-xs md:text-sm text-gray-500 mt-1">
                    Students cannot submit laundry more than this many times per week.
                  </p>
                </div>
              )}

              {ruleData.type === 'prohibited_items' && (
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-4">
                    Prohibited Items
                  </label>
                  <div className="space-y-2 md:space-y-3">
                    {prohibitedItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 md:gap-3">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateProhibitedItem(index, e.target.value)}
                          placeholder="e.g., underwear, bedding, shoes"
                          className="flex-1 px-3 py-2 md:px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm md:text-base min-h-[44px]"
                        />
                        {prohibitedItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProhibitedItem(index)}
                            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addProhibitedItem}
                      className="px-3 py-2 md:px-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg border border-blue-200 text-sm md:text-base min-h-[44px] w-full sm:w-auto"
                    >
                      + Add Item
                    </button>
                  </div>
                  <p className="text-xs md:text-sm text-gray-500 mt-2">
                    These items will be blocked from laundry submissions.
                  </p>
                </div>
              )}
            </GlassCard>

            {/* Violation Actions */}
            <GlassCard className="p-4 md:p-6 lg:p-8">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 md:w-5 md:h-5 text-orange-500 flex-shrink-0" />
                <span className="truncate">Violation Enforcement</span>
              </h3>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-4">
                  Action to Take on Violation *
                </label>
                <div className="space-y-3 md:space-y-4">
                  <label className="flex items-start gap-2 md:gap-3 min-h-[44px]">
                    <input
                      type="radio"
                      value="warning"
                      checked={ruleData.violationAction === 'warning'}
                      onChange={(e) => setRuleData(prev => ({ ...prev, violationAction: e.target.value as Rule['violationAction'] }))}
                      className="text-red-600 focus:ring-red-500 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm md:text-base">Warning</span>
                      <span className="text-xs md:text-sm text-gray-500 block">Issue a warning and allow submission</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 md:gap-3 min-h-[44px]">
                    <input
                      type="radio"
                      value="restriction"
                      checked={ruleData.violationAction === 'restriction'}
                      onChange={(e) => setRuleData(prev => ({ ...prev, violationAction: e.target.value as Rule['violationAction'] }))}
                      className="text-red-600 focus:ring-red-500 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm md:text-base">Temporary Restriction</span>
                      <span className="text-xs md:text-sm text-gray-500 block">Block submissions for a period of time</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2 md:gap-3 min-h-[44px]">
                    <input
                      type="radio"
                      value="block"
                      checked={ruleData.violationAction === 'block'}
                      onChange={(e) => setRuleData(prev => ({ ...prev, violationAction: e.target.value as Rule['violationAction'] }))}
                      className="text-red-600 focus:ring-red-500 mt-1 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="font-medium text-sm md:text-base">Block Submission</span>
                      <span className="text-xs md:text-sm text-gray-500 block">Completely block the violating submission</span>
                    </div>
                  </label>
                </div>
              </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 md:gap-4">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 md:px-6 md:py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg border border-gray-300 text-sm md:text-base min-h-[44px] w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 md:px-8 md:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-medium text-sm md:text-base min-h-[44px] w-full sm:w-auto"
              >
                <Save className="w-4 h-4 flex-shrink-0" />
                Create Rule
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}