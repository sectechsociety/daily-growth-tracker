// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRCBviAWfv2jVlmdm5MYEOBVhPEnVho6g",
  authDomain: "daily-growth-tracker-6dcb2.firebaseapp.com",
  projectId: "daily-growth-tracker-6dcb2",
  storageBucket: "daily-growth-tracker-6dcb2.firebasestorage.app",
  messagingSenderId: "560448305149",
  appId: "1:560448305149:web:d21ac198dc1d0458880b94",
  measurementId: "G-EBS0V6J8QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Analytics only in browser environment
let analytics;
if (typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore
export const db = getFirestore(app);

export default app;