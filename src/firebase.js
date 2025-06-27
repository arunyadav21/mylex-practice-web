// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// ✅ Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAUU0Y027pAx0uekE6snR0yDLWHM44WpOQ",
  authDomain: "rozgaar-511f8.firebaseapp.com",
  projectId: "rozgaar-511f8",
  storageBucket: "rozgaar-511f8.appspot.com",
  messagingSenderId: "374769193816",
  appId: "1:374769193816:web:795133b64572b0faf7cb2d",
  measurementId: "G-BRNQT2WQ5V"
};

// ✅ Initialize Firebase app
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

// ✅ Export for use in components
export { app, auth, db, analytics, RecaptchaVerifier };
