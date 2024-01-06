import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB_7nqQrZ-D6_taou0lC4iB8QBmqOPdaqo",
  authDomain: "registration-5455d.firebaseapp.com",
  projectId: "registration-5455d",
  storageBucket: "registration-5455d.appspot.com",
  messagingSenderId: "125093509060",
  appId: "1:125093509060:web:4f50f3a2609384645dd691",
  measurementId: "G-CKR9B08WLE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {app,auth};