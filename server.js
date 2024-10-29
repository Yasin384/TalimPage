const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 5000;

app.use(express.json());


const usersFilePath = path.join(__dirname, 'base/users.json');


const readUsersFromFile = () => {
  try {
    const data = fs.readFileSync(usersFilePath);
    return JSON.parse(data);
  } catch (error) {
    console.error('Ошибка чтения файла:', error);
    return [];
  }
};


const writeUsersToFile = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Ошибка записи в файл:', error);
  }
};


app.post('/login', (req, res) => {
  const { login, password } = req.body;

  const users = readUsersFromFile();
  const user = users.find(u => u.login === login && u.password === password);

  if (user) {
    res.json({ user });
  } else {
    res.status(401).json({ error: 'Неверный логин или пароль' });
  }
});

app.listen(port, () => {
  console.log(`Сервер работает на http://localhost:${port}`);
});
