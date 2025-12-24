import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, query, collection, limit, getDocs, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../../shared/laundry-types';

const demoAccounts = [
  // Admin accounts
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
  // Operator accounts
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
  // Student accounts
  {
    email: 'student@laundryhub.com',
    password: 'student123',
    name: 'Demo Student',
    role: 'student' as const,
    phone: '+91 9876543210',
    rollNumber: '21BCE0001',
    gender: 'male',
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
    gender: 'female',
    hostel: 'MH-B',
    room: '202'
  },
  {
    email: 'bob@vitap.ac.in',
    password: 'student123',
    name: 'Bob Smith',
    role: 'student' as const,
    phone: '+91 9876543212',
    rollNumber: '21BCE0003',
    gender: 'male',
    hostel: 'LH-A',
    room: '303'
  },
  {
    email: 'carol@vitap.ac.in',
    password: 'student123',
    name: 'Carol Davis',
    role: 'student' as const,
    phone: '+91 9876543213',
    rollNumber: '21BCE0004',
    gender: 'female',
    hostel: 'MH-C',
    room: '404'
  },
  {
    email: 'dave@vitap.ac.in',
    password: 'student123',
    name: 'Dave Wilson',
    role: 'student' as const,
    phone: '+91 9876543214',
    rollNumber: '21BCE0005',
    gender: 'male',
    hostel: 'LH-B',
    room: '505'
  }
];

export async function createDemoAccounts(createAccounts: boolean = true, forceRecreateMockData: boolean = false) {
  console.log('🚀 Starting LaundryHub Demo Data Creation...');
  console.log('Note: Accounts that already exist will be skipped, but mock data will still be created.');

  // Store user ID mappings for mock data creation
  const userIdMappings: { [email: string]: string } = {};

  // First, try to create accounts (skip if they exist or if createAccounts is false)
  if (createAccounts) {
    console.log('\n📝 Creating demo accounts...');
    for (const account of demoAccounts) {
      try {
        console.log(`Creating account for ${account.email}...`);

        // Add delay to avoid rate limiting (2 seconds between accounts)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create Firebase Auth user
        const { user: firebaseUser } = await createUserWithEmailAndPassword(
          auth,
          account.email,
          account.password
        );

        // Store the user ID mapping
        userIdMappings[account.email] = firebaseUser.uid;

        // Update display name
        await updateProfile(firebaseUser, {
          displayName: account.name
        });

        // Create user document in Firestore
        const userData: User = {
          id: firebaseUser.uid,
          name: account.name,
          email: account.email,
          role: account.role,
          phone: account.phone,
          profileCompleted: true,
          createdAt: new Date().toISOString(),
          // Add role-specific fields
          ...(account.role === 'operator' && {
            operatorId: account.operatorId,
            accountStatus: 'active' as const
          }),
          ...(account.role === 'student' && {
            rollNumber: account.rollNumber,
            gender: account.gender,
            hostel: account.hostel,
            room: account.room
          })
        };

        await setDoc(doc(db, 'users', firebaseUser.uid), userData);

        console.log(`✅ Created ${account.role} account: ${account.email}`);

      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err.code === 'auth/email-already-in-use') {
          console.log(`⚠️ Account ${account.email} already exists, skipping account creation...`);

          // Try to get existing user ID for mapping
          try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('email', '==', account.email));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
              userIdMappings[account.email] = querySnapshot.docs[0].id;
            }
          } catch (mappingError) {
            console.warn(`Could not get user ID mapping for ${account.email}:`, mappingError);
          }
        } else if (err.code === 'auth/too-many-requests' || err.message?.includes('too-many-requests')) {
          console.log(`⏳ Rate limited for ${account.email}, waiting 10 seconds before continuing...`);
          // Wait 10 seconds and continue (don't retry this account)
          await new Promise(resolve => setTimeout(resolve, 10000));
          console.log(`⏳ Continuing with next account...`);
        } else {
          console.error(`❌ Failed to create account for ${account.email}:`, error);
        }
      }
    }

    console.log('📝 Demo accounts creation completed!');
  } else {
    console.log('\n⏭️ Skipping demo account creation...');

    // Get existing user ID mappings
    console.log('Getting existing user ID mappings...');
    for (const account of demoAccounts) {
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', account.email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          userIdMappings[account.email] = querySnapshot.docs[0].id;
        }
      } catch (mappingError) {
        console.warn(`Could not get user ID mapping for ${account.email}:`, mappingError);
      }
    }
  }

  // Create additional mock data regardless of account creation success
  console.log('\n🏭 Creating mock data...');
  
  // Check if mock data already exists
  try {
    const machinesQuery = query(collection(db, 'machines'), limit(1));
    const machinesSnapshot = await getDocs(machinesQuery);
    if (!machinesSnapshot.empty && !forceRecreateMockData) {
      console.log('⚠️ Mock data already exists, skipping creation');
      return;
    } else if (!machinesSnapshot.empty && forceRecreateMockData) {
      console.log('🔄 Force recreating mock data...');
    }
  } catch (error) {
    console.warn('Error checking existing mock data:', error);
  }
  
  try {
    await createMockMachines(forceRecreateMockData);
    await createMockQRCodes(userIdMappings, forceRecreateMockData);
    await createMockLaundryOrders(userIdMappings, forceRecreateMockData);
    await createMockLostFound(forceRecreateMockData);
    await createMockSupportTickets(forceRecreateMockData);
    await createMockFeedback(forceRecreateMockData);
    await createMockAnnouncements();
    await createMockLaundrySessions(forceRecreateMockData);
    await createMockLaundryInsights();
    await createMockLaundryReceipts(forceRecreateMockData);
    await createMockDeviceSessions();
    await createMockLaundrySetups();
    await createMockMissedPickups(forceRecreateMockData);
    await createMockOperatorPerformance();
    await createMockOperatorSchedules();
    await createMockOperatorTasks();
    await createMockOperatorMaintenanceLogs();
    await createMockOperatorTimeTracking();
    await createMockLaundryItems(userIdMappings, forceRecreateMockData);

    console.log('\n🎉 Demo data creation completed successfully!');
    console.log('You can now login with:');
    console.log('Admin: admin@laundryhub.com / admin123');
    console.log('Operator: operator@laundryhub.com / operator123');
    console.log('Student: student@laundryhub.com / student123');

  } catch (error) {
    console.error('❌ Error creating mock data:', error);
    console.log('💡 Try refreshing the page and running createDemoAccounts() again');
  }
}

// Create mock machines
async function createMockMachines(forceRecreate: boolean = false) {
  console.log('Creating mock machines...');

  // Check if machines already exist
  try {
    const machinesQuery = query(collection(db, 'machines'), limit(1));
    const machinesSnapshot = await getDocs(machinesQuery);
    if (!machinesSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Machines already exist, skipping creation');
      return;
    } else if (!machinesSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating machines...');
    }
  } catch (error) {
    console.warn('Error checking existing machines:', error);
  }

  const machines = [
    {
      id: 'machine_001',
      name: 'Washer 1',
      type: 'washer',
      status: 'available',
      location: 'Ground Floor - Laundry Room A',
      capacity: '8kg',
      lastMaintenance: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'machine_002',
      name: 'Washer 2',
      type: 'washer',
      status: 'in-use',
      location: 'Ground Floor - Laundry Room A',
      capacity: '8kg',
      currentQR: 'QR-2024-002',
      lastMaintenance: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'machine_003',
      name: 'Washer 3',
      type: 'washer',
      status: 'in-use',
      location: 'Ground Floor - Laundry Room B',
      capacity: '10kg',
      currentQR: 'QR-2024-005',
      lastMaintenance: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'machine_004',
      name: 'Dryer 1',
      type: 'dryer',
      status: 'available',
      location: 'Ground Floor - Laundry Room A',
      capacity: '8kg',
      lastMaintenance: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'machine_005',
      name: 'Dryer 2',
      type: 'dryer',
      status: 'maintenance',
      location: 'Ground Floor - Laundry Room A',
      capacity: '8kg',
      lastMaintenance: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'machine_006',
      name: 'Dryer 3',
      type: 'dryer',
      status: 'available',
      location: 'Ground Floor - Laundry Room B',
      capacity: '10kg',
      lastMaintenance: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  for (const machine of machines) {
    try {
      await setDoc(doc(db, 'machines', machine.id), machine);
      console.log(`✅ Created machine: ${machine.name}`);
    } catch (error) {
      console.error(`❌ Failed to create machine ${machine.name}:`, error);
    }
  }
}

// Create mock QR codes
async function createMockQRCodes(userIdMappings: { [email: string]: string }, forceRecreate: boolean = false) {
  console.log('Creating mock QR codes...');

  // Check if QR codes already exist
  try {
    const qrQuery = query(collection(db, 'qrCodes'), limit(1));
    const qrSnapshot = await getDocs(qrQuery);
    if (!qrSnapshot.empty && !forceRecreate) {
      console.log('⚠️ QR codes already exist, skipping creation');
      return;
    } else if (!qrSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating QR codes...');
    }
  } catch (error) {
    console.warn('Error checking existing QR codes:', error);
  }

  const qrCodes = [
    {
      id: 'qr_001',
      code: 'QR-2024-001',
      status: 'assigned',
      assignedTo: userIdMappings['student@laundryhub.com'] || 'student_001', // Will be updated with actual user ID
      assignedToName: 'Demo Student',
      assignedBy: userIdMappings['operator@laundryhub.com'] || 'operator_001', // Will be updated with actual user ID
      assignedByName: 'Operator John',
      assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'qr_002',
      code: 'QR-2024-002',
      status: 'assigned',
      assignedTo: userIdMappings['alice@vitap.ac.in'] || 'student_002', // Alice Johnson (alice@vitap.ac.in)
      assignedToName: 'Alice Johnson',
      assignedBy: userIdMappings['operator@laundryhub.com'] || 'operator_001',
      assignedByName: 'Operator John',
      assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'qr_003',
      code: 'QR-2024-003',
      status: 'available',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'qr_004',
      code: 'QR-2024-004',
      status: 'available',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'qr_005',
      code: 'QR-2024-005',
      status: 'assigned',
      assignedTo: userIdMappings['bob@vitap.ac.in'] || 'student_003', // Bob Smith
      assignedToName: 'Bob Smith',
      assignedBy: userIdMappings['operator2@laundryhub.com'] || 'operator_002',
      assignedByName: 'Mike Chen',
      assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  for (const qrCode of qrCodes) {
    try {
      await setDoc(doc(db, 'qrCodes', qrCode.id), qrCode);
      console.log(`✅ Created QR code: ${qrCode.code}`);
    } catch (error) {
      console.error(`❌ Failed to create QR code ${qrCode.code}:`, error);
    }
  }
}

// Create mock laundry orders
async function createMockLaundryOrders(userIdMappings: { [email: string]: string }, forceRecreate: boolean = false) {
  console.log('Creating mock laundry orders...');

  // Check if orders already exist
  try {
    const ordersQuery = query(collection(db, 'laundryOrders'), limit(1));
    const ordersSnapshot = await getDocs(ordersQuery);
    if (!ordersSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Laundry orders already exist, skipping creation');
      return;
    } else if (!ordersSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating laundry orders...');
    }
  } catch (error) {
    console.warn('Error checking existing orders:', error);
  }

  const orders = [
    {
      id: 'order_001',
      studentId: userIdMappings['student@laundryhub.com'] || 'student_001', // Demo Student (student@laundryhub.com)
      studentName: 'Demo Student',
      qrCode: 'QR-2024-001',
      bagQRCode: 'BAG-2024-001',
      bagId: 'bag_001',
      items: ['5 Cotton T-shirts', '2 Jeans', '3 Underwear'],
      status: 'delivered',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_001',
      machineName: 'Washer 1',
      totalCost: 45.00,
      paymentStatus: 'paid',
      studentNotes: 'Please be careful with the jeans - they have delicate embroidery.',
      bagPhoto: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_002',
      studentId: userIdMappings['alice@vitap.ac.in'] || 'student_002', // Alice Johnson (alice@vitap.ac.in)
      studentName: 'Alice Johnson',
      qrCode: 'QR-2024-002',
      bagQRCode: 'BAG-2024-002',
      bagId: 'bag_002',
      items: ['3 Wool Sweaters', '2 Silk Blouses'],
      status: 'washing',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_002',
      machineName: 'Washer 2',
      totalCost: 35.00,
      paymentStatus: 'paid',
      specialInstructions: 'Handle with care - delicate fabrics',
      studentNotes: 'Please use gentle cycle for wool items. They are my favorite sweaters.',
      bagPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_003',
      studentId: 'student_003', // Bob Smith
      studentName: 'Bob Smith',
      qrCode: 'QR-2024-005',
      bagQRCode: 'BAG-2024-003',
      bagId: 'bag_003',
      items: ['4 Gym T-shirts', '2 Shorts', '1 Towel'],
      status: 'ready',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      machineId: 'machine_003',
      machineName: 'Washer 3',
      totalCost: 25.00,
      paymentStatus: 'paid',
      studentNotes: 'These are my gym clothes - please make sure they are completely dry before folding.',
      bagPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_004',
      studentId: 'student_004', // Carol Davis
      studentName: 'Carol Davis',
      qrCode: 'QR-2024-006',
      bagQRCode: 'BAG-2024-004',
      bagId: 'bag_004',
      items: ['6 Bed Sheets', '4 Pillowcases', '2 Towels'],
      status: 'picked_up',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      totalCost: 55.00,
      paymentStatus: 'paid',
      studentNotes: 'These are my dorm bedding. Please wash thoroughly.',
      bagPhoto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_005',
      studentId: 'student_005', // Dave Wilson
      studentName: 'Dave Wilson',
      qrCode: 'QR-2024-007',
      bagQRCode: 'BAG-2024-005',
      bagId: 'bag_005',
      items: ['2 Formal Shirts', '1 Blazer', '3 Pairs of Socks'],
      status: 'submitted',
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      totalCost: 40.00,
      paymentStatus: 'pending',
      studentNotes: 'Formal wear for an important event. Please handle carefully.',
      bagPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_006',
      studentId: 'student_001', // Demo Student
      studentName: 'Demo Student',
      qrCode: 'QR-2024-008',
      bagQRCode: 'BAG-2024-006',
      bagId: 'bag_006',
      items: ['2 Bed Sheets', '2 Pillowcases', '1 Duvet Cover', '4 Towels'],
      status: 'ready',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 90 * 60 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      machineId: 'machine_001',
      machineName: 'Washer 1',
      totalCost: 45.00,
      paymentStatus: 'paid',
      studentNotes: 'These are new bedding items - please use gentle cycle.',
      bagPhoto: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_007',
      studentId: 'student_004', // Carol Davis
      studentName: 'Carol Davis',
      qrCode: 'QR-2024-009',
      bagQRCode: 'BAG-2024-007',
      bagId: 'bag_007',
      items: ['3 Sweaters', '2 Skirts', '1 Blouse'],
      status: 'washing',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_003',
      machineName: 'Washer 3',
      totalCost: 35.00,
      paymentStatus: 'paid',
      specialInstructions: 'Delicate cycle required - wool and silk items',
      studentNotes: 'These are my favorite winter clothes. Please handle with extra care.',
      bagPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_008',
      studentId: 'student_002', // Alice Johnson
      studentName: 'Alice Johnson',
      qrCode: 'QR-2024-010',
      bagQRCode: 'BAG-2024-008',
      bagId: 'bag_008',
      items: ['5 T-shirts', '3 Shorts', '2 Sports Bras', '4 Pairs of Socks'],
      status: 'picked_up',
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 90 * 60 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      machineId: 'machine_004',
      machineName: 'Dryer 2',
      totalCost: 40.00,
      paymentStatus: 'paid',
      studentNotes: 'Gym clothes - please make sure they are completely dry.',
      bagPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_009',
      studentId: 'student_003', // Bob Smith
      studentName: 'Bob Smith',
      qrCode: 'QR-2024-011',
      bagQRCode: 'BAG-2024-009',
      bagId: 'bag_009',
      items: ['4 Polo Shirts', '2 Chinos', '1 Belt'],
      status: 'ready',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 90 * 60 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      machineId: 'machine_002',
      machineName: 'Washer 2',
      totalCost: 30.00,
      paymentStatus: 'paid',
      studentNotes: 'Work clothes - please ensure no wrinkles.',
      bagPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'order_010',
      studentId: 'student_005', // Dave Wilson
      studentName: 'Dave Wilson',
      qrCode: 'QR-2024-012',
      bagQRCode: 'BAG-2024-010',
      bagId: 'bag_010',
      items: ['6 White Shirts', '2 Black Pants', '4 Ties'],
      status: 'delivered',
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 90 * 60 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_005',
      machineName: 'Washer 3',
      totalCost: 50.00,
      paymentStatus: 'paid',
      specialInstructions: 'Separate whites from darks, no starch on shirts',
      studentNotes: 'Formal wear for interviews - please be very careful.',
      bagPhoto: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center'
    }
  ];

  for (const order of orders) {
    try {
      await setDoc(doc(db, 'laundryOrders', order.id), order);
      console.log(`✅ Created laundry order: ${order.id}`);
    } catch (error) {
      console.error(`❌ Failed to create order ${order.id}:`, error);
    }
  }
}

// Create mock lost/found items
async function createMockLostFound(forceRecreate: boolean = false) {
  console.log('Creating mock lost/found items...');

  // Check if lost/found items already exist
  try {
    const lostFoundQuery = query(collection(db, 'lostFound'), limit(1));
    const lostFoundSnapshot = await getDocs(lostFoundQuery);
    if (!lostFoundSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Lost/found items already exist, skipping creation');
      return;
    } else if (!lostFoundSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating lost/found items...');
    }
  } catch (error) {
    console.warn('Error checking existing lost/found items:', error);
  }

  const lostFoundItems = [
    {
      id: 'lost_001',
      description: 'Blue hoodie with university logo',
      reportedBy: 'student_001',
      reportedByName: 'Rajesh Kumar',
      hostel: 'MH-A',
      visible: true,
      status: 'reported',
      priority: 'high',
      location: 'Laundry Room MH-A',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      photo: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop&crop=center',
      studentDetails: null
    },
    {
      id: 'lost_002',
      description: 'Black wallet with student ID',
      reportedBy: 'student_002',
      reportedByName: 'Priya Sharma',
      hostel: 'MH-B',
      visible: true,
      status: 'approved',
      priority: 'medium',
      location: 'Sorting Area MH-B',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      foundAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      foundBy: 'operator_001',
      foundByName: 'Operator John',
      photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Amit Singh',
        studentId: 'STU2024001',
        roomNumber: 'MH-B-205',
        contactNumber: '+91-9876543210',
        email: 'amit.singh@university.edu'
      }
    },
    {
      id: 'lost_003',
      description: 'White socks (pair)',
      reportedBy: 'student_003',
      reportedByName: 'Rajesh Kumar',
      hostel: 'LH-A',
      visible: true,
      status: 'returned',
      priority: 'low',
      location: 'Dryer Area LH-A',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      foundAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      foundBy: 'operator_002',
      foundByName: 'Priya Sharma',
      claimedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      claimedBy: 'student_003',
      claimedByName: 'Rajesh Kumar',
      photo: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Rajesh Kumar',
        studentId: 'STU2024002',
        roomNumber: 'LH-A-101',
        contactNumber: '+91-9876543211',
        email: 'rajesh.kumar@university.edu'
      },
      notes: [
        {
          id: 'note_001',
          content: 'Socks found in dryer lint trap',
          createdBy: 'Priya Sharma',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'lost_004',
      description: 'Set of keys with red keychain',
      reportedBy: 'student_004',
      reportedByName: 'Priya Sharma',
      hostel: 'MH-A',
      visible: true,
      status: 'reported',
      priority: 'high',
      location: 'Washing Machine Filter MH-A',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      photo: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Kavita Jain',
        studentId: 'STU2024004',
        roomNumber: 'MH-A-405',
        contactNumber: '+91-9876543213',
        email: 'kavita.jain@university.edu'
      }
    },
    {
      id: 'lost_005',
      description: 'Red water bottle with motivational quote',
      reportedBy: 'student_005',
      reportedByName: 'Rajesh Kumar',
      hostel: 'MH-B',
      visible: true,
      status: 'approved',
      priority: 'medium',
      location: 'Lost and Found Box MH-B',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      foundAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      foundBy: 'operator_001',
      foundByName: 'Operator John',
      photo: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Sneha Patel',
        studentId: 'STU2024005',
        roomNumber: 'MH-B-312',
        contactNumber: '+91-9876543214',
        email: 'sneha.patel@university.edu'
      }
    },
    {
      id: 'lost_006',
      description: 'Black umbrella',
      reportedBy: 'student_006',
      reportedByName: 'Priya Sharma',
      hostel: 'LH-A',
      visible: true,
      status: 'found',
      priority: 'low',
      location: 'Lost and Found Box LH-A',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      foundAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      foundBy: 'operator_002',
      foundByName: 'Priya Sharma',
      photo: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=400&h=300&fit=crop&crop=center',
      studentDetails: null
    },
    {
      id: 'lost_007',
      description: 'Blue jeans with holes',
      reportedBy: 'student_007',
      reportedByName: 'Rajesh Kumar',
      hostel: 'MH-A',
      visible: true,
      status: 'claimed',
      priority: 'medium',
      location: 'Processing Area MH-A',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      foundAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      foundBy: 'operator_001',
      foundByName: 'Operator John',
      claimedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      claimedBy: 'student_007',
      claimedByName: 'Anjali Gupta',
      photo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Anjali Gupta',
        studentId: 'STU2024006',
        roomNumber: 'MH-A-310',
        contactNumber: '+91-9876543215',
        email: 'anjali.gupta@university.edu'
      },
      notes: [
        {
          id: 'note_002',
          content: 'Student identified the jeans by the holes pattern.',
          createdBy: 'Operator John',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'note_003',
          content: 'Item claimed and returned to student.',
          createdBy: 'Operator John',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'lost_008',
      description: 'White earphones',
      reportedBy: 'student_008',
      reportedByName: 'Priya Sharma',
      hostel: 'MH-B',
      visible: true,
      status: 'rejected',
      priority: 'low',
      location: 'Facility Storage MH-B',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      photo: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Rohit Kumar',
        studentId: 'STU2024007',
        roomNumber: 'MH-B-412',
        contactNumber: '+91-9876543216',
        email: 'rohit.kumar@university.edu'
      },
      notes: [
        {
          id: 'note_004',
          content: 'Item identified as facility property. Claim rejected.',
          createdBy: 'Operator John',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'lost_009',
      description: 'Green scarf',
      reportedBy: 'student_009',
      reportedByName: 'Rajesh Kumar',
      hostel: 'LH-A',
      visible: true,
      status: 'reported',
      priority: 'medium',
      location: 'Laundry Counter LH-A',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      photo: 'https://images.unsplash.com/photo-1601762603332-db5e4b90cca7?w=400&h=300&fit=crop&crop=center',
      studentDetails: null
    },
    {
      id: 'lost_010',
      description: 'Brown leather belt',
      reportedBy: 'student_010',
      reportedByName: 'Priya Sharma',
      hostel: 'MH-A',
      visible: true,
      status: 'approved',
      priority: 'high',
      location: 'Lost Property Office',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      reportedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      foundAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      foundBy: 'operator_001',
      foundByName: 'Operator John',
      photo: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&crop=center',
      studentDetails: {
        name: 'Vikram Singh',
        studentId: 'STU2024008',
        roomNumber: 'MH-A-201',
        contactNumber: '+91-9876543217',
        email: 'vikram.singh@university.edu'
      }
    }
  ];

  for (const item of lostFoundItems) {
    try {
      await setDoc(doc(db, 'lostFound', item.id), item);
      console.log(`✅ Created ${item.status} item: ${item.description}`);
    } catch (error) {
      console.error(`❌ Failed to create ${item.status} item ${item.description}:`, error);
    }
  }
}

// Create mock support tickets
async function createMockSupportTickets(forceRecreate: boolean = false) {
  console.log('Creating mock support tickets...');

  // Check if support tickets already exist
  try {
    const ticketsQuery = query(collection(db, 'supportTickets'), limit(1));
    const ticketsSnapshot = await getDocs(ticketsQuery);
    if (!ticketsSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Support tickets already exist, skipping creation');
      return;
    } else if (!ticketsSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating support tickets...');
    }
  } catch (error) {
    console.warn('Error checking existing support tickets:', error);
  }

  const supportTickets = [
    {
      id: 'ticket_001',
      title: 'Machine not working properly',
      description: 'Washer 2 is making strange noises during the spin cycle. Please check.',
      category: 'machine_issue',
      priority: 'high',
      status: 'resolved',
      createdBy: 'student_001',
      createdByName: 'Demo Student',
      createdByRole: 'student',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'operator_001',
      assignedToName: 'Operator John',
      assignedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      resolution: 'Fixed belt tension and lubricated bearings. Machine is now working properly.',
      messages: [
        {
          id: 'msg_001',
          senderId: 'student_001',
          senderName: 'Demo Student',
          senderRole: 'student',
          message: 'Washer 2 is making strange noises during the spin cycle. Please check.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_002',
          senderId: 'operator_001',
          senderName: 'Operator John',
          senderRole: 'operator',
          message: 'I\'ll check the machine and get back to you.',
          timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_003',
          senderId: 'operator_001',
          senderName: 'Operator John',
          senderRole: 'operator',
          message: 'Fixed the issue. The belt was loose. Machine is working properly now.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'ticket_002',
      title: 'Lost laundry bag',
      description: 'I submitted my laundry 2 days ago but haven\'t received it back yet. Bag QR: BAG-2024-001',
      category: 'lost_laundry',
      priority: 'medium',
      status: 'in_progress',
      createdBy: 'student_002',
      createdByName: 'Alice Johnson',
      createdByRole: 'student',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'operator_002',
      assignedToName: 'Mike Chen',
      assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg_004',
          senderId: 'student_002',
          senderName: 'Alice Johnson',
          senderRole: 'student',
          message: 'I submitted my laundry 2 days ago but haven\'t received it back yet. Bag QR: BAG-2024-001',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_005',
          senderId: 'operator_002',
          senderName: 'Mike Chen',
          senderRole: 'operator',
          message: 'I\'m investigating this. Let me check the system records.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'ticket_003',
      title: 'Request for detergent change',
      description: 'I have sensitive skin and would like hypoallergenic detergent to be used for my laundry.',
      category: 'special_request',
      priority: 'low',
      status: 'open',
      createdBy: 'student_003',
      createdByName: 'Bob Smith',
      createdByRole: 'student',
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg_006',
          senderId: 'student_003',
          senderName: 'Bob Smith',
          senderRole: 'student',
          message: 'I have sensitive skin and would like hypoallergenic detergent to be used for my laundry.',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'ticket_004',
      title: 'Machine maintenance required',
      description: 'Washer 3 is making unusual noises during spin cycle. Needs immediate attention.',
      category: 'machine_issue',
      priority: 'high',
      status: 'resolved',
      createdBy: 'operator_001',
      createdByName: 'Operator John',
      createdByRole: 'operator',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'operator_002',
      assignedToName: 'Mike Chen',
      assignedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      resolution: 'Replaced worn bearings and balanced the drum. Machine tested and working normally.',
      messages: [
        {
          id: 'msg_007',
          senderId: 'operator_001',
          senderName: 'Operator John',
          senderRole: 'operator',
          message: 'Washer 3 is making unusual noises during spin cycle. Needs immediate attention.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_008',
          senderId: 'operator_002',
          senderName: 'Mike Chen',
          senderRole: 'operator',
          message: 'I\'ll take a look at it right away. This sounds like a bearing issue.',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_009',
          senderId: 'operator_002',
          senderName: 'Mike Chen',
          senderRole: 'operator',
          message: 'Fixed the issue - replaced worn bearings and balanced the drum. Machine is now working properly.',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'ticket_005',
      title: 'Supply shortage - detergent',
      description: 'Running low on regular detergent. Need to restock before next shift.',
      category: 'inventory',
      priority: 'medium',
      status: 'resolved',
      createdBy: 'operator_003',
      createdByName: 'Lisa Rodriguez',
      createdByRole: 'operator',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'admin_001',
      assignedToName: 'Admin User',
      assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      resolution: 'Ordered 50 gallons of detergent. Delivery expected tomorrow.',
      messages: [
        {
          id: 'msg_010',
          senderId: 'operator_003',
          senderName: 'Lisa Rodriguez',
          senderRole: 'operator',
          message: 'Running low on regular detergent. Need to restock before next shift.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_011',
          senderId: 'admin_001',
          senderName: 'Admin User',
          senderRole: 'admin',
          message: 'I\'ll place an order immediately. We should have enough for today.',
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString()
        }
      ]
    },
    {
      id: 'ticket_006',
      title: 'Safety concern - wet floor',
      description: 'Spillage in Laundry Room A creating safety hazard. Floor is very slippery.',
      category: 'safety',
      priority: 'high',
      status: 'resolved',
      createdBy: 'operator_002',
      createdByName: 'Mike Chen',
      createdByRole: 'operator',
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      assignedTo: 'operator_001',
      assignedToName: 'Operator John',
      assignedAt: new Date(Date.now() - 4 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      resolution: 'Cleaned up the spillage and placed warning signs. Floor is now safe.',
      messages: [
        {
          id: 'msg_012',
          senderId: 'operator_002',
          senderName: 'Mike Chen',
          senderRole: 'operator',
          message: 'Spillage in Laundry Room A creating safety hazard. Floor is very slippery.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'msg_013',
          senderId: 'operator_001',
          senderName: 'Operator John',
          senderRole: 'operator',
          message: 'On it! I\'ll clean it up immediately and put out warning signs.',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString()
        }
      ]
    }
  ];

  for (const ticket of supportTickets) {
    try {
      await setDoc(doc(db, 'supportTickets', ticket.id), ticket);
      console.log(`✅ Created support ticket: ${ticket.title}`);
    } catch (error) {
      console.error(`❌ Failed to create support ticket ${ticket.title}:`, error);
    }
  }
}

// Create mock feedback
async function createMockFeedback(forceRecreate: boolean = false) {
  console.log('Creating mock feedback...');

  // Check if feedback already exists
  try {
    const feedbackQuery = query(collection(db, 'feedback'), limit(1));
    const feedbackSnapshot = await getDocs(feedbackQuery);
    if (!feedbackSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Feedback already exists, skipping creation');
      return;
    } else if (!feedbackSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating feedback...');
    }
  } catch (error) {
    console.warn('Error checking existing feedback:', error);
  }

  const feedback = [
    {
      id: 'feedback_001',
      rating: 5,
      comment: 'Excellent service! My clothes came back perfectly clean and folded. The staff was very professional.',
      category: 'service_quality',
      submittedBy: 'student_001',
      submittedByName: 'Demo Student',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      orderId: 'order_001',
      isPublic: true
    },
    {
      id: 'feedback_002',
      rating: 4,
      comment: 'Good service overall, but there was a small delay in processing. Still satisfied with the results.',
      category: 'service_quality',
      submittedBy: 'student_002',
      submittedByName: 'Alice Johnson',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      orderId: 'order_002',
      isPublic: true
    },
    {
      id: 'feedback_003',
      rating: 3,
      comment: 'Service is okay, but the machines need better maintenance. One dryer wasn\'t working properly.',
      category: 'machine_quality',
      submittedBy: 'student_003',
      submittedByName: 'Bob Smith',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      isPublic: true
    },
    {
      id: 'feedback_004',
      rating: 5,
      comment: 'Great app interface and easy to track orders. Keep up the good work!',
      category: 'app_experience',
      submittedBy: 'student_004',
      submittedByName: 'Carol Davis',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      isPublic: true
    },
    {
      id: 'feedback_005',
      rating: 4,
      comment: 'The QR code system works well and makes tracking easy. Minor suggestion: add more detailed status updates.',
      category: 'app_experience',
      submittedBy: 'student_005',
      submittedByName: 'Dave Wilson',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      isPublic: true
    },
    // Operator feedback (feedback about operators)
    {
      id: 'feedback_006',
      rating: 5,
      comment: 'Operator John was extremely helpful and professional. He handled my delicate clothes with great care.',
      category: 'operator_service',
      submittedBy: 'student_001',
      submittedByName: 'Demo Student',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      isPublic: true
    },
    {
      id: 'feedback_007',
      rating: 4,
      comment: 'Mike is very efficient and always keeps the laundry room clean. Great work!',
      category: 'operator_service',
      submittedBy: 'student_002',
      submittedByName: 'Alice Johnson',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      isPublic: true
    },
    {
      id: 'feedback_008',
      rating: 5,
      comment: 'Lisa goes above and beyond. She noticed a stain on my shirt and treated it specially. Thank you!',
      category: 'operator_service',
      submittedBy: 'student_004',
      submittedByName: 'Carol Davis',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      isPublic: true
    },
    {
      id: 'feedback_009',
      rating: 3,
      comment: 'The operator was okay, but there was some confusion about my special instructions.',
      category: 'operator_service',
      submittedBy: 'student_003',
      submittedByName: 'Bob Smith',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      isPublic: false
    },
    {
      id: 'feedback_010',
      rating: 5,
      comment: 'Excellent customer service from the operator team. They make laundry day much better!',
      category: 'operator_service',
      submittedBy: 'student_005',
      submittedByName: 'Dave Wilson',
      submittedByRole: 'student',
      submittedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      isPublic: true
    }
  ];

  for (const item of feedback) {
    try {
      await setDoc(doc(db, 'feedback', item.id), item);
      console.log(`✅ Created feedback from: ${item.submittedByName}`);
    } catch (error) {
      console.error(`❌ Failed to create feedback from ${item.submittedByName}:`, error);
    }
  }
}

// Create mock announcements
async function createMockAnnouncements() {
  console.log('Creating mock announcements...');

  const announcements = [
    {
      id: 'announcement_001',
      title: 'Holiday Schedule Update',
      message: 'Due to the upcoming holidays, laundry services will be available 24/7 from December 20th to January 5th. Extended hours for your convenience!',
      active: true,
      hostel: null, // All hostels
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin_001',
      priority: 'high'
    },
    {
      id: 'announcement_002',
      title: 'New Eco-Friendly Detergent',
      message: 'We\'ve switched to biodegradable, eco-friendly detergents starting this week. Your laundry will be just as clean but much better for the environment!',
      active: true,
      hostel: null,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin_001',
      priority: 'medium'
    },
    {
      id: 'announcement_003',
      title: 'MH-A Laundry Room Maintenance',
      message: 'The MH-A laundry room will be closed for maintenance on Friday from 2 PM to 6 PM. We apologize for any inconvenience.',
      active: true,
      hostel: 'MH-A',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin_002',
      priority: 'high'
    },
    {
      id: 'announcement_004',
      title: 'Student Feedback Survey',
      message: 'Help us improve our services! Take our 2-minute survey about your laundry experience. Winners will receive a free laundry service.',
      active: false, // Expired
      hostel: null,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      createdBy: 'admin_001',
      priority: 'low'
    }
  ];

  for (const announcement of announcements) {
    try {
      await setDoc(doc(db, 'announcements', announcement.id), announcement);
      console.log(`✅ Created announcement: ${announcement.title}`);
    } catch (error) {
      console.error(`❌ Failed to create announcement ${announcement.title}:`, error);
    }
  }
}

// Create mock laundry sessions
async function createMockLaundrySessions(forceRecreate: boolean = false) {
  console.log('Creating mock laundry sessions...');

  // Check if laundry sessions already exist
  try {
    const sessionsQuery = query(collection(db, 'laundrySessions'), limit(1));
    const sessionsSnapshot = await getDocs(sessionsQuery);
    if (!sessionsSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Laundry sessions already exist, skipping creation');
      return;
    } else if (!sessionsSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating laundry sessions...');
    }
  } catch (error) {
    console.warn('Error checking existing laundry sessions:', error);
  }

  const sessions = [
    {
      id: 'session_001',
      studentId: 'student_001',
      machineId: 'machine_001',
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      endTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      status: 'completed',
      cost: 15.00,
      notes: 'Standard wash cycle completed successfully'
    },
    {
      id: 'session_002',
      studentId: 'student_002',
      machineId: 'machine_002',
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      status: 'active',
      cost: 12.00,
      notes: 'Currently running gentle cycle'
    },
    {
      id: 'session_003',
      studentId: 'student_003',
      machineId: 'machine_004',
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      endTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      status: 'completed',
      cost: 8.00,
      notes: 'Quick dry cycle for gym clothes'
    },
    {
      id: 'session_004',
      studentId: 'student_004',
      machineId: 'machine_003',
      startTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      status: 'completed',
      cost: 18.00,
      notes: 'Heavy load wash cycle'
    },
    {
      id: 'session_005',
      studentId: 'student_005',
      machineId: 'machine_005',
      startTime: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      status: 'cancelled',
      cost: 0.00,
      notes: 'Machine maintenance required - session cancelled'
    }
  ];

  for (const session of sessions) {
    try {
      await setDoc(doc(db, 'laundrySessions', session.id), session);
      console.log(`✅ Created laundry session: ${session.id}`);
    } catch (error) {
      console.error(`❌ Failed to create laundry session ${session.id}:`, error);
    }
  }
}

// Create mock laundry insights
async function createMockLaundryInsights() {
  console.log('Creating mock laundry insights...');

  const insights = [
    {
      id: 'insights_2024_12',
      month: '2024-12',
      totalWashes: 245,
      peakDay: 'Wednesday',
      averageItems: 8.5,
      commonTags: ['Cotton', 'T-shirts', 'Jeans', 'Towels'],
      totalSpent: 1250.00,
      ecoImpact: 'Saved 125kg of CO2 emissions',
      topStudents: ['student_001', 'student_002', 'student_003'],
      machineUtilization: {
        'machine_001': 85,
        'machine_002': 78,
        'machine_003': 92,
        'machine_004': 67
      }
    },
    {
      id: 'insights_2024_11',
      month: '2024-11',
      totalWashes: 289,
      peakDay: 'Friday',
      averageItems: 7.8,
      commonTags: ['Bedding', 'Winter Clothes', 'Towels'],
      totalSpent: 1450.00,
      ecoImpact: 'Saved 145kg of CO2 emissions',
      topStudents: ['student_002', 'student_004', 'student_001'],
      machineUtilization: {
        'machine_001': 88,
        'machine_002': 82,
        'machine_003': 95,
        'machine_004': 71
      }
    }
  ];

  for (const insight of insights) {
    try {
      await setDoc(doc(db, 'laundryInsights', insight.id), insight);
      console.log(`✅ Created laundry insights for: ${insight.month}`);
    } catch (error) {
      console.error(`❌ Failed to create laundry insights for ${insight.month}:`, error);
    }
  }
}

// Create mock laundry receipts
async function createMockLaundryReceipts(forceRecreate: boolean = false) {
  console.log('Creating mock laundry receipts...');

  // Check if laundry receipts already exist
  try {
    const receiptsQuery = query(collection(db, 'laundryReceipts'), limit(1));
    const receiptsSnapshot = await getDocs(receiptsQuery);
    if (!receiptsSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Laundry receipts already exist, skipping creation');
      return;
    } else if (!receiptsSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating laundry receipts...');
    }
  } catch (error) {
    console.warn('Error checking existing laundry receipts:', error);
  }

  const receipts = [
    {
      id: 'receipt_001',
      laundryId: 'order_001',
      qrId: 'QR-2024-001',
      pickupDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickupTime: '14:30',
      operatorName: 'John D.',
      items: ['5 Cotton T-shirts', '2 Jeans', '3 Underwear'],
      totalItems: 10,
      specialInstructions: 'Handle with care - delicate embroidery',
      conditionPhotos: [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
      ],
      totalCost: 45.00,
      paymentMethod: 'Digital Wallet',
      feedback: {
        id: 'feedback_001',
        rating: 5,
        comment: 'Excellent service! My clothes came back perfectly clean and folded.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      id: 'receipt_002',
      laundryId: 'order_003',
      qrId: 'QR-2024-005',
      pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      pickupTime: '16:45',
      operatorName: 'Mike C.',
      items: ['4 Gym T-shirts', '2 Shorts', '1 Towel'],
      totalItems: 7,
      conditionPhotos: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
      ],
      totalCost: 25.00,
      paymentMethod: 'Cash',
      feedback: {
        id: 'feedback_003',
        rating: 3,
        comment: 'Service is okay, but the machines need better maintenance.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    }
  ];

  for (const receipt of receipts) {
    try {
      await setDoc(doc(db, 'laundryReceipts', receipt.id), receipt);
      console.log(`✅ Created laundry receipt: ${receipt.id}`);
    } catch (error) {
      console.error(`❌ Failed to create laundry receipt ${receipt.id}:`, error);
    }
  }
}

// Create mock device sessions
async function createMockDeviceSessions() {
  console.log('Creating mock device sessions...');

  const deviceSessions = [
    {
      id: 'device_001',
      userId: 'student_001',
      deviceName: 'iPhone 13 Pro',
      deviceType: 'mobile',
      ipAddress: '192.168.1.100',
      lastActive: new Date().toISOString(),
      isCurrent: true,
      location: 'MH-A Block',
      browserInfo: 'Safari Mobile'
    },
    {
      id: 'device_002',
      userId: 'student_001',
      deviceName: 'MacBook Pro',
      deviceType: 'desktop',
      ipAddress: '192.168.1.101',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isCurrent: false,
      location: 'Library WiFi',
      browserInfo: 'Chrome 120.0'
    },
    {
      id: 'device_003',
      userId: 'operator_001',
      deviceName: 'Samsung Galaxy S23',
      deviceType: 'mobile',
      ipAddress: '192.168.1.102',
      lastActive: new Date().toISOString(),
      isCurrent: true,
      location: 'Laundry Room A',
      browserInfo: 'Chrome Mobile'
    },
    {
      id: 'device_004',
      userId: 'admin_001',
      deviceName: 'Windows Desktop',
      deviceType: 'desktop',
      ipAddress: '192.168.1.103',
      lastActive: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isCurrent: true,
      location: 'Admin Office',
      browserInfo: 'Edge 120.0'
    }
  ];

  for (const session of deviceSessions) {
    try {
      await setDoc(doc(db, 'deviceSessions', session.id), session);
      console.log(`✅ Created device session: ${session.deviceName}`);
    } catch (error) {
      console.error(`❌ Failed to create device session ${session.deviceName}:`, error);
    }
  }
}

// Create mock laundry setups
async function createMockLaundrySetups() {
  console.log('Creating mock laundry setups...');

  const setups = [
    {
      id: 'setup_001',
      userId: 'student_001',
      name: 'Weekly Basics',
      items: ['5 T-shirts', '3 Pairs of Jeans', '5 Pairs of Socks', '2 Towels'],
      specialInstructions: 'Use gentle cycle for jeans',
      tags: ['basics', 'weekly', 'casual'],
      preferences: {
        gentleWash: true,
        separateWhites: false,
        extraRinse: false,
        dryCleaning: false,
        foldOnly: false,
        noStarch: true
      },
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      usageCount: 12,
      isFavorite: true
    },
    {
      id: 'setup_002',
      userId: 'student_002',
      name: 'Delicate Care',
      items: ['3 Silk Blouses', '2 Wool Sweaters', '1 Cashmere Scarf'],
      specialInstructions: 'Hand wash recommended, but machine wash on gentle cycle',
      tags: ['delicate', 'expensive', 'special-care'],
      preferences: {
        gentleWash: true,
        separateWhites: true,
        extraRinse: true,
        dryCleaning: false,
        foldOnly: true,
        noStarch: true
      },
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      usageCount: 8,
      isFavorite: true
    },
    {
      id: 'setup_003',
      userId: 'student_003',
      name: 'Gym Gear',
      items: ['4 Workout Shirts', '3 Shorts', '2 Sports Bras', '3 Pairs of Socks'],
      specialInstructions: 'Quick wash, no fabric softener',
      tags: ['gym', 'sports', 'quick-wash'],
      preferences: {
        gentleWash: false,
        separateWhites: false,
        extraRinse: false,
        dryCleaning: false,
        foldOnly: false,
        noStarch: false
      },
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      usageCount: 15,
      isFavorite: true
    },
    {
      id: 'setup_004',
      userId: 'student_004',
      name: 'Bedding Bundle',
      items: ['2 Bed Sheets', '2 Pillowcases', '1 Duvet Cover', '2 Towels'],
      specialInstructions: 'Wash in hot water for hygiene',
      tags: ['bedding', 'bulk', 'hygiene'],
      preferences: {
        gentleWash: false,
        separateWhites: true,
        extraRinse: true,
        dryCleaning: false,
        foldOnly: false,
        noStarch: false
      },
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      usageCount: 6,
      isFavorite: true
    }
  ];

  for (const setup of setups) {
    try {
      await setDoc(doc(db, 'laundrySetups', setup.id), setup);
      console.log(`✅ Created laundry setup: ${setup.name}`);
    } catch (error) {
      console.error(`❌ Failed to create laundry setup ${setup.name}:`, error);
    }
  }
}

// Create mock missed pickups
async function createMockMissedPickups(forceRecreate: boolean = false) {
  console.log('Creating mock missed pickups...');

  // Check if missed pickups already exist
  try {
    const missedPickupsQuery = query(collection(db, 'missedPickups'), limit(1));
    const missedPickupsSnapshot = await getDocs(missedPickupsQuery);
    if (!missedPickupsSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Missed pickups already exist, skipping creation');
      return;
    } else if (!missedPickupsSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating missed pickups...');
    }
  } catch (error) {
    console.warn('Error checking existing missed pickups:', error);
  }

  const missedPickups = [
    {
      id: 'missed_001',
      laundryId: 'order_001',
      studentId: 'student_001',
      studentName: 'Demo Student',
      missedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), // 3 hours after ready
      notifiedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'resolved',
      resolution: 'Student picked up laundry the next day',
      penaltyFee: 0.00,
      notificationSent: true
    },
    {
      id: 'missed_002',
      laundryId: 'order_006',
      studentId: 'student_005',
      studentName: 'Dave Wilson',
      missedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      notifiedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      penaltyFee: 5.00,
      notificationSent: true,
      followUpRequired: true
    },
    {
      id: 'missed_003',
      laundryId: 'order_007',
      studentId: 'student_003',
      studentName: 'Bob Smith',
      missedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      notifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      resolvedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'escalated',
      resolution: 'Laundry donated to charity after 48 hours',
      penaltyFee: 10.00,
      notificationSent: true,
      escalatedTo: 'admin_001'
    }
  ];

  for (const missed of missedPickups) {
    try {
      await setDoc(doc(db, 'missedPickups', missed.id), missed);
      console.log(`✅ Created missed pickup: ${missed.id}`);
    } catch (error) {
      console.error(`❌ Failed to create missed pickup ${missed.id}:`, error);
    }
  }
}

// Create mock operator performance data
async function createMockOperatorPerformance() {
  console.log('Creating mock operator performance data...');

  const operatorPerformance = [
    {
      id: 'perf_operator_001',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      month: '2024-12',
      totalOrders: 45,
      completedOrders: 43,
      averageRating: 4.7,
      totalEarnings: 1250.00,
      workingHours: 160,
      efficiency: 95,
      customerSatisfaction: 4.8,
      issuesReported: 2,
      issuesResolved: 2,
      machineMaintenance: 5,
      attendanceRate: 98,
      bonusEarned: 150.00
    },
    {
      id: 'perf_operator_002',
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      month: '2024-12',
      totalOrders: 38,
      completedOrders: 37,
      averageRating: 4.5,
      totalEarnings: 1100.00,
      workingHours: 155,
      efficiency: 92,
      customerSatisfaction: 4.6,
      issuesReported: 1,
      issuesResolved: 1,
      machineMaintenance: 3,
      attendanceRate: 100,
      bonusEarned: 120.00
    },
    {
      id: 'perf_operator_003',
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      month: '2024-12',
      totalOrders: 42,
      completedOrders: 41,
      averageRating: 4.9,
      totalEarnings: 1180.00,
      workingHours: 158,
      efficiency: 97,
      customerSatisfaction: 4.9,
      issuesReported: 0,
      issuesResolved: 0,
      machineMaintenance: 4,
      attendanceRate: 95,
      bonusEarned: 180.00
    }
  ];

  for (const performance of operatorPerformance) {
    try {
      await setDoc(doc(db, 'operatorPerformance', performance.id), performance);
      console.log(`✅ Created operator performance: ${performance.operatorName} - ${performance.month}`);
    } catch (error) {
      console.error(`❌ Failed to create operator performance ${performance.operatorName}:`, error);
    }
  }
}

// Create mock operator schedules
async function createMockOperatorSchedules() {
  console.log('Creating mock operator schedules...');

  const operatorSchedules = [
    {
      id: 'schedule_op001_20241220',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      date: '2024-12-20',
      shift: 'morning',
      startTime: '06:00',
      endTime: '14:00',
      location: 'Laundry Room A',
      status: 'completed',
      tasks: [
        'Machine maintenance and cleaning',
        'Order processing and washing',
        'Customer assistance',
        'Quality control checks'
      ],
      notes: 'All tasks completed successfully. No issues reported.'
    },
    {
      id: 'schedule_op001_20241221',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      date: '2024-12-21',
      shift: 'evening',
      startTime: '14:00',
      endTime: '22:00',
      location: 'Laundry Room A',
      status: 'completed',
      tasks: [
        'Evening shift supervision',
        'Order pickup and delivery',
        'Machine monitoring',
        'End-of-day cleaning'
      ],
      notes: 'Busy evening shift. Handled 15 orders successfully.'
    },
    {
      id: 'schedule_op002_20241220',
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      date: '2024-12-20',
      shift: 'morning',
      startTime: '06:00',
      endTime: '14:00',
      location: 'Laundry Room B',
      status: 'completed',
      tasks: [
        'Machine setup and calibration',
        'Order sorting and processing',
        'Student assistance',
        'Inventory management'
      ],
      notes: 'Completed all morning tasks. Calibrated 3 washers.'
    },
    {
      id: 'schedule_op003_20241220',
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      date: '2024-12-20',
      shift: 'afternoon',
      startTime: '12:00',
      endTime: '20:00',
      location: 'Laundry Room A',
      status: 'active',
      tasks: [
        'Afternoon shift coverage',
        'Quality assurance',
        'Customer service',
        'Special requests handling'
      ],
      notes: 'Currently on duty. Handling special care items.'
    }
  ];

  for (const schedule of operatorSchedules) {
    try {
      await setDoc(doc(db, 'operatorSchedules', schedule.id), schedule);
      console.log(`✅ Created operator schedule: ${schedule.operatorName} - ${schedule.date}`);
    } catch (error) {
      console.error(`❌ Failed to create operator schedule ${schedule.operatorName}:`, error);
    }
  }
}

// Create mock operator tasks
async function createMockOperatorTasks() {
  console.log('Creating mock operator tasks...');

  const operatorTasks = [
    {
      id: 'task_op001_001',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      title: 'Monthly Machine Maintenance',
      description: 'Perform comprehensive maintenance on all washers and dryers in Laundry Room A',
      category: 'maintenance',
      priority: 'high',
      status: 'completed',
      assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(),
      machines: ['machine_001', 'machine_002'],
      notes: 'Cleaned filters, checked belts, lubricated moving parts. All machines operating normally.'
    },
    {
      id: 'task_op002_001',
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      title: 'Inventory Check - Supplies',
      description: 'Check and restock laundry supplies (detergent, fabric softener, bags)',
      category: 'inventory',
      priority: 'medium',
      status: 'in_progress',
      assignedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      notes: 'Currently checking detergent levels. Need to order more eco-friendly detergent.'
    },
    {
      id: 'task_op003_001',
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      title: 'Handle Special Care Order',
      description: 'Process delicate items for student with special requirements',
      category: 'customer_service',
      priority: 'high',
      status: 'completed',
      assignedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      orderId: 'order_002',
      notes: 'Successfully processed wool and silk items with gentle care. Student very satisfied.'
    },
    {
      id: 'task_op001_002',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      title: 'Quality Control Inspection',
      description: 'Inspect all completed orders for quality before delivery',
      category: 'quality_control',
      priority: 'high',
      status: 'pending',
      assignedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
      notes: 'Daily quality check required before end of shift.'
    },
    {
      id: 'task_op002_002',
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      title: 'Clean Laundry Room B',
      description: 'Deep clean Laundry Room B including floors, machines, and common areas',
      category: 'cleaning',
      priority: 'medium',
      status: 'pending',
      assignedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      notes: 'Scheduled deep cleaning for end of week.'
    }
  ];

  for (const task of operatorTasks) {
    try {
      await setDoc(doc(db, 'operatorTasks', task.id), task);
      console.log(`✅ Created operator task: ${task.title}`);
    } catch (error) {
      console.error(`❌ Failed to create operator task ${task.title}:`, error);
    }
  }
}

// Create mock operator maintenance logs
async function createMockOperatorMaintenanceLogs() {
  console.log('Creating mock operator maintenance logs...');

  const maintenanceLogs = [
    {
      id: 'maintenance_001',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_001',
      machineName: 'Washer 1',
      maintenanceType: 'preventive',
      description: 'Monthly preventive maintenance - belt inspection and lubrication',
      performedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 45, // minutes
      partsUsed: ['Lubricant', 'Filter'],
      issuesFound: ['Minor belt wear'],
      issuesFixed: ['Applied lubricant', 'Cleaned filter'],
      nextMaintenanceDue: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      notes: 'Machine running smoothly after maintenance.'
    },
    {
      id: 'maintenance_002',
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      machineId: 'machine_003',
      machineName: 'Dryer 1',
      maintenanceType: 'repair',
      description: 'Fixed dryer heating element malfunction',
      performedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 120, // minutes
      partsUsed: ['Heating Element', 'Thermostat'],
      issuesFound: ['Faulty heating element', 'Temperature sensor issue'],
      issuesFixed: ['Replaced heating element', 'Calibrated thermostat'],
      nextMaintenanceDue: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      notes: 'Dryer now heating properly. Tested with full load.'
    },
    {
      id: 'maintenance_003',
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      machineId: 'machine_002',
      machineName: 'Washer 2',
      maintenanceType: 'preventive',
      description: 'Weekly cleaning and inspection',
      performedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      duration: 30, // minutes
      partsUsed: ['Cleaning Solution'],
      issuesFound: ['Lint buildup in drain'],
      issuesFixed: ['Cleaned drain and filter'],
      nextMaintenanceDue: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      notes: 'Routine maintenance completed. Machine ready for use.'
    },
    {
      id: 'maintenance_004',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_004',
      machineName: 'Dryer 2',
      maintenanceType: 'emergency',
      description: 'Emergency repair - door latch broken',
      performedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      duration: 25, // minutes
      partsUsed: ['Door Latch Assembly'],
      issuesFound: ['Broken door latch mechanism'],
      issuesFixed: ['Replaced door latch assembly'],
      nextMaintenanceDue: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'completed',
      notes: 'Emergency repair completed. Door now latching properly.'
    }
  ];

  for (const log of maintenanceLogs) {
    try {
      await setDoc(doc(db, 'maintenanceLogs', log.id), log);
      console.log(`✅ Created maintenance log: ${log.machineName} - ${log.maintenanceType}`);
    } catch (error) {
      console.error(`❌ Failed to create maintenance log ${log.machineName}:`, error);
    }
  }
}

// Create mock operator time tracking
async function createMockOperatorTimeTracking() {
  console.log('Creating mock operator time tracking...');

  const timeTracking = [
    {
      id: 'time_op001_20241220',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      date: '2024-12-20',
      clockIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
      clockOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
      scheduledHours: 8,
      actualHours: 8,
      breakTime: 30, // minutes
      overtime: 0,
      status: 'completed',
      location: 'Laundry Room A',
      notes: 'Full shift completed. No issues.'
    },
    {
      id: 'time_op002_20241220',
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      date: '2024-12-20',
      clockIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000).toISOString(),
      clockOut: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
      scheduledHours: 8,
      actualHours: 8.5,
      breakTime: 30,
      overtime: 0.5,
      status: 'completed',
      location: 'Laundry Room B',
      notes: 'Stayed extra 30 minutes to complete urgent order.'
    },
    {
      id: 'time_op003_20241220',
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      date: '2024-12-20',
      clockIn: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 12 * 60 * 60 * 1000).toISOString(),
      clockOut: null, // Still working
      scheduledHours: 8,
      actualHours: 4, // Current session
      breakTime: 0,
      overtime: 0,
      status: 'active',
      location: 'Laundry Room A',
      notes: 'Currently on afternoon shift.'
    },
    {
      id: 'time_op001_20241221',
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      date: '2024-12-21',
      clockIn: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000).toISOString(),
      clockOut: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 22 * 60 * 60 * 1000).toISOString(),
      scheduledHours: 8,
      actualHours: 8,
      breakTime: 45,
      overtime: 0,
      status: 'completed',
      location: 'Laundry Room A',
      notes: 'Evening shift. Handled peak hours efficiently.'
    }
  ];

  for (const timeEntry of timeTracking) {
    try {
      await setDoc(doc(db, 'operatorTimeTracking', timeEntry.id), timeEntry);
      console.log(`✅ Created time tracking: ${timeEntry.operatorName} - ${timeEntry.date}`);
    } catch (error) {
      console.error(`❌ Failed to create time tracking ${timeEntry.operatorName}:`, error);
    }
  }
}

// Create mock laundry items (individual submissions)
async function createMockLaundryItems(userIdMappings: { [email: string]: string }, forceRecreate: boolean = false) {
  console.log('Creating mock laundry items...');

  // Check if laundry items already exist
  try {
    const itemsQuery = query(collection(db, 'laundryItems'), limit(1));
    const itemsSnapshot = await getDocs(itemsQuery);
    if (!itemsSnapshot.empty && !forceRecreate) {
      console.log('⚠️ Laundry items already exist, skipping creation');
      return;
    } else if (!itemsSnapshot.empty && forceRecreate) {
      console.log('🔄 Force recreating laundry items...');
    }
  } catch (error) {
    console.warn('Error checking existing laundry items:', error);
  }

  const laundryItems = [
    {
      id: 'laundry_item_001',
      studentId: userIdMappings['student@laundryhub.com'] || 'student_001',
      studentName: 'Demo Student',
      qrCode: 'QR-2024-001',
      bagQRCode: 'BAG-2024-001',
      items: ['5 Cotton T-shirts', '2 Jeans', '3 Underwear'],
      status: 'completed',
      submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      deliveredAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_001',
      machineName: 'Washer 1',
      totalCost: 45.00,
      paymentStatus: 'paid',
      studentNotes: 'Please be careful with the jeans - they have delicate embroidery.',
      bagPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'laundry_item_002',
      studentId: userIdMappings['alice@vitap.ac.in'] || 'student_002',
      studentName: 'Alice Johnson',
      qrCode: 'QR-2024-002',
      bagQRCode: 'BAG-2024-002',
      items: ['3 Wool Sweaters', '2 Silk Blouses'],
      status: 'washing',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_002',
      machineName: 'Washer 2',
      totalCost: 35.00,
      paymentStatus: 'paid',
      specialInstructions: 'Handle with care - delicate fabrics',
      studentNotes: 'Please use gentle cycle for wool items. They are my favorite sweaters.',
      bagPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'laundry_item_003',
      studentId: userIdMappings['bob@vitap.ac.in'] || 'student_003',
      studentName: 'Bob Smith',
      qrCode: 'QR-2024-005',
      bagQRCode: 'BAG-2024-003',
      items: ['4 Gym T-shirts', '2 Shorts', '1 Towel'],
      status: 'ready',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
      operatorId: 'operator_002',
      operatorName: 'Mike Chen',
      machineId: 'machine_003',
      machineName: 'Washer 3',
      totalCost: 25.00,
      paymentStatus: 'paid',
      studentNotes: 'These are my gym clothes - please make sure they are completely dry before folding.',
      bagPhoto: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'laundry_item_004',
      studentId: userIdMappings['carol@vitap.ac.in'] || 'student_004',
      studentName: 'Carol Davis',
      qrCode: 'QR-2024-006',
      bagQRCode: 'BAG-2024-004',
      items: ['6 Bed Sheets', '4 Pillowcases', '2 Towels'],
      status: 'picked_up',
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      operatorId: 'operator_003',
      operatorName: 'Lisa Rodriguez',
      totalCost: 55.00,
      paymentStatus: 'paid',
      studentNotes: 'These are my dorm bedding. Please wash thoroughly.',
      bagPhoto: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'laundry_item_005',
      studentId: userIdMappings['dave@vitap.ac.in'] || 'student_005',
      studentName: 'Dave Wilson',
      qrCode: 'QR-2024-007',
      bagQRCode: 'BAG-2024-005',
      items: ['2 Formal Shirts', '1 Blazer', '3 Pairs of Socks'],
      status: 'submitted',
      submittedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      totalCost: 40.00,
      paymentStatus: 'pending',
      studentNotes: 'Formal wear for an important event. Please handle carefully.',
      bagPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center'
    }
  ];

  for (const item of laundryItems) {
    try {
      await setDoc(doc(db, 'laundryItems', item.id), item);
      console.log(`✅ Created laundry item: ${item.id}`);
    } catch (error) {
      console.error(`❌ Failed to create laundry item ${item.id}:`, error);
    }
  }
}

// Auto-run if this script is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - can be called from console
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).createDemoAccounts = createDemoAccounts;
  console.log('Demo accounts script loaded. Run createDemoAccounts() in the browser console.');
}