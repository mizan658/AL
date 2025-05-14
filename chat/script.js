import { auth, db, provider, signInWithPopup } from './firebase.js';
import { ref, push, onChildAdded } from "firebase/database";

const loginBtn = document.getElementById("loginBtn");
const chatBox = document.getElementById("chatBox");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const chatWindow = document.getElementById("chatWindow");

let currentUser = null;

// Login
loginBtn.onclick = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;
    if (!email.endsWith("@diu.edu.bd")) {
      alert("Only @diu.edu.bd emails allowed");
      auth.signOut();
      return;
    }
    currentUser = result.user;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("chatSection").style.display = "block";
  } catch (error) {
    console.error(error);
  }
};

// Send message
sendBtn.onclick = () => {
  const msg = messageInput.value.trim();
  if (!msg) return;
  push(ref(db, "messages"), {
    text: msg,
    sender: currentUser.displayName,
    uid: currentUser.uid,
    timestamp: Date.now()
  });
  messageInput.value = "";
};

// Display messages
onChildAdded(ref(db, "messages"), (snapshot) => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.className = "message";
  div.innerHTML = `
    <strong>${data.sender}:</strong> ${data.text}
    <span class="reaction">💬</span>
  `;
  div.querySelector(".reaction").onclick = () => {
    div.querySelector(".reaction").textContent = "❤️";
  };
  chatWindow.appendChild(div);
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
