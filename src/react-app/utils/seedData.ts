import { User } from '@/shared/laundry-types';

export function initializeSeedData(force = false) {
  // Check if data already exists (unless forced)
  if (!force && localStorage.getItem('dataSeeded')) {
    return;
  }

  // Seed demo users
  const demoUsers: User[] = [
    {
      id: 'admin_001',
      name: 'Admin User',
      email: 'admin@laundryhub.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890',
      createdAt: new Date().toISOString()
    },
    {
      id: 'operator_001',
      name: 'Operator John',
      email: 'operator@laundryhub.com',
      password: 'operator123',
      role: 'operator',
      phone: '+1234567891',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_001',
      name: 'Student Alice',
      email: 'alice@vitap.ac.in',
      password: 'student123',
      role: 'student',
      phone: '+91 9876543210',
      rollNumber: '21BCE0001',
      gender: 'female',
      hostel: 'MH-A',
      room: '101',
      createdAt: new Date().toISOString()
    },
    {
      id: 'student_002',
      name: 'Demo Student',
      email: 'student@laundryhub.com',
      password: 'student123',
      role: 'student',
      phone: '+91 9876543211',
      rollNumber: '21BCE0002',
      gender: 'male',
      hostel: 'MH-B',
      room: '202',
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem('users', JSON.stringify(demoUsers));

  // Seed demo machines
  const demoMachines = [
    {
      id: 'machine_001',
      name: 'Washer 1',
      type: 'washer',
      status: 'available',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'machine_002',
      name: 'Washer 2',
      type: 'washer',
      status: 'in-use',
      currentQR: 'BAG-2024-002',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'machine_003',
      name: 'Dryer 1',
      type: 'dryer',
      status: 'available',
      lastUpdated: new Date().toISOString()
    },
    {
      id: 'machine_004',
      name: 'Dryer 2',
      type: 'dryer',
      status: 'available',
      lastUpdated: new Date().toISOString()
    }
  ];

  localStorage.setItem('machines', JSON.stringify(demoMachines));

  // Seed demo QR codes
  const demoQRCodes = [
    {
      id: 'qr_001',
      code: 'QR-2024-001',
      status: 'assigned',
      assignedTo: 'student_001',
      assignedToName: 'Student Alice',
      assignedBy: 'operator_001',
      assignedByName: 'Operator John',
      assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'qr_002',
      code: 'QR-2024-002',
      status: 'available',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'qr_003',
      code: 'QR-2024-003',
      status: 'available',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  localStorage.setItem('qrCodes', JSON.stringify(demoQRCodes));

  // Seed demo laundry items
  const demoLaundryItems = [
    {
      id: 'laundry_001',
      studentId: 'student_001',
      studentName: 'Student Alice',
      qrCode: 'QR-2024-001',
      bagQRCode: 'BAG-2024-001',
      items: ['5 Cotton items'],
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
      machineName: 'Washer 1'
    },
    {
      id: 'laundry_002',
      studentId: 'student_001',
      studentName: 'Student Alice',
      qrCode: 'QR-2024-001',
      bagQRCode: 'BAG-2024-002',
      items: ['3 Wool items'],
      status: 'washing',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_002',
      machineName: 'Washer 2',
      specialInstructions: 'Handle with care - delicate fabrics',
      studentNotes: 'Please use gentle cycle for wool items. They are my favorite sweaters.',
      bagPhoto: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop&crop=center'
    },
    {
      id: 'laundry_003',
      studentId: 'student_001',
      studentName: 'Student Alice',
      qrCode: 'QR-2024-001',
      bagQRCode: 'BAG-2024-003',
      items: ['2 Synthetic items'],
      status: 'ready',
      submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      pickedUpAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      washingStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
      dryingStartedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
      readyAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
      operatorId: 'operator_001',
      operatorName: 'Operator John',
      machineId: 'machine_001',
      machineName: 'Washer 1',
      studentNotes: 'These are my gym clothes - please make sure they are completely dry before folding.',
      bagPhoto: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center'
    }
  ];

  localStorage.setItem('laundryItems', JSON.stringify(demoLaundryItems));

  // Initialize empty arrays for other data
  localStorage.setItem('feedbacks', JSON.stringify([]));
  localStorage.setItem('lostItems', JSON.stringify([]));
  localStorage.setItem('supportTickets', JSON.stringify([]));

  // Mark as seeded
  localStorage.setItem('dataSeeded', 'true');
}
