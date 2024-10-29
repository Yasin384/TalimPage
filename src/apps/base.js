import React, { createContext, useEffect, useState } from 'react';


class LessonCreate {
    constructor(name, hour, minutes, breakDuration, teachername, room) {
        this.name = name
        this.hour = hour
        this.minutes = minutes
        this.breakDuration = breakDuration
        this.teachername = teachername
        this.room = room
    }
}
export const base = {
    days: {
        lessons: {
            "bl-24-9": {
                '1': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('chemistry',1,20,5,'Агибетова','301'),
                    new LessonCreate('math',1,20,45,'Шатманалиев','301'),
                    new LessonCreate('englang',1,20,5,'Мухамед Насир','203'), 
                    new LessonCreate('astronomy',1,20,5,'Доненко','203'),                   
                ],
                '2': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','301'),
                    new LessonCreate('physic',1,20,45,'Доненко','301'),
                    new LessonCreate('history',1,20,5,'Ботобекова','301'), 
                    new LessonCreate('turklang',1,20,5,'Жумабаев','203'),
                ],
                '3': [
                    new LessonCreate('englang',1,20,10,'Кожогулова.','201'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','203'),
                    new LessonCreate('no_lessons',1,20,45,'none','-'),
                    new LessonCreate('biology',1,20,5,'Агибетова','301'), 
                    new LessonCreate('worldliterature',1,20,5,'Оразунова','301'),
                ],
                '4': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('literature',1,20,5,'Орозакунова','301'),
                    new LessonCreate('englang',1,20,45,'Кожогулова','203'),
                    new LessonCreate('compscience',1,20,5,'Баяманов/Бактыбек уулу','к.к/201'), 
                    new LessonCreate('compprog',1,20,5,'Баяманов','203'),
                ],
                '5': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('social',1,20,5,'Каниметов','301'),
                    new LessonCreate('ruslang',1,20,45,'Низалиева','203'),
                    new LessonCreate('kyrglang',1,20,5,'Азылов','203'),
                    new LessonCreate('englang',1,20,5,'Умиталиева','203')
                ],
                '6': [
                    new LessonCreate('no_lessons',0,20,10,'none','-'),
                    new LessonCreate('PI',1,20,5,'Арстанбеков','-'),
                    new LessonCreate('doprizvprep',1,20,45,'Келдибеков','-'),
                ]
               },
          "kb-24-9": {
                '1': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('chemistry',1,20,5,'Агибетова','301'),
                    new LessonCreate('math',1,20,45,'Шатманалиева','301'),
                    new LessonCreate('englang',1,20,5,'Мухамед Насир','203'),
                    new LessonCreate('astronomy',1,20,5,'Доненко','203'),                    
                ],
                '2': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','301'),
                    new LessonCreate('physic',1,20,45,'Доненко','301'),
                    new LessonCreate('history',1,20,5,'Ботобекова','301'), 
                    new LessonCreate('turklang',1,20,5,'Жумабаев','203'),
                ],
                '3': [
                    new LessonCreate('englang',1,20,10, 'Кожогулова/Умиталиева', '201/202'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','203'),
                    new LessonCreate('no_lessons',1,20,45,'none','-'),
                    new LessonCreate('biology',1,20,5,'Агибетова','301'), 
                    new LessonCreate('worldliterature',1,20,5,'Оразакунова','301'),
                ],
                '4': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('literature',1,20,5,'Орозакунова','301'),
                    new LessonCreate('englang',1,20,45,'Кожогулова','203'),
                    new LessonCreate('compscience',1,20,5,'Баяманов/Бактыбек уулу','к.к/201'), 
                    new LessonCreate('compprog',1,20,5,'Баяманов','203'),
                ],
                '5': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('social',1,20,5,'Каниметов','301'),
                    new LessonCreate('ruslang',1,20,45,'Низалиева','203'),
                    new LessonCreate('kyrglang',1,20,5,'Азылов','203'),
                    new LessonCreate('englang',1,20,5, 'Умиталиева','203')
                        ],
                '6': [
                    new LessonCreate('no_lessons',0,20,10,'none','-'),
                    new LessonCreate('PI',1,20,5,'Арстанбеков','-'),
                    new LessonCreate('doprizvprep',1,20,45,'Келдибеков','-'),
                ]
               },
            "ri-24-9": {
                '1': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('chemistry',1,20,5,'Агибетова','301'),
                    new LessonCreate('math',1,20,45,'Шатманалиева','301'),
                    new LessonCreate('astronomy',1,20,5,'Доненко','202'), 
                    new LessonCreate('englang',1,20,5,'Мухамед Насир','202'),                   
                ],
                '2': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','301'),
                    new LessonCreate('physic',1,20,45,'Доненко','301'),
                    new LessonCreate('history',1,20,5,'Ботобекова','301'), 
                    new LessonCreate('ruslang',1,20,5,'Низалиева','204'),
                ],
                '3': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('englang',1,20,5,'Кожогулова/Умиталиева','201/204'),
                    new LessonCreate('math',1,20,45,'Шатманалиева','204'),
                    new LessonCreate('biology',1,20,5,'Агибетова','301'), 
                    new LessonCreate('worldliterature',1,20,5,'Орозакунова','301'),
                ],
                '4': [
                    new LessonCreate('compscience',1,20,10,'Баяманов/Бактыбек уулу','к.к/201'),
                    new LessonCreate('literature',1,20,5,'Орозакунова','301'),
                    new LessonCreate('ruslang',1,20,45,'Низалиева','202'),
                    new LessonCreate('englang',1,20,5,'Кожогулова','202'), 
                    new LessonCreate('compprog',1,20,5,'Бактыбек уулу','202'),
                ],
                '5': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('social',1,20,5,'Каниметов','301'),
                    new LessonCreate('turklang',1,20,45,'Жумабаев','202'),
                    new LessonCreate('englang',1,20,5, 'Умиталиева', '202')
                                    ],
                '6': [
                    new LessonCreate('no_lessons',0,20,10,'none','-'),
                    new LessonCreate('PI',1,20,5,'Арстанбеков','-'),
                    new LessonCreate('doprizvprep',1,20,45,'Келдибеков','-'),
                ]
               },
            "ai-24-9": {
                '1': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('chemistry',1,20,5,'Агибетова','301'),
                    new LessonCreate('math',1,20,45,'Шатманалиева','301'),
                    new LessonCreate('astronomy',1,20,5,'Доненко','202'), 
                    new LessonCreate('englang',1,20,5,'Мухамед Насир','202'),                   
                ],
                '2': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','301'),
                    new LessonCreate('physic',1,20,45,'Доненко','301'),
                    new LessonCreate('history',1,20,5,'Ботобекова','301'), 
                    new LessonCreate('ruslang',1,20,5,'Низалиева','204'),
                ],
                '3': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('englang',1,20,5,'Кожогулова/Уметалиева','201/204'),
                    new LessonCreate('math',1,20,45,'Шатманалиева','204'),
                    new LessonCreate('biology',1,20,5,'Агибетова','301'), 
                    new LessonCreate('worldliterature',1,20,5,'Орозакунова','301'),
                ],
                '4': [
                    new LessonCreate('compscience',1,20,10,'Баяманов/Бактыбек уулу','к.к/201'),
                    new LessonCreate('literature',1,20,5,'Орозакунова','301'),
                    new LessonCreate('ruslang',1,20,45,'Низалиева','202'),
                    new LessonCreate('englang',1,20,45,'Кожогулова','202'), 
                    new LessonCreate('compprog',1,20,5,'Бактыбек уулу','202'),
                ],
                '5': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('social',1,20,5,'Каниметов','301'),
                    new LessonCreate('turklang',1,20,45,'Жумабаев','202'),
                    new LessonCreate('englang',1,20,5,'Умиталиева','202'),
                ],
                '6': [
                    new LessonCreate('no_lessons',0,20,10,'none','-'),
                    new LessonCreate('PI',1,20,5,'Арстанбеков','-'),
                    new LessonCreate('doprizvprep',1,20,45,'Келдибеков','-'),
                ]
               },
            "ia-24-9": {
                '1': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('astronomy',1,20,5,'Доненко','201'),
                    new LessonCreate('englang',1,20,45,'Мухамед Насир','201'),
                    new LessonCreate('chemistry',1,20,5,'Агибетова','301'), 
                    new LessonCreate('math',1,20,5,'Шатманалиева','301'),                   
                ],
                '2': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('Japanese',1,20,5,'Аманова','201'),
                    new LessonCreate('turklang',1,20,45,'Жумабаев','201'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','201'), 
                    new LessonCreate('history',1,20,5,'Ботобекова','301'),
                    new LessonCreate('physic',1,20,5,'Доненко','301'),
                ],
                '3': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('biology',1,20,5,'Агибетова','301'),
                    new LessonCreate('worldliterature',1,20,45,'Орозакунова','301'),
                    new LessonCreate('math',1,20,5,'Шатманалиева','201'), 
                    new LessonCreate('englang',1,20,5,'Вахид Ахмар','201'),
                                ],
                '4': [
                    new LessonCreate('literature',1,20,10,'Орозакунова','301'),
                    new LessonCreate('compscience',1,20,5,'Баяманов/Бактыбек уулу','к.к/201'),
                    new LessonCreate('englang',1,20,45,'Вахид Ахмар','201'),
                    new LessonCreate('ruslang',1,20,5,'Низалиева','203'), 
                ],
                '5': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('kyrglang',1,20,5,'Азылов','201'),
                    new LessonCreate('social',1,20,45,'Каниметов','301'),
                      ],
                '6': [
                    new LessonCreate('no_lessons',0,20,10,'none','-'),
                    new LessonCreate('PI',1,20,5,'Арстанбеков','-'),
                    new LessonCreate('doprizvprep',1,20,45,'Келдибеков','-'),
                ]
               },
            "pvks-24-9": {
                '1': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('englang',1,20,5,'Мухамед Насир','204'),
                    new LessonCreate('astronomy',1,20,45,'Доненко','204'),
                    new LessonCreate('chemistry',1,20,5,'Агибетова','301'), 
                    new LessonCreate('math',1,20,5,'Шатманалиева','301'),                   
                ],
                '2': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('no_lessons',1,20,5,'none','-'),
                    new LessonCreate('math',1,20,45,'Шатманалиева','204'),
                    new LessonCreate('kyrglang',1,20,5, 'Азылов','204'), 
                    new LessonCreate('history',1,20,5,'Ботобекова','301'),
                    new LessonCreate('physic',1,20,5,'Доненко','301'),
                ],
                '3': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('biology',1,20,5,'Агибетова','301'),
                    new LessonCreate('worldliterature',1,20,45,'Орозакунова','301'),
                    new LessonCreate('englang',1,20,5,'Кожогулова/Мухамед Насир','204/101'), 
                    new LessonCreate('math',1,20,5,'Шатманалиева','204'),
                ],
                '4': [
                    new LessonCreate('literature',1,20,10,'Орозакунова','301'),
                    new LessonCreate('turklang',1,20,5,'Жумабаев','204'),
                    new LessonCreate('compscience',1,20,45,'Баяманов/Бактыбек уулу','к.к/201'),
                    new LessonCreate('no_lessons',1,20,5,'none','-'), 
                    new LessonCreate('englang',1,20,5,'Кожогулова','204'),
                ],
                '5': [
                    new LessonCreate('no_lessons',1,20,10,'none','-'),
                    new LessonCreate('compprog',1,20,5,'Бактыбек уулу','102'),
                    new LessonCreate('social',1,20,45,'Каниметов','301'),
                    new LessonCreate('englang.',1,20,5,'Мухамед Насир','204'),
                    new LessonCreate('ruslang',1,20,5,'Низалиева','-'),
                ],
                '6': [
                    new LessonCreate('no_lessons',0,20,10,'none','-'),
                    new LessonCreate('PI',1,20,5,'Арстанбеков','-'),
                    new LessonCreate('doprizvprep',1,20,45,'Келдибеков','-'),
                ]
               },
        },
    }
} 
export const users = {
    'bl-24-9': {
        // users here
    },
    'kb-24-9': {
        // users here
    },
    'ai-24-9': {
        // users here
    },
    'ii-24-9': {
        // users here
    },
    'ri-24-9': {
        // users here
    },
    'pvks-24-9': {
        // users here
    }
}

export let teachers = {
    '1': {
        name: 'Таалайбек',
        lessonTeacher: 'turklang',
        surname: 'Жумабаев',
        thirdname: 'Дурболонович',
        login: '3424',
        password: '8674',
        role: 'Teacher'
    },
    '2': {
        name: 'Зарина',
        lessonTeacher: 'ruslang',
        surname: 'Низалиева',
        thirdname: 'Садвакасовна',
        login: '3424',
        password: '8674',
        role: 'Teacher'
    },
    '3': {
        name: 'Эмиль',
        lessonTeacher: 'social',
        surname: 'Каниметов',
        thirdname: 'Жанлорозович',
        login: '3424',
        password: '8674',
        role: 'Teacher'
    },
    '4': {
        name: 'Талгат',
        lessonTeacher: 'compscience',
        surname: 'Баяманов',
        thirdname: 'Жыргалович',
        login: '3424',
        password: '8674',
        role: 'Teacher'
    },
    '5': {
        name: 'Леонид',
        lessonTeacher: 'cosmos',
        surname: 'Доненко',
        thirdname: 'Николаевич',
        login: '3424',
        password: '8674',
        role: 'Teacher'
    }
}


const subjects = ['bl-24-9', 'kb-24-9', 'ri-24-9', 'ia-24-9', 'pvks-24-9', 'ai-24-9'];

export const homeWorks = {
    'social': createLessonStructure(),
    'PI': createLessonStructure(),
    'turklang': createLessonStructure(),
    'cosmos': createLessonStructure(),
    'physic': createLessonStructure(),
    'kyrglang': createLessonStructure(),
    'ruslang': createLessonStructure(),
    'math': createLessonStructure(),
    'history': createLessonStructure(),
    'chemistry': createLessonStructure(),
    'biology': createLessonStructure(),
    'englang': createLessonStructure(),
    'compscience': createLessonStructure(),
    'doprizvprep': createLessonStructure(),
    'japanlang': createLessonStructure(),
    'literature': createLessonStructure(),
    'worldliterature': createLessonStructure(),
};

function createLessonStructure() {
    return subjects.reduce((acc, subject) => {
        acc[subject] = ['1'];
        return acc;
    }, {});
}

export const scores = [
    "wasnt",
    "sicked",
    "by-reason",
    "1",
    "2",
    "3",
    "4",
    "5",
    "clear-score"
]


export const daysOfWeek = ["day7", "day1", "day2", "day3", "day4", "day5", "day6"];

export const shortDaysOfWeek = ["shortday1", "shortday2", "shortday3", "shortday4", "shortday5", "shortday6", "shortday7"];

export const getCurrentDay = () => {
    const daysOfWeek = ["shortday1", "shortday2", "shortday3", "shortday4", "shortday5", "shortday6", "shortday7"];
    const today = new Date();
    const dayIndex = today.getDay(); // Возвращает число от 0 до 6
    return daysOfWeek[(dayIndex + 6) % 7]; // Преобразование в формат недели, начиная с понедельника
};

export const getTimeByMinute = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(mins).padStart(2, '0');
    
    return `${formattedHours}:${formattedMinutes}`;
};

export const addTime = (hours, minutes, incrementHours, incrementMinutes) => {
    if (isNaN(hours) || isNaN(minutes) || isNaN(incrementHours) || isNaN(incrementMinutes)) {
        return 'Invalid input';
    }

    hours = Number(hours);
    minutes = Number(minutes);
    incrementHours = Number(incrementHours);
    incrementMinutes = Number(incrementMinutes);
    let totalMinutes = hours * 60 + minutes + incrementHours * 60 + incrementMinutes;

    const newHours = Math.floor(totalMinutes / 60) % 24;  
    const newMinutes = totalMinutes % 60;
    const formattedHours = String(newHours).padStart(2, '0');
    const formattedMinutes = String(newMinutes).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}`;
};

export const calculateLessonTimes = (lessons) => {
    const times = [];
    let totalMinutes = 0;
  
    for (let i = 0; i < lessons.length; i++) {
      const lesson = lessons[i];
      const startHour = 10;
      const startMinutes = 0;
  
      const lessonStartTime = addTime(startHour, startMinutes, Math.floor(totalMinutes / 60), totalMinutes % 60);
      
      totalMinutes += lesson.hour * 60 + lesson.minutes;
      const lessonEndTime = addTime(startHour, startMinutes, Math.floor(totalMinutes / 60), totalMinutes % 60);
  
      times.push({
        name: lesson.name,
        startTime: lessonStartTime,
        endTime: lessonEndTime,
      });
  
      totalMinutes += lesson.breakDuration; // Используем переменную длительность перемены
    }
  
    return times;
  };

export function getDateForDay(day) {
    const baseDate = new Date();
    const dayOfWeek = baseDate.getDay(); // Текущий день недели
    const daysToAdd = shortDaysOfWeek.indexOf(day) - dayOfWeek; // Расчет разницы в днях

    baseDate.setDate(baseDate.getDate() + daysToAdd); // Устанавливаем дату для дня недели
    const date = baseDate;

    const dayStr = String(date.getDate()).padStart(2, '0');
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const yearStr = date.getFullYear();

    return `${String(Number(dayStr)+1).padStart(2, '0')}.${monthStr}.${String(yearStr)[2]}${String(yearStr)[3]}`;
}

export function clickLesson(lesson) {
    return 1
}





export const UserContext = createContext(null); // Экспорт контекста

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
export const uus = {
    groups: {
        'bl-24-9': {
            '1': {
                id: '1',
                login: 'tiway32',
                password: '623314',
                name: 'Иман',
                surname: 'Рахатбеков',
                role: 'admin',
                group: 'bl-24-9 БЛ-24-9',
                scores: []
            },
            '2': {
                id: '2',
                login: 'ilim',
                password: 'password234',
                name: 'Илим',
                surname: 'Русланов',
                role: 'user',
                group: 'bl-24-9 БЛ-24-9',
                scores: []
            }
        },
        'kb-24-9': {
            '3': {
                id: '3',
                login: 'Элдияр',
                password: 'password234',
                name: 'Эльдияр',
                surname: 'Бекжанов',
                role: 'user',
                group: 'kb-24-9 КБ-24-9',
                scores: []
            }
        },
        'ia-24-9': {
            name: 'ИЯ-24-9'
        },
        'ai-24-9': {
            name: 'ИИ-24-9'
        },
        'ri-24-9': {
            name: 'РИ-24-9'
        },
        'pvks-24-9': {
            name: 'ПвКС-24-9'
        }
    }
}

export const lessons = [
    {name: 'turklang'},
    {name: 'cosmos'},
    {name: 'physic'},
    {name: 'kyrglang'},
    {name: 'ruslang'},
    {name: 'math'},
    {name: 'social'},
    {name: 'history'},
    {name: 'chemistry'},
    {name: 'biology'},
    {name: 'englang'},
    {name: 'compscience'},
    {name: 'PI'},
    {name: 'japanlang'}
]

export const scoresScore = [
    {score: '3', scores: 20},
    {score: '4', scores: 40},
    {score: '5', scores: 80},
]