const express = require('express');
require('dotenv').config();

const { default: mongoose } = require('mongoose');

const { PORT = 3000 } = process.env;
const app = express();
const bodyParser = require('body-parser');
const { errors } = require('celebrate');

const auth = require('./middlewares/auth');
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const NotFoundError = require('./utils/statuses');
const { login, postUser } = require('./controllers/users');
const { validatePostUser, validateLogin } = require('./middlewares/validators');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// Роуты с валидацией данных
app.post('/signin', validateLogin, login);
app.post('/signup', validatePostUser, postUser);

// Миддлвэр авторизации
app.use(auth);

// Роуты с авторизацией
app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.use(errors());

// Централизованная обработка ошибок
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? 'Ошибка сервера' : message,
  });
  next();
});

app.listen(PORT, () => {
  console.log('all is right');
});
