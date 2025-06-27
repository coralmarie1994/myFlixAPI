//imports and sets up Local Stategy & JWT Strategy for user authentication
const passport = require('passport'), //importing the passport library for authentication -- logging in with username and password
  LocalStrategy = require('passport-local').Strategy,   //importing the local  user/pass strategy from passport-local
  Models = require('./models.js'),  //importing the Mongoose models from models.js file that have been created
  passportJWT = require('passport-jwt');  //importing the passport-jwt library for JWT authentication

let Users = Models.User, //importing the User model from models.js to search for specific user in the database
  JWTStrategy = passportJWT.Strategy, //importing the JWT strategy from passport-jwt to authenticate users with JWT
  ExtractJWT = passportJWT.ExtractJwt;  //extracting the JWT from the request header (helps to pull token out of HTTP header request)
//Local Strategy for authenticating users with username and password (when logging in)
passport.use( //when someone tries to log in, use the local strategy to authenticate them (looks for username and password)
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, callback) => { //checks if the user exists and password is correct
      console.log(`${username} ${password}`); //console logs the username and password 
      await Users.findOne({ username: username }) //looks in database for the user with the given username
      .then((user) => {
        if (!user) { //if user is not found, return false and an error message
          console.log('incorrect username');
          return callback(null, false, {
            message: 'Incorrect username or password.',
          });
        }
        console.log('finished');
        return callback(null, user); //if user is found, return success
      })
      .catch((error) => { //if there is an error, log it and return the error
        if (error) {
          console.log(error);
          return callback(error);
        }
      })
    }
  )
);

// JWT Strategy for authenticating users with JWT tokens (after logging in with HTTP auth request user/pass)
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), 
  secretOrKey: 'your_jwt_secret' //sets up passport to use the JWT strategy with the secret key for decoding the JWT
}, async (jwtPayload, callback) => { //decodes token
  return await Users.findById(jwtPayload._id) //looks up user ID,d fetchs user from database
    .then((user) => {
      return callback(null, user); //if user is found, return success
    })
    .catch((error) => {
      return callback(error) //if there is an error, log it and return the error
    });
}));

//Local Strategy *passport-local* used for login auth with user/pass by looking up, and checking
//JWT *passport-jwt* used to auth JWT toeksn in HTTP headers