const { Router } = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../models/User');

const router = Router();

router.post('/register',
  [
    check('email', 'Incorrect email').isEmail(),
    check('password', 'Incorrect password: min 6 symbols').isLength({ min: 6 })
  ],
 async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data'
      })
    }

    const { email, password } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      return res.status(400).json({ message: 'User exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({ email, password: hashedPassword })

    await user.save();

    res.status(201).json('User has been saved');

  } catch(err) {
    res.status(500).json({ message: 'Smth is wrong' })
    console.log()
  }
});

router.post('/login',
[
  check('email', 'Enter correct email').normalizeEmail().isEmail(),
  check('password', 'Incorrect password').exists()
],
async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Incorrect data'
      })
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'No such user' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user.id }, // user data payload - name, id, email etc
      config.get('jwtSecret'), // secret key
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id });

  } catch(err) {
    res.status(500).json({ message: 'Smth is wrong' })
    console.log()
  }
});

module.exports = router;


