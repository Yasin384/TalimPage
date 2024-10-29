import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti'; // Импорт конфетти
import '../cssFiles/ratingPage.css';

export const RatingPage = ({ user }) => {
    const { t } = useTranslation();
    const [groupRankings, setGroupRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isWinner, setIsWinner] = useState(false); // Стейт для отслеживания победителя
    const navigate = useNavigate();

    const handleClick = (group) => {
        if (group) {
            navigate('/leaderBoard', { state: { group } });
        }
    };

    useEffect(() => {
        const fetchGroupRankings = async () => {
            setLoading(true);
            const db = getDatabase();
            const dbRef = ref(db, 'users/groups');
            try {
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const groups = snapshot.val();
                    const rankings = [];

                    for (const groupId in groups) {
                        const users = groups[groupId];
                        let groupTotalScore = 0;
                        
                        for (const userId in users) {
                            groupTotalScore += users[userId].score || 0;
                        }

                        rankings.push({
                            groupId,
                            totalScore: groupTotalScore,
                        });
                    }

                    rankings.sort((a, b) => b.totalScore - a.totalScore);
                    setGroupRankings(rankings);

                    // Проверяем, является ли группа пользователя первой
                    if (rankings.length > 0 && rankings[0].groupId === user.group.split(' ')[0]) {
                        setIsWinner(true);
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };

        fetchGroupRankings();
    }, [user.group]); // Добавляем user.group в зависимости
    
    return (
        <div className="rating-page">
            <h1 id='inter-font2'>{t('groupRankingTitle')}</h1>
            {loading ? (
                <p>{t('loading')}</p>
            ) : (
                <div className="rankings-list">
    {groupRankings.length > 0 ? (
        groupRankings.map((group, index) => {

            if (index < 3) return (
                <div 
                    key={group.groupId}
                    className={`ranking-item ${index === 0 ? 'gold' : index === 1 ? 'silver' : 'bronze'}`}
                    onClick={() => handleClick(group.groupId)}
                >
                    <span id='inter-font2'>{index + 1}. {t(group.groupId)}</span>
                    <span id='inter-font2'>{group.totalScore} Б</span>
                </div>
            );
        })
    ) : (
        <p>{t('noGroupsFound')}</p>
    )}
</div>
            )}
            {isWinner && <Confetti width={window.innerWidth} height={window.innerHeight} />} {/* Конфетти при победе */}
        </div>
    );
};
