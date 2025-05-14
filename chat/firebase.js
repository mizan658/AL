// 1. firebase.js - Firebase Configuration
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCiEVpLPaJ5AtFAaV7boxne-d-tVR1d3K0",
  authDomain: "chat-88f0f.firebaseapp.com",
  projectId: "chat-88f0f",
  storageBucket: "chat-88f0f.appspot.com",
  messagingSenderId: "146118641258",
  appId: "1:146118641258:web:f311645f40c8fbcadbac13",
  measurementId: "G-H7LPCPMMYM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { auth, provider, db };

// 2. App.jsx - Main App
import ChatRoom from "./ChatRoom";
import { useEffect, useState } from "react";
import { auth, provider } from "./firebase";
import { signInWithPopup } from "firebase/auth";

export default function App() {
  const [user, setUser] = useState(null);

  const signIn = async () => {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;
    if (!email.endsWith("@diu.edu.bd")) {
      alert("Only @diu.edu.bd emails are allowed.");
      auth.signOut();
      return;
    }
    setUser(result.user);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      {user ? <ChatRoom user={user} /> : <button onClick={signIn} className="bg-green-600 p-4 rounded text-white">Sign in with DIU Google</button>}
    </div>
  );
}

// 3. ChatRoom.jsx - WhatsApp-like Chat Room
import { useEffect, useRef, useState } from "react";
import { db, auth } from "./firebase";
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

export default function ChatRoom({ user }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    await addDoc(collection(db, "messages"), {
      text: newMessage,
      name: user.displayName,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    setNewMessage("");
  };

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-4">
      <div className="h-96 overflow-y-scroll mb-2">
        {messages.map(msg => (
          <div key={msg.id} className={`p-2 my-1 rounded ${msg.uid === user.uid ? 'bg-green-600 text-right' : 'bg-gray-700'}`}>
            <div className="text-sm opacity-80">{msg.name}</div>
            <div>{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button className="bg-green-600 p-2 rounded">Send</button>
      </form>
    </div>
  );
}

// 4. index.css (Tailwind Base)
@tailwind base;
@tailwind components;
@tailwind utilities;

// 5. main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
