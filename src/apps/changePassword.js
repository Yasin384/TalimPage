import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { changePassword } from '../components/scores'; 

import '../cssFiles/changePassword.css'

export default function ChangePassword({ user }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();


    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setErrorMessage('Новый пароль и подтверждение не совпадают.');
            setSuccessMessage('');
            return;
        }

        if (newPassword.includes(' ')) {
            setErrorMessage('Новый пароль не должен содержать пробелы.');
            setSuccessMessage('');
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage('Новый пароль должен содержать не менее 8 символов.');
            setSuccessMessage('');
            return;
        }

        try {
            if (user) {
                await changePassword(user.id, newPassword); 
                setErrorMessage('');
                setSuccessMessage('Пароль успешно изменен.');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setErrorMessage('Не удалось обновить пароль.');
                setSuccessMessage('');
            }
        } catch (error) {
            console.error('Ошибка при изменении пароля:', error);
            setErrorMessage('Произошла ошибка при изменении пароля.');
            setSuccessMessage('');
        }
    };

    const handleBackClick = () => {
        navigate('/profile');
    };

    return (
        <div className="form-change-password">
            <h2>Изменение пароля</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                    <label>Текущий пароль:</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Новый пароль:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Подтвердите новый пароль:</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="change-password-btn">Изменить пароль</button>
            </form>
            <div className='buttonback' id='changepas' onClick={handleBackClick}>
                <i className='fas fa-arrow-left'></i>
                <p>Назад</p>
            </div>
        </div>
    );
};