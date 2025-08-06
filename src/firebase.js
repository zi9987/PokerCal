import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your Firebase config object
// Use environment variables if available, otherwise fallback to hardcoded values
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBQXGD-Ofc_Eba2EJ2SaWdj4XW8uLN9Nus",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "pokercal-58dab.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://pokercal-58dab-default-rtdb.firebaseio.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "pokercal-58dab",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "pokercal-58dab.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "622703743900",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:622703743900:web:60431ee41da1f756732e59",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-3W16S4GSF9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Sign in anonymously for each user
export const signInAnonymous = async () => {
  try {
    const result = await signInAnonymously(auth);
    return result.user;
  } catch (error) {
    console.error('Error signing in anonymously:', error);
    throw error;
  }
};

export default app;