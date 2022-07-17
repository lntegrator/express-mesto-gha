const express = require('express');
const { default: mongoose } = require('mongoose');
const { PORT=3000 } = process.env;
const app = express();
const routerUsers = require('./routes/users');
const routerCards = require('./routes/cards');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '62d2d4325da30e72947e833c'
  };

  next();
});

app.use('/users', routerUsers);
app.use('/cards', routerCards);

app.listen(PORT, () => {
  console.log('all is right')
})