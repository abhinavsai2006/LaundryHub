import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, User, Mail, Calendar, CheckCircle } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';

interface SupportTicket {
  id: string;
  studentId: string;
  studentName: string;
  subject: string;
  message: string;
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  response?: string;
}

export default function TicketResponsePage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { toasts, showToast, removeToast } = useToast();
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ticketsData = localStorage.getItem('supportTickets');
  const tickets: SupportTicket[] = ticketsData ? JSON.parse(ticketsData) : [];
  const ticket = tickets.find(t => t.id === ticketId);

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <GlassCard className="p-8 text-center">
          <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
          <p className="text-gray-600 mb-6">The requested support ticket could not be found.</p>
          <button
            onClick={() => navigate('/operator/help-support')}
            className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:from-orange-700 hover:to-orange-800 transition-all"
          >
            Back to Support
          </button>
        </GlassCard>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!response.trim()) {
      showToast('Please enter a response', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const updatedTickets = tickets.map(t =>
        t.id === ticket.id
          ? { ...t, status: 'resolved' as const, response: response.trim() }
          : t
      );

      localStorage.setItem('supportTickets', JSON.stringify(updatedTickets));
      showToast('Response sent successfully', 'success');
      navigate('/operator/help-support');
    } catch (error) {
      showToast('Failed to send response', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/operator/help-support')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Support Tickets
          </button>
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Respond to Ticket</h1>
              <p className="text-gray-600">Ticket #{ticket.id.slice(-8).toUpperCase()}</p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Ticket Details */}
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Ticket Details</h2>
              <div className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status.replace('-', ' ').toUpperCase()}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <User className="w-4 h-4" />
                    Student Name
                  </p>
                  <p className="text-lg font-medium text-gray-900">{ticket.studentName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    Student ID
                  </p>
                  <p className="text-gray-900">{ticket.studentId}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Created
                  </p>
                  <p className="text-gray-900">{new Date(ticket.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subject</p>
                  <p className="text-gray-900 font-medium">{ticket.subject}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Message</h3>
              <p className="text-gray-900 leading-relaxed">{ticket.message}</p>
            </div>
          </GlassCard>

          {/* Response Form */}
          {ticket.status !== 'resolved' && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Response</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Response Message *
                  </label>
                  <textarea
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Type your detailed response to help resolve this issue..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Your response will be sent to the student and the ticket will be marked as resolved.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={isSubmitting || !response.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Send & Mark Resolved
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/operator/help-support')}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </GlassCard>
          )}

          {/* Previous Response */}
          {ticket.response && (
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Previous Response</h2>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-gray-900 leading-relaxed">{ticket.response}</p>
                <p className="text-xs text-gray-500 mt-2">Sent on {new Date(ticket.createdAt).toLocaleString()}</p>
              </div>
            </GlassCard>
          )}
        </div>
      </div>
    </div>
  );
}