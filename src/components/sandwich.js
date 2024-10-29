import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../apps/langs';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/sandwich.css'; 

export const Sandwich = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const sideDrawerRef = useRef(null);
  const buttonRef = useRef(null); // Reference for the button

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent click event from bubbling up
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : 'auto'; 
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // Reset overflow
  };

  const navigateAndClose = (path) => {
    navigate(path);
    closeMenu();
  };

  const groupName = user?.group?.split(' ')[0];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Ensure both the drawer and the button are not the target
      if (
        sideDrawerRef.current &&
        !sideDrawerRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        closeMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="meta-edu2">
      <div className="page-header">
        <button 
          ref={buttonRef}
          onClick={toggleMenu} 
          className="toggle-menu"
        >
          &#9776;
        </button>
          <h1 id='inter-font' onClick={() => navigateAndClose('/')}>TalimPage</h1>
          
          <div className="TouchBar-icon" onClick={() => navigateAndClose('/chat')}>
                <i className="fas fa-comment"></i>
            </div>
        
      </div>
  
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
  
      <div className={`side-drawer ${isOpen ? 'open' : ''}`} ref={sideDrawerRef}>
        {user ? (
          <>
            <div className="info">
  <div className="profile-container">
    <div className="profile-content2">
      <div className="profile-info2">
        <img src="/logo.png" alt="Profile" className="profile-image" />
        <p className="profile-group">{user.role === 'Teacher' ? t(user.lessonTeacher) : t(groupName)}</p>
        <h2 id="inter-font" className="profile-name">
          {user.name ? `${user.surname} ${user.name}` : `Загрузка...`}
        </h2>
        <p className="profile-login">
          {t('login4')}: {user?.login ? user?.login : ''}
        </p>
      </div>
    </div>
  </div>
</div>
            <div className="btns">
              <div className="down">

                <div className="features" id="inter-light-font">
                  
                  <div className="waswasntbtn">
  <button 
    onClick={() => window.location.href = 'https://metaattendance-production.up.railway.app'} 
    className="btn-link">
    <i className="fa-solid fa-circle-info"></i>
    <p>{t('waswasnt')}</p>
  </button>
</div>
<hr></hr>
                  <div className="accountdev" onClick={() => navigateAndClose('/profile')}>
                    <i className="fas fa-user"></i>
                    <p>{t('profile')}</p>
                  </div>
                  
                  
                  {user.role === 'admin' && (
                    <>
                    <div className="secretbtn" onClick={() => navigateAndClose('/adminpane')}>
                      <i className="fas fa-star"></i>
                      <p>{t('admin')}</p>
                    </div>
                    <div className="buttonforSchedule" onClick={() => navigateAndClose('/scheduleControl')}>
                      <i className="fas fa-star"></i>
                      <p>{t('scheduleD')}</p>
                    </div>
                    <LanguageSelector />
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p id="inter-font">{t('goInAcc')}...</p>
        )}
      </div>
    </div>
  );
  
};
