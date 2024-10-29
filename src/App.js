import { database } from './firebase';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './App.css';
import { Mainpage } from './apps/mainpage';
import { LoginPage } from './apps/registrpage';
import ProfilePage from './apps/profile';
import ChangePassword from './apps/changePassword';
import AdminPanel from './apps/adminpanel';
import LessonsPage from './apps/lessons';
import { PageScores } from './apps/pageScores';
import TeacherPage from './apps/teacherPage';
import { PageLesson } from './apps/pageLesson';
import { SelectGroupPage } from './apps/selectGroups';
import { LessonInfoPage } from './apps/lessonInfo';
import { Sandwich } from './components/sandwich.js';
import { LogoAndContacts } from './apps/logo.js';
import { ref, get, child } from 'firebase/database';
import { ScheduleControl } from './apps/scheduleControl.js';
import { RatingPage } from './apps/rating.js';

import { isMobile } from 'react-device-detect';
import { LeaderboardUs } from './apps/leaderboardus.js';
import TouchBar from './components/touchbar.js';
import CheckAttendance from './components/attendanceBtn.js';
import LoadingPage from './components/loading.js';

function App() {
  const [user, setUser] = useState(null);
  const { t } = useTranslation();

  return (
    <Router>
      <Main user={user} setUser={setUser} />
    </Router>
    
  );
}

function Main({ user, setUser }) {
  const location = useLocation();
  const navigate = useNavigate();
  const savedPassword = localStorage.getItem('userPassword');
  const showLogoAndContacts = ['/'];

  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');

    if (savedUserId) {
      const fetchUserById = async (userId) => {
        try {
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, 'users/groups'));
          let foundUser = null;
    
          if (snapshot.exists()) {
            const data = snapshot.val();
    
            for (const groupKey in data) {
              const group = data[groupKey];
    
              for (const userKey in group) {
                const userData = group[userKey];
                if (userData.id === userId) {
                  foundUser = userData;
                  break;
                }
              }
    
              if (foundUser) break;
            }
          }
    
          if (foundUser) {
            if (foundUser.password === savedPassword) {
              setUser(foundUser);
            } else {
              handleLogout();
            }
          } else {
            const teacherSnapshot = await get(child(dbRef, `users/teachers/${userId}`));
    
            if (teacherSnapshot.exists()) {
              const teacherData = teacherSnapshot.val();
    
              if (teacherData.password === savedPassword) {
                setUser(teacherData);
              } else {
                handleLogout();
              }
            } else {
              console.error('User not found in groups or teachers');
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };
      
      fetchUserById(savedUserId);
    }
  }, [savedPassword, setUser]);

  const handleLogout = () => {
    localStorage.removeItem('userPassword');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/');
  };

  

  return (
    <div className="App">
      <Sandwich user={user} />
      {user ? (
        <header className="App-header">
          <>
            {user.role !== 'Teacher' && user.name && <CheckAttendance user={user}/>}
          </>
          
         {user.name ? (
            <>
              <Routes>
                <Route path="/lessonInfo" element={<LessonInfoPage user={user} setUser={setUser} />} />
                <Route path="/groupss" element={<SelectGroupPage user={user} setUser={setUser} />} />
                <Route path="/changepas" element={<ChangePassword user={user} setUser={setUser} />} />
                <Route path="/profile" element={<ProfilePage user={user} setUser={setUser} />} />
                <Route path="/lessons" element={<LessonsPage user={user} />} />
                <Route path="/scheduleControl" element={<ScheduleControl user={user} />} />
                <Route path="/teacherPage" element={<TeacherPage user={user} />} />
                <Route path="/lesson" element={<PageLesson user={user} />} />
                <Route path="/" element={<Mainpage user={user} setUser={setUser} />} />
                <Route path="/rating" element={<RatingPage user={user}/>} />
                <Route path="/scores" element={<PageScores />} />
                <Route path="/adminpane" element={<AdminPanel />} />
                <Route path="/leaderBoard" element={<LeaderboardUs user={user} />} />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>

              {showLogoAndContacts.includes(location.pathname) && <LogoAndContacts />}
              <TouchBar user={user}/>
            </>
          ) : (
            <LoadingPage/>
          )}
        </header>
      ) : (
        <Routes>
          <Route path="/" element={<LoginPage setUser={setUser} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </div>
  );
  
}

export default App;
