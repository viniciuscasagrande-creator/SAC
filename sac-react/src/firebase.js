import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Firebase configuration using Vite environment variables for security and flexibility
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "593914291284.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "593914291284",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "593914291284.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "593914291284",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

// Initialize Cloud Messaging (with safety check for browser environments that support notifications)
let messagingInstance = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messagingInstance = getMessaging(app);
  } catch (err) {
    console.warn("Cloud Messaging não é suportado ou foi bloqueado neste navegador:", err);
  }
}

export const messaging = messagingInstance;

// Helper to request notification permissions and fetch the device token
export const requestNotificationPermission = async () => {
  if (!messaging) {
    console.warn("Mensageria não inicializada ou não suportada.");
    return null;
  }
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Permissão de notificação concedida.");
      // Retrieve FCM token
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "SUA_CHAVE_VAPID_PUBLICA"
      });
      console.log("FCM Token do Dispositivo:", token);
      return token;
    } else {
      console.warn("Permissão de notificação negada.");
      return null;
    }
  } catch (err) {
    console.error("Erro ao obter token de notificação:", err);
    return null;
  }
};

// Helper to listen for foreground messages
export const onForegroundMessage = (callback) => {
  if (messaging) {
    return onMessage(messaging, (payload) => {
      console.log("Mensagem recebida em primeiro plano:", payload);
      callback(payload);
    });
  }
};

export default app;
