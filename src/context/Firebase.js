import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAF-yQMp5przzc6LK_TCVcAYhepxQbCF9A",
  authDomain: "intrenship-11de1.firebaseapp.com",
  databaseURL: "https://intrenship-11de1-default-rtdb.firebaseio.com",
  projectId: "intrenship-11de1",
  storageBucket: "intrenship-11de1.firebasestorage.app",
  messagingSenderId: "906670318992",
  appId: "1:906670318992:web:5bf10ad464ea3b48f93f15",
  measurementId: "G-KGLHHK39E2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
