// passport.js – Sets up Local Strategy & JWT Strategy for authentication

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const Models = require('./models.js');

const User = Models.User;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

// Local Strategy for logging in with username & password
passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });

        if (!user) {
          console.log('Incorrect username');
          return done(null, false, { message: 'Incorrect username or password.' });
        }

        // Optional: add user.validatePassword(password) here if you implement hashing
        // if (!user.validatePassword(password)) {
        //   return done(null, false, { message: 'Incorrect password.' });
        // }

        return done(null, user);
      } catch (error) {
        console.error('Error during login:', error);
        return done(error);
      }
    }
  )
);

// JWT Strategy for verifying token from Authorization header
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your_jwt_secret',
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findById(jwtPayload._id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);
