import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCua_R6KVYHDkfIYP_dvEY813_zMymWxSA",
  authDomain: "aplicativo-de-gratidao.firebaseapp.com",
  databaseURL: "https://aplicativo-de-gratidao-default-rtdb.firebaseio.com",
  projectId: "aplicativo-de-gratidao",
  storageBucket: "aplicativo-de-gratidao.firebasestorage.app",
  messagingSenderId: "816687675718",
  appId: "1:816687675718:web:09c4368c645a0f29a24d47",
  measurementId: "G-91KFMKBTSV"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser doesn\'t support all of the features required to enable persistence');
  }
});