require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const appRoutes = require('./routes/index.js');
const { PORT = 3001 } = process.env;
const app = express();
app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
app.use('/', appRoutes.loginRoutes);
app.use('/', appRoutes.signUpRoutes);
app.use('/', appRoutes.usersRoutes);
app.use('/', appRoutes.articlesRoutes);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});
app.use(errorLogger); // подключаем логгер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.listen(PORT, () => {
});
app.get('/', (req, res) => {
  res.send({ message: 'API' });
});