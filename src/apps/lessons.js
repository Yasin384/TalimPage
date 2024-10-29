import React, { useState, useEffect } from 'react';
import { lessons } from './base.js';
import { getScores, getHalfYear } from '../components/scores.js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import '../cssFiles/lessons.css';
import '../cssFiles/half-years.css';

const ScoreItem = React.memo(({ score }) => {
    const scoreValue = parseFloat(score.score); // Accessing score value
    let scoreClass = 'score-low';

    if (isNaN(scoreValue)) return null; // Return null if score is NaN

    if (scoreValue >= 4) {
        scoreClass = 'score-high';
    } else if (scoreValue === 3) {
        scoreClass = 'score-average';
    }

    return (
        <div className={`score-item-container ${scoreClass}`}>
            <span className='score-item'>{scoreValue}</span>    
        </div>
    );
});

export default function LessonsPage({ user }) {
    const navigate = useNavigate();
    const [averagesScores, setAveragesScores] = useState([]);
    const { t } = useTranslation();
    const [halfyear, setHalfYear] = useState(1); // Default to first half year
    
    useEffect(() => {
        const fetchScores = async () => {
            try {
                const scoresPromises = lessons.map(async (lesson) => {
                    // Fetch scores for each subject
                    const { scores: scoresForSubject } = await getScores(user.id, lesson.name, user.group.split(' ')[0], halfyear);
    
                    // Calculate the average score correctly
                    const averageScore = scoresForSubject.length > 0 
                        ? scoresForSubject.reduce((acc, score) => acc + (isNaN(score.score) ? 0 : parseFloat(score.score)), 0) / scoresForSubject.length 
                        : 0;
    
                    return {
                        name: lesson.name,
                        scores: scoresForSubject || [],
                        averageScore: isNaN(averageScore) ? 0 : averageScore,
                    };
                });
    
                // Wait for all promises to resolve
                const scores = await Promise.all(scoresPromises);
                setAveragesScores(scores);
            } catch (error) {
                console.error('Error fetching scores:', error);
                setAveragesScores([]);
            }
        };
    
        fetchScores();
    }, [user.id, halfyear]); // Ensure halfyear is included in the dependencies
    

    const handleClickLesson = (lesson) => {
        navigate('/lessonInfo', { state: { lesson } });
    };

    return (
        <div className="lessonsPage">
            <div className='half-years'>
                <div className={`half-btn ${halfyear === 1 ? 'current' : ''}`} onClick={() => setHalfYear(1)}>
                    <p id='inter-font2'>1 {t('half-year')}</p>
                </div>
                <div className={`half-btn ${halfyear === 2 ? 'current' : ''}`} onClick={() => setHalfYear(2)}>
                    <p id='inter-font2'>2 {t('half-year')}</p>
                </div>
            </div>
            <div className="lesson-grid">
                {averagesScores.map((lesson, index) => (
                    <div className='lesson-card5' key={index} onClick={() => handleClickLesson(lesson)}>
                        <div className="lesson-info">
                            <p className='lesson-name' id='inter-font2'>{t(lesson.name)}</p>
                        </div>
                        <div className='average-score'>
                            <p className={`score-${Math.ceil(lesson.averageScore)}`}>
                                {lesson.averageScore.toFixed(1) !== '0.0' ? (
                                    <span className="average-badge" id='inter-font2'> {lesson.averageScore.toFixed(1)}</span>
                                ) : (
                                    <p id='inter-font2' class='no_score'>{t('no_score')}</p>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
