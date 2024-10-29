import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDatabase, ref, update, get } from 'firebase/database';
import { writeFile, read, utils } from 'xlsx';
import { getUsersInGroup, getHalfYear, changeScores } from '../components/scores';
import { scores, scoresScore } from './base.js';
import '../cssFiles/pageScores.css';

export const PageScores = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [selectedScore, setSelectedScore] = useState(null);
  const [userScores, setUserScores] = useState({});
  const [excelFile, setExcelFile] = useState(null);
  const location = useLocation();
  const { group, date, lesson } = location.state || {};
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndScores = async () => {
      const result = await getUsersInGroup(group);
      setUsers(Array.isArray(result) ? result : Object.values(result));

      const db = getDatabase();
      const lessonName = lesson.name;
      const scoresRef = ref(db, `users/groups/${group}`);
      const snapshot = await get(scoresRef);

      if (snapshot.exists()) {
        const allUserScores = snapshot.val();
        const updatedScores = {};

        for (const userId in allUserScores) {
          const userScores = allUserScores[userId].scores?.[lessonName]?.score || [];
          const scoreForDate = userScores.find((s) => s.date === date);
          if (scoreForDate) {
            updatedScores[userId] = scoreForDate.score;
          }
        }

        setUserScores(updatedScores);
      }
    };

    fetchUsersAndScores();
  }, [group, lesson, date]);

  const handleUserClick = (userId) => {
    if (selectedScore) {
      setUserScores((prevScores) => ({
        ...prevScores,
        [userId]: selectedScore,
      }));
    } else {
      alert("Пожалуйста, выберите оценку.");
    }
  };

  const handleSaveScores = async () => {
    try {
      const db = getDatabase();
      const updates = {};
      const halfyear = await getHalfYear();

      for (const [userId, score] of Object.entries(userScores)) {
        const lessonName = lesson.name;
        const scoresRef = ref(db, `users/groups/${group}/${userId}/scores/${lessonName}`);
        const snapshot = await get(scoresRef);
        const currentScores = snapshot.exists() ? snapshot.val().score || [] : [];
        const existingScoreIndex = currentScores.findIndex((s) => s.date === date);

        if (existingScoreIndex !== -1) {
          if (score === 'clear-score' || score === 'нет оценки') {
            currentScores.splice(existingScoreIndex, 1);
          } else {
            currentScores[existingScoreIndex].score = score;
            currentScores[existingScoreIndex].halfyear = halfyear;
          }
        } else if (score !== 'clear-score' && score !== 'нет оценки') {
          currentScores.push({
            score: score,
            date: date,
            halfyear: halfyear,
          });
        }

        updates[`users/groups/${group}/${userId}/scores/${lessonName}`] = {
          score: currentScores,
        };

        const gotScore = scoresScore.find(x => x.score === score);
        if (gotScore) {
          await changeScores(userId, gotScore.scores);
        }
      }

      await update(ref(db), updates);
      alert("Оценки успешно сохранены!");
    } catch (error) {
      console.error("Ошибка при сохранении оценок:", error);
      alert("Произошла ошибка при сохранении оценок.");
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDownloadExcel = () => {
    const worksheet = utils.json_to_sheet(
      users.map(user => ({
        Name: `${user.surname} ${user.name}`,
        Score: t(userScores[user.id]) || 'нет оценки',
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Scores');

    writeFile(workbook, 'UserScores.xlsx');
  };

  const handleUploadExcel = (event) => {
    const file = event.target.files[0];
    if (!file || !(file instanceof Blob)) {
      alert("Пожалуйста, загрузите корректный Excel файл.");
      return;
    }
    setExcelFile(file);
  };

  const handleSubmitExcel = () => {
    if (!excelFile) {
      alert("Пожалуйста, загрузите файл перед отправкой.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = read(data, { type: 'array' });
      const worksheet = workbook.Sheets['Scores'];

      if (!worksheet) {
        alert("Лист 'Scores' не найден в Excel файле.");
        return;
      }

      const json = utils.sheet_to_json(worksheet);
      const updates = {};

      json.forEach(({ Name, Score }) => {
        const user = users.find(user => `${user.surname} ${user.name}`.trim() === Name.trim());
        if (user) {
          updates[user.id] = Score;
        } else {
          console.warn(`Пользователь с именем ${Name} не найден.`);
        }
      });

      console.log("Updates from Excel:", updates); // Debugging log

      setUserScores(prev => ({ ...prev, ...updates }));
      console.log("Updated user scores:", userScores); // Debugging log
      alert("Данные из Excel успешно загружены!");
    };

    reader.readAsArrayBuffer(excelFile);
  };

  return (
    <div className='scoresPage'>
      <div className='tools-scores'>
        {scores.map((score, index) => (
          <div
            key={index}
            className='tool-score'
            onClick={() => setSelectedScore(score)}
            id='inter-font'
            style={{ cursor: 'pointer', backgroundColor: selectedScore === score ? '#e0e0e0' : 'transparent' }}
          >
            <p>{t(score)}</p>
          </div>
        ))}
      </div>
      <div className='listUsers'>
        {users.length > 0 ? (
          <>
            {users.map((user, index) => (
              user.name ? (
                <div key={index} className='userCard'>
                  <div className='userName' id='inter-light-font'>
                    {index + 1}. {user.surname} {user.name}
                  </div>
                  <div className='slot-for-score'
                    onClick={() => handleUserClick(user.id)}
                    style={{ cursor: 'pointer' }}
                    id='inter-font2'
                  >
                    {userScores[user.id] === 'clear-score' ? ' ' : t(userScores[user.id]) || 'нет оценки'}
                  </div>
                </div>
              ) : null
            ))}
            <button type='button' id='inter-font' onClick={handleSaveScores}>
              Сохранить
            </button>
            <button type='button' id='inter-font' onClick={handleDownloadExcel}>
              Скачать оценки в Excel
            </button>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleUploadExcel}
              style={{ marginTop: '10px' }}
            />
            <button type='button' id='inter-font' onClick={handleSubmitExcel}>
              Отправить файл в excel
            </button>
          </>
        ) : (
          <p className='noUsers'>Пользователи не найдены</p>
        )}
        <div className='buttonback' onClick={handleBackClick}>
          <i className='fas fa-arrow-left'></i>
          <p>{t('back_btn')}</p>
        </div>
      </div>
    </div>
  );
};