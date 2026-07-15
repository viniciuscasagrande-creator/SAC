import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "SUA_API_KEY", // Insira a sua API Key do Console do Firebase
  authDomain: "593914291284.firebaseapp.com",
  projectId: "593914291284",
  storageBucket: "593914291284.appspot.com",
  messagingSenderId: "593914291284",
  appId: "SUA_APP_ID" // Insira o seu App ID do Console do Firebase
};

// Inicializa a aplicação Firebase
const app = initializeApp(firebaseConfig);

// Inicializa e exporta os serviços do SDK
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const messaging = typeof window !== "undefined" && "serviceWorker" in navigator ? getMessaging(app) : null;

export default app;
