import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QRCode, LaundryItem, Machine, Feedback, LostItem, User, LaundrySession } from '@/shared/laundry-types';
import FirestoreService from '@/react-app/services/firestore';
import { useAuth } from './AuthContext';

interface DataContextType {
  users: User[];
  qrCodes: QRCode[];
  laundryItems: LaundryItem[];
  machines: Machine[];
  feedbacks: Feedback[];
  lostItems: LostItem[];
  laundrySessions: LaundrySession[];
  loading: boolean;
  addQRCode: (qr: Omit<QRCode, 'id' | 'createdAt'>) => Promise<QRCode>;
  updateQRCode: (id: string, updates: Partial<QRCode>) => Promise<void>;
  addLaundryItem: (item: Omit<LaundryItem, 'id' | 'submittedAt'>) => Promise<LaundryItem>;
  updateLaundryItem: (id: string, updates: Partial<LaundryItem>) => Promise<void>;
  addMachine: (machine: Omit<Machine, 'id' | 'lastUpdated'>) => Promise<Machine>;
  updateMachine: (id: string, updates: Partial<Machine>) => Promise<void>;
  updateUser: (id: string, updates: Partial<User>) => Promise<void>;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Promise<Feedback>;
  addLostItem: (item: Omit<LostItem, 'id' | 'createdAt'>) => Promise<LostItem>;
  updateLostItem: (id: string, updates: Partial<LostItem>) => Promise<void>;
  addLaundrySession: (session: Omit<LaundrySession, 'id' | 'startTime'>) => Promise<LaundrySession>;
  updateLaundrySession: (id: string, updates: Partial<LaundrySession>) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [laundryItems, setLaundryItems] = useState<LaundryItem[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);
  const [laundrySessions, setLaundrySessions] = useState<LaundrySession[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (user) {
      // Set up real-time listeners for user-specific data
      let unsubscribeLaundryItems;

      if (user.role === 'admin' || user.role === 'operator') {
        // Admins and operators see all laundry items
        unsubscribeLaundryItems = FirestoreService.subscribeToAllLaundryItems(setLaundryItems);
      } else {
        // Students only see their own laundry items
        unsubscribeLaundryItems = FirestoreService.subscribeToLaundryItems(
          user.id,
          setLaundryItems
        );
      }

      return () => {
        unsubscribeLaundryItems();
      };
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [
        usersData,
        qrCodesData,
        laundryItemsData,
        machinesData,
        feedbacksData,
        lostItemsData,
        sessionsData
      ] = await Promise.all([
        FirestoreService.getUsers(),
        FirestoreService.getQRCodes(),
        FirestoreService.getLaundryItems(),
        FirestoreService.getMachines(),
        FirestoreService.getFeedbacks(),
        FirestoreService.getLostItems(),
        FirestoreService.getLaundrySessions()
      ]);

      setUsers(usersData);
      setQRCodes(qrCodesData);
      setLaundryItems(laundryItemsData);
      setMachines(machinesData);
      setFeedbacks(feedbacksData);
      setLostItems(lostItemsData);
      setLaundrySessions(sessionsData);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setLoading(false);
    }
  };
  // CRUD Functions
  const addQRCode = async (qr: Omit<QRCode, 'id' | 'createdAt'>): Promise<QRCode> => {
    const newQR = await FirestoreService.addQRCode(qr);
    setQRCodes(prev => [...prev, newQR]);
    return newQR;
  };

  const updateQRCode = async (id: string, updates: Partial<QRCode>): Promise<void> => {
    await FirestoreService.updateQRCode(id, updates);
    setQRCodes(prev => prev.map(qr => qr.id === id ? { ...qr, ...updates } : qr));
  };

  const addLaundryItem = async (item: Omit<LaundryItem, 'id' | 'submittedAt'>): Promise<LaundryItem> => {
    const newItem = await FirestoreService.addLaundryItem(item);
    setLaundryItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateLaundryItem = async (id: string, updates: Partial<LaundryItem>): Promise<void> => {
    await FirestoreService.updateLaundryItem(id, updates);
    setLaundryItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const addMachine = async (machine: Omit<Machine, 'id' | 'lastUpdated'>): Promise<Machine> => {
    const newMachine = await FirestoreService.addMachine(machine);
    setMachines(prev => [...prev, newMachine]);
    return newMachine;
  };

  const updateMachine = async (id: string, updates: Partial<Machine>): Promise<void> => {
    await FirestoreService.updateMachine(id, updates);
    setMachines(prev => prev.map(machine => machine.id === id ? { ...machine, ...updates } : machine));
  };

  const updateUser = async (id: string, updates: Partial<User>): Promise<void> => {
    await FirestoreService.updateUser(id, updates);
    setUsers(prev => prev.map(user => user.id === id ? { ...user, ...updates } : user));
  };

  const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> => {
    const newFeedback = await FirestoreService.addFeedback(feedback);
    setFeedbacks(prev => [...prev, newFeedback]);
    return newFeedback;
  };

  const addLostItem = async (item: Omit<LostItem, 'id' | 'createdAt'>): Promise<LostItem> => {
    const newItem = await FirestoreService.addLostItem(item);
    setLostItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateLostItem = async (id: string, updates: Partial<LostItem>): Promise<void> => {
    await FirestoreService.updateLostItem(id, updates);
    setLostItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const addLaundrySession = async (session: Omit<LaundrySession, 'id' | 'startTime'>): Promise<LaundrySession> => {
    const newSession = await FirestoreService.addLaundrySession(session);
    setLaundrySessions(prev => [...prev, newSession]);
    return newSession;
  };

  const updateLaundrySession = async (id: string, updates: Partial<LaundrySession>): Promise<void> => {
    await FirestoreService.updateLaundrySession(id, updates);
    setLaundrySessions(prev => prev.map(session => session.id === id ? { ...session, ...updates } : session));
  };

  return (
    <DataContext.Provider value={{
      users,
      qrCodes,
      laundryItems,
      machines,
      feedbacks,
      lostItems,
      laundrySessions,
      loading,
      addQRCode,
      updateQRCode,
      addLaundryItem,
      updateLaundryItem,
      addMachine,
      updateMachine,
      updateUser,
      addFeedback,
      addLostItem,
      updateLostItem,
      addLaundrySession,
      updateLaundrySession
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
