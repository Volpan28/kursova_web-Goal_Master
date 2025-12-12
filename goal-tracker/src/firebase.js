import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// ДОДАНО: Імпорт необхідних функцій для авторизації
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD6fS7JYKgIWo9iWRykx-4UUnjWEbrYN0E",
    authDomain: "kursova-web-9e32c.firebaseapp.com",
    projectId: "kursova-web-9e32c",
    storageBucket: "kursova-web-9e32c.firebasestorage.app",
    messagingSenderId: "230020911640",
    appId: "1:230020911640:web:b9dfff67c7ebda1510696d",
    measurementId: "G-618EWG4XB9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Тепер ці функції працюють, бо ми їх імпортували зверху
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);