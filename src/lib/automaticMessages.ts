import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import { addDays } from 'date-fns';

export const automaticMessages = [
  "Gratidão transforma o que temos em suficiente.",
  "Agradecer é reconhecer a beleza nas pequenas coisas.",
  "Cada novo dia é uma oportunidade para ser grato.",
  "A gratidão abre portas para novas bênçãos.",
  "Ser grato é um exercício diário de amor.",
  "A gratidão muda nossa perspectiva sobre a vida.",
  "Pequenos momentos de gratidão somam uma vida feliz.",
  "Agradecer é um ato de sabedoria.",
  "A gratidão é o caminho para a paz interior.",
  "Cada momento é uma chance de ser grato."
];

export const scheduleAutomaticMessage = async (userId: string) => {
  const tomorrow = addDays(new Date(), 1);
  tomorrow.setHours(9, 0, 0, 0);

  const randomMessage = automaticMessages[Math.floor(Math.random() * automaticMessages.length)];

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
    console.error('Error scheduling automatic message:', error);
  }
};