// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB9cKGIFdmQ0OpQVlOR84YgejryRfzVOPg",
  authDomain: "realchat-app-76861.firebaseapp.com",
  projectId: "realchat-app-76861",
  storageBucket: "realchat-app-76861.appspot.com",
  messagingSenderId: "761222194960",
  appId: "1:761222194960:web:438a51e979addb04572795",
  measurementId: "G-KDN776P2JN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);