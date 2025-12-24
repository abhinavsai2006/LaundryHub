// Firestore service layer for LaundryHub data operations
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/react-app/config/firebase';
import {
  User,
  QRCode,
  LaundryItem,
  Machine,
  Feedback,
  LostItem,
  LaundrySession
} from '@/shared/laundry-types';

class FirestoreService {
  // Users
  static async getUsers(): Promise<User[]> {
    const querySnapshot = await getDocs(collection(db, 'users'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  }

  static async getUser(userId: string): Promise<User | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as User : null;
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const docRef = doc(db, 'users', userId);
    await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
  }

  // QR Codes
  static async getQRCodes(): Promise<QRCode[]> {
    const q = query(collection(db, 'qrCodes'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as QRCode));
  }

  static async addQRCode(qrData: Omit<QRCode, 'id' | 'createdAt'>): Promise<QRCode> {
    const docRef = await addDoc(collection(db, 'qrCodes'), {
      ...qrData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...qrData, createdAt: new Date().toISOString() };
  }

  static async updateQRCode(qrId: string, updates: Partial<QRCode>): Promise<void> {
    const docRef = doc(db, 'qrCodes', qrId);
    await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
  }

  // Laundry Items
  static async getLaundryItems(userId?: string): Promise<LaundryItem[]> {
    let q = query(collection(db, 'laundryItems'), orderBy('submittedAt', 'desc'));
    if (userId) {
      q = query(collection(db, 'laundryItems'), where('studentId', '==', userId), orderBy('submittedAt', 'desc'));
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LaundryItem));
  }

  static async addLaundryItem(itemData: Omit<LaundryItem, 'id' | 'submittedAt'>): Promise<LaundryItem> {
    const docRef = await addDoc(collection(db, 'laundryItems'), {
      ...itemData,
      submittedAt: Timestamp.now()
    });
    return { id: docRef.id, ...itemData, submittedAt: new Date().toISOString() };
  }

  static async updateLaundryItem(itemId: string, updates: Partial<LaundryItem>): Promise<void> {
    const docRef = doc(db, 'laundryItems', itemId);
    await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
  }

  // Machines
  static async getMachines(): Promise<Machine[]> {
    const querySnapshot = await getDocs(collection(db, 'machines'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Machine));
  }

  static async addMachine(machineData: Omit<Machine, 'id' | 'lastUpdated'>): Promise<Machine> {
    const docRef = await addDoc(collection(db, 'machines'), {
      ...machineData,
      lastUpdated: Timestamp.now()
    });
    return { id: docRef.id, ...machineData, lastUpdated: new Date().toISOString() };
  }

  static async updateMachine(machineId: string, updates: Partial<Machine>): Promise<void> {
    const docRef = doc(db, 'machines', machineId);
    await updateDoc(docRef, { ...updates, lastUpdated: Timestamp.now() });
  }

  // Feedback
  static async getFeedbacks(): Promise<Feedback[]> {
    const q = query(collection(db, 'feedbacks'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
  }

  static async addFeedback(feedbackData: Omit<Feedback, 'id' | 'createdAt'>): Promise<Feedback> {
    const docRef = await addDoc(collection(db, 'feedbacks'), {
      ...feedbackData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...feedbackData, createdAt: new Date().toISOString() };
  }

  // Lost Items
  static async getLostItems(): Promise<LostItem[]> {
    const q = query(collection(db, 'lostFound'), orderBy('reportedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LostItem));
  }

  static async addLostItem(itemData: Omit<LostItem, 'id' | 'createdAt'>): Promise<LostItem> {
    const docRef = await addDoc(collection(db, 'lostFound'), {
      ...itemData,
      createdAt: Timestamp.now()
    });
    return { id: docRef.id, ...itemData, createdAt: new Date().toISOString() };
  }

  static async updateLostItem(itemId: string, updates: Partial<LostItem>): Promise<void> {
    const docRef = doc(db, 'lostFound', itemId);
    await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
  }

  // Laundry Sessions
  static async getLaundrySessions(): Promise<LaundrySession[]> {
    const q = query(collection(db, 'laundrySessions'), orderBy('startTime', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LaundrySession));
  }

  static async addLaundrySession(sessionData: Omit<LaundrySession, 'id' | 'startTime'>): Promise<LaundrySession> {
    const docRef = await addDoc(collection(db, 'laundrySessions'), {
      ...sessionData,
      startTime: Timestamp.now()
    });
    return { id: docRef.id, ...sessionData, startTime: new Date().toISOString() };
  }

  static async updateLaundrySession(sessionId: string, updates: Partial<LaundrySession>): Promise<void> {
    const docRef = doc(db, 'laundrySessions', sessionId);
    await updateDoc(docRef, { ...updates, updatedAt: Timestamp.now() });
  }

  // Real-time listeners
  static subscribeToLaundryItems(userId: string, callback: (items: LaundryItem[]) => void) {
    const q = query(
      collection(db, 'laundryItems'),
      where('studentId', '==', userId),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LaundryItem));
      callback(items);
    });
  }

  static subscribeToAllLaundryItems(callback: (items: LaundryItem[]) => void) {
    const q = query(
      collection(db, 'laundryItems'),
      orderBy('submittedAt', 'desc')
    );

    return onSnapshot(q, (querySnapshot) => {
      const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LaundryItem));
      callback(items);
    });
  }

  static subscribeToMachines(callback: (machines: Machine[]) => void) {
    const q = query(collection(db, 'machines'), orderBy('lastUpdated', 'desc'));

    return onSnapshot(q, (querySnapshot) => {
      const machines = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Machine));
      callback(machines);
    });
  }
}

export default FirestoreService;