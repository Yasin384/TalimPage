import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { getDatabase, ref, get } from 'firebase/database';
import '../cssFiles/leaderboard.css'; 

export const LeaderboardUs = ({ user }) => {
    const { t } = useTranslation();
    const location = useLocation();
    const { group } = location?.state || ''; // Получаем название группы

    const [groupUsers, setGroupUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroupUsers = async () => {
            if (!group) return;

            setLoading(true);
            const db = getDatabase();
            const groupRef = ref(db, `users/groups/${group}`); // Ссылка на группу

            try {
                const snapshot = await get(groupRef);
                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const usersList = Object.keys(usersData).map(userId => ({
                        id: userId,
                        ...usersData[userId]
                    }));

                    // Сортируем пользователей по убыванию значения score
                    usersList.sort((a, b) => (b.score || 0) - (a.score || 0));

                    setGroupUsers(usersList);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching group users:", error);
                setLoading(false);
            }
        };

        fetchGroupUsers();
    }, [group]);

    return (
        <div className="leaderboard-page">
            <h1 className="leaderboard-title" id='inter-font'>{t(group)}</h1>
            {loading ? (
                <p className="loading-message">{t('loading')}</p>
            ) : (
                <div className="users-list">
                    {groupUsers.length > 0 ? (
                        groupUsers.map(userL => (
                            <div key={userL.id} className="user-item">
                                <span className="user-name" id='inter-regular-font2'>
                                    <i className="fas fa-user"></i> {userL.name + ' ' + userL.surname} {userL.login === user.login ? `(${t('you')})` : ''}
                                </span>
                                <span className="user-score" id='inter-font2'>
                                    <i className="fas fa-star"></i> {userL.score || 0} Б
                                </span>
                            </div>
                        ))
                    ) : (
                        <p className="no-users-message">{t('noUsersFound')}</p>
                    )}
                </div>
            )}
        </div>
    );
};
