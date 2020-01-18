const mongoose = require('mongoose');
const validator = require('validator');


const { ObjectId } = mongoose.Schema.Types;

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    minlength: 1,
  },
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  text: {
    type: String,
    required: true,
    minlength: 1,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    required: true,
    type: String,
    validate: {
      validator(str) {
        return validator.isURL(str);
      },
      message: 'Эта строка должна быть url',
    },
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(str) {
        return validator.isURL(str);
      },
      message: 'Эта строка должна быть url',
    },
    owner: {
      type: ObjectId,
      required: true,
    },
  },
});
module.exports = mongoose.model('article', articleSchema);
