const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

class GeminiAIService {
  private requestQueue: Array<() => void> = [];
  private isProcessingQueue: boolean = false;
  private currentRequests: Map<string, Promise<string>> = new Map();

  // Rate limiting: minimum 2 seconds between requests (more conservative for direct API)
  private readonly RATE_LIMIT_DELAY = 2000;

  // Quota tracking
  private isQuotaExceeded: boolean = false;
  private lastQuotaError: Date | null = null;

  constructor() {
    // Direct API implementation - no initialization needed
  }

  // Predefined responses for common questions
  private getQuickResponse(message: string): string | null {
    const msg = message.toLowerCase().trim();

    if (msg.includes('scan') && msg.includes('qr')) {
      return "To scan a QR code: 1) Open the Scan QR page, 2) Point your camera at the QR code on the laundry bag, 3) The system will automatically read the code and display order details. Make sure the QR code is well-lit and not damaged. If scanning fails, try manual entry using the order number.";
    }

    if ((msg.includes('machine') || msg.includes('washer') || msg.includes('dryer')) && (msg.includes('broken') || msg.includes('not working'))) {
      return "For broken machines: 1) Mark the machine as out-of-order in the Machines page, 2) Create an incident report with details about the issue, 3) Notify maintenance staff immediately. Students will be unable to use that machine until it's repaired. Consider redirecting customers to alternative machines.";
    }

    if (msg.includes('lost') && msg.includes('item')) {
      return "For lost items: 1) Go to the Lost & Found page, 2) Add the lost item with description, location found, and contact info, 3) The system will notify the student when they log in. Always check pockets before washing and maintain detailed records of found items.";
    }

    if (msg.includes('manual') && msg.includes('receipt')) {
      return "For manual receipts: 1) Go to Manual Receipt page, 2) Enter customer details and order information, 3) Select services and calculate total, 4) Print or email the receipt. Use this only when the automated system is unavailable. Always verify payment before processing.";
    }

    if (msg.includes('assign') && msg.includes('qr')) {
      return "To assign QR codes: 1) Go to Assign QR page, 2) Select an available QR code from the list, 3) Scan or enter the order/bag details, 4) Confirm the assignment. Each QR code should be unique to one order at a time. Clean codes regularly for better scanning.";
    }

    if (msg.includes('hour') || msg.includes('time') || msg.includes('open')) {
      return "Operating hours: Drop-off: 6 AM - 8 PM daily, Pick-up: 6 AM - 10 PM daily. We recommend arriving early during peak hours (8 AM - 6 PM) to avoid long waits. Holiday hours may vary - check the announcements section.";
    }

    if (msg.includes('anomaly') || msg.includes('report')) {
      return "To report anomalies: 1) Go to Anomaly Reporting page, 2) Select the type of issue (machine, process, customer), 3) Provide detailed description with photos if possible, 4) Submit for review. Regular anomaly reporting helps improve our service quality.";
    }

    if (msg.includes('order') && msg.includes('manage')) {
      return "Order management: Use the Manage Orders page to view all active orders, update statuses, handle payments, and track progress. You can filter by status, date, or customer. Always update order status promptly to keep customers informed.";
    }

    return null; // No quick response found
  }

  // Get related questions based on the user's query
  private getRelatedQuestions(message: string): string[] {
    const msg = message.toLowerCase();

    if (msg.includes('scan') || msg.includes('qr')) {
      return ["How do I handle lost items?", "What's the procedure for manual receipt?", "How do I manage orders?"];
    }

    if (msg.includes('machine') || msg.includes('broken')) {
      return ["How do I report an anomaly?", "What are the operating hours?", "How do I assign QR codes?"];
    }

    if (msg.includes('lost') || msg.includes('item')) {
      return ["How do I scan a QR code?", "How do I manage orders?", "How do I report an anomaly?"];
    }

    if (msg.includes('receipt') || msg.includes('payment')) {
      return ["How do I manage orders?", "How do I assign QR codes?", "What are the operating hours?"];
    }

    if (msg.includes('hour') || msg.includes('time')) {
      return ["How do I manage orders?", "How do I report an anomaly?", "How do I scan a QR code?"];
    }

    // Default related questions
    return ["How do I scan a QR code?", "What should I do if a machine is broken?", "How do I handle lost items?"];
  }

  async generateResponse(userMessage: string): Promise<string> {
    // Create a unique key for this request to prevent duplicates
    const requestKey = userMessage.trim().toLowerCase();

    // Check if we already have a pending request for this message
    if (this.currentRequests.has(requestKey)) {
      return this.currentRequests.get(requestKey)!;
    }

    // Check for quick responses first (no API call needed)
    const quickResponse = this.getQuickResponse(userMessage);
    if (quickResponse) {
      const relatedQuestions = this.getRelatedQuestions(userMessage);
      return `${quickResponse}\n\n💡 Related questions you might ask:\n${relatedQuestions.map(q => `• ${q}`).join('\n')}`;
    }

    // Create the promise for this request
    const requestPromise = new Promise<string>((resolve, reject) => {
      // Add request to queue with its own resolve/reject handlers
      this.requestQueue.push(async () => {
        try {
          const result = await this.processRequest(userMessage);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          // Clean up the request from current requests
          this.currentRequests.delete(requestKey);
        }
      });
    });

    // Store the promise to prevent duplicate requests
    this.currentRequests.set(requestKey, requestPromise);

    // Start processing queue
    this.processQueue();

    return requestPromise;
  }

  private async processQueue() {
    // If already processing, return immediately (prevents multiple concurrent executions)
    if (this.isProcessingQueue) {
      return;
    }

    // If no requests in queue, mark as not processing and return
    if (this.requestQueue.length === 0) {
      this.isProcessingQueue = false;
      return;
    }

    // Set processing flag
    this.isProcessingQueue = true;

    try {
      while (this.requestQueue.length > 0 && this.isProcessingQueue) {
        const request = this.requestQueue.shift();
        if (request) {
          try {
            await request();
            // Wait for rate limit delay before next request (only if there are more requests)
            if (this.requestQueue.length > 0) {
              await this.delay(this.RATE_LIMIT_DELAY);
            }
          } catch (error) {
            console.error('Request processing error:', error);
            // Continue processing other requests even if one fails
          }
        }
      }
    } finally {
      // Always reset processing flag when done
      this.isProcessingQueue = false;
    }
  }

  // Reset quota status (can be called periodically or manually)
  resetQuotaStatus() {
    this.isQuotaExceeded = false;
    this.lastQuotaError = null;
  }

  // Check if we should retry quota (e.g., after some time has passed)
  shouldRetryQuota(): boolean {
    if (!this.isQuotaExceeded || !this.lastQuotaError) return true;

    // Retry after 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return this.lastQuotaError < oneHourAgo;
  }

  // Get current service status
  getServiceStatus() {
    return {
      isQuotaExceeded: this.isQuotaExceeded,
      lastQuotaError: this.lastQuotaError,
      queueLength: this.requestQueue.length,
      isProcessing: this.isProcessingQueue,
      activeRequests: this.currentRequests.size
    };
  }

  // Check if AI service is available (not quota exceeded)
  isServiceAvailable(): boolean {
    return !this.isQuotaExceeded;
  }

  // Clear all pending requests (useful for resetting state)
  clearQueue() {
    this.requestQueue = [];
    this.currentRequests.clear();
    this.isProcessingQueue = false;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async processRequest(userMessage: string): Promise<string> {
    try {
      // Create the system context and user message
      const systemContext = `You are an AI assistant for LaundryHub, a laundry management system. You help operators with QR code scanning, machine maintenance, lost and found, order tracking, and general laundry operations. Be helpful and professional. Current date: ${new Date().toLocaleDateString()}. Provide detailed, actionable responses and suggest related questions when appropriate.`;

      const fullPrompt = `${systemContext}\n\nUser: ${userMessage}\n\nAssistant:`;

      const requestBody = {
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024
        }
      };

      // Make direct API call
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        // Handle specific HTTP status codes
        if (response.status === 429) {
          // Mark quota as exceeded
          this.isQuotaExceeded = true;
          this.lastQuotaError = new Date();
          throw new Error('Quota exceeded for Gemini API');
        }
        if (response.status === 403) {
          throw new Error('API key invalid or quota exceeded');
        }
        if (response.status === 500) {
          throw new Error('Gemini API server error');
        }
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from Gemini AI');
      }

      const aiResponse = data.candidates[0].content.parts[0].text;
      const relatedQuestions = this.getRelatedQuestions(userMessage);

      return `${aiResponse.trim()}\n\n💡 Related questions you might ask:\n${relatedQuestions.map(q => `• ${q}`).join('\n')}`;
    } catch (error) {
      console.error('Gemini AI Error:', error);

      // Enhanced error handling for direct API calls
      if (error instanceof Error) {
        // Check for quota exceeded errors specifically
        if (error.message.includes('quota') ||
            error.message.includes('Quota exceeded') ||
            error.message.includes('current quota') ||
            error.message.includes('billing details') ||
            error.message.includes('403') ||
            error.message.includes('API key invalid')) {
          // Mark quota as exceeded
          this.isQuotaExceeded = true;
          this.lastQuotaError = new Date();

          return '🚫 **AI Service Temporarily Unavailable**\n\nThe AI assistant has reached its usage limit. This may be due to quota restrictions or API key limits.\n\n💡 **What you can do:**\n• Use the **quick questions** above for instant answers\n• Check the **FAQ section** for common solutions\n• Contact support for urgent issues\n\nTry again later or consider upgrading your API plan. Thank you for your understanding!';
        }

        // Check for rate limiting (429 errors)
        if (error.message.includes('429') ||
            error.message.includes('rate') ||
            error.message.includes('limit') ||
            error.message.includes('too many requests')) {
          return '⏱️ **Please Wait**\n\nThe AI assistant is currently busy. Please wait a moment before asking another question.\n\n💡 **Quick tip:** Try one of the **instant questions** above for immediate answers!';
        }

        // Check for blocked content
        if (error.message.includes('blocked') || error.message.includes('safety')) {
          return 'I apologize, but I cannot respond to that request due to content guidelines. Please try rephrasing your question.';
        }

        // Check for network or connection issues
        if (error.message.includes('network') ||
            error.message.includes('fetch') ||
            error.message.includes('connection') ||
            error.message.includes('timeout')) {
          return 'Sorry, I\'m having trouble connecting to the AI service right now. Please try again later or contact support.';
        }

        // Check for server errors
        if (error.message.includes('500') || error.message.includes('server error')) {
          return 'The AI service is temporarily experiencing issues. Please try again in a few minutes.';
        }
      }

      // Generic fallback
      return 'I apologize, but I\'m unable to process your request at the moment. Please try again or contact support for help.';
    }
  }
}

// Export singleton instance
export const geminiAI = new GeminiAIService();
export default geminiAI;