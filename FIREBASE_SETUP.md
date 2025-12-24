# Firebase & Google Services Integration Setup

This guide will help you set up Firebase Authentication, Firestore, Cloud Messaging, Google ML Kit, Google Drive, and Gemini AI for the LaundryHub application.

## 1. Firebase Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: "laundry-hub"
4. Enable Google Analytics (optional)
5. Choose your Google Analytics account
6. Click "Create project"

### Enable Firebase Services

#### Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable:
   - Email/Password
   - Google
5. For Google provider, add your domain to authorized domains

#### Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

#### Cloud Messaging (FCM)
1. Go to "Cloud Messaging"
2. Click "Get started"
3. Note down the Server key (for FCM VAPID key)

#### Storage
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Set up default security rules

### Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Add app" → Web app (</>)
4. Register your app with name "LaundryHub"
5. Copy the Firebase config object

## 2. Google Cloud Setup

### Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable required APIs:
   - Vision AI API (for ML Kit)
   - Drive API
   - Generative AI API (for Gemini)

### ML Kit / Vision API Setup
1. Go to "APIs & Services" → "Library"
2. Search for "Cloud Vision API"
3. Click "Enable"

### Google Drive API Setup
1. Search for "Google Drive API"
2. Click "Enable"

### Gemini AI Setup
1. Search for "Generative AI API"
2. Click "Enable"

### Create API Key
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "API Key"
3. Restrict the API key to specific APIs:
   - Cloud Vision API
   - Google Drive API
   - Generative AI API

### Create OAuth 2.0 Client ID
1. Go to "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add authorized origins:
   - `http://localhost:5173` (dev)
   - `http://localhost:5174` (dev)
   - `http://localhost:5175` (dev)
   - `http://localhost:5176` (dev)
   - Your production domain
5. Add authorized redirect URIs:
   - `http://localhost:5173` (dev)
   - `http://localhost:5174` (dev)
   - `http://localhost:5175` (dev)
   - `http://localhost:5176` (dev)
   - Your production domain

## 3. Environment Variables Setup

Update your `.env` file with the following values:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# FCM VAPID Key (from Firebase Console → Cloud Messaging → Web Push certificates)
VITE_FCM_VAPID_KEY=your_vapid_key_here

# Google APIs
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GOOGLE_API_KEY=your_google_api_key

# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Google Drive
VITE_GOOGLE_DRIVE_API_KEY=your_drive_api_key
```

## 4. Firestore Security Rules

Update your Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Laundry items - users can read/write their own, operators can read all
    match /laundryItems/{itemId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.token.role == 'operator' ||
         resource.data.studentId == request.auth.uid);
    }

    // Machines - operators and admins can manage
    match /machines/{machineId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.token.role == 'operator' || request.auth.token.role == 'admin');
    }

    // QR Codes - operators and admins can manage
    match /qrCodes/{qrId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.token.role == 'operator' || request.auth.token.role == 'admin');
    }

    // Feedback - anyone can submit, operators can read
    match /feedbacks/{feedbackId} {
      allow read: if request.auth != null &&
        (request.auth.token.role == 'operator' || request.auth.token.role == 'admin');
      allow create: if request.auth != null;
    }

    // Lost items - anyone can read/create, operators can update
    match /lostItems/{itemId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.token.role == 'operator' || request.auth.token.role == 'admin');
    }

    // Laundry sessions - operators can manage
    match /laundrySessions/{sessionId} {
      allow read, write: if request.auth != null &&
        (request.auth.token.role == 'operator' || request.auth.token.role == 'admin');
    }
  }
}
```

## 5. Firebase Storage Security Rules

Update your Storage rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User profile photos
    match /users/{userId}/profile/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Laundry photos
    match /laundry/{userId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }

    // Demo assets (public read)
    match /demo/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
        (request.auth.token.role == 'admin' || request.auth.token.role == 'operator');
    }
  }
}
```

## 6. Testing the Integration

1. Start the development server: `npm run dev`
2. Try registering a new user with Firebase Auth
3. Test Google Sign-In
4. Verify data is being stored in Firestore
5. Test the AI chat functionality
6. Try QR scanning with ML Kit enhancement

## 7. Production Deployment

### Firebase Hosting (Optional)
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize hosting: `firebase init hosting`
4. Deploy: `firebase deploy`

### Environment Variables
- Update all `VITE_` variables with production values
- Ensure API keys are restricted to your domain
- Set up proper CORS policies

## Troubleshooting

### Common Issues:

1. **Firebase Auth not working**: Check if domain is added to authorized domains
2. **ML Kit not working**: Verify API key has Vision API enabled
3. **Gemini AI errors**: Check if Generative AI API is enabled and API key is valid
4. **FCM not working**: Ensure VAPID key is correctly set and service worker is registered

### Debug Tips:
- Check browser console for detailed error messages
- Use Firebase Console to monitor authentication and database activity
- Test APIs directly using tools like Postman
- Verify environment variables are loaded correctly

## Support

For additional help:
- Firebase Documentation: https://firebase.google.com/docs
- Google Cloud Documentation: https://cloud.google.com/docs
- LaundryHub GitHub Issues: [Create an issue](https://github.com/your-repo/issues)