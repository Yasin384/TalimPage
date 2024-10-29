const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json'); 


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://diary-bl24-9-default-rtdb.firebaseio.com/"
});


const createUser = async (userData) => {
  const { id, password, role, name, surname } = userData;
  try {

    const user = await admin.auth().createUser({
      uid: id, 
      password: password,
      displayName: `${name} ${surname}`, 
    });

    await admin.auth().setCustomUserClaims(user.uid, { role });

    console.log(`Пользователь ${user.uid} создан с ролью ${role}`);
    return user;
  } catch (error) {
    console.error('Ошибка создания пользователя:', error);
    throw error;
  }
};


const syncUsersFromDatabase = async () => {
  const db = admin.database();
  const usersRef = db.ref('users'); 

  try {
    const snapshot = await usersRef.once('value');
    const users = snapshot.val();

    if (users) {
      for (const userData of Object.values(users)) {
        try {
          await createUser(userData);
        } catch (error) {
          console.error(`Ошибка при создании пользователя ${userData.login}:`, error);
        }
      }
    } else {
      console.log('Нет данных пользователей');
    }
  } catch (error) {
    console.error('Ошибка чтения пользователей из Realtime Database:', error);
  }
};

syncUsersFromDatabase();
