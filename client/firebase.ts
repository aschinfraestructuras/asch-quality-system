// client/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIZaSyD...t6b0t8",
  authDomain: "controlobra-3dcce.firebaseapp.com",
  projectId: "controlobra-3dcce",
  storageBucket: "controlobra-3dcce.appspot.com",
  messagingSenderId: "57704883108",
  appId: "1:57704883108:web:xxxxxxx",
  measurementId: "G-XXXXXXXX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
