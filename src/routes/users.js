const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const { User, validateUser } = require('../models/user');
const { encryptPassword } = require('../util/encryptPassword');

router.post('/register', upload.none(), async (req, res) => {
  let user = new User(
    _.pick(req.body, ['name', 'username', 'email', 'gender', 'password'])
  );

  const { error } = validateUser(user.toObject());
  if (error) return res.status(400).send(error.details[0].message);

  const emailTaken = await User.findOne({ email: req.body.email });
  if (emailTaken) return res.status(400).send('User already registered.');

  const usernameTaken = await User.findOne({ username: req.body.username });
  if (usernameTaken) return res.status(400).send('Username already taken.');

  if (user.password !== req.body.passwordConfirmation) return res.send("Passwords don't match.");

  user.password = await encryptPassword(user.password);

  user = await user.save();
  return res.status(200).send('Successful registration!');
});

router.post('/logging', upload.none(), async (req, res) => {
  let user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).send('Username is not registered.');

  let validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid password.');

  const token = user.generateAuthToken();
  res.cookie('authToken', token);

  res.status(200).send('Successfully logged!');
});

router.get('/loggout', (req, res) => {
  res.clearCookie('authToken').send('Successful loggout');
});

module.exports = router;
