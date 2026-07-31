import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  OAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyALpsVjRPYQQHwV3rU--B2kmjtKBXJgkCI",
  authDomain: "gen-lang-client-0185853879.firebaseapp.com",
  projectId: "gen-lang-client-0185853879",
  storageBucket: "gen-lang-client-0185853879.firebasestorage.app",
  messagingSenderId: "794151489682",
  appId: "1:794151489682:web:77fb42aff2b3f8bf16564b"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const databaseId = "ai-studio-sporpuan-584c3fa0-145e-4898-bad3-ca77311c7f56";
const db = getFirestore(app, databaseId);

const googleProvider = new GoogleAuthProvider();
const appleProvider = new OAuthProvider('apple.com');

export { 
  auth, 
  db, 
  googleProvider, 
  appleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
};
