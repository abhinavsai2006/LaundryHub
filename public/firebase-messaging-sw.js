// Firebase Cloud Messaging Service Worker
import { initializeApp } from 'firebase/app';
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw';

// Firebase configuration (same as main app)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification?.title || 'LaundryHub Notification';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new notification',
    icon: '/vite.svg',
    badge: '/vite.svg',
    tag: payload.data?.tag || 'laundry-notification',
    data: payload.data,
    actions: [
      {
        action: 'view',
        title: 'View Details'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification click received:', event);

  event.notification.close();

  if (event.action === 'view') {
    // Open the app and navigate to relevant page
    event.waitUntil(
      clients.openWindow('/student') // Default to student dashboard
    );
  }
});