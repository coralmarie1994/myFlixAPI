// File is responsible for user login and generating JWT tokens
const jwtSecret = 'your_jwt_secret'; // the secure key used to sign the JWT tokens

const jwt = require('jsonwebtoken'), //allows create and verify JWT tokens
  passport = require('passport'); //importing passport for user authentication

require('./passport'); // Your local passport file


let generateJWTToken = (user) => {
  return jwt.sign(user, jwtSecret, {
    subject: user.username, // This is the username you’re encoding in the JWT
    expiresIn: '7d', // 7 day expiration (user will need to log in again after 7 days)
    algorithm: 'HS256' // This is the algorithm used to “sign” or encode the values of the JWT
  });
}


/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token });
      });
    })(req, res);
  });
}