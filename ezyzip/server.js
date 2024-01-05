// Import Required Dependencies
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/users');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/my_database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

// Set up EJS as the view engine
app.set('view engine', 'ejs');

// Set up body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Define Routes
app.get('/', (req, res) => {
  User.find({})
    .then((users) => {
      res.render('index', { users: users, editing: false, user: {} });
    })
    .catch((err) => {
      console.log(err);
      res.send('Error fetching users');
    });
});

app.get('/edit/:id', (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      User.find({})
        .then((users) => {
          res.render('index', { users: users, editing: true, user: user });
        })
        .catch((err) => {
          console.log(err);
          res.send('Error fetching users');
        });
    })
    .catch((err) => {
      console.log(err);
      res.send('Error fetching user');
    });
});

app.post('/add', (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  });

  newUser.save()
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.send('Error adding user');
    });
});

app.post('/edit/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
  })
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.send('Error updating user');
    });
});

app.get('/delete/:id', (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id)
    .then(() => {
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
      res.send('Error deleting user');
    });
});

// Start the Server
app.listen(3000, () => console.log('Server started on port 3000...'));
