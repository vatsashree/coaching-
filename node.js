const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const app = express();

// connect to database
mongoose.connect('mongodb://localhost:27017/coaching_app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected'))
  .catch((err) => console.log(err));

// user schema
const userSchema = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

// user model
const User = mongoose.model('User', userSchema);

// middleware
app.use(bodyParser.json());

// login endpoint
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // check if password is correct
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  // generate token
  const token = jwt.sign({ email: user.email, id: user._id }, 'secret', { expiresIn: '1h' });

  res.status(200).json({ result: user, token });
});

// signup endpoint
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new user
  const newUser = new User({ email, password: hashedPassword });

  try {
    await newUser.save();

    // generate token
    const token = jwt.sign({ email: newUser.email, id: newUser._id }, 'secret', { expiresIn: '1h' });

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
