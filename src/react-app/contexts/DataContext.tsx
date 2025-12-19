import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QRCode, LaundryItem, Machine, Feedback, LostItem, User } from '@/shared/laundry-types';

interface DataContextType {
  users: User[];
  qrCodes: QRCode[];
  laundryItems: LaundryItem[];
  machines: Machine[];
  feedbacks: Feedback[];
  lostItems: LostItem[];
  addQRCode: (qr: Omit<QRCode, 'id' | 'createdAt'>) => QRCode;
  updateQRCode: (id: string, updates: Partial<QRCode>) => void;
  addLaundryItem: (item: Omit<LaundryItem, 'id' | 'submittedAt'>) => LaundryItem;
  updateLaundryItem: (id: string, updates: Partial<LaundryItem>) => void;
  addMachine: (machine: Omit<Machine, 'id' | 'lastUpdated'>) => Machine;
  updateMachine: (id: string, updates: Partial<Machine>) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => Feedback;
  addLostItem: (item: Omit<LostItem, 'id' | 'createdAt'>) => LostItem;
  updateLostItem: (id: string, updates: Partial<LostItem>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [laundryItems, setLaundryItems] = useState<LaundryItem[]>([]);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [lostItems, setLostItems] = useState<LostItem[]>([]);

  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    const savedQR = localStorage.getItem('qrCodes');
    const savedItems = localStorage.getItem('laundryItems');
    const savedMachines = localStorage.getItem('machines');
    const savedFeedbacks = localStorage.getItem('feedbacks');
    const savedLostItems = localStorage.getItem('lostItems');

    // Initialize mock data if not exists
    if (!savedUsers) {
      const mockUsers: User[] = [
        {
          id: 'admin_1',
          name: 'Admin User',
          email: 'admin@laundryhub.com',
          password: 'adminpass',
          rollNumber: 'ADM001',
          hostel: 'MH-A',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        // Students
        {
          id: 'student_1',
          name: 'John Doe',
          email: 'john.doe@student.com',
          password: 'studentpass1',
          rollNumber: '2021001',
          hostel: 'MH-A',
          room: '101',
          role: 'student',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          laundryPreferences: {
            gentleWash: true,
            separateWhites: false,
            extraRinse: true,
            dryCleaning: false,
            foldOnly: false,
            noStarch: true
          },
          laundryPaused: false,
          privacySettings: {
            hideProfilePhoto: false,
            maskRoomNumber: false,
            hideContactInfo: false,
            allowRoommateView: true
          },
          favoriteSetups: [
            {
              id: 'setup_1',
              name: 'Weekly Wash',
              items: ['Shirts x3', 'Pants x2', 'Towels x2'],
              specialInstructions: 'Gentle wash, extra rinse',
              tags: ['weekly', 'essentials'],
              preferences: {
                gentleWash: true,
                separateWhites: false,
                extraRinse: true,
                dryCleaning: false,
                foldOnly: false,
                noStarch: true
              },
              createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          roommateSharing: true,
          sharedWithRoommate: 'student_2',
          deviceSessions: [
            {
              id: 'session_1',
              deviceName: 'iPhone 13',
              deviceType: 'mobile',
              ipAddress: '192.168.1.100',
              lastActive: new Date().toISOString(),
              isCurrent: true
            }
          ],
          feedbackHistory: [
            {
              id: 'feedback_1',
              laundryId: 'laundry_1',
              studentId: 'student_1',
              studentName: 'John Doe',
              rating: 5,
              emoji: '😊',
              comment: 'Great service!',
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              helpful: true
            }
          ]
        },
        {
          id: 'student_2',
          name: 'Jane Smith',
          email: 'jane.smith@student.com',
          password: 'studentpass2',
          rollNumber: '2021002',
          hostel: 'MH-B',
          room: '202',
          role: 'student',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
          laundryPreferences: {
            gentleWash: false,
            separateWhites: true,
            extraRinse: false,
            dryCleaning: false,
            foldOnly: true,
            noStarch: false
          },
          laundryPaused: false,
          privacySettings: {
            hideProfilePhoto: false,
            maskRoomNumber: false,
            hideContactInfo: false,
            allowRoommateView: true
          },
          favoriteSetups: [],
          roommateSharing: true,
          sharedWithRoommate: 'student_1',
          deviceSessions: [
            {
              id: 'session_2',
              deviceName: 'Samsung Galaxy',
              deviceType: 'mobile',
              ipAddress: '192.168.1.101',
              lastActive: new Date().toISOString(),
              isCurrent: true
            }
          ],
          feedbackHistory: []
        },
        {
          id: 'student_3',
          name: 'Bob Johnson',
          email: 'bob.johnson@student.com',
          password: 'studentpass3',
          rollNumber: '2021003',
          hostel: 'LH-A',
          room: '12',
          role: 'student',
          createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
          laundryPreferences: {
            gentleWash: true,
            separateWhites: true,
            extraRinse: true,
            dryCleaning: false,
            foldOnly: false,
            noStarch: false
          },
          laundryPaused: true,
          laundryPausedUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          privacySettings: {
            hideProfilePhoto: true,
            maskRoomNumber: true,
            hideContactInfo: false,
            allowRoommateView: false
          },
          favoriteSetups: [],
          roommateSharing: false,
          deviceSessions: [
            {
              id: 'session_3',
              deviceName: 'MacBook Pro',
              deviceType: 'desktop',
              ipAddress: '192.168.1.102',
              lastActive: new Date().toISOString(),
              isCurrent: true
            }
          ],
          feedbackHistory: []
        },
        {
          id: 'student_4',
          name: 'Aisha Khan',
          email: 'aisha.khan@student.com',
          password: 'studentpass4',
          rollNumber: '2021004',
          hostel: 'MH-A',
          room: '110',
          role: 'student',
          createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
          laundryPreferences: {
            gentleWash: false,
            separateWhites: false,
            extraRinse: false,
            dryCleaning: true,
            foldOnly: false,
            noStarch: true
          },
          laundryPaused: false,
          privacySettings: {
            hideProfilePhoto: false,
            maskRoomNumber: false,
            hideContactInfo: true,
            allowRoommateView: true
          },
          favoriteSetups: [
            {
              id: 'setup_2',
              name: 'Delicates',
              items: ['Dress x1', 'Blouse x2', 'Skirt x1'],
              specialInstructions: 'Dry cleaning only, no starch',
              tags: ['delicates', 'formal'],
              preferences: {
                gentleWash: false,
                separateWhites: false,
                extraRinse: false,
                dryCleaning: true,
                foldOnly: false,
                noStarch: true
              },
              createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
            }
          ],
          roommateSharing: false,
          deviceSessions: [
            {
              id: 'session_4',
              deviceName: 'iPad Pro',
              deviceType: 'tablet',
              ipAddress: '192.168.1.103',
              lastActive: new Date().toISOString(),
              isCurrent: true
            }
          ],
          feedbackHistory: []
        },
        {
          id: 'student_5',
          name: 'Samuel Green',
          email: 'samuel.green@student.com',
          password: 'studentpass5',
          rollNumber: '2021005',
          hostel: 'MH-B',
          room: '215',
          role: 'student',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          laundryPreferences: {
            gentleWash: true,
            separateWhites: false,
            extraRinse: true,
            dryCleaning: false,
            foldOnly: false,
            noStarch: false
          },
          laundryPaused: false,
          privacySettings: {
            hideProfilePhoto: false,
            maskRoomNumber: false,
            hideContactInfo: false,
            allowRoommateView: true
          },
          favoriteSetups: [],
          roommateSharing: false,
          deviceSessions: [
            {
              id: 'session_5',
              deviceName: 'Windows Laptop',
              deviceType: 'desktop',
              ipAddress: '192.168.1.104',
              lastActive: new Date().toISOString(),
              isCurrent: true
            }
          ],
          feedbackHistory: []
        },
        {
          id: 'student_6',
          name: 'Ling Wei',
          email: 'ling.wei@student.com',
          password: 'studentpass6',
          rollNumber: '2021006',
          hostel: 'LH-A',
          room: '08',
          role: 'student',
          createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          laundryPreferences: {
            gentleWash: false,
            separateWhites: true,
            extraRinse: false,
            dryCleaning: false,
            foldOnly: true,
            noStarch: true
          },
          laundryPaused: false,
          privacySettings: {
            hideProfilePhoto: false,
            maskRoomNumber: false,
            hideContactInfo: false,
            allowRoommateView: true
          },
          favoriteSetups: [],
          roommateSharing: false,
          deviceSessions: [
            {
              id: 'session_6',
              deviceName: 'Android Phone',
              deviceType: 'mobile',
              ipAddress: '192.168.1.105',
              lastActive: new Date().toISOString(),
              isCurrent: true
            }
          ],
          feedbackHistory: []
        },
        // Operators
        {
          id: 'op_1',
          name: 'Rajesh Kumar',
          email: 'rajesh.kumar@laundryhub.com',
          password: 'operatorpass1',
          rollNumber: 'OP001',
          hostel: 'MH-A',
          role: 'operator',
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'op_2',
          name: 'Priya Sharma',
          email: 'priya.sharma@laundryhub.com',
          password: 'operatorpass2',
          rollNumber: 'OP002',
          hostel: 'MH-B',
          role: 'operator',
          createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      
      localStorage.setItem('users', JSON.stringify(mockUsers));
      setUsers(mockUsers);
    } else {
      setUsers(JSON.parse(savedUsers));
    }

    if (!savedQR) {
      const mockQRCodes: QRCode[] = [
        { id: 'qr_1', code: 'QR001', assignedTo: 'student_1', assignedBy: 'op_1', status: 'verified', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'qr_2', code: 'QR002', assignedTo: 'student_2', assignedBy: 'op_2', status: 'verified', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'qr_3', code: 'QR003', assignedTo: 'student_3', assignedBy: 'op_1', status: 'assigned', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'qr_4', code: 'QR004', assignedTo: 'student_4', assignedBy: 'op_2', status: 'assigned', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'qr_5', code: 'QR005', assignedTo: 'student_5', assignedBy: 'op_1', status: 'verified', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
        { id: 'qr_6', code: 'QR006', status: 'available', createdAt: new Date().toISOString() }
      ];
      localStorage.setItem('qrCodes', JSON.stringify(mockQRCodes));
      setQRCodes(mockQRCodes);
    } else {
      setQRCodes(JSON.parse(savedQR));
    }

    if (!savedItems) {
      const mockLaundryItems: LaundryItem[] = [
        { 
          id: 'laundry_1', 
          studentId: 'student_1', 
          studentName: 'John Doe', 
          operatorId: 'op_1', 
          operatorName: 'Rajesh Kumar', 
          items: ['shirt x2','pants x1'], 
          status: 'delivered', 
          submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
          pickedUpAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), 
          deliveredAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
          machineName: 'Washer-01', 
          qrCode: 'QR001',
          tags: ['essentials', 'weekly'],
          conditionPhotos: ['https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400', 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=400'],
          receipt: {
            id: 'receipt_1',
            laundryId: 'laundry_1',
            qrId: 'QR001',
            pickupDate: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            pickupTime: '14:30',
            operatorName: 'Rajesh K.',
            items: ['shirt x2','pants x1'],
            totalItems: 3,
            specialInstructions: 'Gentle wash, extra rinse'
          },
          feedback: {
            id: 'feedback_1',
            laundryId: 'laundry_1',
            studentId: 'student_1',
            studentName: 'John Doe',
            rating: 5,
            emoji: '😊',
            comment: 'Great service!',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            helpful: true
          },
          setupId: 'setup_1'
        },
        { 
          id: 'laundry_2', 
          studentId: 'student_2', 
          studentName: 'Jane Smith', 
          operatorId: 'op_2', 
          operatorName: 'Priya Sharma', 
          items: ['shirt x3','bedsheet x1'], 
          status: 'washing', 
          submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), 
          pickedUpAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), 
          washingStartedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          machineName: 'Washer-02', 
          qrCode: 'QR002',
          tags: ['bedding', 'shirts'],
          reminderSent: false
        },
        { 
          id: 'laundry_3', 
          studentId: 'student_3', 
          studentName: 'Bob Johnson', 
          operatorId: 'op_1', 
          items: ['towel x2','socks x5'], 
          status: 'paused' as any,
          submittedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), 
          qrCode: 'QR003',
          tags: ['towels', 'socks']
        },
        { 
          id: 'laundry_4', 
          studentId: 'student_4', 
          studentName: 'Aisha Khan', 
          operatorId: 'op_2', 
          items: ['dress x1'], 
          status: 'ready', 
          submittedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), 
          readyAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          qrCode: 'QR004', 
          machineName: 'Washer-03',
          tags: ['delicates', 'formal'],
          reminderSent: true,
          pickupDeadline: new Date(Date.now() + 22 * 60 * 60 * 1000).toISOString(),
          setupId: 'setup_2'
        },
        { 
          id: 'laundry_5', 
          studentId: 'student_5', 
          studentName: 'Samuel Green', 
          operatorId: 'op_1', 
          items: ['shirt x2'], 
          status: 'picked_up', 
          submittedAt: new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString(), 
          pickedUpAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
          qrCode: 'QR005', 
          machineName: 'Washer-02',
          tags: ['casual'],
          missedPickup: {
            id: 'missed_1',
            laundryId: 'laundry_5',
            missedAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
            notifiedAt: new Date(Date.now() - 29 * 60 * 60 * 1000).toISOString(),
            status: 'resolved'
          }
        }
      ];
      localStorage.setItem('laundryItems', JSON.stringify(mockLaundryItems));
      setLaundryItems(mockLaundryItems);
    } else {
      setLaundryItems(JSON.parse(savedItems));
    }

    if (!savedMachines) {
      const mockMachines: Machine[] = [
        {
          id: 'machine_1',
          name: 'Washer-01',
          type: 'washer',
          hostel: 'MH-A',
          status: 'available',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'machine_2',
          name: 'Washer-02',
          type: 'washer',
          hostel: 'MH-A',
          status: 'in-use',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'machine_3',
          name: 'Dryer-01',
          type: 'dryer',
          hostel: 'MH-A',
          status: 'available',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'machine_4',
          name: 'Washer-03',
          type: 'washer',
          hostel: 'MH-B',
          status: 'maintenance',
          lastUpdated: new Date().toISOString()
        },
        {
          id: 'machine_5',
          name: 'Dryer-02',
          type: 'dryer',
          hostel: 'LH-A',
          status: 'available',
          lastUpdated: new Date().toISOString()
        }
      ];
      localStorage.setItem('machines', JSON.stringify(mockMachines));
      setMachines(mockMachines);
    } else {
      setMachines(JSON.parse(savedMachines));
    }

    if (!savedFeedbacks) {
      const mockFeedbacks: Feedback[] = [
        {
          id: 'feedback_1',
          laundryId: 'laundry_1',
          studentId: 'student_1',
          studentName: 'John Doe',
          rating: 5,
          comment: 'Excellent service! Clothes came back clean and fresh.',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'feedback_2',
          laundryId: 'laundry_2',
          studentId: 'student_2',
          studentName: 'Jane Smith',
          rating: 4,
          comment: 'Good service, but took a bit longer than expected.',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('feedbacks', JSON.stringify(mockFeedbacks));
      setFeedbacks(mockFeedbacks);
    } else {
      setFeedbacks(JSON.parse(savedFeedbacks));
    }

    if (!savedLostItems || JSON.parse(savedLostItems).length === 0) {
      const mockLostItems: LostItem[] = [
        { 
          id: 'lost_1', 
          description: 'Blue hoodie with university logo', 
          reportedBy: 'op_1', 
          reportedByName: 'Rajesh Kumar', 
          foundBy: 'Rajesh Kumar', 
          hostel: 'MH-A', 
          status: 'reported', 
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Student reported that their favorite hoodie went missing after laundry pickup. They mentioned it was in their laundry bag when they submitted it.',
          studentDetails: { name: 'Amit Singh', studentId: 'STU2024001', roomNumber: 'MH-A-201', contactNumber: '+91-9876543210', email: 'amit.singh@university.edu' },
          photos: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400'],
          bagDetails: { bagId: 'BAG-001', color: 'Blue', size: 'Large', submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'high',
          location: 'Laundry Room MH-A',
          notes: []
        },
        { 
          id: 'lost_2', 
          description: 'Black wallet with student ID', 
          reportedBy: 'op_2', 
          reportedByName: 'Priya Sharma', 
          foundBy: 'Priya Sharma', 
          hostel: 'MH-B', 
          status: 'approved', 
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Wallet found in the dryer machine. Contains student ID card and some cash. Student has been notified.',
          studentDetails: { name: 'Sneha Patel', studentId: 'STU2024002', roomNumber: 'MH-B-305', contactNumber: '+91-9876543211', email: 'sneha.patel@university.edu' },
          photos: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
          bagDetails: { bagId: 'BAG-002', color: 'Black', size: 'Medium', submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'medium',
          location: 'Dryer Machine MH-B',
          notes: [{ id: 'note_1', content: 'Wallet verified with student ID. Approved for return.', createdBy: 'op_2', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() }]
        },
        { 
          id: 'lost_3', 
          description: 'White socks (pair)', 
          reportedBy: 'op_1', 
          reportedByName: 'Rajesh Kumar', 
          foundBy: 'Rajesh Kumar', 
          hostel: 'LH-A', 
          status: 'returned', 
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: false,
          complaintDetails: 'Pair of white socks found unpaired in the laundry. Student claimed them after verification.',
          studentDetails: { name: 'Rahul Verma', studentId: 'STU2024003', roomNumber: 'LH-A-102', contactNumber: '+91-9876543212', email: 'rahul.verma@university.edu' },
          photos: [],
          bagDetails: { bagId: 'BAG-003', color: 'White', size: 'Small', submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'low',
          location: 'Sorting Area LH-A',
          notes: [
            { id: 'note_2', content: 'Student contacted and verified ownership.', createdBy: 'op_1', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'note_3', content: 'Item returned to student successfully.', createdBy: 'op_1', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        { 
          id: 'lost_4', 
          description: 'Set of keys with red keychain', 
          reportedBy: 'op_2', 
          reportedByName: 'Priya Sharma', 
          foundBy: 'Priya Sharma', 
          hostel: 'MH-A', 
          status: 'reported', 
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Keys found in the washing machine filter. Red keychain attached. Student reported missing their room keys.',
          studentDetails: { name: 'Kavita Jain', studentId: 'STU2024004', roomNumber: 'MH-A-405', contactNumber: '+91-9876543213', email: 'kavita.jain@university.edu' },
          photos: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400'],
          bagDetails: { bagId: 'BAG-004', color: 'Red', size: 'Small', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'high',
          location: 'Washing Machine Filter MH-A',
          notes: []
        },
        { 
          id: 'lost_5', 
          description: 'Red water bottle with motivational quote', 
          reportedBy: 'op_1', 
          reportedByName: 'Rajesh Kumar', 
          foundBy: 'Rajesh Kumar', 
          hostel: 'MH-B', 
          status: 'approved', 
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Water bottle found near the entrance. Has a motivational quote sticker. Student identified it as theirs.',
          studentDetails: { name: 'Vikram Singh', studentId: 'STU2024005', roomNumber: 'MH-B-208', contactNumber: '+91-9876543214', email: 'vikram.singh@university.edu' },
          photos: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400'],
          bagDetails: { bagId: 'BAG-005', color: 'Red', size: 'Medium', submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'medium',
          location: 'Entrance Area MH-B',
          notes: [{ id: 'note_4', content: 'Student verified the motivational quote sticker. Approved for pickup.', createdBy: 'op_1', createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() }]
        },
        { 
          id: 'lost_6', 
          description: 'Black umbrella', 
          reportedBy: 'op_2', 
          reportedByName: 'Priya Sharma', 
          foundBy: 'Priya Sharma', 
          hostel: 'LH-A', 
          status: 'found', 
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Umbrella found folded in the lost and found box. No immediate claims yet.',
          studentDetails: null,
          photos: ['https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=400'],
          bagDetails: null,
          priority: 'low',
          location: 'Lost and Found Box LH-A',
          notes: []
        },
        { 
          id: 'lost_7', 
          description: 'Blue jeans with holes', 
          reportedBy: 'op_1', 
          reportedByName: 'Rajesh Kumar', 
          foundBy: 'Rajesh Kumar', 
          hostel: 'MH-A', 
          status: 'claimed', 
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: false,
          complaintDetails: 'Jeans with distinctive holes found after laundry processing. Student claimed and picked up.',
          studentDetails: { name: 'Anjali Gupta', studentId: 'STU2024006', roomNumber: 'MH-A-310', contactNumber: '+91-9876543215', email: 'anjali.gupta@university.edu' },
          photos: [],
          bagDetails: { bagId: 'BAG-006', color: 'Blue', size: 'Large', submittedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'medium',
          location: 'Processing Area MH-A',
          notes: [
            { id: 'note_5', content: 'Student identified the jeans by the holes pattern.', createdBy: 'op_1', createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
            { id: 'note_6', content: 'Item claimed and returned to student.', createdBy: 'op_1', createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() }
          ]
        },
        { 
          id: 'lost_8', 
          description: 'White earphones', 
          reportedBy: 'op_2', 
          reportedByName: 'Priya Sharma', 
          foundBy: 'Priya Sharma', 
          hostel: 'MH-B', 
          status: 'rejected', 
          createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: false,
          complaintDetails: 'Earphones found but determined to be laundry facility property. Not returned to student.',
          studentDetails: { name: 'Rohit Kumar', studentId: 'STU2024007', roomNumber: 'MH-B-412', contactNumber: '+91-9876543216', email: 'rohit.kumar@university.edu' },
          photos: ['https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400'],
          bagDetails: null,
          priority: 'low',
          location: 'Facility Storage MH-B',
          notes: [{ id: 'note_7', content: 'Item identified as facility property. Claim rejected.', createdBy: 'op_2', createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() }]
        },
        { 
          id: 'lost_9', 
          description: 'Green scarf', 
          reportedBy: 'op_1', 
          reportedByName: 'Rajesh Kumar', 
          foundBy: 'Rajesh Kumar', 
          hostel: 'LH-A', 
          status: 'reported', 
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Green scarf found in the laundry area. Student reported it missing from their laundry bag.',
          studentDetails: { name: 'Meera Shah', studentId: 'STU2024008', roomNumber: 'LH-A-205', contactNumber: '+91-9876543217', email: 'meera.shah@university.edu' },
          photos: ['https://images.unsplash.com/photo-1601762603339-fd61e28b698a?w=400'],
          bagDetails: { bagId: 'BAG-007', color: 'Green', size: 'Small', submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'medium',
          location: 'Laundry Area LH-A',
          notes: []
        },
        { 
          id: 'lost_10', 
          description: 'Brown leather belt', 
          reportedBy: 'op_2', 
          reportedByName: 'Priya Sharma', 
          foundBy: 'Priya Sharma', 
          hostel: 'MH-A', 
          status: 'approved', 
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 60 * 1000).toISOString(), 
          visible: true,
          complaintDetails: 'Leather belt found in the folding area. Student provided detailed description for verification.',
          studentDetails: { name: 'Arjun Patel', studentId: 'STU2024009', roomNumber: 'MH-A-118', contactNumber: '+91-9876543218', email: 'arjun.patel@university.edu' },
          photos: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'],
          bagDetails: { bagId: 'BAG-008', color: 'Brown', size: 'Medium', submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          priority: 'high',
          location: 'Folding Area MH-A',
          notes: [{ id: 'note_8', content: 'Student description matches exactly. Approved for return.', createdBy: 'op_2', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() }]
        }
      ];
      localStorage.setItem('lostItems', JSON.stringify(mockLostItems));
      setLostItems(mockLostItems);
    } else {
      setLostItems(JSON.parse(savedLostItems));
    }
  }, []);

  const addQRCode = (qr: Omit<QRCode, 'id' | 'createdAt'>): QRCode => {
    const newQR: QRCode = {
      ...qr,
      id: `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...qrCodes, newQR];
    setQRCodes(updated);
    localStorage.setItem('qrCodes', JSON.stringify(updated));
    return newQR;
  };

  const updateQRCode = (id: string, updates: Partial<QRCode>) => {
    const updated = qrCodes.map(qr => qr.id === id ? { ...qr, ...updates } : qr);
    setQRCodes(updated);
    localStorage.setItem('qrCodes', JSON.stringify(updated));
  };

  const addLaundryItem = (item: Omit<LaundryItem, 'id' | 'submittedAt'>): LaundryItem => {
    const newItem: LaundryItem = {
      ...item,
      id: `laundry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      submittedAt: new Date().toISOString()
    };
    const updated = [...laundryItems, newItem];
    setLaundryItems(updated);
    localStorage.setItem('laundryItems', JSON.stringify(updated));
    return newItem;
  };

  const updateLaundryItem = (id: string, updates: Partial<LaundryItem>) => {
    const updated = laundryItems.map(item => item.id === id ? { ...item, ...updates } : item);
    setLaundryItems(updated);
    localStorage.setItem('laundryItems', JSON.stringify(updated));
  };

  const addMachine = (machine: Omit<Machine, 'id' | 'lastUpdated'>): Machine => {
    const newMachine: Machine = {
      ...machine,
      id: `machine_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date().toISOString()
    };
    const updated = [...machines, newMachine];
    setMachines(updated);
    localStorage.setItem('machines', JSON.stringify(updated));
    return newMachine;
  };

  const updateMachine = (id: string, updates: Partial<Machine>) => {
    const updated = machines.map(m => m.id === id ? { ...m, ...updates, lastUpdated: new Date().toISOString() } : m);
    setMachines(updated);
    localStorage.setItem('machines', JSON.stringify(updated));
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updated = users.map(u => u.id === id ? { ...u, ...updates } : u);
    setUsers(updated);
    localStorage.setItem('users', JSON.stringify(updated));
  };

  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt'>): Feedback => {
    const newFeedback: Feedback = {
      ...feedback,
      id: `feedback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...feedbacks, newFeedback];
    setFeedbacks(updated);
    localStorage.setItem('feedbacks', JSON.stringify(updated));
    return newFeedback;
  };

  const addLostItem = (item: Omit<LostItem, 'id' | 'createdAt'>): LostItem => {
    const newItem: LostItem = {
      ...item,
      id: `lost_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [...lostItems, newItem];
    setLostItems(updated);
    localStorage.setItem('lostItems', JSON.stringify(updated));
    return newItem;
  };

  const updateLostItem = (id: string, updates: Partial<LostItem>) => {
    const updated = lostItems.map(item => item.id === id ? { ...item, ...updates } : item);
    setLostItems(updated);
    localStorage.setItem('lostItems', JSON.stringify(updated));
  };

  return (
    <DataContext.Provider value={{
      users,
      qrCodes,
      laundryItems,
      machines,
      feedbacks,
      lostItems,
      addQRCode,
      updateQRCode,
      addLaundryItem,
      updateLaundryItem,
      addMachine,
      updateMachine,
      updateUser,
      addFeedback,
      addLostItem,
      updateLostItem
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
