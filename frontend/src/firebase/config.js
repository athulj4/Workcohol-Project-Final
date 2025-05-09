import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDElY-ejhXyFs76sAubjllA10NbLjBmsDQ",
  authDomain: "prestige-homes-explorer.firebaseapp.com",
  projectId: "prestige-homes-explorer",
  storageBucket: "prestige-homes-explorer.firebasestorage.app",
  messagingSenderId: "700566066083",
  appId: "1:700566066083:web:58a913778c4ee4b68c0016"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };