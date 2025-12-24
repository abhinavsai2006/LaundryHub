import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, MessageSquare, CheckCircle, Clock, AlertCircle, MessageCircle, FileText, Phone, MessageCircle as ChatIcon, X, Send, Loader2 } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { useToast } from '@/react-app/hooks/useToast';
import { ToastContainer } from '@/react-app/components/Toast';
import { geminiAI } from '@/react-app/services/geminiAI';

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
  const [activeTab, setActiveTab] = useState<'help' | 'tickets' | 'contact'>('help');
  const [showChatBox, setShowChatBox] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([
    {
      id: '1',
      text: 'Hi! I\'m your AI assistant for LaundryHub. How can I help you with laundry operations today?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [queueStatus, setQueueStatus] = useState({ queueLength: 0, isProcessing: false, activeRequests: 0 });
  const [serviceStatus, setServiceStatus] = useState({ isQuotaExceeded: false, lastQuotaError: null as Date | null, queueLength: 0, isProcessing: false, activeRequests: 0 });

  // Update queue and service status periodically
  useEffect(() => {
    const updateStatus = () => {
      const serviceStats = geminiAI.getServiceStatus();
      setQueueStatus({ queueLength: serviceStats.queueLength, isProcessing: serviceStats.isProcessing, activeRequests: serviceStats.activeRequests });
      setServiceStatus(serviceStats);
    };

    // Update immediately and then every second
    updateStatus();
    const interval = setInterval(updateStatus, 1000);

    return () => clearInterval(interval);
  }, []);

  // Quick questions for operators
  const quickQuestions = [
    "How do I scan a QR code?",
    "What should I do if a machine is broken?",
    "How do I handle lost items?",
    "What's the procedure for manual receipt?",
    "How do I assign QR codes to bags?",
    "What are the operating hours?",
    "How do I report an anomaly?",
    "How do I manage orders?"
  ];

  const handleQuickQuestion = async (question: string) => {
    if (isTyping || rateLimited || serviceStatus.isQuotaExceeded) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: question,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setRateLimited(false);

    try {
      const aiResponse = await geminiAI.generateResponse(question);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting to the AI service right now. Please try again later or contact support.',
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isTyping || rateLimited || serviceStatus.isQuotaExceeded) return;

    const userMessageText = currentMessage.trim();
    setCurrentMessage('');

    const userMessage = {
      id: Date.now().toString(),
      text: userMessageText,
      isUser: true,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setRateLimited(false);

    try {
      const aiResponse = await geminiAI.generateResponse(userMessageText);

      // Check if response indicates rate limiting
      if (aiResponse.includes('receiving many requests') || aiResponse.includes('wait a moment')) {
        setRateLimited(true);
        // Reset rate limit status after 3 seconds
        setTimeout(() => setRateLimited(false), 3000);
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);

      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I\'m having trouble connecting to the AI service right now. Please try again later or contact support.',
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Mock data for support tickets
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

  const faqItems = [
    {
      question: 'How do I scan QR codes?',
      answer: 'Use the Scan QR feature from the dashboard. Point your camera at the student\'s QR code and the system will automatically process it.'
    },
    {
      question: 'What should I do if a machine breaks down?',
      answer: 'Report the issue through the Contact Support section and contact maintenance immediately. Mark the machine as out of service in the system.'
    },
    {
      question: 'How do I handle lost items?',
      answer: 'Use the Lost & Found section to report found items or help students locate their belongings. Always verify ownership before returning items.'
    },
    {
      question: 'What if a student reports an issue?',
      answer: 'Check the support tickets section and respond promptly. Most issues can be resolved by checking order status or machine availability.'
    },
    {
      question: 'How do I update order status?',
      answer: 'Use the Orders section to view and update laundry order statuses. Always scan QR codes to ensure accurate tracking.'
    }
  ];

  const tabs = [
    { id: 'help' as const, label: 'Help & FAQ', icon: HelpCircle },
    { id: 'tickets' as const, label: 'Support Tickets', icon: MessageSquare },
    { id: 'contact' as const, label: 'Contact Support', icon: Phone }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <ToastContainer toasts={toasts} onClose={removeToast} />

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <HelpCircle className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              Help & Support
            </h1>
            <p className="text-sm md:text-base text-gray-600">Get help, manage support tickets, and report anomalies</p>
          </div>

          {/* Tab Navigation */}
          <div className="mb-4 md:mb-6">
            <div className="flex flex-wrap gap-1 md:gap-2 bg-white rounded-lg p-1 shadow-sm">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3 md:px-4 py-2 md:py-2 rounded-md text-sm font-medium transition-colors min-h-[44px] ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'help' && (
            <div className="space-y-4 md:space-y-6">
              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                  Frequently Asked Questions
                </h2>
                <div className="space-y-3 md:space-y-4">
                  {faqItems.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 md:pb-4 last:border-b-0">
                      <h3 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{faq.question}</h3>
                      <p className="text-gray-600 text-xs md:text-sm">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="flex items-center gap-3 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left min-h-[44px]"
                  >
                    <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 text-sm md:text-base">Contact Support</p>
                      <p className="text-xs md:text-sm text-blue-700">Get help from administrators</p>
                    </div>
                  </button>
                </div>
              </GlassCard>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-4 md:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 mb-4 md:mb-6">
                <GlassCard className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                    <p className="text-xs md:text-sm text-gray-600">Open Tickets</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'open').length}
                  </p>
                </GlassCard>

                <GlassCard className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <Clock className="w-4 h-4 md:w-5 md:h-5 text-orange-600" />
                    <p className="text-xs md:text-sm text-gray-600">In Progress</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'in-progress').length}
                  </p>
                </GlassCard>

                <GlassCard className="p-4 md:p-6">
                  <div className="flex items-center gap-2 md:gap-3 mb-2">
                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                    <p className="text-xs md:text-sm text-gray-600">Resolved</p>
                  </div>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900">
                    {tickets.filter(t => t.status === 'resolved').length}
                  </p>
                </GlassCard>
              </div>

              {tickets.length === 0 ? (
                <GlassCard className="p-8 md:p-12 text-center">
                  <MessageSquare className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">No Support Tickets</h3>
                  <p className="text-sm md:text-base text-gray-600">There are no support requests at the moment.</p>
                </GlassCard>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  {tickets.map(ticket => (
                    <GlassCard key={ticket.id} className="p-4 md:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 md:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                            {getStatusIcon(ticket.status)}
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">{ticket.subject}</h3>
                              <p className="text-xs md:text-sm text-gray-600 truncate">
                                From: {ticket.studentName} • {new Date(ticket.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-3 md:p-4 mb-3">
                            <p className="text-xs md:text-sm text-gray-700">{ticket.message}</p>
                          </div>

                          {ticket.response && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 mb-3">
                              <p className="text-xs text-blue-600 mb-1 font-medium">Your Response:</p>
                              <p className="text-xs md:text-sm text-blue-900">{ticket.response}</p>
                            </div>
                          )}

                          {ticket.status !== 'resolved' && (
                            <button
                              onClick={() => navigate(`/operator/help/${ticket.id}`)}
                              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px]"
                            >
                              Respond to Ticket
                            </button>
                          )}
                        </div>

                        <div className={`px-2 md:px-3 py-1 rounded-lg text-xs font-medium self-start ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </div>
                      </div>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'contact' && (
            <GlassCard className="p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
                <Phone className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                Contact Support
              </h2>

              <div className="space-y-4 md:space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
                  <h3 className="font-medium text-blue-900 mb-1 md:mb-2 text-sm md:text-base">Need Immediate Help?</h3>
                  <p className="text-blue-800 text-xs md:text-sm mb-2 md:mb-3">
                    For urgent technical issues or system problems, contact the IT support team directly.
                  </p>
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <Phone className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="font-medium">Emergency Support:</span>
                    <span>+91-9876543210</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4">
                  <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Technical Support</h4>
                    <p className="text-gray-600 text-xs md:text-sm mb-2">For system issues, bugs, or technical problems</p>
                    <p className="text-xs md:text-sm text-gray-500">Email: tech.support@university.edu</p>
                    <p className="text-xs md:text-sm text-gray-500">Phone: +91-9876543211</p>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-3 md:p-4">
                    <h4 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Operational Support</h4>
                    <p className="text-gray-600 text-xs md:text-sm mb-2">For operational questions or procedures</p>
                    <p className="text-xs md:text-sm text-gray-500">Email: operations@university.edu</p>
                    <p className="text-xs md:text-sm text-gray-500">Phone: +91-9876543212</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 md:p-4">
                  <h4 className="font-medium text-gray-900 mb-1 md:mb-2 text-sm md:text-base">Response Times</h4>
                  <ul className="text-xs md:text-sm text-gray-600 space-y-1">
                    <li>• <strong>Emergency issues:</strong> Immediate response</li>
                    <li>• <strong>High priority:</strong> Within 1 hour</li>
                    <li>• <strong>Normal priority:</strong> Within 4 hours</li>
                    <li>• <strong>Low priority:</strong> Within 24 hours</li>
                  </ul>
                </div>
              </div>
            </GlassCard>
          )}
        </div>
      </div>

      {/* AI Chat Bubble - Only visible in Help tab */}
      {activeTab === 'help' && (
        <>
          {/* Chat Bubble */}
          <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-50">
            <button
              onClick={() => setShowChatBox(!showChatBox)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-6 md:p-5 rounded-full shadow-lg transition-all duration-200 hover:scale-110 min-w-[68px] min-h-[68px] md:min-w-[52px] md:min-h-[52px] flex items-center justify-center"
            >
              <ChatIcon className="w-8 h-8 md:w-7 md:h-7" />
            </button>
          </div>

          {/* Chat Box */}
          {showChatBox && (
            <div className="fixed bottom-28 md:bottom-20 right-4 md:right-6 w-[calc(100vw-2rem)] max-w-sm md:w-96 h-[calc(100vh-8rem)] max-h-[500px] bg-white rounded-lg shadow-2xl z-50 border border-gray-200 flex flex-col">
              {/* Chat Header */}
              <div className="bg-blue-600 text-white p-3 md:p-4 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ChatIcon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="font-semibold text-sm md:text-base">AI Laundry Assistant</span>
                </div>
                <button
                  onClick={() => setShowChatBox(false)}
                  className="hover:bg-blue-700 p-1 md:p-1 rounded transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 p-3 md:p-4 overflow-y-auto space-y-2 md:space-y-3">
                {chatMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-2 md:p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-xs md:text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isUser ? 'text-blue-200' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-2 md:p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin text-gray-500" />
                        <span className="text-xs md:text-sm text-gray-500">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 md:p-4 border-t border-gray-200">
                {/* Quick Questions */}
                <div className="mb-2 md:mb-3">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <p className="text-xs text-gray-500">
                      Quick questions:
                      {serviceStatus.isQuotaExceeded && <span className="text-red-500">(AI service quota exceeded)</span>}
                      {rateLimited && !serviceStatus.isQuotaExceeded && <span className="text-orange-500">(Rate limited - please wait)</span>}
                      {queueStatus.queueLength > 0 && <span className="text-blue-500">({queueStatus.queueLength} in queue)</span>}
                    </p>
                    {queueStatus.queueLength > 0 && (
                      <button
                        onClick={() => {
                          geminiAI.clearQueue();
                          setQueueStatus({ queueLength: 0, isProcessing: false, activeRequests: 0 });
                          setServiceStatus(prev => ({ ...prev, queueLength: 0, isProcessing: false, activeRequests: 0 }));
                        }}
                        className="text-xs text-red-500 hover:text-red-700 underline"
                      >
                        Clear queue
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {quickQuestions.slice(0, 4).map((question, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickQuestion(question)}
                        disabled={isTyping || rateLimited || serviceStatus.isQuotaExceeded}
                        className={`text-xs px-2 py-1 rounded-full transition-colors min-h-[32px] ${
                          rateLimited
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && !isTyping && !rateLimited && !serviceStatus.isQuotaExceeded && handleSendMessage()}
                    placeholder={
                      serviceStatus.isQuotaExceeded
                        ? "AI service is temporarily unavailable due to quota limits..."
                        : rateLimited
                        ? "Please wait a moment before sending another message..."
                        : "Ask me anything about laundry operations..."
                    }
                    disabled={isTyping || rateLimited || serviceStatus.isQuotaExceeded}
                    className={`flex-1 px-3 py-2 text-sm md:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed min-h-[44px] ${
                      serviceStatus.isQuotaExceeded
                        ? 'border-red-300 bg-red-50'
                        : rateLimited
                        ? 'border-orange-300 bg-orange-50'
                        : 'border-gray-300'
                    }`}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isTyping || rateLimited || serviceStatus.isQuotaExceeded}
                    className={`px-3 md:px-4 py-2 rounded-lg transition-colors flex items-center gap-2 min-h-[44px] min-w-[44px] justify-center ${
                      serviceStatus.isQuotaExceeded
                        ? 'bg-red-400 text-white cursor-not-allowed'
                        : rateLimited
                        ? 'bg-orange-400 text-white cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
                    }`}
                  >
                    {serviceStatus.isQuotaExceeded ? (
                      <>
                        🚫
                      </>
                    ) : rateLimited ? (
                      <>
                        <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                      </>
                    ) : isTyping ? (
                      <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3 md:w-4 md:h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
