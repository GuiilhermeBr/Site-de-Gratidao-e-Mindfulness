import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

export const checkAndUpdateNotificationStatus = async (userId: string) => {
  const now = new Date();
  
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('isExpired', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    const updatePromises = querySnapshot.docs
      .filter(doc => {
        const data = doc.data();
        return new Date(data.scheduleDate.toDate()) < now;
      })
      .map(doc => 
        updateDoc(doc.ref, { isExpired: true })
      );
    
    await Promise.all(updatePromises);
  } catch (error) {
    console.error('Error updating notification status:', error);
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};