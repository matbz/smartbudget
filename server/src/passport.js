const User = require('./models/User');
const passport = require('passport');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const config = require('./config');

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.authentication.jwtSecret
  }, async function (jwtPayload, done) {
      try {
        const user = new User();
        await user.find(jwtPayload.id);

        if (!user) {
            return done(new Error(), false)
        }
        return done(null, user)
      } catch (err) {
        return done(new Error(), false)
      }
  })
);

module.exports = null;
