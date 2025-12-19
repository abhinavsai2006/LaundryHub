import { useNavigate } from 'react-router-dom';
import { HelpCircle, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
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

export default function HelpSupport() {
  const navigate = useNavigate();
  const { toasts, removeToast } = useToast();

  const ticketsData = localStorage.getItem('supportTickets');
  const tickets: SupportTicket[] = ticketsData ? JSON.parse(ticketsData) : [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-orange-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-blue-500" />;
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
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-8 h-8 text-blue-600" />
              Help & Support Tickets
            </h1>
            <p className="text-gray-600">Manage student support requests</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6 mb-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                <p className="text-sm text-gray-600">Open Tickets</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'open').length}
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'in-progress').length}
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-sm text-gray-600">Resolved</p>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {tickets.filter(t => t.status === 'resolved').length}
              </p>
            </GlassCard>
          </div>

          {tickets.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Support Tickets</h3>
              <p className="text-gray-600">There are no support requests at the moment.</p>
            </GlassCard>
          ) : (
            <div className="space-y-4">
              {tickets.map(ticket => (
                <GlassCard key={ticket.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        {getStatusIcon(ticket.status)}
                        <div>
                          <h3 className="font-semibold text-gray-900">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">
                            From: {ticket.studentName} • {new Date(ticket.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-sm text-gray-700">{ticket.message}</p>
                      </div>

                      {ticket.response && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                          <p className="text-xs text-blue-600 mb-1 font-medium">Your Response:</p>
                          <p className="text-sm text-blue-900">{ticket.response}</p>
                        </div>
                      )}

                      {ticket.status !== 'resolved' && (
                        <button
                          onClick={() => navigate(`/operator/help/${ticket.id}`)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Respond to Ticket
                        </button>
                      )}
                    </div>

                    <div className={`px-3 py-1 rounded-lg text-xs font-medium ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
