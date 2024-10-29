import React, { useState, useEffect } from 'react';
import { database } from '../firebase'; 
import { ref, get, child } from 'firebase/database'; 
import { useTranslation } from 'react-i18next';
import '../cssFiles/registrpage.css';

const checkUserCredentials = async (login, password, t, isTeacher) => {
  try {
    const dbRef = ref(database);
    const path = isTeacher ? 'users/teachers' : 'users/groups';
    const snapshot = await get(child(dbRef, path));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      let user = null;

      if (isTeacher) {
        user = Object.values(data).find(
          (teacher) => teacher.login === login && teacher.password === password
        );
        
      } else {
        for (const groupKey in data) {
          const group = data[groupKey];
          user = Object.values(group).find(
            (user) => user.login === login && user.password === password
          );
          if (user) break;
        }
      }

      if (user) {
        return { success: true, user };
      } else {
        throw new Error(t('wrong_password_or_login'));
      }
    } else {
      throw new Error(isTeacher ? t('no_teachers_found') : t('groups_foundnt'));
    }
  } catch (error) {
    console.error('Error checking login credentials:', error);
    throw error;
  }
};

export const LoginPage = ({ setUser }) => {
  const { t } = useTranslation();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isTeacher, setIsTeacher] = useState(false); 

  useEffect(() => {
    // Получаем id пользователя из localStorage и устанавливаем его как текущего пользователя
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUser({ id: savedUserId });
    }
  }, [setUser]);

  const handleLogin = async () => {
    if (!login || !password) {
      setErrorMessage(t('error_login_input_name_and_login'));
      return;
    }

    try {
      const response = await checkUserCredentials(login, password, t, isTeacher);
      
      if (response.success) {
        const { user } = response;
        // Сохраняем id пользователя и пароль в localStorage
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userPassword', password); // Сохранение пароля
        setUser({ id: user.id, password: password }); // Добавление пароля в объект пользователя
        setErrorMessage('');
        setSuccessMessage(t('success'));
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage('');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2 id='inter-font2'>{t('loginText')}</h2> 
        
        {errorMessage && <p className="error-message" id='inter-regular-font2'>{errorMessage}</p>}
        {successMessage && <p className="success-message" id='inter-regular-font2'>{successMessage}</p>}
        
        <div className='input-group'>
          <i className='fas fa-user'></i>
          <input
            type="text"
            placeholder={t('login2')}
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
        </div>
        
        <div className='input-group'>
          <i className='fas fa-lock'></i>
          <input
            type="password"
            placeholder={t('password_input')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group" id='inter-regular-font2'>
          <label>
            <input
              type="checkbox"
              checked={isTeacher}
              onChange={(e) => setIsTeacher(e.target.checked)}
            />
            {t('login_as_teacher')} 
          </label>
        </div>

        <button className="login-button" onClick={handleLogin}>
          {t('goInAcc')}
        </button>
      </div>

      <div className="image-section"></div>
    </div>
  );
};
