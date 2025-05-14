import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAEYjUeSuFxpyZuphg0vB2AK24eyHSjBak",
  authDomain: "chat-7c4ed.firebaseapp.com",
  databaseURL: "https://chat-7c4ed-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-7c4ed",
  storageBucket: "chat-7c4ed.appspot.com",
  messagingSenderId: "871465831321",
  appId: "1:871465831321:web:f9ac2aeef73133450b2108",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup };
