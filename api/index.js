const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.getCustomToken = functions.https.onRequest(async (req, res) => {
  const { login, password } = req.body;

  try {
    const userRef = admin.database().ref(`users/${login}`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    if (userData && userData.password === password) {
      const token = await admin.auth().createCustomToken(login);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Неверный логин или пароль' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});