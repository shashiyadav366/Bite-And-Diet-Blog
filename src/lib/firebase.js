// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCpjSisGMYrvBXOLKQ4ULaeNmK5zU_8K-w",
  authDomain: "shashichatapp.firebaseapp.com",
  databaseURL: "https://shashichatapp-default-rtdb.firebaseio.com",
  projectId: "shashichatapp",
  storageBucket: "shashichatapp.appspot.com",
  messagingSenderId: "837915550458",
  appId: "1:837915550458:web:df32edf2030c97e2159f43",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
