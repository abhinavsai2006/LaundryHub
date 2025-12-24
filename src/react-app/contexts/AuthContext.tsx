import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '@/react-app/config/firebase';
import { createDemoAccounts } from '@/react-app/utils/createDemoAccounts';
import { User } from '@/shared/laundry-types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  demoDataLoading: boolean;
  needsProfileCompletion: { uid: string; email: string; name: string } | null;
  completeProfile: (profileData: Omit<User, 'id' | 'email' | 'name' | 'createdAt'>) => Promise<{ success: boolean; usedFallback?: boolean; offline?: boolean }>;
  isOnline: boolean;
  sendPasswordReset: (email: string) => Promise<boolean>;
  updateUserEmail: (newEmail: string, password: string) => Promise<boolean>;
  updateUserPassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resendVerificationEmail: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo account data for automatic profile creation
const getDemoAccountData = (email: string) => {
  const demoAccounts = [
    {
      email: 'admin@laundryhub.com',
      password: 'admin123',
      name: 'Admin User',
      role: 'admin' as const,
      phone: '+1234567890'
    },
    {
      email: 'admin2@laundryhub.com',
      password: 'admin123',
      name: 'Sarah Johnson',
      role: 'admin' as const,
      phone: '+1234567891'
    },
    {
      email: 'operator@laundryhub.com',
      password: 'operator123',
      name: 'Operator John',
      role: 'operator' as const,
      phone: '+1234567891',
      operatorId: 'OP001'
    },
    {
      email: 'operator2@laundryhub.com',
      password: 'operator123',
      name: 'Mike Chen',
      role: 'operator' as const,
      phone: '+1234567892',
      operatorId: 'OP002'
    },
    {
      email: 'operator3@laundryhub.com',
      password: 'operator123',
      name: 'Lisa Rodriguez',
      role: 'operator' as const,
      phone: '+1234567893',
      operatorId: 'OP003'
    },
    {
      email: 'student@laundryhub.com',
      password: 'student123',
      name: 'Demo Student',
      role: 'student' as const,
      phone: '+91 9876543210',
      rollNumber: '21BCE0001',
      gender: 'male' as const,
      hostel: 'MH-A',
      room: '101'
    },
    {
      email: 'alice@vitap.ac.in',
      password: 'student123',
      name: 'Alice Johnson',
      role: 'student' as const,
      phone: '+91 9876543211',
      rollNumber: '21BCE0002',
      gender: 'female' as const,
      hostel: 'MH-B',
      room: '202'
    }
  ];

  return demoAccounts.find(account => account.email === email);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [demoDataLoading, setDemoDataLoading] = useState(false);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState<{ uid: string; email: string; name: string } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Connectivity check function
  const checkConnectivity = async (): Promise<boolean> => {
    try {
      // Try a simple fetch to check connectivity
      await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      return true;
    } catch (error) {
      console.warn('Connectivity check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Special handling for demo accounts - skip Firestore operations for faster login
        const demoAccountData = getDemoAccountData(firebaseUser.email || '');
        if (demoAccountData) {
          console.log('👤 Demo account detected, setting user directly:', firebaseUser.email);
          const userData: User = {
            id: firebaseUser.uid,
            name: demoAccountData.name,
            email: demoAccountData.email,
            role: demoAccountData.role,
            phone: demoAccountData.phone,
            profileCompleted: true,
            createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
            // Add role-specific fields
            ...(demoAccountData.role === 'operator' && {
              operatorId: demoAccountData.operatorId,
              accountStatus: 'active' as const
            }),
            ...(demoAccountData.role === 'student' && {
              rollNumber: demoAccountData.rollNumber,
              gender: demoAccountData.gender,
              hostel: demoAccountData.hostel,
              room: demoAccountData.room
            })
          };

          // Cache user data
          localStorage.setItem('cachedUserData', JSON.stringify(userData));

          setUser(userData);
          setNeedsProfileCompletion(null);
          setLoading(false);
          return;
        }

        try {
          // Add timeout and retry logic to Firestore query to prevent hanging
          let userDoc = null;
          let attempts = 0;
          const maxAttempts = 2;

          while (attempts < maxAttempts && !userDoc) {
            try {
              // Check connectivity before attempting Firestore read
              const isConnected = await checkConnectivity();
              if (!isConnected) {
                console.log('No internet connectivity detected, skipping Firestore read');
                break; // Exit retry loop for connectivity issues
              }

              const firestorePromise = getDoc(doc(db, 'users', firebaseUser.uid));
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Firestore timeout')), 30000)
              );

              userDoc = await Promise.race([firestorePromise, timeoutPromise]) as any;
              break; // Success, exit retry loop
            } catch (error: any) {
              attempts++;
              
              // Check if this is an offline error - don't retry for offline
              if (error?.message?.includes('client is offline') || error?.code === 'unavailable') {
                console.warn('Client detected as offline by Firestore');
                break; // Exit retry loop immediately for offline errors
              }
              
              console.warn(`Firestore read attempt ${attempts} failed:`, error);
              if (attempts >= maxAttempts) {
                throw error; // All attempts failed
              }
              // Wait 1 second before retry
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }

          if (userDoc && userDoc.exists()) {
            const userData = userDoc.data() as Omit<User, 'id'>;
            const fullUserData = {
              ...userData,
              id: firebaseUser.uid
            };

            // Cache user data for offline/fallback scenarios
            localStorage.setItem('cachedUserData', JSON.stringify(fullUserData));

            // Check if user has password provider (email/password registration)
            const hasPasswordProvider = firebaseUser.providerData.some(provider => provider.providerId === 'password');

            if (hasPasswordProvider && !firebaseUser.emailVerified) {
              // Email/password user hasn't verified email yet
              setUser(null);
              setNeedsProfileCompletion(null);
              // Don't show profile completion - user needs to verify email first
              return;
            }

            // For email/password users who are verified, assume profile is complete
            // even if profileCompleted field is not set (for backward compatibility)
            if (userData.profileCompleted || hasPasswordProvider) {
              setUser(fullUserData);
              setNeedsProfileCompletion(null);
            } else {
              // User exists but profile not completed (Google OAuth user)
              setNeedsProfileCompletion({
                uid: firebaseUser.uid,
                email: userData.email,
                name: userData.name
              });
              setUser(null);
            }
          } else {
            // Check if this is a demo account that needs automatic profile creation
            const demoAccountData = getDemoAccountData(firebaseUser.email || '');
            if (demoAccountData) {
              console.log('👤 Setting up demo account:', firebaseUser.email);
              try {
                const userData: User = {
                  id: firebaseUser.uid,
                  name: demoAccountData.name,
                  email: demoAccountData.email,
                  role: demoAccountData.role,
                  phone: demoAccountData.phone,
                  profileCompleted: true,
                  createdAt: new Date().toISOString(),
                  // Add role-specific fields
                  ...(demoAccountData.role === 'operator' && {
                    operatorId: demoAccountData.operatorId,
                    accountStatus: 'active' as const
                  }),
                  ...(demoAccountData.role === 'student' && {
                    rollNumber: demoAccountData.rollNumber,
                    gender: demoAccountData.gender,
                    hostel: demoAccountData.hostel,
                    room: demoAccountData.room
                  })
                };

                // Try to create the document in Firestore, but don't fail if it doesn't work
                try {
                  await setDoc(doc(db, 'users', firebaseUser.uid), userData);
                  console.log('✅ User document created successfully for demo account');
                } catch (firestoreError) {
                  console.warn('⚠️ Failed to create Firestore document for demo account, but proceeding with local user data:', firestoreError);
                }

                // Cache user data
                localStorage.setItem('cachedUserData', JSON.stringify(userData));

                setUser(userData);
                setNeedsProfileCompletion(null);
              } catch (error) {
                console.error('❌ Error setting up demo user:', error);
                // For demo accounts, create a fallback user object
                const fallbackUser: User = {
                  id: firebaseUser.uid,
                  name: demoAccountData.name,
                  email: demoAccountData.email,
                  role: demoAccountData.role,
                  profileCompleted: true,
                  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
                };
                setUser(fallbackUser);
                setNeedsProfileCompletion(null);
              }
            } else {
              // Check if this is an email/password user who hasn't verified yet
              const hasPasswordProvider = firebaseUser.providerData.some(provider => provider.providerId === 'password');
              
              if (hasPasswordProvider && !firebaseUser.emailVerified) {
                // Email/password user hasn't verified email yet - don't show profile completion
                setUser(null);
                setNeedsProfileCompletion(null);
                return;
              }

              // New user - needs profile completion (Google OAuth user)
              setNeedsProfileCompletion({
                uid: firebaseUser.uid,
                email: firebaseUser.email || '',
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User'
              });
              setUser(null);
            }
          }
        } catch (error: any) {
          console.error('Error fetching user data:', error);
          
          // Fallback: create a user object to allow login even if Firestore fails
          if (firebaseUser) {
            // Check if this is a demo account
            const demoAccountData = getDemoAccountData(firebaseUser.email || '');
            if (demoAccountData) {
              const fallbackUser: User = {
                id: firebaseUser.uid,
                name: demoAccountData.name,
                email: demoAccountData.email,
                role: demoAccountData.role,
                phone: demoAccountData.phone,
                profileCompleted: true,
                createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
                // Add role-specific fields
                ...(demoAccountData.role === 'operator' && {
                  operatorId: demoAccountData.operatorId,
                  accountStatus: 'active' as const
                }),
                ...(demoAccountData.role === 'student' && {
                  rollNumber: demoAccountData.rollNumber,
                  gender: demoAccountData.gender,
                  hostel: demoAccountData.hostel,
                  room: demoAccountData.room
                })
              };
              setUser(fallbackUser);
            } else {
              const fallbackUser: User = {
                id: firebaseUser.uid,
                name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
                email: firebaseUser.email || '',
                role: 'student' as const,
                profileCompleted: true,
                createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
              };
              setUser(fallbackUser);
            }
            setNeedsProfileCompletion(null);
          }
        }
      } else {
        setUser(null);
        setNeedsProfileCompletion(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sync pending user data from localStorage to Firestore when available
  useEffect(() => {
    const syncPendingData = async () => {
      const pendingData = localStorage.getItem('pendingUserData');
      if (pendingData && user) {
        try {
          const userData = JSON.parse(pendingData);
          await setDoc(doc(db, 'users', userData.id), userData);
          // Cache the successfully synced data
          localStorage.setItem('cachedUserData', JSON.stringify(userData));
          localStorage.removeItem('pendingUserData');
          console.log('Pending user data synced to Firestore and cached');
        } catch (error) {
          console.error('Failed to sync pending data:', error);
        }
      }
    };

    if (user) {
      syncPendingData();
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Check if email is verified (skip for demo accounts)
      const demoEmails = [
        'admin@laundryhub.com',
        'admin2@laundryhub.com',
        'operator@laundryhub.com',
        'operator2@laundryhub.com',
        'operator3@laundryhub.com',
        'student@laundryhub.com',
        'alice@vitap.ac.in'
      ];

      if (!demoEmails.includes(email) && !userCredential.user.emailVerified) {
        // Sign out the user since email is not verified
        await signOut(auth);
        throw new Error('Please verify your email before logging in. Check your inbox for the verification link.');
      }

      // Check if this is a demo account and create demo data if needed
      if (demoEmails.includes(email)) {
        // Check if demo data has already been created
        const demoDataCreated = localStorage.getItem('demoDataCreated');
        if (!demoDataCreated) {
          console.log('🎯 Demo account detected. Creating mock data...');
          setDemoDataLoading(true);
          try {
            // Only create mock data, not accounts (accounts should be pre-created)
            await createDemoAccounts(false);
            localStorage.setItem('demoDataCreated', 'true');
            console.log('✅ Demo data creation completed successfully!');
          } catch (error) {
            console.error('❌ Error creating demo data:', error);
            // Don't fail the login if demo data creation fails
          } finally {
            setDemoDataLoading(false);
          }
        } else {
          console.log('ℹ️ Demo data already exists, skipping creation');
        }
      }

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email, userData.password || '');

      // Update display name
      await updateProfile(firebaseUser, {
        displayName: userData.name
      });

      // Send email verification
      await sendEmailVerification(firebaseUser);

      // Create user document in Firestore
      const newUser: User = {
        ...userData,
        id: firebaseUser.uid,
        createdAt: new Date().toISOString(),
        profileCompleted: true // Email/password registration completes profile
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    try {
      await signInWithPopup(auth, googleProvider);
      // User data will be handled by the onAuthStateChanged listener
      return true;
    } catch (error) {
      console.error('Google login error:', error);
      return false;
    }
  };

  const completeProfile = async (profileData: Omit<User, 'id' | 'email' | 'name' | 'createdAt'>): Promise<{ success: boolean; usedFallback?: boolean; offline?: boolean }> => {
    if (!needsProfileCompletion) return { success: false };

    const userData: User = {
      ...profileData,
      id: needsProfileCompletion.uid,
      email: needsProfileCompletion.email,
      name: needsProfileCompletion.name,
      profileCompleted: true,
      createdAt: new Date().toISOString()
    };

    try {
      console.log('Starting Firestore write operation...');
      
      // Retry logic for Firestore writes
      let lastError: any = null;
      const maxRetries = 3;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`Firestore write attempt ${attempt}/${maxRetries}`);
          
          // Check connectivity before attempting Firestore write
          const isConnected = await checkConnectivity();
          if (!isConnected) {
            console.log('No internet connectivity detected, using localStorage fallback');
            break; // Exit retry loop for connectivity issues
          }
          
          const setDocPromise = setDoc(doc(db, 'users', needsProfileCompletion.uid), userData);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Firestore write timeout')), 30000) // 30 seconds per attempt
          );

          await Promise.race([setDocPromise, timeoutPromise]);
          console.log('Firestore write completed successfully on attempt', attempt);
          
          // Cache user data for future offline scenarios
          localStorage.setItem('cachedUserData', JSON.stringify(userData));
          
          setUser(userData);
          setNeedsProfileCompletion(null);
          return { success: true };
          
        } catch (error: any) {
          lastError = error;
          console.warn(`Firestore write attempt ${attempt} failed:`, error?.message);
          
          // If it's an offline error, don't retry
          if (error?.message?.includes('client is offline') || error?.code === 'unavailable') {
            console.log('Client is offline, stopping retries');
            break;
          }
          
          // If this is the last attempt, we'll fall through to the catch block
          if (attempt === maxRetries) {
            throw error;
          }
          
          // Wait before retrying (exponential backoff)
          const waitTime = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
          console.log(`Waiting ${waitTime}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
      
      // If we get here, all retries failed
      throw lastError;
    } catch (error: any) {
      console.error('Profile completion error:', error);
      console.error('Error details:', {
        message: error?.message,
        code: error?.code,
        name: error?.name,
        stack: error?.stack
      });
      
      // Check if this is an offline error
      const isOffline = error?.message?.includes('client is offline') || error?.code === 'unavailable';
      
      // Only use fallback if truly offline or if it's a timeout (not other errors)
      const isTimeout = error?.message?.includes('Firestore write timeout');
      
      if (isOffline) {
        console.log('Client is offline, using localStorage fallback');
      } else if (isTimeout) {
        console.log('Firestore write timed out, using localStorage fallback');
      } else {
        console.log('Unexpected Firestore error, using localStorage fallback');
      }
      
      // Fallback: Save to localStorage and proceed
      try {
        localStorage.setItem('pendingUserData', JSON.stringify(userData));
        setUser(userData);
        setNeedsProfileCompletion(null);
        console.log('Profile saved to localStorage as fallback - user can proceed');
        return { success: true, usedFallback: true, offline: isOffline }; // Allow user to proceed
      } catch (localError) {
        console.error('LocalStorage fallback failed:', localError);
        return { success: false };
      }
    }
  };

  const sendPasswordReset = async (email: string): Promise<boolean> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const updateUserEmail = async (newEmail: string, password: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Re-authenticate user before email change
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user as any, credential);

      // Update email with verification
      await verifyBeforeUpdateEmail(user as any, newEmail);

      // Update Firestore document
      await setDoc(doc(db, 'users', user.id), {
        ...user,
        email: newEmail
      }, { merge: true });

      return true;
    } catch (error) {
      console.error('Email update error:', error);
      return false;
    }
  };

  const updateUserPassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;

    try {
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user as any, credential);

      // Update password
      await updatePassword(user as any, newPassword);
      return true;
    } catch (error) {
      console.error('Password update error:', error);
      return false;
    }
  };

  const resendVerificationEmail = async (): Promise<boolean> => {
    if (!user) return false;

    try {
      await sendEmailVerification(user as any);
      return true;
    } catch (error) {
      console.error('Resend verification email error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Clear cached data on logout
      localStorage.removeItem('cachedUserData');
      localStorage.removeItem('pendingUserData');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      loginWithGoogle,
      logout,
      isAuthenticated: !!user,
      loading,
      demoDataLoading,
      needsProfileCompletion,
      completeProfile,
      isOnline,
      sendPasswordReset,
      updateUserEmail,
      updateUserPassword,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
