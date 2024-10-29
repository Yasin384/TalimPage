import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDatabase, ref, get } from "firebase/database";
import '../cssFiles/lessonInfo.css';

export const LessonInfoPage = ({ user }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { lesson } = location.state || {};
    const [lessonData, setLessonData] = useState([]);
    const [score, setScore] = useState([]);
    const navigate = useNavigate();
    const getCurrentWeekDates = () => {
        const today = new Date();
        const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay())); // Start of the week (Sunday)
        const dates = [];
    
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            dates.push(date.toISOString().split('T')[0]); // Format as YYYY-MM-DD
        }
    
        return dates;
    };
    const nameSubject = lesson ? lesson.name : '';

    useEffect(() => {
        const fetchLessons = async () => {
            if (!nameSubject) return;

            const db = getDatabase();
            const lessonsRef = ref(db, `days/homeWorks/${nameSubject}/${user.group.split(' ')[0]}`);
            
            try {
                const snapshot = await get(lessonsRef);
                if (snapshot.exists()) {
                    const lessons = snapshot.val();
                    setLessonData(Object.values(lessons));
                } else {
                    console.log("Нет данных по этому предмету.");
                }
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        fetchLessons();
    }, [nameSubject]);
    
    useEffect(() => {
        const fetchUserScore = async () => {
            if (!nameSubject) return;
        
            const db = getDatabase();
            const scoreRef = ref(db, `users/groups/${user.group.split(' ')[0]}/${user.id}/scores/${nameSubject}/score`);
            
            try {
                const snapshot = await get(scoreRef);
                if (snapshot.exists()) {
                    const scores = Object.values(snapshot.val());
                    setScore(scores);
                } else {
                    console.log("Нет данных по оценке пользователя.");
                }
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };
    
        fetchUserScore();
    }, [user.group.split(' ')[0], user.id, nameSubject]);
    
    const handleClick = (lesson, date, lesson2) => {
        if (lesson) {
            lesson.name = lesson2.name;
            navigate('/lesson', { state: { lesson, date: date } });
        }
    };
    
    return (
        <div className='lessonInfoPage'>
            <div className='header-info'>
                <p id='inter-font' className='titleLesson'>{t(lesson.name)}</p>
                <p id='inter-font' className='groupL'>{t(user.group.split(' ')[0])}</p>
            </div>
            <div className='lessonsInfo-container'>
                {score.length > 0 ? (
                    score.map((lesson1, index) => {
                        const lessonScore = score[index];
                        return (
                            <div 
                                className='lesson-block1' 
                                key={index} 
                                onClick={() => handleClick(lesson1 !== '1' ? lesson1 : {}, lessonScore?.date, lesson)}
                            >
                                <h3 id='inter-font'>{lessonScore?.date || ''}</h3>
                                {lessonScore ? (
                                    <h3 className={`color-${lessonScore?.score}`} id='inter-font'>
                                        {t(lessonScore?.score)}
                                    </h3>
                                ) : (
                                    <h3 className="color-default" id='inter-font'>
                                        {t('no_score')}
                                    </h3>
                                )}
                            </div>
                        );
                    })
                ) : (
                    // If no lesson data is available, render 3 placeholder blocks
                    Array(8).fill().map((_, idx) => (
                        <div className='empty-lesson-block' key={idx} id='inter-font2'>-</div>
                    ))
                )}
            </div>
        </div>
    );
};
