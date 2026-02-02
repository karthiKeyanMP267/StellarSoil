/* eslint-disable no-undef */
/* Firebase Messaging Service Worker */
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

// IMPORTANT: Update these values to match your Firebase web app config.
firebase.initializeApp({
  apiKey: 'AIzaSyB5mhzoCe1ubFovf1BQ6csSAw8ommmDLYM',
  authDomain: 'stellarsoil-1cd10.firebaseapp.com',
  projectId: 'stellarsoil-1cd10',
  messagingSenderId: '1007941956749',
  appId: '1:1007941956749:web:d44feb888f91cec7b15ec4'
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload?.notification?.title || 'StellarSoil Notification';
  const options = {
    body: payload?.notification?.body || 'You have a new update.',
    icon: '/favicon.ico'
  };

  self.registration.showNotification(title, options);
});
