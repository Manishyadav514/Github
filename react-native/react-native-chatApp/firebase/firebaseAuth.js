import { initializeApp } from "firebase/app";
// import {FIREBASE_API_KEY,FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID,FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_AP_ID} from 'react-native-dotenv';
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";

const firebaseConfig = {
  // apiKey: FIREBASE_API_KEY,
  // authDomain: FIREBASE_AUTH_DOMAIN,
  // projectId: FIREBASE_PROJECT_ID,
  // storageBucket: FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  // appId: FIREBASE_AP_ID,
  apiKey: "AIzaSyBVR15L1TnOpz5hBZAFZneZ_M940E_61ts",
  authDomain: "react-firebase-authentic-8c851.firebaseapp.com",
  projectId: "react-firebase-authentic-8c851",
  storageBucket: "react-firebase-authentic-8c851.appspot.com",
  messagingSenderId: "950890087245",
  appId: "1:950890087245:web:0a259bd4460d71f6caad04",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
// export const handleSignUp = async (email, password) => {
//   await createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const user = userCredential.user;
//       return "Registered Successfully!";
//     })
//     .catch((error) => {
//       const errorMessage = error?.code?.split("/")[1];
//       return "errorMessage";
//     });
// };
export const handleSignOut = () => {
  console.log("signing off...");
  signOut(auth)
    .then(() => {
      console.log("signed out");
    })
    .catch((error) => {
      console.log(error);
    });
};
