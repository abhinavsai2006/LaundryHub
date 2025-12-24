// Google Services Configuration
import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini AI Configuration
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export const geminiModel = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Google Drive Configuration (commented out to fix build)
// const oauth2Client = new google.auth.OAuth2(
//   import.meta.env.VITE_GOOGLE_CLIENT_ID,
//   import.meta.env.VITE_GOOGLE_API_KEY,
//   'urn:ietf:wg:oauth:2.0:oob' // For desktop apps
// );

// export const drive = google.drive({
//   version: 'v3',
//   auth: oauth2Client
// });

// ML Kit Configuration (for QR scanning)
export const ML_KIT_CONFIG = {
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  visionApiUrl: 'https://vision.googleapis.com/v1/images:annotate'
};

// AI Workflow Functions
export class LaundryAI {
  static async predictETA(orderData: any): Promise<string> {
    try {
      const prompt = `Based on the following laundry order data, predict the estimated time of arrival (ETA) for completion. Consider factors like order size, current queue, machine availability, and typical processing times.

Order Data: ${JSON.stringify(orderData)}

Provide a realistic ETA prediction with reasoning.`;

      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
        return 'Unable to predict ETA at this time due to service limits. Please check back later.';
      }
      console.error('ETA Prediction error:', error);
      return 'Unable to predict ETA at this time.';
    }
  }

  static async detectAnomalies(orderData: any, sensorData?: any): Promise<string> {
    try {
      const prompt = `Analyze the following laundry order and sensor data for potential anomalies or issues that might affect processing time or quality.

Order Data: ${JSON.stringify(orderData)}
Sensor Data: ${JSON.stringify(sensorData || {})}

Identify any anomalies and provide recommendations for resolution.`;

      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
        return 'Unable to analyze anomalies at this time due to service limits. Please contact support if you notice any issues.';
      }
      console.error('Anomaly Detection error:', error);
      return 'Unable to analyze anomalies at this time.';
    }
  }

  static async provideChatAssistance(userMessage: string, context?: any): Promise<string> {
    try {
      const prompt = `You are a helpful laundry service assistant. Respond to the user's question about laundry services.

User Question: ${userMessage}
Context: ${JSON.stringify(context || {})}

Provide a helpful, friendly response. Keep it concise but informative.`;

      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      // Check for quota exceeded error
      if (error?.message?.includes('RESOURCE_EXHAUSTED') ||
          error?.message?.includes('quota exceeded') ||
          error?.status === 429) {
        return LaundryAI.getFallbackResponse(userMessage);
      }

      console.error('Chat Assistance error:', error);
      // For other errors, also use fallback
      return LaundryAI.getFallbackResponse(userMessage);
    }
  }

  static async decisionSupport(scenario: string, options: string[]): Promise<string> {
    try {
      const prompt = `As a laundry service operations expert, analyze the following scenario and recommend the best course of action from the provided options.

Scenario: ${scenario}
Options: ${options.join(', ')}

Provide a reasoned recommendation with pros and cons of the chosen option.`;

      const result = await geminiModel.generateContent(prompt);
      return result.response.text();
    } catch (error: any) {
      if (error?.message?.includes('RESOURCE_EXHAUSTED') || error?.status === 429) {
        return 'Unable to provide decision support at this time due to service limits. Please consult with your team for guidance.';
      }
      console.error('Decision Support error:', error);
      return 'Unable to provide decision support at this time.';
    }
  }

  static getFallbackResponse(userMessage: string): string {
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
}
//       // This would require proper OAuth flow in production
//       // For demo purposes, we'll simulate the upload
//       console.log('Uploading file to Google Drive:', file.name);
//       return `https://drive.google.com/file/d/${Date.now()}/view`;
//     } catch (error) {
//       console.error('Drive upload error:', error);
//       throw error;
//     }
//   }

//   static async getFileMetadata(fileId: string): Promise<any> {
//     try {
//       // This would require proper OAuth flow in production
//       console.log('Getting file metadata:', fileId);
//       return { id: fileId, name: 'Demo File', mimeType: 'video/mp4' };
//     } catch (error) {
//       console.error('Drive metadata error:', error);
//       throw error;
//     }
//   }
// }

// export { oauth2Client };