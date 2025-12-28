# 🧺 LaundryHub

A comprehensive, AI-powered laundry management system built with React, TypeScript, and Firebase. Transform your campus laundry experience with smart QR tracking, real-time analytics, and seamless digital management.

![LaundryHub](https://img.shields.io/badge/LaundryHub-v1.0.0-blue?style=for-the-badge&logo=react)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=flat-square&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-10.7.1-FFCA28?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Role System**: Admin, Operator, and Student dashboards
- **QR Code Tracking**: Smart QR system for seamless laundry management
- **AI-Powered Support**: Gemini AI chatbot for instant help
- **Real-Time Notifications**: Push notifications via Firebase Cloud Messaging
- **Analytics Dashboard**: Comprehensive insights and performance metrics

### 🔧 Admin Features
- User management and role assignment
- Machine monitoring and maintenance tracking
- Analytics and reporting dashboard
- Lost & found management
- Time slot governance
- Incident management and rule enforcement

### 👷 Operator Features
- QR code assignment and scanning
- Order processing and status updates
- Manual receipt generation
- Lost item reporting
- Anomaly reporting and help support

### 🎓 Student Features
- One-tap laundry submission
- Real-time order tracking
- QR code verification
- Payment processing
- Order history and support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase project
- Google Cloud Platform account (for Gemini AI)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhinavsai2006/TechSprint-Google.git
   cd LaundryHub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your API keys:
   ```env
   # Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Gemini AI
   VITE_GEMINI_API_KEY=your_gemini_api_key

   # FCM VAPID Key
   VITE_FCM_VAPID_KEY=your_fcm_vapid_key
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, Storage, and Cloud Messaging
   - Copy your Firebase config to the `.env` file

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Build for production**
   ```bash
   npm run build
   ```

## 🔒 Security

### API Key Protection
- All API keys are stored in environment variables
- `.env` files are excluded from version control
- Never commit sensitive credentials to the repository

### Environment Variables Required
- `VITE_FIREBASE_*` - Firebase configuration
- `VITE_GEMINI_API_KEY` - Google Gemini AI API key
- `VITE_FCM_VAPID_KEY` - Firebase Cloud Messaging key

## 🏗️ Architecture

```
LaundryHub/
├── src/
│   ├── react-app/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components (Admin, Operator, Student)
│   │   ├── contexts/      # React contexts for state management
│   │   ├── services/      # API services (Firebase, Gemini AI)
│   │   ├── config/        # Configuration files
│   │   └── utils/         # Utility functions
│   └── shared/            # Shared types and utilities
├── public/                # Static assets
└── dist/                  # Build output
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Auth, Storage, Functions)
- **AI**: Google Gemini 2.0 Flash
- **Notifications**: Firebase Cloud Messaging
- **Build Tool**: Vite
- **Deployment**: Firebase Hosting

## 📱 Responsive Design

- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interfaces
- Progressive Web App (PWA) ready

## 🎨 Premium Animations

- Scroll-triggered animations
- Ultra-fast transitions (0.025s - 0.175s delays)
- Smooth easing curves
- Performance optimized

## 🔒 Security

This repository does not contain any sensitive information such as API keys, Firebase project configurations, or personal data. All sensitive files (`.env`, `.firebase/`, `.firebaserc`, etc.) have been removed for security purposes.

To run this project:

1. Copy `.env.example` to `.env`
2. Fill in your own API keys and configuration values
3. Set up your own Firebase project
4. Configure your own Cloudflare Workers (if using)

**Never commit sensitive information to version control!**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Google for Gemini AI and Firebase
- React and TypeScript communities
- Tailwind CSS for styling
- All contributors and testers

## 📞 Support

For support, email [your-email@example.com] or create an issue in this repository.

---

**Made with ❤️ for better laundry experiences**
