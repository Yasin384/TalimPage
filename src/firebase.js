import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCeJOCy8yGL5euJXGNQ5cZQuU0LM-ZgFEQ",
  authDomain: "meta-educate.firebaseapp.com",
  projectId: "meta-educate",
  storageBucket: "meta-educate.appspot.com",
  messagingSenderId: "412989360315",
  appId: "1:412989360315:web:726db0ba013c668f4ec19e",
  databaseURL: "https://meta-educate-default-rtdb.firebaseio.com"  // URL базы данных
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };