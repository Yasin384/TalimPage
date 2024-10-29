import React, { useState } from 'react';
import { getDatabase, ref, update } from "firebase/database";
import '../cssComponents/checkAttendance.css';

function CheckAttendance({ user }) {
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const db = getDatabase(); // Initialize Firebase database

    function checkAttendance() {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Get the current date and time for attendance record
            const currentDate = new Date().toISOString().split('T')[0];
            const currentTime = new Date().toLocaleTimeString();

            // Prepare the attendance data
            const attendanceData = {
                streakDays: 1, // Customize streak logic as needed
                cords: `${userLat} ${userLng}`,
                points: 1, // Customize point logic as needed
                dates: [
                    { date: currentDate, time: currentTime }
                ],
            };

            // Update attendance data in the database
            try {
                const attendanceRef = ref(db, `users/groups/${user.group.split(' ')[0]}/${user.id}/attendance`);
                await update(attendanceRef, attendanceData);
                setMessage("Attendance marked successfully!");
                setMessageType("success");
            } catch (error) {
                setMessage("Ошибка записи в БД.");
                setMessageType("error");
            }

            setShowMessage(true);
        }, () => {
            setMessage("Дайте разрешение на геопозицию пожалуйста");
            setMessageType("error");
            setShowMessage(true);
        });
    }

    function closeMessage() {
        setShowMessage(false);
    }

    return (
        <div className="checkAttendance-container">
            <button className='buttonAttendance' onClick={checkAttendance}>
                Отметится
            </button>
            {showMessage && (
                <div className="message-popup">
                    <div className={`popup-content ${messageType}`}>
                        <p id='inter-regular-font2'>{message}</p>
                        <button onClick={closeMessage}>ок</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckAttendance;
