// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCptIPOMwsxozjpBelEs7gf6Lerc3cz0QM",
  authDomain: "myhome-e2b7c.firebaseapp.com",
  projectId: "myhome-e2b7c",
  storageBucket: "myhome-e2b7c.appspot.com",
  messagingSenderId: "856902395384",
  appId: "1:856902395384:web:eccc246d7a3f666294620d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
