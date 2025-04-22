// firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDbcQCa9gJfYtqpHKEvTLjzjHUNCt60bT8",
  authDomain: "controlobra-3dcce.firebaseapp.com",
  projectId: "controlobra-3dcce",
  storageBucket: "controlobra-3dcce.appspot.com",
  messagingSenderId: "57704883108",
  appId: "1:57704883108:web:47f88250a26c8ddd429731",
  measurementId: "G-XZCRDWGMB3"
};

// Inicializar a app
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
