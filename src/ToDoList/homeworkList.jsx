import React from 'react';
import { lessons } from '../apps/base.js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './lessonst.css';

export default function HomeworkListPage({ user }) {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClickLesson = (lesson) => {
        navigate('/homework', { state: { lesson } });
    };

    return (
        <div className="lessonsPage10">
            <div className="lesson-grid10">
                {lessons.map((lesson, index) => (
                    <div className="lesson-card10" key={index} onClick={() => handleClickLesson(lesson)}>
                        <div className="lesson-info10">
                            <p className="lesson-name10">{t(lesson.name)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}