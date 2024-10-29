// server.js
const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const serviceAccount = require('./path/to/serviceAccountKey.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://diary-bl24-9-default-rtdb.firebaseio.com/'
});

const app = express();
app.use(bodyParser.json());

app.post('/get-custom-token', async (req, res) => {
  const { login, password } = req.body;

  const userRef = admin.database().ref('users/' + login);
  const snapshot = await userRef.once('value');
  
  if (snapshot.exists()) {
    const userData = snapshot.val();


    if (userData.password === password) {
      try {

        const customToken = await admin.auth().createCustomToken(userData.id);
        res.json({ token: customToken });
      } catch (error) {
        res.status(500).json({ error: 'Ошибка создания custom token' });
      }
    } else {
      res.status(401).json({ error: 'Неправильный пароль' });
    }
  } else {
    res.status(404).json({ error: 'Пользователь не найден' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
