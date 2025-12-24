// Script to fix mock data by recreating it with correct user IDs
import { createDemoAccounts } from './src/react-app/utils/createDemoAccounts';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './src/react-app/config/firebase';

async function deleteExistingMockData() {
  console.log('🗑️ Deleting existing mock data...');

  const collectionsToClear = [
    'laundryItems',
    'qrCodes',
    'machines',
    'feedbacks',
    'lostFound',
    'laundrySessions',
    'laundryOrders' // Note: this might be the same as laundryItems
  ];

  for (const collectionName of collectionsToClear) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      console.log(`✅ Cleared ${collectionName} collection`);
    } catch (error) {
      console.warn(`⚠️ Could not clear ${collectionName}:`, error);
    }
  }
}

async function fixMockData() {
  console.log('🛠️ Fixing mock data by recreating with correct user IDs...');

  // Delete existing mock data first
  await deleteExistingMockData();

  // Recreate accounts and mock data
  await createDemoAccounts(true);

  console.log('✅ Mock data fixed! Please refresh the page and login again.');
}

// Run the fix
fixMockData().catch(console.error);