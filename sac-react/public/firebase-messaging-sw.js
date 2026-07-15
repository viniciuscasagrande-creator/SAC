// Scripts importados para rodar o Firebase SDK dentro do Service Worker
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js");

// Inicialize o Firebase no Service Worker usando o Project Number/ID
firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  authDomain: "593914291284.firebaseapp.com",
  projectId: "593914291284",
  storageBucket: "593914291284.appspot.com",
  messagingSenderId: "593914291284",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

// Handler de mensagens em segundo plano (background message handler)
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Mensagem recebida em segundo plano: ", payload);

  const notificationTitle = payload.notification.title || "DiskIngressos ERP";
  const notificationOptions = {
    body: payload.notification.body || "Atualização de chamado ou estorno.",
    icon: "/favicon.ico"
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
