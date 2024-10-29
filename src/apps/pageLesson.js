import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getDatabase, ref, child, get, set } from "firebase/database";
import '../cssFiles/pageLesson.css';
import { getThemeLesson } from '../components/scores';

const db = getDatabase();

const findLessonByName = async (lessonName) => {
    const dbRef = ref(db);
    try {
        const snapshot = await get(child(dbRef, `days/homeWorks`));
        if (snapshot.exists()) {
            const lessons = snapshot.val();
            for (const key in lessons) {
                if (lessons[key].name === lessonName) {
                    return lessons[key];
                }
            }
            return null; 
        } else {
            console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};

const saveLessonData = async (lessonName, group, data) => {
    const lessonRef = ref(db, `days/homeWorks/${lessonName}/${group}`);
    try {
        await set(lessonRef, data);
    } catch (error) {
        console.error("Error saving lesson data:", error);
    }
};

export const PageLesson = ({ user }) => {
    const navigate = useNavigate();
    const [lessonData, setLessonData] = useState(null); 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ theme: '', homework: '' });
    const { t } = useTranslation();
    const location = useLocation();
    const { lesson, date } = location.state || {};

    useEffect(() => {
        const fetchThemeLesson = async () => {
            if (!date || !lesson || !lesson.name) return;

            try {
                console.log("Fetching theme lesson for:", { date, lesson });
                const lessonData = await getThemeLesson(
                    date, 
                    lesson.group ? lesson.group[0] : user.group.split(' ')[0], 
                    lesson.name
                );
                setLessonData(lessonData);
            } catch (error) {
                console.error("Error fetching theme lesson:", error);
            }
        };

        fetchThemeLesson();
    }, [date, lesson]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };
    
    const handleBackClick = () => {
        navigate('/'); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const dataToSave = [{
            date: date,
            theme: formData.theme,
            homework: formData.homework,
        }];
        lesson.group.forEach(x => {
            saveLessonData(lesson.name, x, dataToSave);
        });
        setIsEditing(false);
        setFormData({ theme: '', homework: '' }); // Reset form data after save
    };

    if (!lesson) {
        return <div className="page-lesson-container">Информация о уроке не найдена</div>;
    }

    const editLesson = () => {
        if (lesson.startTime !== lesson.endTime && lesson.name !== 'Нет пар') {
            setIsEditing(true);
        }
    };

    const selectGroup = (lesson) => {
        navigate('/groupss', { state: { lesson, date } });
    };

    return (
        <div className="page-lesson-container">
            <div className="lesson-card2">
                <h1 className="lesson-title2">{t(lesson.name)}</h1>
                <h1 className="lesson-date2">{date}</h1>
                <div className="divider"></div>
                <div className="lesson-details2">
                    <p><i className="fas fa-file-alt"></i> {t('lessonRul')}: </p>
                    <p>{lessonData ? lessonData.theme : t('empty_lesson')}</p>
                    <div className="divider"></div>
                    <p><i className="fas fa-clock"></i> {lesson.startTime} - {lesson.endTime}</p>
                    <div className="divider"></div>
                    <p><i className="fas fa-address-book"></i> {t('homework')}:</p>
                    <p>{lessonData ? lessonData.homework : t('empty_lesson')}</p>
                </div>
            </div>
    
            {user?.role === 'Teacher' && (
                <div className="teacher-actions">
                    <button className="edit-lesson" onClick={editLesson} aria-label="Edit lesson">{t('edit_lesson')}</button>
                    <button className="edit-scores" onClick={() => selectGroup(lesson)} aria-label="Edit scores">{t('edit_scores')}</button>
                </div>
            )}
    
            {isEditing && (
                <form onSubmit={handleSubmit} className="edit-form">
                    <textarea 
                        name="theme" 
                        value={formData.theme} 
                        onChange={handleChange} 
                        placeholder={t('Theme')} 
                        className="edit-input"
                    />
                    <textarea 
                        name="homework" 
                        value={formData.homework} 
                        onChange={handleChange} 
                        placeholder={t('Homework')} 
                        className="edit-input"
                    />
                    <button type="submit" className="save-btn">{t('Save')}</button>
                    <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>{t('Cancel')}</button>
                </form>
            )}
    
            <div className="buttonback" onClick={handleBackClick} aria-label="Back button">
                <i className="fas fa-arrow-left"></i>
                <p>{t('back_btn')}</p>
            </div>
        </div>
    );
};
