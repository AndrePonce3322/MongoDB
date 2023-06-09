const loginRouter = require('express').Router();
const user_model = require('../models/users_eschema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

loginRouter.post('/', async (req, res) => {
  const { body } = req;
  const { userName, password } = body;

  if (!userName || !password) {
    return res.status(400).json({ error: 'Password or Username not send' });
  }

  const user = await user_model.findOne({ userName });

  const correctPassword =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);

  if (!(user && correctPassword)) {
    return res.status(401).json({ error: 'Invalid user or password' });
  }

  const payload = {
    _id: user._id,
    userName,
  };

  const token = jwt.sign(payload, process.env.TOKEN_SECRET_KEY, {
    expiresIn: 60 * 60 * 24 * 15,
  });

  res
    .send({
      envio: 'EXITOSO!',
      user: user.user,
      userName: user.userName,
      token,
    })
    .status(200);
});

module.exports = loginRouter;
