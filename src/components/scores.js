import { ref, set, getDatabase, get, update, child } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { base, homeWorks, teachers } from '../apps/base.js';
import { v4 as uuidv4 } from 'uuid';

const auth = getAuth();
const database = getDatabase();

export const createUser = (group, login, password, name, surname) => {
  const db = getDatabase();

  const userId = uuidv4();


  const userRef = ref(db, `users/groups/${group}/${userId}`);

  const userData = {
    id: userId,
    login: login,
    password: password, 
    name: name,
    surname: surname,
    role: 'user', 
    group: group, 
    scores: {},
  };

  return set(userRef, userData)
    .then(() => {
      console.log('Пользователь успешно создан:', userData);
    })
    .catch((error) => {
      console.error('Ошибка при создании пользователя:', error);
    });
};

export const updateUserData = async (newData) => {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    const userRef = ref(database, 'users/' + userId);
    try {
      await set(userRef, newData);
    } catch {
      
    }
  }
};

const db = getDatabase();

export const updateScores = async (userId, subject, scores) => {
  try {
    const scoresRef = ref(db, `users/${userId}/scores/${subject}`);
    await set(scoresRef, scores);
  } catch {
    // Handle error silently
  }
};

export const getUsers = async () => {
  try {
    const usersRef = ref(db, 'users');
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch {
    return null;
  }
};

export const getUsersInGroup = async (group) => {
  try {
    const usersRef = ref(db, `users/groups/${group}`);
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      // Преобразуем объект в массив, если он не является массивом
      return Array.isArray(users) ? users : Object.values(users);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Ошибка при получении пользователей:', error);
    return [];
  }
};

export const getThemeLesson = async (date, group, lessonName) => {
  try {
    const usersRef = ref(db, `days/homeWorks/${lessonName}/${group}`);
    const snapshot = await get(usersRef);
    
    if (snapshot.exists()) {
      const lessonData = snapshot.val();
      
      // Преобразуем данные в массив уроков
      const lessonArray = Object.values(lessonData);

      // Ищем урок с нужной датой
      const foundLesson = lessonArray.find(lesson => lesson.date === date);

      if (foundLesson) {
        return foundLesson;
      } else {
        return null; // Урок не найден
      }
    } else {
      return null; // Данные не существуют
    }
  } catch (error) {
    return null; // Возвращаем null в случае ошибки
  }
};



export const getLesson = async (date, group, lessonName) => {
  try {
    const usersRef = ref(db, `days/homeWorks/${lessonName}/${group}`);
    const snapshot = await get(usersRef);
    console.log(`days/homeWorks/${lessonName}/${group}`)
    if (snapshot.exists()) {
      const lesson = snapshot.val();
      // Предполагаем, что данные хранятся как объект, и возвращаем нужные данные
      return lesson; // Возвращаем объект, который содержит необходимые данные
    } else {
      return null; // Возвращаем null, если данных нет
    }
  } catch (error) {
    console.error('Ошибка при получении темы урока:', error);
    return null; // Возвращаем null в случае ошибки
  }
};

export const addScores = async (userId, subject, score) => {
  try {
    const scoresRef = ref(db, `users/${userId}/scores/${subject}`);
    const snapshot = await get(scoresRef);
    let scores = snapshot.exists() ? snapshot.val() : [];

    if (!Array.isArray(scores)) {
      scores = [];
    }

    scores.push(score);
    await set(scoresRef, scores);
  } catch {
    // Handle error silently
  }
};
export const addScore = async (group, userId, lessonName, score, date) => {
  const scoresRef = ref(db, `users/groups/${group}/${userId}/scores/${lessonName}`);

  // Используем get, чтобы получить текущие оценки
  const snapshot = await get(scoresRef);
  let currentScores = [];

  if (snapshot.exists()) {
    currentScores = snapshot.val().score || [];
  }

  // Добавляем новую оценку
  currentScores.push({
    score: score,
    date: date, 
  });

  // Обновляем данные
  await update(scoresRef, {
    score: currentScores,
  });
};

export const getHalfYear = async () => {
  const db = getDatabase(); // Ensure the db instance is defined
  try {
    const userScoresRef = ref(db, `halfyear`);
    const snapshot = await get(userScoresRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      return Number(data);
    }
  } catch (e) {
    console.log(e);
  }
  return 1; // Return a default value in case of an error
};

export const getScores = async (userId, subject, group, halfYear) => {
  try {
    const userScoresRef = ref(db, `users/groups/${group}/${userId}/scores/${subject}`);
    const snapshot = await get(userScoresRef);

    if (snapshot.exists()) {
      const scoresData = snapshot.val();

      // Assuming scoresData is structured as an array of arrays
      const scoresDataFiltered = Object.values(scoresData).flat(); // Flatten the nested array

      // Now filter the flattened data based on halfYear
      const filteredScores = scoresDataFiltered.filter(score => score.halfyear === halfYear);

      // Log the filtered scores to check the result
      

      // Extract the scores from the filtered results
      const extractedScores = filteredScores.map(item => ({
        score: item.score,
        halfyear: item.halfyear,
      }));

      return { scores: extractedScores };
    }

    return { scores: [] }; // If no data exists
  } catch (error) {
    console.error('Error fetching scores:', error);
    return { scores: [] }; // Return empty on error
  }
};





export const updateLocalStorage = async (userId) => {
  const db = getDatabase();
  const userRef = ref(db, `users/${userId}/scores`);
  
  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return;
    }

    const dbScores = snapshot.val();
    
    const localStorageData = localStorage.getItem('scores');
    const localScores = localStorageData ? JSON.parse(localStorageData) : {};

    if (JSON.stringify(localScores) !== JSON.stringify(dbScores)) {
      localStorage.setItem('scores', JSON.stringify(dbScores));
    }
  } catch {
    // Handle error silently
  }
};

const findUserGroupById = async (userId) => {
  const db = getDatabase();
  const groupsRef = ref(db, 'users/groups'); // Путь к группам

  try {
    const snapshot = await get(groupsRef);
    if (snapshot.exists()) {
      const groups = snapshot.val();
      console.log('Группы:', groups); // Логируем для отладки

      for (const groupKey in groups) {
        const group = groups[groupKey];
        
        if (group && group[userId]) {
          console.log('Найденная группа:', groupKey);
          return { groupKey, userData: group[userId] };
        }
      }

      return { groupKey: null, userData: null };
    } else {
      return { groupKey: null, userData: null };
    }
  } catch (error) {
    console.error('Ошибка при поиске группы:', error);
    return { groupKey: null, userData: null };
  }
};



export const changePassword = async (userId, newPassword) => {
  const db = getDatabase();

  try {
    console.log('Поиск группы пользователя...');
    const { groupKey, userData } = await findUserGroupById(userId);
    console.log('Данные группы:', { groupKey, userData });
    
    if (!userData || !userData.group) {
      console.error('Не удалось найти группу пользователя или отсутствуют данные пользователя.');
      return;
    }

    const groupId = userData.group.split(' ')[0];
    console.log('ID группы:', groupId);
    
    const passwordRef = ref(db, `users/groups/${groupKey}/${userId}/password`);
    console.log('Обновление пароля по пути:', `users/groups/${groupKey}/${userId}/password`);

    // Обновление пароля
    await set(passwordRef, newPassword);
    console.log('Пароль успешно обновлен.');
  } catch (error) {
    console.error('Ошибка при изменении пароля:', error);
  }
};

export const changeScores = async (userId, newScore) => {
  const db = getDatabase();
  
  try {
    console.log('Поиск группы пользователя...');
    const { groupKey, userData } = await findUserGroupById(userId);
    console.log('Данные группы:', { groupKey, userData });
    
    if (!userData || !userData.group) {
      console.error('Не удалось найти группу пользователя или отсутствуют данные пользователя.');
      return;
    }

    const groupId = userData.group.split(' ')[0];
    console.log('ID группы:', groupId);
    
    const scoreRef = ref(db, `users/groups/${groupKey}/${userId}/score`);
    console.log('Обновление счета по пути:', `users/groups/${groupKey}/${userId}/score`);

    // Получаем текущий счет
    const scoreSnapshot = await get(scoreRef);
    const currentScore = scoreSnapshot.exists() ? scoreSnapshot.val() || 0 : 0;

    // Обновляем счет (например, добавляя новое значение к текущему)
    const updatedScore = currentScore + newScore; // или используйте любое другое правило обновления

    // Записываем обновленный счет в базу данных
    await set(scoreRef, updatedScore);
    console.log('Счет успешно обновлен:', updatedScore);
  } catch (error) {
    console.error('Ошибка при изменении счета:', error);
  }
};






export const getUserCount = async () => {
  const db = getDatabase();
  const groupsRef = ref(db, 'users/groups'); // Путь к ветке с группами пользователей
  
  try {
    const snapshot = await get(groupsRef);
    if (snapshot.exists()) {
      const groups = snapshot.val();
      let userCount = 0;

      for (const groupKey in groups) {
        const group = groups[groupKey];
        userCount += Object.keys(group).length; 
      }

      return userCount;
    } else {
      return 0;
    }
  } catch {
    return 0;
  }
};

export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const saveDataToDatabase = async () => {
  try {
    const dbRef = ref(database, 'days/lessons');
    await set(dbRef, base.days.lessons);
  } catch(e) {
    console.error(e)
  }
};

export const saveDataToDatabase1 = async () => {
  try {
    const dbRef = ref(database, 'days/homeWorks');
    await set(dbRef, homeWorks);
  } catch(e) {
    console.error(e)
  }
};

export const saveDataToDatabase2 = async () => {
  try {
    const dbRef = ref(database, 'users/teachers');
    await set(dbRef, teachers);
  } catch(e) {
    console.error(e)
  }
};
/*export const saveDataToDatabase3 = async () => {
  try {
    const dbRef = ref(database, 'users/groups/bl-24-9');
    await set(dbRef, users['bl-24-9']);
  } catch(e) {
    console.error(e)
  }
};*/


export function clearUserData(userId) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);

    try {
      const data = JSON.parse(value);

      if (key === 'user') {
        if (data.id === userId) {
          localStorage.removeItem(key);
          return;
        }
      } else if (data && data.users && data.users.groups) {
        let dataChanged = false;

        for (const groupKey in data.users.groups) {
          const group = data.users.groups[groupKey];
          if (group[userId]) {
            delete data.users.groups[groupKey][userId];

            if (Object.keys(data.users.groups[groupKey]).length === 0) {
              delete data.users.groups[groupKey];
            }

            dataChanged = true;
          }
        }

        if (dataChanged) {
          localStorage.setItem(key, JSON.stringify(data));
        }
      }
    } catch {
      // Handle error silently
    }
  }
}
export const saveLessonData = async (lessonName, group, data) => {
  const lessonRef = ref(db, `days/homeWorks/${lessonName}/${group}`); // Путь к вашему уроку

  try {
      await set(lessonRef, data); // Отправка данных
      console.log("Lesson data saved successfully!");
  } catch (error) {
      console.error("Error saving lesson data:", error);
  }
};

export const getUserById = async (userId, role) => {
  const db = getDatabase();
  const userRef = role === 'Teacher' 
      ? ref(db, `users/teachers/${userId}`) 
      : ref(db, 'users/groups');
  
  
  
  try {
      const snapshot = await get(userRef);
      
      if (role === 'Teacher') {
          const userData = snapshot.exists() ? snapshot.val() : null;
        
          return userData;
      } else {
          if (snapshot.exists()) {
              const groups = snapshot.val();
              for (const groupKey in groups) {
                  const group = groups[groupKey];
                  if (group?.[userId]) {

                      return group[userId];
                  }
              }
          }
          
          return null;
      }
  } catch (error) {
      console.error("Error getting user by ID:", error);
      return null;
  }
};




/*

let usersKb = `1. Абдыганиева Дильназ Абдыбалыевна
2. Абсатаров Татын
3. Акбаров Сирожидин
4. Алмазбеков Бекболсун Алмазбекович
5. Аралбеков Байель Маратович
6. Асанбек уулу Чынгыз
7. Бадалов Абу-Бакр Шахопович
8. Гульжигитов Марлен Азаматович
9. Жолдошалиев Назим
10. Иманкадыров Эмир Бакытович
11. Ишенбеков Ранатали Арстанбекович
12. Кубанычбеков Темирлан Русланбекович
13. Кубанычбеков Шайлообек Узакжанович
14. Муратбеков Гулбарчын Муратбековна
15. Райымжан уулу Абылгазы
16. Рахманкулова Фатима Арзыматовна
17. Романбеков Даниель Романбекович
18. РусланУулу Ислам
19. ТаалайбекКызы Айпери
20. Ташболотов Жолдошбек Жыргалбаевич
21. Токтосунов Бекзат Жакшылыкович
22. Турдукулов Жандарбек Эралыевич
23. Эгембердиева Даниель Канатбекович
24. Эсенкулов Абдурашид Алтынбекович`;

// Преобразуем данные в массив
let userskb2 = usersKb.split('\n');

const usedLogins = new Set();
const usedPasswords = new Set();

// Функция генерации уникального числа
function generateUniqueNumber(existingSet, length) {
    let num;
    do {
        num = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, '0');
    } while (existingSet.has(num));
    existingSet.add(num);
    return num;
}

// Создаем объект с пользователями
let basee = {};
for (let i in userskb2) {
    const userkb = userskb2[i];
    const userArr = userkb.split(' ');

    // Извлечение данных пользователя
    const surname = userArr[1];
    const name = userArr[2];
    const group = "bl-24-n-3 БЛ-24-n-3";
    const role = "user";

    // Генерация уникального UUID
    const userId = uuidv4();

    // Генерация уникальных логина и пароля
    const login = generateUniqueNumber(usedLogins, 4);
    const password = generateUniqueNumber(usedPasswords, 5);
    // Создание объекта пользователя
    basee[userId] = {
        group: group,
        name: name,
        surname: surname,
        role: role,
        id: userId, // Используем сгенерированный UUID
        password: password,
        login: login,
        licence: false,
        score: 0,
        course: 3
    };
}

// Функция для записи всех пользователей в Firebase
function writeUsersToDatabase(users) {
    const db = getDatabase(); // Получаем экземпляр базы данных

    // Проходим по каждому пользователю и записываем в Firebase
    for (let userId in users) {
        const user = users[userId];
        const userRef = ref(db, `users/groups/${user.group.split(' ')[0]}/${userId}`); // Ссылка на конкретного пользователя

        // Записываем пользователя в базу данных
        set(userRef, user)
            .then(() => {
                console.log(`Пользователь ${user.name} успешно записан в Firebase!`);
            })
            .catch((error) => {
                console.error(`Ошибка при записи пользователя ${user.name}: `, error);
            });
    }
}
function createGroup(groupId, groupName) {
  const db = getDatabase(); // Получаем экземпляр базы данных

  // Объект с данными группы
  const groupData = {
      name: groupName
  };

  // Ссылка на новую группу в базе данных
  const groupRef = ref(db, `users/groups/${groupId}`);

  // Записываем данные группы в базу данных
  set(groupRef, groupData)
      .then(() => {
          console.log(`Группа ${groupName} успешно создана!`);
      })
      .catch((error) => {
          console.error("Ошибка при создании группы: ", error);
      });
}*/
//createGroup('bl-24-n-3','БЛ-24-n-3')
// Записываем пользователей в базу данн
//console.log(uuidv4())
//console.log(basee)
//writeUsersToDatabase(basee)

/*
async function addAttendanceToAllUsers() {
  const groupsRef = ref(db, 'users/groups');
  
  try {
      // Fetch all groups and users from the database
      const snapshot = await get(groupsRef);
      
      if (snapshot.exists()) {
          const groupsData = snapshot.val();

          // Iterate over each group and user
          for (const group in groupsData) {
              const usersInGroup = groupsData[group];

              for (const userId in usersInGroup) {
                  // Define the attendance data to add
                  const attendanceData = {
                      attendance: {
                          streakDays: 0,
                          cords: "0 0",
                          points: 0,
                          dates: [
                              {
                                  date: "29.10.24",
                                  time: "11:10:12",
                              },
                          ],
                      },
                  };

                  // Update each user with the attendance data
                  const userRef = ref(db, `users/groups/${group}/${userId}`);
                  await update(userRef, attendanceData);
                  console.log(`Added attendance to user ${userId} in group ${group}`);
              }
          }
      } else {
          console.log("No groups found in the database.");
      }
  } catch (error) {
      console.error("Error updating attendance data:", error);
  }
}

// Call the function
addAttendanceToAllUsers();*/

/*
const fetchAllUsers = async () => {
  let text = ``
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, 'users/groups')); // Запрашиваем все группы
    
    if (snapshot.exists()) {
      const groups = snapshot.val(); // Получаем данные всех групп

      // Перебираем все группы
      for (const groupKey in groups) {
        const group = groups[groupKey]; // Доступ к группе

        text += `\n${groupKey}\n\n`


        // Перебираем всех пользователей внутри группы
        for (const userKey in group) {
          const user = group[userKey]; // Доступ к пользователю
          text += `- ${user.name} ${user.surname}\n  Логин: ${user.login}\n  Пароль: ${user.password}\n\n`; // Вывод данных пользователя
        }
      }
      console.log(text)
    } else {
      console.log('No data available');
    }
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};
fetchAllUsers()*/

/*
function getRandomNumber(min, max) {
  if (min > max) {
      throw new Error("Minimum value should be less than the maximum value.");
  }
  
  // Generate a random number between min (inclusive) and max (inclusive)
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Role {
  constructor(fullName, role) {
    this.fullname = fullName;
    this.role = role;
  }
}

const teachers = [
  new Role('Агибетова Динара Джумгалиева','chemistry,ecology,biology'),
  new Role('Азылов Нурланбек Кумарович','kyrglang'),
  new Role('Алтынбек кызы Айсулуу','Возрастная анатомия, физиология и гигиена'),
  new Role('Аманова Назик Болотбековна','japanlang,kb,socialproblems'),
  new Role('Арстанбеков Сыймык Арстанбекович','pi'),
  new Role('Ахмар Вахид','englang,anotherlang,latlang'),
  new Role('Байгуттиев Сейтек Сейитбекович','crypto,smartcontract'),
  new Role('Бактыбек уулу Алмаз','compprog,compsciense'),
  new Role('Баяманов Талгат','compscience'),
  new Role('Ботобекова Айсара Маманасыровна','kyrghistory,worldhistory'),
  new Role('Доненко Леонид Николаевич','physic,cosmos'),
  new Role('Жумабаев Таалайбек Дурболонович','turklang'),
  new Role('Жумадинов Шумкарбек','compscience'),
  new Role('Каниметов Эмиль Жангорозович','social'),
  new Role('Келдибеков Элдияр','pi,doprizvprep'),
  new Role('Кожогулова Айжан Тенизбековна','anotherlang'),
  new Role('Кожогулова Дилара Тенизбековна','Педагогика'),
  new Role('Кудайбердиев Айдар Уланович',''),
  new Role('d Мухамед Насир','englang,anotherlang,proanotherlang'),
  new Role('Низалиева Зарина Садвакасовна','ruslang'),
  new Role('Орозакунова Бегайым','literature,worldliterature'),
  new Role('Радова Эрика Радовна ','anotherlang,mainlang'),
  new Role('Ренадов Айбек Ренадович','gameprog'),
  new Role('Ренадов Аймир Ренадович','historyart,gamedesign'),
  new Role('Савутохунов Абдулла Джавланбекович','Законoблокчейне,сетевыеструктуры'),
  new Role('Сулайманова Айгерим Феликсовна','langknow'),
  new Role('Уметалиева Айгуль Базарбаевна','anotherlang,Теоретическийфонетика'),
  new Role('Чикетаева Радмила Токтобековна','psychology'),
  new Role('Шатманалиева Роза Курмановна','math,promath'),
]

let teachers2 = {};
for (let teacher of teachers) {
    const teacherId = uuidv4();
    const [surname, name, thirdname] = teacher.fullname.split(' ');
    teachers2[teacherId] = {
        id: teacherId,
        name: name,
        surname: surname,
        thirdname: thirdname || '',
        lessonTeacher: teacher.role.split(','),
        login: String(getRandomNumber(10000, 99999)),
        password: String(getRandomNumber(3000000, 9999999)),
        role: 'Teacher'
    };

}

function writeToDatabase(users) {
    const db = getDatabase();

    for (let userId in users) {
        const user = users[userId];
        const userRef = ref(db, `users/teachers/${userId}`);

        set(userRef, user)
            .then(() => {
                console.log(`Пользователь ${user.name} успешно записан в Firebase!`);
            })
            .catch((error) => {
                console.error(`Ошибка при записи пользователя ${user.name}: `, error);
            });
    }
}

writeToDatabase(teachers2);*/





/*const updateUserProperties = async () => {
  const db = getDatabase();
  const groupRef = ref(db, 'users/groups'); // Ссылка на группы

  try {
      const snapshot = await get(groupRef);
      if (snapshot.exists()) {
          const groups = snapshot.val();

          // Проходим по каждой группе
          for (const groupId in groups) {
              const users = groups[groupId];

              // Обновляем каждого пользователя в группе
              for (const userId in users) {
                  const userRef = ref(db, `users/groups/${groupId}/${userId}`);

                  const updatedData = {
                      themeColor: users[userId].themeColor || 'blue',          
                  };

                  // Обновляем пользователя
                  await update(userRef, updatedData);
              }
          }
          console.log('Пользователи успешно обновлены.');
      } else {
          console.log('Данных не существует.');
      }
  } catch (error) {
      console.error('Ошибка при обновлении пользователей:', error);
  }
};
updateUserProperties()*/






export const updateUserScores = async (group, userScores, lessonName, date) => {
  const db = getDatabase();
  const updates = {};

  for (const [userId, score] of Object.entries(userScores)) {
    const scoresRef = ref(db, `users/groups/${group}/${userId}/scores/${lessonName}`);
    const snapshot = await get(scoresRef);
    const currentScores = snapshot.exists() ? snapshot.val().score || [] : [];

    const existingScoreIndex = currentScores.findIndex((s) => s.date === date);
    
    let pointsToAdd = 0;
    if (score === 5) pointsToAdd = 50;
    else if (score === 4) pointsToAdd = 40;
    else if (score === 3) pointsToAdd = 30;

    if (existingScoreIndex !== -1) {
      if (score === 'clear-score') {
        currentScores.splice(existingScoreIndex, 1); // Удаляем оценку за текущий день
      } else {
        currentScores[existingScoreIndex].score = score; // Обновляем оценку
      }
    } else if (score !== 'clear-score') {
      currentScores.push({
        score: score,
        date: date,
      });

      updates[`users/groups/${group}/${userId}/score`] = ((snapshot.val() && snapshot.val().score) || 0) + pointsToAdd;
    }

    updates[`users/groups/${group}/${userId}/scores/${lessonName}`] = {
      score: currentScores,
    };
  }

  await update(ref(db), updates);
};



// Function to ensure each day has 7 lessons, adding placeholders if necessary
/*async function addLessons(group) {
  try {
    const db = getDatabase();
    const refLessons = ref(db, `days/lessons/${group}/`);
    
    // Get the current lessons from the database
    const snapshot = await get(refLessons);
    
    if (snapshot.exists()) {
      const days = snapshot.val();

      // Loop through each day (assuming days are indexed from 0 to 5)
      days.forEach((dayLessons, dayIndex) => {
        // Check if the number of lessons is less than 7
        if (dayLessons && dayLessons.length < 7) {
          const additionalLessons = [];

          // Create additional lessons to make the total count 7
          for (let i = dayLessons.length; i < 7; i++) {
            additionalLessons.push({
              breakDuration: 10, // Adjust as necessary
              hour: 1,
              minutes: 20,
              name: "no_lessons",
              room: "-",
              teachername: "none"
            });
          }

          // Add new lessons to the existing array
          const updatedDayLessons = [...dayLessons, ...additionalLessons];

          // Replace the entire day's lessons array in the database
          set(ref(db, `days/lessons/${group}/${dayIndex}`), updatedDayLessons)
            .then(() => {
              console.log(`Updated lessons for day ${dayIndex + 1}`);
            })
            .catch((err) => {
              console.error(`Failed to update lessons for day ${dayIndex + 1}:`, err);
            });
        }
      });

      console.log("Check completed.");
    } else {
      console.log(`No lessons found for group ${group}`);
    }
  } catch (e) {
    console.error("Error:", e);
  }
}

// Example usage:
addLessons("ia-24-9");
addLessons("kb-24-9");
addLessons("bl-24-9");
addLessons("pvks-24-9");
addLessons("ri-24-9");
addLessons("ri-24-n-2");
addLessons("ia-24-11");
addLessons("bl-24-n-3");*/