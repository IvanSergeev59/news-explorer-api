require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const { errors } = require('celebrate');

const { NODE_ENV, MONGO_DB } = process.env;
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorHandler = require('./errors/errorHandler');
const router = require('./routes/index.js');
const mongoAd = require('./mongo/mongoAd');

const { PORT = 3001 } = process.env;
const app = express();
app.use(helmet());
app.use(requestLogger); // подключаем логгер запросов
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect(NODE_ENV === 'production' ? MONGO_DB : mongoAd, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use('/', router);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);
app.use(errorLogger); // подключаем логгер ошибок
app.listen(PORT, () => {
});
