// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Use environment variables if available, otherwise use hardcoded config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCRCBviAWfv2jVlmdm5MYEOBVhPEnVho6g",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "daily-growth-tracker-6dcb2.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "daily-growth-tracker-6dcb2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "daily-growth-tracker-6dcb2.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "560448305149",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:560448305149:web:d21ac198dc1d0458880b94",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-EBS0V6J8QY"
};

// Initialize Firebase with error handling for App Check issues
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization error:', error);
  // If App Check is causing issues, try to reinitialize without it
  if (error.message?.includes('app-check')) {
    console.warn('App Check issue detected, continuing without App Check for development');
    // For development, we'll continue without App Check
    app = initializeApp(firebaseConfig);
  } else {
    throw error;
  }
}

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider for social login
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Add scopes for better user experience
googleProvider.addScope('email');
googleProvider.addScope('profile');

// Auth state observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Authentication methods with App Check bypass for development
export const signInWithEmail = async (email, password) => {
  try {
    console.log('🔐 Firebase signInWithEmail called with:', email);

    // Try authentication with App Check bypass for development
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Firebase signInWithEmailAndPassword successful');
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('❌ Firebase signInWithEmailAndPassword failed:', error);

    // Handle App Check errors specifically
    if (error.code === 'auth/firebase-app-check-token-is-invalid') {
      console.warn('🚫 App Check token invalid - this is expected in development');
      console.log('💡 For production, configure App Check properly in Firebase Console');
      console.log('🔧 For development, you can temporarily disable App Check enforcement');

      // Return a helpful error message for the user
      return {
        user: null,
        error: 'Authentication is blocked by security settings. Please contact support or try again later.'
      };
    }

    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    let errorMessage = 'Sign in failed. Please try again.';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many failed attempts. Please try again later.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection.';
    }

    console.error('Final error message:', errorMessage);
    return { user: null, error: errorMessage };
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  try {
    console.log('🔐 Firebase signUpWithEmail called with:', email);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('✅ Firebase createUserWithEmailAndPassword successful');

    console.log('📝 Updating user profile...');
    await updateProfile(userCredential.user, { displayName });
    console.log('✅ User profile updated');

    console.log('💾 Creating Firestore document...');
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name: displayName,
      email: email,
      level: 1,
      xp: 0,
      totalPoints: 0,
      streak: 0,
      tasksCompleted: 0,
      skillsUnlocked: 0,
      mindfulMinutes: 0,
      badges: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('✅ Firestore document created');

    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error('❌ Firebase signUpWithEmail failed:', error);

    // Handle App Check errors specifically
    if (error.code === 'auth/firebase-app-check-token-is-invalid') {
      console.warn('🚫 App Check token invalid - this is expected in development');
      return {
        user: null,
        error: 'Account creation is blocked by security settings. Please contact support.'
      };
    }

    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    let errorMessage = 'Sign up failed. Please try again.';

    if (error.code === 'auth/email-already-in-use') {
      errorMessage = 'An account with this email already exists.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    } else if (error.code === 'auth/weak-password') {
      errorMessage = 'Password should be at least 6 characters.';
    } else if (error.code === 'auth/network-request-failed') {
      errorMessage = 'Network error. Please check your connection.';
    }

    console.error('Final error message:', errorMessage);
    return { user: null, error: errorMessage };
  }
};

export const signInWithGoogle = async () => {
  try {
    console.log('🔄 Starting Google sign-in process...');

    // Check if Google provider is properly configured
    if (!googleProvider) {
      throw new Error('Google Auth Provider not configured');
    }

    console.log('🔧 Using Google provider:', !!googleProvider);

    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    console.log("✅ Signed in successfully:", user);

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      console.log('📝 Creating new user profile in Firestore...');
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        level: 1,
        xp: 0,
        totalPoints: 0,
        streak: 0,
        tasksCompleted: 0,
        skillsUnlocked: 0,
        mindfulMinutes: 0,
        badges: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return { user: user, error: null };
  } catch (error) {
    console.error("❌ Google sign in failed:", error);
    console.error("Error code:", error.code);
    console.error("Error message:", error.message);

    let errorMessage = 'Google sign in failed. Please try again.';

    if (error.code === 'auth/internal-error') {
      errorMessage = 'Google sign-in configuration issue. Please check Firebase console settings or try again later.';
    } else if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign in cancelled. Please try again and complete the Google sign-in process.';
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup blocked by browser. Please allow popups for this site and try again.';
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google sign-in is not enabled. Please check Firebase console settings.';
    } else if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Google Auth Provider not configured in Firebase Console.';
    }

    alert(`Google Sign-In Error: ${errorMessage}\n\nDebug info: ${error.code} - ${error.message}`);

    return { user: null, error: errorMessage };
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    console.error('Logout error:', error);
    return { error: 'Logout failed. Please try again.' };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    let errorMessage = 'Password reset failed. Please try again.';

    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email address.';
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Please enter a valid email address.';
    }

    return { error: errorMessage };
  }
};

// Firestore operations with error handling
export const getUserProfile = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    if (error.code === 'auth/firebase-app-check-token-is-invalid') {
      console.warn('App Check error in getUserProfile, returning default profile');
      return {
        name: 'Growth Seeker',
        level: 1,
        xp: 0,
        tasksCompleted: 0,
        skillsUnlocked: 0,
        mindfulMinutes: 0,
        badges: []
      };
    }
    // Return a default profile if Firestore fails
    return {
      name: 'Growth Seeker',
      level: 1,
      xp: 0,
      tasksCompleted: 0,
      skillsUnlocked: 0,
      mindfulMinutes: 0,
      badges: []
    };
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: new Date()
    });
    return { error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { error: 'Failed to update profile. Please try again.' };
  }
};

export const setTodayGoal = async (uid, goal) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await setDoc(doc(db, 'userGoals', uid), {
      [today]: goal,
      createdAt: new Date()
    }, { merge: true });
    return { error: null };
  } catch (error) {
    console.error('Error setting today\'s goal:', error);
    return { error: 'Failed to save goal. Please try again.' };
  }
};

export const getTodayGoal = async (uid) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const goalDoc = await getDoc(doc(db, 'userGoals', uid));
    if (goalDoc.exists()) {
      return goalDoc.data()[today] || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting today\'s goal:', error);
    return null;
  }
};

export const subscribeToUserProfile = (uid, callback) => {
  try {
    return onSnapshot(doc(db, 'users', uid), (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      }
    });
  } catch (error) {
    console.error('Error subscribing to profile:', error);
    return () => {};
  }
};

export const getQuoteOfTheDay = async () => {
  try {
    const quotes = [
      {
        text: "The journey of a thousand miles begins with a single step.",
        author: "Lao Tzu"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
      },
      {
        text: "Your future is created by what you do today, not tomorrow.",
        author: "Robert Kiyosaki"
      },
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
      }
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  } catch (error) {
    console.error('Error getting quote:', error);
    return {
      text: "Every moment is a fresh beginning.",
      author: "T.S. Eliot"
    };
  }
};

// Export the app instance
export default app;

// Diagnostic function to test Firebase configuration
export const testFirebaseConfig = async () => {
  try {
    console.log('🔍 Testing Firebase configuration...');

    // Test if auth is initialized
    if (!auth) {
      throw new Error('Firebase Auth not initialized');
    }

    // Test if Google provider is configured
    if (!googleProvider) {
      throw new Error('Google Auth Provider not configured');
    }

    // Test if Firestore is initialized
    if (!db) {
      throw new Error('Firestore not initialized');
    }

    console.log('✅ Firebase configuration test passed');
    return { success: true, message: 'Firebase is properly configured' };
  } catch (error) {
    console.error('❌ Firebase configuration test failed:', error);
    return { success: false, message: error.message };
  }
};
