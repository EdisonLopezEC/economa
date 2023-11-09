// Import the functions you need from the SDKs you need
// import * as firebase from 'firebase';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import 'firebase/compat/firestore';

import { getFirestore } from 'firebase/firestore/lite';
// import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnANQCo3QsqS9sF0b6dBeB7eE6bawRKXs",
  authDomain: "economia-8b1d7.firebaseapp.com",
  projectId: "economia-8b1d7",
  storageBucket: "economia-8b1d7.appspot.com",
  messagingSenderId: "1040023410214",
  appId: "1:1040023410214:web:170d8319b868d4a617b8e7"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = getFirestore(app);
const auth = firebase.auth();

export { db, auth };

