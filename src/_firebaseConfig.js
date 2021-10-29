import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnyLthJRHcjNqu02VzVV7XCXXsF_KrKoY",
  authDomain: "encouragement-test.firebaseapp.com",
  projectId: "encouragement-test",
  storageBucket: "encouragement-test.appspot.com",
  messagingSenderId: "653782120697",
  appId: "1:653782120697:web:dc3fe9bb1d5b5c6e378a28"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const auth = firebase.auth();

export { db, auth };