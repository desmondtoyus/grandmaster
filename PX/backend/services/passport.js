const passport = require('passport');
const C = require('../utils/vars');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const crypto = require('crypto');
const models = require('../models');

const getEmailUser = async (email) => {
  try {
    return await models.users.findOne({
      where: {
        email: {
          $iLike: email
        }
      }
    });
  }
  catch(err) {
    return err;
  }
};

const getIdUser = async (id) => {
  try {
    return await models.users.findOne({
      where: { id: id }
    })
  }
  catch(err) {
    return err;
  }
};

const localOptions = { usernameField: 'email' };
const localLogin = new LocalStrategy(localOptions, function(email, password, done) {
  getEmailUser(email)
    .then(user => {
      if (!user || user.status !== "active") {
        return done(null, false);
      }

      const hashedPassword = crypto.pbkdf2Sync(password, C.SALT, 24000, 32, 'sha256').toString('base64');

      if (hashedPassword !== user.password) {
        return done(null, false);
      }

      return done(null, user);
    })
    .catch(err => {
      return done(err);
    })
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: C.JWT
};

const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  getIdUser(payload.id)
    .then(user => {
      if (!user || user.status !== "active") {
        return done(null, false);
      }
      else {
        return done(null, user);
      }
    })
    .catch(err => {
      return done(err, false);
    })
});

passport.use(jwtLogin);
passport.use(localLogin);