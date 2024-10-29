import { database } from '../firebase';
import { ref, set, get, update, child } from 'firebase/database';
import { useState, useEffect } from 'react';
import { getUserById } from './scores';

// Функция для записи данных пользователя в Firebase
const writeUserData = (user) => {
  set(ref(database, 'users/' + user.id), user)
    .then(() => {
      console.log('Данные записаны успешно');
    })
    .catch((error) => {
      console.error('Ошибка записи данных: ', error);
    });
};

const updateUserData = (userId, updates) => {
  const userRef = ref(database, 'users/' + userId);
  update(userRef, updates)
    .then(() => {
      console.log('Данные обновлены успешно');
    })
    .catch((error) => {
      console.error('Ошибка обновления данных: ', error);
    });
};

// Функция для чтения данных пользователя из Firebase
const readUserData = async (userId) => {
  const userRef = ref(database, 'users/' + userId);
  const snapshot = await get(userRef);
  if (snapshot.exists()) {
    console.log(snapshot.val());
    return snapshot.val();
  } else {
    console.log("Нет доступных данных");
    return null;
  }
};
export const getUsers = async () => {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'users/groups'));

    if (snapshot.exists()) {
      const groups = snapshot.val();
      let allUsers = [];

      // Собираем пользователей из всех групп
      for (const groupKey in groups) {
        const group = groups[groupKey];
        allUsers = allUsers.concat(Object.values(group));
      }

      return allUsers;
    } else {
      throw new Error('Данные пользователей не найдены');
    }
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    throw error;
  }
};
export const getUser = async (userId) => {
  if (!userId) {
    return null;
  }

  try {
    const userData = await getUserById(userId);
    if (userData) {
      return userData;
    } else {
      console.error('User not found');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    return null;
  }
};
export function SomeComponent() {
  const [userData, setUserData] = useState({
    id: '1',
    login: '',
    password: '',
    name: '',
    surname: '',
    role: 'user',
    scores: []  // Инициализируем как пустой массив
  });

  // Чтение данных пользователя при монтировании компонента
  useEffect(() => {
    readUserData('1').then(data => {
      if (data) {
        setUserData(data);
      }
    });
  }, []);

  // Функция для обработки нажатия на кнопку
  const handleClick = () => {
    const newUser = {
      id: '1',
      login: '',
      password: '',
      name: '',
      surname: '',
      role: 'user',
      scores: []
    };
    writeUserData(newUser);
  };

  return (
    <div>
      <button onClick={handleClick}>Записать данные</button>

      <h1>Данные пользователя</h1>
      {userData ? (
        <div>
          <p>ID: {userData.id}</p>
          <p>Login: {userData.login}</p>
          <p>Name: {userData.name}</p>
          <p>Surname: {userData.surname}</p>
          <p>Role: {userData.role}</p>
          <p>Scores: {userData.scores ? userData.scores.join(', ') : 'Нет данных'}</p>
        </div>
      ) : (
        <p>Загрузка данных...</p>
      )}
    </div>
  );
}
