import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Deine Firebase Config eintragen:
const firebaseConfig = {
  apiKey: "AIzaSyBJUScevMZ4kNRMge-C2KHbGPV1JDqNLXc",
  authDomain: "generation-making.firebaseapp.com",
  projectId: "generation-making",
  storageBucket: "generation-making.firebasestorage.app",
  messagingSenderId: "420508410958",
  appId: "1:420508410958:web:6974d510b16d3fad390f1f",
  measurementId: "G-0KYJMV5WQD"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);          // <- Expo Go/Managed: nur getAuth!
export const db = getFirestore(app);
export const storage = getStorage(app);