//ORDER: 1. define app & connect, 2. middleware(bodyparser, morgan, express.static) 3. routes & errors, and start server
// Required module apps
const express = require('express'); //API framework for servers in apps
const morgan = require('morgan'); // Logging http requests to terminal
const path = require('path'); // Path module for file paths
const bodyParser = require('body-parser'); // Handles req.body POST/PUT (user info)
const uuid = require('uuid'); // Unique ID generator
const mongoose = require('mongoose'); // MongoDB connection ODM (Object Data Modeling)
const Models = require('./models.js'); //Imports Mongoose models from model.js file
//Models from models.js file
const Movies = Models.Movie; //stores movie model to interact with database
const Users = Models.User;
// Express app setup
const app = express(); //initialize express app
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
const cors = require('cors');
const { check, validationResult } = require('express-validator'); 
// MongoDB connection
mongoose.connect('mongodb://localhost:27017/cfDB');//connects app to database named "myFlixDB"

// Middleware setup (NOTE: only need to call bodyParser once)
app.use(bodyParser.json()); // Parsing set for incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); //express URL-encoded parsing
// app.use can be replaced by
const passport = require('passport'); //importing passport for authentication middleware
require('./passport'); //importing passport configuration file for local jwt set up
app.use(morgan('common')); // Logging common predefined http requests to terminal
//const cors = require('cors');
//app.use(cors()); -- this gives access to all origins, which is not secure for production and should not be used, below option allows for specific origins only!
//CORS cross-origin resource sharing allows requests from different origins (domains)
let allowedOrigins = ['http://localhost:8080', 'http://anysitethatsalloweduse.com'];

app.use(cors({
origin: (origin, callback) => {
  if(!origin) return callback(null, true);
  if(allowedOrigins.indexOf(origin) === -1){ // If a specific origin isn’t found on the list of allowed origins
    let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
    return callback(new Error(message ), false);
  }
  return callback(null, true);
}
}));
let auth = require('./auth')(app); //importing auth.js file to use authentication middleware
// ---- ROUTES ON API ----

//Return: Homepage Landing -Returns text "http://localhost:8080"
app.get('/', (req, res) => {
  res.send('Welcome to the movie API landing page!'); 
});

//CRUD Mongoose -Create=Post Read=Get, Update=Put, Delete=Delete

//Return: all movies data -READ/GET -returns JSON data
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    await Movies.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});

//Return: single movie data -READ/GET -returns JSON data
app.get(
  "/movies/:title",
  [
    passport.authenticate("jwt", { session: false }),
    check('title', 'Title is required').notEmpty()
  ],(req, res) => {
  const title = req.params.title;
  console.log("Searching for:", title);

  Movies.findOne({
    title: { $regex: `^${title}$`, $options: 'i' }
  })
    .then((movie) => {
      if (!movie) return res.status(404).send('Movie not found');
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return: genre data -READ/GET -Returns JSON data
app.get(
  "/genres/:name",
  [
    passport.authenticate("jwt", { session: false }),
    check('name', 'Genre name is required').notEmpty()
  ],async (req, res) => {
  try {
    const genreName = req.params.name;
    const movie = await Movies.findOne({
      'genre.name': { $regex: new RegExp(`^${genreName}$`, 'i') } // 👈 lowercase keys
    });

    if (!movie) {
      return res.status(404).send(`Genre "${genreName}" not found.`);
    }

    res.json(movie.genre);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});
//Return: director data -READ/GET --Returns JSON data
app.get(
  "/directors/:name",
  [
    passport.authenticate("jwt", { session: false }),
    check('name', 'Director name is required').notEmpty()
  ],async (req, res) => {
  try {
    const directorName = req.params.name.trim();
    const movies = await Movies.find({
      director: { $regex: new RegExp(`^${directorName}$`, 'i') } // ⬅️ no .name
    });

    if (!movies.length) {
      return res.status(404).send('Director not found');
    }

    res.json({
      name: directorName,
      movies: movies.map(movie => ({
        title: movie.title,
        genre: movie.genre?.name,
        _id: movie._id
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

// Return all users -READ/GET -Returns JSON data -should only be accessible to admins
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});
//Allow new users to register - CREATE/POST
app.post('/users',
  [
    check('username', 'Username is required and must be at least 5 characters long')
      .isLength({ min: 5 }),
    check('username', 'Username contains non-alphanumeric characters - not allowed.')
      .isAlphanumeric(),
    check('password', 'Password is required').not().isEmpty(),
    check('email', 'Email is not valid').isEmail(),
    check('birthday', 'Birthday is required and must be a valid date in YYYY-MM-DD format')
      .isISO8601()
  ],
  async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.password);

    await Users.findOne({ username: req.body.username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.username + ' already exists');
        } else {
          Users.create({
            username: req.body.username,
            password: hashedPassword,
            email: req.body.email,
            birthday: req.body.birthday
          })
          .then((newUser) => res.status(201).json(newUser))
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//Allow users to add movie to favorites - CREATE/POST  "movie has been added"
app.post(
  "/users/:username/movies/:movieId",
  [
    passport.authenticate("jwt", { session: false }),
    check('username', 'Username is required').notEmpty(),
    check('movieId', 'Invalid movie ID').isMongoId()
  ],async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { username: req.params.username },
      { $addToSet: { favoriteMovies: req.params.movieID } }, // avoid duplicates
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error: ${err}`);
  }
});


//Allow users to remove a movie from favorites- DELETE/DELELTE "movie has been removed"
app.delete(
  "/users/:username/movies/:movieId",
  [
    passport.authenticate("jwt", { session: false }),
    check('username', 'Username is required').notEmpty(),
    check('movieId', 'Invalid movie ID').isMongoId()
  ],async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { username: req.params.username },       // lowercase username here
      { $pull: { favoriteMovies: req.params.movieID } },  // lowercase movieID here
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).send('User not found');
    }

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error: ' + error);
  }
});


//Allow users de-register - DELETE/DELETE "user has been removed"
app.delete(
  "/users/:username",
  [
    passport.authenticate("jwt", { session: false }),
    check('username', 'Username is required').notEmpty()
  ],(req, res) => {
  Users.findOneAndDelete({ username: req.params.username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.username + ' was not found');
      } else {
        res.status(200).send(req.params.username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


//Create a movie - CREATE/POST "movie has been added"
app.post('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
  Movies.create({ 
    title: req.body.title,
    description: req.body.description,
    genre: {
      name: req.body.genre?.name,
      description: req.body.genre?.description,
    },
    director: {
      name: req.body.director?.name,
      bio: req.body.director?.bio,
    },
    actors: req.body.actors,
    imagePath: req.body.imagePath,
    featured: req.body.featured,
  })
    .then((newMovie) => {
      res.status(201).json(newMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err.message}`);
    });
});

// Serve static files (HTML, images, css) on local host
app.use(express.static('public')); 
// Error handling (middleware, will run during)
app.use((err, req, res, next) => {
  console.error("ERROR MESSAGE:", err.message);
  console.error("ERROR STACK:", err.stack);
  res.status(500).json({ error: err.message });
});
// Start the server (STAYS AT BOTTOM)
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
