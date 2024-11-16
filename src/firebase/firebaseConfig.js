// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBfZOp3GSbbZ2eaZMDabxzrq9Repa8uaOI",
  authDomain: "flavorsacademy-c688e.appspot.com",
  projectId: "flavorsacademy-c688e",
  storageBucket: "flavorsacademy-c688e.firebasestorage.app",
  messagingSenderId: "44001770668",
  appId: "1:44001770668:web:3ff6b671c87f4de7327309",
  measurementId: "G-WNM3MMEFQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase Storage
const storage = getStorage(app);

// export { storage, analytics };
export { storage};