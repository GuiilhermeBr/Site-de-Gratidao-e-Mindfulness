import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { addDays } from 'date-fns';

export const defaultMessages = [
  "Seja bem-vindo(a) ao Gratidão! Comece sua jornada de gratidão hoje mesmo.",
  "A gratidão é a memória do coração. Que bom ter você conosco!",
  "Cada dia é uma nova oportunidade para agradecer. Vamos começar?"
];

export const createInitialMessage = async (userId: string) => {
  const tomorrow = addDays(new Date(), 1);
  tomorrow.setHours(9, 0, 0, 0); // Define para 9h da manhã do dia seguinte

  const randomMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];

  try {
    await addDoc(collection(db, 'notifications'), {
      userId,
      message: randomMessage,
      scheduleDate: tomorrow,
      createdAt: serverTimestamp(),
      isExpired: false,
      isAutomatic: true
    });
  } catch (error) {
    console.error('Error creating initial message:', error);
  }
};