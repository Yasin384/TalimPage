import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { getDatabase, ref, child, get } from "firebase/database";

import '../cssFiles/selectGroups.css'; 

export const SelectGroupPage = ({ user }) => {
    
    const [users, setUsers] = useState([]);
    const location = useLocation(); 
    const { lesson, date } = location.state || {};
    const groups = lesson?.group || []; 
    

    const { t } = useTranslation();
    const navigate = useNavigate();
    const s1 = (group, date, lesson) => {
        navigate('/scores', { state: { group, date, lesson } });
    }
    const handleClick = (group, date, lesson) => {
        if (group) {
            s1(group, date, lesson);
        }
    }
    return (
      <div className='select-groups-page'>
        {groups.length > 0 ? (
          groups.map((group, index) => (
            <div key={index} className='groupCard'>
              <div className='groupName' id='inter-font' onClick={() => handleClick(group, date, lesson)}>{index + 1}. {t(group)}</div>
            </div>
          ))
        ) : (
          <p className='noGroup'>Пользователи не найдены</p>
        )}
      </div>
    );
};
