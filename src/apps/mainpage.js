import React, { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { shortDaysOfWeek, getCurrentDay, addTime, getDateForDay, clickLesson } from './base.js';
import { getUserById } from '../components/scores.js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import '../cssFiles/mainpage.css'

export function Mainpage({ user, setUser }) {
    const { t } = useTranslation();
    const [selectedDay, setSelectedDay] = useState(getCurrentDay());
    const [weekLessons, setWeekLessons] = useState(null);
    const isTeacher = user.role === 'Teacher';
    const group = user.group?.split(' ')[0];
    const groupName = user.group?.split(' ')[0];
    const numberOfLessons = 7;
    const navigate = useNavigate();

    useEffect(() => {
        const db = getDatabase();

        const handleLessonsForTeacher = (userName) => {
          const lessonsRef = ref(db, 'days/lessons');
          onValue(lessonsRef, (snapshot) => {
              const lessonsData = snapshot.val() || {};
              const allLessons = [];
      
              for (const group in lessonsData) {
                  for (const day in lessonsData[group]) {
                      for (let lessonIndex in lessonsData[group][day]) {
                          const lesson = lessonsData[group][day][lessonIndex];
      
                          if (lesson.teachername === userName) {
                              // Преобразуем lessonIndex в число для точного сравнения
                              lessonIndex = parseInt(lessonIndex);
      
                              const existingLesson = allLessons.find(x => x.day === day && x.lessonId === lessonIndex);
      
                              if (existingLesson) {
                                  // Добавляем группу, если ее еще нет в массиве group
                                  if (!existingLesson.group.includes(group)) {
                                      existingLesson.group.push(group);
                                  }
                              } else {
                                  // Создаем новый урок с массивом групп
                                  allLessons.push({
                                      name: lesson.name,
                                      hour: lesson.hour,
                                      minutes: lesson.minutes,
                                      breakDuration: lesson.breakDuration,
                                      group: [group], 
                                      day: day,       
                                      lessonId: lessonIndex,
                                      room: lesson.room
                                  });
                              }
                          }
                      }
                  }
              }
      
              
              setWeekLessons(allLessons);
          });
      };
      

        const handleLessonsForStudent = (group) => {
            const lessonsRef = ref(db, `days/lessons/${group}`);
            onValue(lessonsRef, (snapshot) => {
                const lessonsData = snapshot.val() || {};
                setWeekLessons(lessonsData);
            });
        };

        getUserById(user.id, user.role).then(userData => {
          if (!userData || userData.password !== user.password) {
              
              localStorage.removeItem('user');
              return;
          }
        });
        if (!isTeacher) {
            
                handleLessonsForStudent(group);
            
        } else {
            handleLessonsForTeacher(user.surname);
        }
    }, [group, user.id, user.password, user.name, isTeacher]);
    let lessons = [];


    if (!isTeacher) {
      lessons = Array.isArray(weekLessons) && weekLessons.length > 0
          ? weekLessons[shortDaysOfWeek.indexOf(selectedDay) + 1] || []
          : [];
  }
  
  const lessonsToShow = [...lessons];
  
  // Заполняем пустые уроки
  while (lessonsToShow.length < numberOfLessons) {
      lessonsToShow.push({
          startTime: "",
          endTime: "",
          name: "no_lessons",
          isEmpty: false,
          hour: 1,
          minutes: 20,
          breakDuration: lessonsToShow.length === 1 ? 45 : 5,
          room: 'none'
      });
  }
  
  if (isTeacher) {
    const dayIndex = shortDaysOfWeek.indexOf(selectedDay) + 1; // Индекс дня
    

    const foundLessons = weekLessons && Array.isArray(weekLessons)
        ? weekLessons.filter(x => x.day === String(dayIndex))
        : [];

    foundLessons.forEach(lesson => {
        if (lesson.lessonId < numberOfLessons) {
            lessonsToShow[lesson.lessonId] = { ...lesson }; 
        }
    });
}
    const calculateLessonTimes = (lessons) => {
        const times = [];
        let totalMinutes = 0;
        const startHour = 8;
        const startMinutes = 30;

        lessons.forEach((lesson) => {
          const hour = !isNaN(lesson.hour) ? Number(lesson.hour) : 0;
          const minutes = !isNaN(lesson.minutes) ? Number(lesson.minutes) : 0;
          const breakDuration = !isNaN(lesson.breakDuration) ? Number(lesson.breakDuration) : 0;
          
            const lessonName = lesson.name || t('unnamed_lesson');

            const lessonStartTime = addTime(startHour, startMinutes, Math.floor(totalMinutes / 60), totalMinutes % 60);
            totalMinutes += hour * 60 + minutes;
            const lessonEndTime = addTime(startHour, startMinutes, Math.floor(totalMinutes / 60), totalMinutes % 60);

            times.push({
                name: lessonName,
                startTime: lessonStartTime,
                endTime: lessonEndTime,
                group: lesson.group ? lesson.group : '',
                room: lesson.room
            });

            totalMinutes += breakDuration;
        });

        return times;
    };

    const lessonTimes = calculateLessonTimes(lessonsToShow);

    const handleClick = (lesson) => {
        if (lesson.startTime !== lesson.endTime && lesson.name !== 'no_lessons') {
            navigate('/lesson', { state: { lesson, date: getDateForDay(selectedDay) } });
        }
    };

    return (
      <div className="form5">
        <h1 id='inter-font'>{t("schedule")}</h1>
        <div className="days">
          
          <div className="week-days">
            {shortDaysOfWeek.filter(day => !day.endsWith('7')).map((day, index) => (
              <div
                key={index}
                className={`day ${day === selectedDay ? 'current' : ''}`}
                onClick={() => setSelectedDay(day)}
              >
                <p className='dayOfWeek' id='inter-light-font'>{t(day)}</p> 
                <p className='dateDay' id='inter-light-font'>{getDateForDay(day)}</p>
              </div>
            ))}
          </div>
          <div className="lessons">
            {!isTeacher ? (
              lessonTimes.length > 0 ? (
                lessonTimes.map((lesson, index) => (
                  <div key={index} className="blockLesson">
                    <div className={`time ${lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? 'empty' : ''}`} id='inter-regular-font'>
                      <div className="time-container">
                        <p>{lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? '-' : lesson.startTime}</p>
                        <p>-</p>
                        <p>{lesson.endTime === lesson.startTime || lesson.name === 'no_lessons' ? '-' : lesson.endTime}</p>
                      </div>
                      <div className='room-container'>
                        <p>{lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? '-' : lesson.room} {t('room')}.</p>
                      </div>
                    </div>
                    <div onClick={() => handleClick(lesson)} className={`lesson ${lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? 'empty' : ''}`} id='inter-light-font'>
                      <p>{t(lesson.name)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>{t('no_lessons_available')}</p>
              )
            ) : (
              lessonTimes.length > 0 ? (
                lessonTimes.map((lesson, index) => (
                  <div key={index} className="blockLesson" onClick={() => handleClick(lesson)}>
                    <div className={`time ${lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? 'empty' : ''}`} id='inter-regular-font'>
                      <div className="time-container">
                        <p>{lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? '-' : lesson.startTime}</p>
                        <p>-</p>
                        <p>{lesson.endTime === lesson.startTime || lesson.name === 'no_lessons' ? '-' : lesson.endTime}</p>
                      </div>
                      <div className='room-container'>
                        <p>{lesson.startTime === lesson.endTime || lesson.name === 'no_lessons' ? '-' : lesson.room} {t('room')}.</p>
                      </div>
                    </div>
                    <div className={`lesson ${lesson.name === 'no_lessons' ? 'empty' : ''}`} id='inter-light-font'>
                    <p>
                      {t(lesson.name)}{' '}
                      {lesson.group ? lesson.group.map((g) => t(g)).join(' ') : ''}
                    </p>

                    </div>
                  </div>
                ))
              ) : (
                <p>{t('no_teacher_lessons_available')}</p>
              )
            )}
          </div>
        </div>
      </div>
    );
}
