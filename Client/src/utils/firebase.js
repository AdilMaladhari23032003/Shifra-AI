import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "shifra-ai-78ee5.firebaseapp.com",
  projectId: "shifra-ai-78ee5",
  storageBucket: "shifra-ai-78ee5.firebasestorage.app",
  messagingSenderId: "988174747459",
  appId: "1:988174747459:web:f5a81f65d4cf3cc6aed1f6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth , provider}

