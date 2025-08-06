import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyBQXGD-Ofc_Eba2EJ2SaWdj4XW8uLN9Nus",
  authDomain: "pokercal-58dab.firebaseapp.com",
  databaseURL: "https://pokercal-58dab-default-rtdb.firebaseio.com",
  projectId: "pokercal-58dab",
  storageBucket: "pokercal-58dab.firebasestorage.app",
  messagingSenderId: "622703743900",
  appId: "1:622703743900:web:60431ee41da1f756732e59",
  measurementId: "G-3W16S4GSF9"
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