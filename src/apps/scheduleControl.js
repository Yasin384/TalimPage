import React, { useState, useEffect } from 'react';
import { ref, get, child, update } from 'firebase/database'; // Added 'update'
import { database } from '../firebase'; // Adjust the path to your firebase file
import '../cssFiles/controlSa.css'; // Import the CSS file

import { daysOfWeek } from './base';

import { useTranslation } from 'react-i18next';

export const ScheduleControl = ({ user }) => {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [schedule, setSchedule] = useState(null);
    const [editedSchedule, setEditedSchedule] = useState({}); // Track changes to schedule

    const { t } = useTranslation();

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const dbRef = ref(database);
                const snapshot = await get(child(dbRef, 'days/lessons'));
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const groupKeys = Object.keys(data);
                    setGroups(groupKeys);
                } else {
                    console.error('No groups found');
                }
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    const fetchScheduleForGroup = async (group) => {
        try {
            const dbRef = ref(database);
            const snapshot = await get(child(dbRef, `days/lessons/${group}`));
            if (snapshot.exists()) {
                const scheduleData = snapshot.val();
                setSchedule(scheduleData);
                setSelectedGroup(group);
                setEditedSchedule(scheduleData); // Initialize with fetched schedule
            } else {
                console.error('No schedule found for group', group);
            }
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    const handleInputChange = (day, index, field, value) => {
        // Update the edited schedule based on user input
        const updatedSchedule = { ...editedSchedule };
        updatedSchedule[day][index] = { 
            ...updatedSchedule[day][index], 
            [field]: value 
        };
        setEditedSchedule(updatedSchedule);
    };

    const saveChanges = async () => {
        try {
            const updates = {};
            updates[`days/lessons/${selectedGroup}`] = editedSchedule;
            await update(ref(database), updates); // Save updated schedule to Firebase
            alert('Schedule updated successfully!');
        } catch (error) {
            console.error('Error saving schedule:', error);
        }
    };

    return (
        <div className="schedule-control">
            <h2>Select a Group to View and Edit Schedule</h2>
            <div className="group-buttons">
                {groups.map((group) => (
                    <button key={group} className="group-btn" onClick={() => fetchScheduleForGroup(group)}>
                        {t(group)}
                    </button>
                ))}
            </div>

            {selectedGroup && editedSchedule && (
                <div className="schedule-details">
                    <h3>Schedule for {t(selectedGroup)}</h3>
                    {Object.keys(editedSchedule).map((day) => (
                        <div key={day} className="day-schedule">
                            <h4>{t(daysOfWeek[Number(day)])}</h4>
                            <div className="lesson-cards">
                                {editedSchedule[day].map((lesson, index) => (
                                    <div key={index} className="lesson-card">
                                        <input 
                                            type="text" 
                                            value={lesson.name} 
                                            onChange={(e) => handleInputChange(day, index, 'name', e.target.value)} 
                                            placeholder={t('Lesson Name')}
                                        />
                                        <input 
                                            type="number" 
                                            value={lesson.hour} 
                                            onChange={(e) => handleInputChange(day, index, 'hour', e.target.value)} 
                                            placeholder={t('Hour')}
                                        />
                                        <input 
                                            type="number" 
                                            value={lesson.minutes} 
                                            onChange={(e) => handleInputChange(day, index, 'minutes', e.target.value)} 
                                            placeholder={t('Minutes')}
                                        />
                                        <input 
                                            type="number" 
                                            value={lesson.breakDuration} 
                                            onChange={(e) => handleInputChange(day, index, 'breakDuration', e.target.value)} 
                                            placeholder={t('Break Duration')}
                                        />
                                        <input 
                                            type="text" 
                                            value={lesson.teachername} 
                                            onChange={(e) => handleInputChange(day, index, 'teachername', e.target.value)} 
                                            placeholder={t('Teacher Name')}
                                        />
                                        <input 
                                            type="text" 
                                            value={lesson.room} 
                                            onChange={(e) => handleInputChange(day, index, 'room', e.target.value)} 
                                            placeholder={t('Room')}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button onClick={saveChanges} className="save-btn">
                        {t('Save Changes')}
                    </button>
                </div>
            )}
        </div>
    );
};
