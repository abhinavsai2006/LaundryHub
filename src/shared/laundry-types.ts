export type Role = 'admin' | 'operator' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string; // Optional for OAuth users
  phone?: string;
  rollNumber?: string;
  gender?: string;
  hostel?: string;
  room?: string;
  profilePhoto?: string;
  qrCode?: string;
  createdAt: string;
  profileCompleted?: boolean; // For Google OAuth users
  // Operator specific fields
  operatorId?: string;
  assignedHostel?: string;
  accountStatus?: 'active' | 'suspended' | 'pending_approval';
  // Admin specific fields
  adminLevel?: 'standard' | 'super';
  // New student features
  laundryPreferences?: LaundryPreferences;
  laundryPaused?: boolean;
  laundryPausedUntil?: string;
  privacySettings?: PrivacySettings;
  favoriteSetups?: LaundrySetup[];
  roommateSharing?: boolean;
  sharedWithRoommate?: string; // roommate user ID
  deviceSessions?: DeviceSession[];
  feedbackHistory?: Feedback[];
}

export interface LaundryPreferences {
  gentleWash: boolean;
  separateWhites: boolean;
  extraRinse: boolean;
  dryCleaning: boolean;
  foldOnly: boolean;
  noStarch: boolean;
}

export interface PrivacySettings {
  hideProfilePhoto: boolean;
  maskRoomNumber: boolean;
  hideContactInfo: boolean;
  allowRoommateView: boolean;
}

export interface LaundrySetup {
  id: string;
  name: string;
  items: string[];
  specialInstructions?: string;
  tags: string[];
  preferences: LaundryPreferences;
  createdAt: string;
}

export interface DeviceSession {
  id: string;
  deviceName: string;
  deviceType: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LaundryReceipt {
  id: string;
  laundryId: string;
  qrId: string;
  pickupDate: string;
  pickupTime: string;
  operatorName: string; // masked
  items: string[];
  totalItems: number;
  specialInstructions?: string;
  conditionPhotos?: string[];
  feedback?: Feedback;
}

export interface LaundryInsight {
  month: string;
  totalWashes: number;
  peakDay: string;
  averageItems: number;
  commonTags: string[];
  totalSpent?: number;
  ecoImpact?: string;
}

export interface MissedPickup {
  id: string;
  laundryId: string;
  missedAt: string;
  notifiedAt: string;
  resolvedAt?: string;
  status: 'pending' | 'resolved' | 'escalated';
}

export interface QRCode {
  id: string;
  code: string;
  machineId?: string;
  machineName?: string;
  assignedTo?: string;
  assignedToName?: string;
  assignedBy?: string;
  assignedAt?: string;
  status: 'available' | 'assigned' | 'in-use' | 'verified';
  createdAt: string;
}

export type LaundryStatus = 'submitted' | 'picked_up' | 'washing' | 'drying' | 'ready' | 'delivered' | 'delayed' | 'paused';

export interface NextActionGuidance {
  action: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: string;
  actionUrl?: string;
}

export interface LaundryTroubleshooting {
  status: LaundryStatus;
  title: string;
  explanation: string;
  solutions: string[];
  contactSupport: boolean;
}

export interface LaundryItem {
  id: string;
  studentId: string;
  studentName: string;
  qrCode?: string;
  bagQRCode?: string;
  bagId: string;
  status: LaundryStatus;
  items: string[];
  specialInstructions?: string;
  studentNotes?: string;
  bagPhoto?: string;
  operatorId?: string;
  operatorName?: string;
  machineId?: string;
  machineName?: string;
  submittedAt: string;
  pickedUpAt?: string;
  washingStartedAt?: string;
  dryingStartedAt?: string;
  readyAt?: string;
  deliveredAt?: string;
  estimatedReadyTime?: string;
  // New student features
  tags?: string[];
  conditionPhotos?: string[];
  receipt?: LaundryReceipt;
  reminderSent?: boolean;
  pickupDeadline?: string;
  missedPickup?: MissedPickup;
  feedback?: Feedback;
  setupId?: string; // reference to favorite setup used
}

export interface Machine {
  id: string;
  name: string;
  type: 'washer' | 'dryer';
  status: 'available' | 'in-use' | 'maintenance';
  hostel: string;
  notes?: string;
  currentQR?: string;
  lastUpdated: string;
}

export interface Feedback {
  id: string;
  laundryId: string;
  studentId: string;
  studentName: string;
  rating: number;
  emoji?: string;
  comment?: string;
  createdAt: string;
  helpful?: boolean; // admin marked as helpful
}

export interface LostItem {
  id: string;
  description: string;
  reportedBy: string;
  reportedByName: string;
  foundBy?: string;
  foundByName?: string;
  hostel: string;
  visible: boolean;
  status: 'reported' | 'found' | 'claimed' | 'approved' | 'rejected' | 'returned';
  createdAt: string;
  foundAt?: string;
  claimedAt?: string;
  claimedBy?: string;
  claimedByName?: string;
  photo?: string;
  photos?: string[]; // Multiple photos
  complaintDetails?: string; // Original complaint description
  studentDetails?: {
    name: string;
    studentId: string;
    roomNumber: string;
    contactNumber: string;
    email?: string;
  } | null;
  bagDetails?: {
    bagId: string;
    color: string;
    size: string;
    submittedAt: string;
  } | null;
  priority?: 'low' | 'medium' | 'high';
  location?: string; // Where the item was found
  notes?: {
    id: string;
    content: string;
    createdBy: string;
    createdAt: string;
  }[]; // Operator notes as objects
}

export interface NextActionGuidance {
  action: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  icon: string;
  actionUrl?: string;
}

export interface LaundryInsights {
  month: string;
  totalWashes: number;
  peakDay: string;
  averageItems: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  active: boolean;
  hostel?: string;
}

export interface LaundrySession {
  id: string;
  studentId: string;
  machineId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'cancelled';
  cost?: number;
  notes?: string;
}
