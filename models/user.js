const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const answers = require('../answers/answers');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(str) {
        return validator.isEmail(str);
      },
      message: 'Эта строка должна быть email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});
userSchema.statics.findUserByCredentials = function r(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(answers.wrongEmailPas));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(answers.wrongEmailPas));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
