import { database } from './firebase';
import { ref, set, get, update } from 'firebase/database';

// Функция для записи данных пользователя в Firebase
export const writeUserData = (user) => {
  return set(ref(database, 'users/' + user.id), user);
};

// Функция для обновления данных пользователя в Firebase
export const updateUserData = (userId, updates) => {
  const userRef = ref(database, 'users/' + userId);
  return update(userRef, updates);
};

// Функция для чтения данных пользователя из Firebase
export const readUserData = async (userId) => {
  const userRef = ref(database, 'users/' + userId);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    return snapshot.val();
  } else {
    return null;
  }
};