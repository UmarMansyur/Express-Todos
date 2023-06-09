const crypto = require('crypto');
const query = require('../config/db');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await query("SELECT * FROM users WHERE username = ?", [username]);

      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const salt = user[0].salt.toString('hex');
      const usePassword = user[0].hashed_password.toString('hex');

      const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');

      if (hashedPassword !== usePassword) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user[0].id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await query("SELECT * FROM users WHERE id = ?", [id]);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = crypto.pbkdf2Sync(password, salt, 310000, 32, 'sha256').toString('hex');
      await query("INSERT INTO users (username, hashed_password, salt) VALUES (?, ?, ?)", [username, hashedPassword, salt]);
      res.status(201).redirect('/login');
    } catch (err) {
      next(err);
    }
  },
  login: async (req, res, next) => {
    passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/' })(req, res, next);
  },
  logout: async (req, res, next) => {
    try {
      req.logout((err) => {
        if(err) return next(err);
        res.redirect('/login');
      });
    } catch (error) {
      next(error);
    }
  }
};
