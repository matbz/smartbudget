const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');

function jwtSignUser (user) {
  const ONE_YEAR = 60 * 60 * 24 * 7 * 52;
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_YEAR
  });
};

module.exports = {
  async login(req, res) {
    const user = new User();

    try {
      const {username, password} = req.body;
      await user.findByUsername(username);

      if (!user.username) {
        return res.status(401).json({
            error: 'User not found'
        });
      }

      if (user.attempts > 3) {
        return res.status(401).json({
            error: 'User locked'
        });
      }

      if (user.password !== password) {
        user.addAttempts(user.id, user.attempts);

        return res.status(401).json({
            error: 'Password was incorrect'
        });
      }

      await user.resetAttempts(user.id);

      const payload = {
        id: user.id,
        username: user.username
      };

      res.json({
        user: payload,
        token: jwtSignUser(payload)
      });
    } catch (err) {
      res.status(500).json({
       error: 'An error has occured trying to log in'
      });
    }
  }
};
