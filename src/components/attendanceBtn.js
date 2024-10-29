import React, { useState } from 'react';
import { getDatabase, ref, update } from "firebase/database";
import '../cssComponents/checkAttendance.css';

const COLLEGE_COORDINATES = {
    latitude: 42.85765909539741,
    longitude: 74.59857798310655,
};

function CheckAttendance({ user }) {
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const db = getDatabase(); // Initialize Firebase database

    // Haversine formula to calculate distance in meters
    function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Radius of the earth in meters
        const phi1 = lat1 * (Math.PI / 180);
        const phi2 = lat2 * (Math.PI / 180);
        const deltaPhi = (lat2 - lat1) * (Math.PI / 180);
        const deltaLambda = (lon2 - lon1) * (Math.PI / 180);

        const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                  Math.cos(phi1) * Math.cos(phi2) *
                  Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Distance in meters
    }

    function checkAttendance() {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Calculate distance from college
            const distance = getDistanceFromLatLonInMeters(userLat, userLng, COLLEGE_COORDINATES.latitude, COLLEGE_COORDINATES.longitude);
            
            if (distance > 50) {
                setMessage("Вы слишком далеко от колледжа, чтобы отметиться."); // Too far message
                setMessageType("error");
                setShowMessage(true);
                return;
            }

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
                setMessage("Ошибка записи в БД."); // Database error message
                setMessageType("error");
            }

            setShowMessage(true);
        }, () => {
            setMessage("Дайте разрешение на геопозицию пожалуйста"); // Geolocation permission error
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
