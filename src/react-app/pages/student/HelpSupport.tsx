import { useState } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { HelpCircle, Send, Mail, Phone, MessageSquare, Clock } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

const faqItems = [
  {
    question: 'How do I submit a laundry request?',
    answer: 'Go to "Submit Laundry" from your dashboard, select items, scan your laundry bag QR code, and submit the request. An operator will assign a machine to you.'
  },
  {
    question: 'What is the laundry bag QR code?',
    answer: 'Each laundry bag has a unique QR code that helps track your items throughout the washing process. Scan it when submitting your laundry.'
  },
  {
    question: 'How long does the laundry process take?',
    answer: 'Typically, washing takes 30-45 minutes and drying takes 45-60 minutes. Check your laundry history for estimated completion times.'
  },
  {
    question: 'Can I track my laundry status?',
    answer: 'Yes! View real-time status updates in your dashboard and laundry history. You\'ll see when your laundry is washing, drying, or ready for collection.'
  },
  {
    question: 'What if I lose my laundry bag?',
    answer: 'Report lost items in the Lost & Found section. Our operators will help locate your bag or provide a replacement.'
  },
  {
    question: 'How do I verify my QR code assignment?',
    answer: 'After an operator assigns a QR code to you, go to "Verify QR" and scan the code to confirm the assignment.'
  }
];

const supportContacts = [
  {
    icon: Mail,
    label: 'Email Support',
    value: 'support@laundryhub.college',
    description: 'Response within 24 hours'
  },
  {
    icon: Phone,
    label: 'Phone Support',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 8 AM - 6 PM'
  },
  {
    icon: MessageSquare,
    label: 'Live Chat',
    value: 'Available on dashboard',
    description: 'Mon-Fri, 9 AM - 5 PM'
  }
];

export default function HelpSupport() {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { toasts, showToast, removeToast } = useToast();

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !message.trim()) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    // Store support ticket in localStorage
    const tickets = JSON.parse(localStorage.getItem('supportTickets') || '[]');
    const newTicket = {
      id: `ticket_${Date.now()}`,
      studentId: user?.id,
      studentName: user?.name,
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString()
    };
    tickets.push(newTicket);
    localStorage.setItem('supportTickets', JSON.stringify(tickets));

    showToast('Support ticket submitted successfully', 'success');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              Help & Support
            </h1>
            <p className="text-gray-600">Get help with your laundry services</p>
          </div>

          {/* Contact Information */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {supportContacts.map((contact, index) => (
              <GlassCard key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                    <contact.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{contact.label}</h3>
                    <p className="text-blue-600 font-medium mb-1">{contact.value}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{contact.description}</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* FAQ Section */}
            <div>
              <GlassCard className="p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-3">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                        className="w-full px-4 py-3 text-left font-medium text-gray-900 hover:bg-gray-50 transition-colors flex items-center justify-between"
                      >
                        <span>{faq.question}</span>
                        <span className="text-blue-600 text-xl">
                          {selectedFAQ === index ? '−' : '+'}
                        </span>
                      </button>
                      {selectedFAQ === index && (
                        <div className="px-4 py-3 bg-blue-50 border-t border-gray-200">
                          <p className="text-gray-700 text-sm">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Submit Support Ticket */}
            <div>
              <GlassCard className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Submit a Support Ticket</h2>
                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Brief description of your issue"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your issue in detail..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg font-medium"
                  >
                    <Send className="w-5 h-5" />
                    Submit Ticket
                  </button>
                </form>
              </GlassCard>

              <GlassCard className="p-4 mt-4 bg-blue-50 border-blue-200">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-medium mb-1">Need immediate assistance?</p>
                    <p className="text-blue-800">Contact our operators directly through the phone number listed above during business hours.</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
