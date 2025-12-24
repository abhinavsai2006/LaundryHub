import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/react-app/contexts/AuthContext';
import { HelpCircle, Send, Mail, Phone, MessageSquare, Clock, MessageCircle, X, Minimize2 } from 'lucide-react';
import GlassCard from '@/react-app/components/GlassCard';
import { LaundryAI } from '@/react-app/config/google-services';
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

const quickQuestions = [
  "What's the status of my laundry?",
  "When will my laundry be ready?",
  "How do I pay for my order?",
  "I lost my laundry bag",
  "Machine is not working",
  "How do I submit laundry?"
];

export default function HelpSupport() {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isChatMinimized, setIsChatMinimized] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'agent', timestamp: Date}>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickQuestions, setShowQuickQuestions] = useState(true);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
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

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: `msg_${Date.now()}`,
      text: currentMessage.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setShowQuickQuestions(false);
    setIsTyping(true);

    // Simulate agent response
    setTimeout(async () => {
      const agentResponse = await getAgentResponse(userMessage.text);
      setChatMessages(prev => [...prev, {
        id: `msg_${Date.now()}`,
        text: agentResponse,
        sender: 'agent' as const,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const handleQuickQuestion = async (question: string) => {
    const userMessage = {
      id: `msg_${Date.now()}`,
      text: question,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setShowQuickQuestions(false);
    setIsTyping(true);

    // Simulate agent response
    setTimeout(async () => {
      const agentResponse = await getAgentResponse(question);
      setChatMessages(prev => [...prev, {
        id: `msg_${Date.now()}`,
        text: agentResponse,
        sender: 'agent' as const,
        timestamp: new Date()
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const getAgentResponse = async (userMessage: string): Promise<string> => {
    try {
      return await LaundryAI.provideChatAssistance(userMessage, {
        user: user,
        context: 'laundry service support'
      });
    } catch (error) {
      console.error('AI Chat error:', error);
      // Fallback to basic responses
      const message = userMessage.toLowerCase();

      if (message.includes('status') || message.includes('where is my laundry')) {
        return "I'd be happy to help you check your laundry status! Can you please provide your order number or the time you submitted your laundry?";
      }

      if (message.includes('pickup') || message.includes('ready')) {
        return "Your laundry should be ready for pickup within 24-48 hours after submission. You'll receive a notification when it's ready. Is there a specific order you'd like me to check?";
      }

      if (message.includes('payment') || message.includes('pay')) {
        return "Payments are processed securely through our system. If you're having trouble with payment, please make sure your account has sufficient balance or try a different payment method.";
      }

      if (message.includes('machine') || message.includes('broken')) {
        return "I'm sorry to hear about the machine issue. Our operators are notified automatically when machines malfunction. Please try a different machine or contact the laundry facility directly.";
      }

      if (message.includes('lost') || message.includes('missing')) {
        return "For lost items, please submit a lost item report through the Lost & Found section. Our team will help you search for your belongings.";
      }

      if (message.includes('hours') || message.includes('time')) {
        return "Our laundry facilities are open from 6 AM to 10 PM daily. Drop-off hours are 6 AM to 8 PM. How can I assist you with your laundry needs?";
      }

      if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
        return "Hello! I'm here to help with your laundry questions. You can ask me about order status, pickup times, payments, or any other laundry-related concerns.";
      }

      return "I'm here to help with your laundry questions! Please let me know what specific information you need regarding your order, payment, or our services.";
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      setIsChatMinimized(false);
    }
  };

  const minimizeChat = () => {
    setIsChatMinimized(true);
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

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

      {/* Chat Bubble */}
      {!isChatOpen && (
        <div className="fixed bottom-20 right-6 z-50 md:bottom-6 group">
          <button
            onClick={toggleChat}
            className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white p-4 rounded-2xl shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-indigo-500/25"
          >
            <MessageCircle className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full animate-ping"></div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-pink-500 to-red-500 rounded-full"></div>
          </button>
        </div>
      )}

      {/* Chat Interface */}
      {isChatOpen && (
        <div className={`fixed bottom-20 left-4 right-4 z-50 w-auto max-w-sm mx-auto md:mx-0 md:left-auto md:right-6 md:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 transition-all duration-500 ease-out ${isChatMinimized ? 'h-14' : 'h-[500px]'}`}>
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white p-4 rounded-t-2xl flex items-center justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 animate-pulse"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-sm">Laundry Assistant</span>
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  Online
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 relative z-10">
              <button
                onClick={minimizeChat}
                className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={toggleChat}
                className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:scale-110"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isChatMinimized && (
            <>
              {/* Chat Messages */}
              <div
                ref={chatMessagesRef}
                className="flex-1 p-4 space-y-4 overflow-y-auto h-80 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent"
              >
                {chatMessages.length === 0 && showQuickQuestions && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="w-6 h-6 text-white" />
                      </div>
                      <p className="text-gray-700 font-medium mb-1">Hi! How can I help you today?</p>
                      <p className="text-gray-500 text-sm">Choose a question below or type your own</p>
                    </div>

                    {/* Quick Questions */}
                    <div className="space-y-2">
                      {quickQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => handleQuickQuestion(question)}
                          className="w-full text-left p-3 bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border border-indigo-200/50 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-md group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full group-hover:scale-125 transition-transform"></div>
                            <span className="text-gray-700 text-sm font-medium">{question}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[280px] px-4 py-3 rounded-2xl text-sm shadow-lg ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-md'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md shadow-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200/50 bg-gray-50/50 rounded-b-2xl">
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm shadow-sm transition-all duration-200"
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim()}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-3 rounded-xl transition-all duration-200 hover:scale-105 disabled:hover:scale-100 shadow-lg disabled:shadow-none"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
