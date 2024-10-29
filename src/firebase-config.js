import { initializeApp } from "firebase/app";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDUABuVL4NhbL2x0JEn3kLaEVn_245MFBI",
  authDomain: "diary-bl24-9.firebaseapp.com",
  projectId: "diary-bl24-9",
  storageBucket: "diary-bl24-9.appspot.com",
  messagingSenderId: "184409224229",
  appId: "1:184409224229:web:62589bc54b4e120ba6bbcc",
  measurementId: "G-P1B49CHKCR",
  databaseURL: "https://diary-bl24-9-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const loginUser = async (login, password) => {
  try {
    const response = await fetch('https://<your-region>-<your-project-id>.cloudfunctions.net/getCustomToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, password })
    });

    const data = await response.json();
    
    if (response.ok && data.token) {
      await signInWithCustomToken(auth, data.token);
      console.log('Пользователь аутентифицирован');
    } else {
      console.error('Ошибка получения custom token:', data.error || 'Неизвестная ошибка');
    }
  } catch (error) {
    console.error('Ошибка логина:', error);
  }
};