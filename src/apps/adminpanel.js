import React, { useState, useEffect } from 'react';
import { ref, set, get, child } from 'firebase/database';
import { database } from '../firebase';  
import { useNavigate } from 'react-router-dom';
import { getUserCount, saveDataToDatabase } from '../components/scores';

//saveDataToDatabase()

export default function AdminPanel() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: '',
    login: '',
    password: '',
    name: '',
    surname: '',
    role: 'user',
    group: 'bl-24-9 БЛ-24-9',
    scores: []
  });

  const fetchUserCount = async () => {
    const userCount = await getUserCount();
    setUserData((prevData) => ({
      ...prevData,
      id: String(userCount + 3)
    }));
  };

  useEffect(() => {
    fetchUserCount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const dbRef = ref(database);
    const groupId = userData.group.split(' ')[0];
  
    try {
      const snapshot = await get(child(dbRef, `users/groups/${groupId}`));
      
      if (!snapshot.exists()) {
        alert('Группа не найдена');
        return;
      }
  
      const userSnapshot = await get(child(dbRef, `users/groups/${groupId}/${userData.id}`));
  
      if (userSnapshot.exists()) {
        alert('Пользователь с таким ID уже существует в группе');
        return;
      }
  
      const userRef = ref(database, `users/groups/${groupId}/${userData.id}`);
  
      await set(userRef, userData)
        .then(() => {
          alert('Пользователь создан успешно');
          fetchUserCount();
          setUserData({
            id: '',
            login: '',
            password: '',
            name: '',
            surname: '',
            role: 'user',
            group: 'bl-24-9 БЛ-24-9',
            scores: []
          });
        })
        .catch((error) => {
          console.error('Ошибка записи данных: ', error);
        });
    } catch (error) {
      console.error('Ошибка проверки группы или пользователя: ', error);
      alert('Ошибка проверки группы или пользователя');
    }
  };

  const handleBackClick = () => {
    navigate('/'); 
  };

  const handleNavScores = () => {
    navigate('/'); 
  };

  return (
    <div>
      <h1>Админ Панель</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Login:
            <input
              type="text"
              name="login"
              value={userData.login}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>Password:
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>Name:
            <input
              type="text"
              name="name"
              value={userData.name}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>Surname:
            <input
              type="text"
              name="surname"
              value={userData.surname}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>Role:
            <select
              name="role"
              value={userData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
        </div>
        <div>
          <label>Group (Если учитель то не меняйте):
            <select
              name="group"
              value={userData.group}
              onChange={handleChange}
            >
              <option value="bl-24-9 БЛ-24-9">БЛ-24-9</option>
              <option value="kb-24-9 КБ-24-9">КБ-24-9</option>
              <option value="ai-24-9 ИИ-24-9">ИИ-24-9</option>
              <option value="ri-24-9 РИ-24-9">РИ-24-9</option>
              <option value="ia-24-9 ИЯ-24-9">ИЯ-24-9</option>
            </select>
          </label>
        </div>
        <button type="submit">Создать пользователя</button>
        <button type="button" onClick={handleNavScores}>111</button>
      </form>
      <div className='buttonback' id='button-back-adminpanel' onClick={handleBackClick}>
        <i className='fas fa-arrow-left'></i>
        <p>Назад</p>
      </div>
    </div>
  );
}
