import React from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import '../cssComponents/TouchBar.css'; // Import the CSS file for styling

const contributions = {
    'main': ['/profile','/lesson'],
    'lessons': ['/lessons','/lessonInfo'],
    'rating': ['/rating','/leaderBoard'],
    'aichat': ['/chat']
}

function TouchBar({ user }) {
    const navigate = useNavigate();
    const location = useLocation();

    const navigateAndClose = (path) => {
        navigate(path);
        closeMenu();
    };

    const closeMenu = () => {
        document.body.style.overflow = 'auto'; // Reset overflow
    };

    return (
        <div className="TouchBar">
            <div className="TouchBar-icon" id={location.pathname === '/' || contributions['main'].includes(location.pathname) ? 'current4' : 'assad'} onClick={() => navigateAndClose('/')}>
                <i className="fa-solid fa-home"></i>
            </div>
            {user.role !== 'Teacher' && (
            <div className="TouchBar-icon" id={contributions['lessons'].includes(location.pathname) ? 'current4' : 'assad'} onClick={() => navigateAndClose('/lessons')}>
                <i class="fa-solid fa-clipboard"></i>
            </div>
            )}
            <div className="TouchBar-icon" id={contributions['rating'].includes(location.pathname) ? 'current4' : 'assad'} onClick={() => navigateAndClose('/rating')}>
                <i className="fas fa-star"></i>
            </div>
            <div className="TouchBar-icon" id={contributions['aichat'].includes(location.pathname) ? 'current4' : 'assad'} onClick={() => navigateAndClose('/chat')}>
            <i class="fa-solid fa-comment"/>
            </div>
        </div>
    );
}

export default TouchBar;