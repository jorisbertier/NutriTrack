// ./services/firebase.ts
import { initializeApp } from "firebase/app";
import { initializeAuth, getAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";  // Importation de Firestore
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configuration de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAXFXrqpfYgIlZW65vbQIymFLUJevSu6JM",
  authDomain: "fir-35768.firebaseapp.com",
  projectId: "fir-35768",
  storageBucket: "fir-35768.appspot.com",
  messagingSenderId: "1036805747008",
  appId: "1:1036805747008:web:bd81d930ff260130994aa5",
  measurementId: "G-L5KXVYT3JL"
};

// Initialisation de Firebase App
const app = initializeApp(firebaseConfig);

// Initialisation d'Auth avec persistence via AsyncStorage
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialisation de Firestore
const firestore = getFirestore(app);

export { app, auth, firestore, getAuth };
