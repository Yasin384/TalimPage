import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getDatabase, ref, get } from "firebase/database";
import './homeworkTodo.css';

export const HomeworkTodoPage = ({ user }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { lesson } = location.state || {};
    const [homeworkList, setHomeworkList] = useState([]);
    const [completedHomework, setCompletedHomework] = useState([]);
    const nameSubject = lesson ? lesson.name : '';

    useEffect(() => {
        const fetchHomework = async () => {
            if (!nameSubject) return;

            const db = getDatabase();
            const homeworkRef = ref(db, `days/homeWorks/${nameSubject}/${user.group.split(' ')[0]}`);
            
            try {
                const snapshot = await get(homeworkRef);
                if (snapshot.exists()) {
                    const homework = snapshot.val();
                    setHomeworkList(Object.values(homework));
                } else {
                    console.log("Нет данных по домашним заданиям.");
                }
            } catch (error) {
                console.error("Ошибка при получении данных:", error);
            }
        };

        fetchHomework();
    }, [nameSubject, user.group]);

    const toggleComplete = (index) => {
        setCompletedHomework(prev => {
            const newCompleted = [...prev];
            if (newCompleted.includes(index)) {
                newCompleted.splice(newCompleted.indexOf(index), 1);
            } else {
                newCompleted.push(index);
            }
            return newCompleted;
        });
    };

    return (
        <div className='homeworkTodoPage'>
            <div className='header-info'>
                <h1 id='inter-font'>{t('homework_for')} {t(nameSubject)}</h1>
            </div>
            <div className='homework-list-container'>
                {homeworkList.length > 0 ? (
                    homeworkList.map((homework, index) => (
                        <div 
                            key={index} 
                            className={`homework-block ${completedHomework.includes(index) ? 'completed' : ''}`} 
                            onClick={() => toggleComplete(index)}
                        >
                            <p id='inter-font'>{homework.homework}</p>
                            <span className="toggle-icon">✔</span>
                        </div>
                    ))
                ) : (
                    <p id='inter-font'>{t('no_homework')}</p>
                )}
            </div>
        </div>
    );
};