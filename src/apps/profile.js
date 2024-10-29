import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import '../cssFiles/profile.css'

export default function ProfilePage ({ user, setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const groupName = user.group ? user.group.split(' ')[0] : ''
  const handleLogout = () => {
    localStorage.removeItem('userPassword');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/'); 
  };
  const handleChange = () => {
    navigate('/changepas'); 
  };
  const handleBackClick = () => {
    navigate('/'); 
};
  return (
    <>
    <div className='profile-page'>
        <div className='profile-content'>
            {/* Profile Image */}
            <img src='/logo.png' alt='Profile' className='profile-image' />
            
            {/* Group/Role */}
            <p className="profile-group" id='inter-font'>
                {user.role === 'Teacher' ? t(user.lessonTeacher) : t(groupName)}
            </p>
            
            {/* User Full Name */}
            <h2 id='inter-font'>
                {user?.surname + ' ' + user?.name || 'Имя пользователя'}
            </h2>

            {/* Login Information */}
            <p className="profile-login" id='inter-light-font'>
                {t('login4')}: {user?.login ? user?.login : ''}
            </p>
            
            {/* Edit Profile Button */}
            <button className='edit-profile-btn' onClick={handleChange} id='inter-font2'>
                {t('change_password_btn')}
            </button>
            
            {/* Logout Button */}
            <button className='exit-profile-btn' onClick={handleLogout} id='inter-font2'>
                {t('logout_btn')}
            </button>
        </div>
    </div>
</>



  );
};

