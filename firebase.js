// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyADnxR0U6N6o-PfRXM48ifWR8B7jBz4MeA",
  authDomain: "inventory-management-781e6.firebaseapp.com",
  projectId: "inventory-management-781e6",
  storageBucket: "inventory-management-781e6.appspot.com",
  messagingSenderId: "940090925396",
  appId: "1:940090925396:web:85e11e7ebc708deb47a8c1",
  measurementId: "G-F62V76E5SX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}