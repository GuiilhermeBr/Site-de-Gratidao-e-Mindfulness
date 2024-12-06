importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCua_R6KVYHDkfIYP_dvEY813_zMymWxSA",
  authDomain: "aplicativo-de-gratidao.firebaseapp.com",
  projectId: "aplicativo-de-gratidao",
  storageBucket: "aplicativo-de-gratidao.firebasestorage.app",
  messagingSenderId: "816687675718",
  appId: "1:816687675718:web:09c4368c645a0f29a24d47"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon-192x192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});