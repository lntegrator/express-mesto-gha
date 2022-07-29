const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(link) {
        // Валидация ссылки аватара
        return /^https?:\/\/[www.]?S*#/i.test(link);
      },
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: 'Введен неверный email',
      minlength: 8,
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // запрет на возврат хеша пароля из БД
  },
});

// Метод авторизации пользователя
userSchema.statics.findUserbyCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неверные данные входа'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неверные данные входа'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
