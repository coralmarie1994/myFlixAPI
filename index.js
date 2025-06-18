//ORDER: 1. define app & connect, 2. middleware(bodyparser, morgan, express.static) 3. routes & errors, and start server
// Required module apps
const express = require('express'); //API framework for servers in apps
const bodyParser = require('body-parser'); // Handles req.body POST/PUT (user info)
const morgan = require('morgan'); // Logging http requests to terminal
const uuid = require('uuid'); // Unique ID generator
const mongoose = require('mongoose'); // MongoDB connection ODM (Object Data Modeling)
const Models = require('./models.js'); //Imports Mongoose models from model.js file

// Express app setup
const app = express(); //initialize express app
const port = 8080;//local port for app to run on

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/myFlixDB');//connects app to database named "myFlixDB" 

// Middleware setup (NOTE: only need to call bodyParser once)
app.use(bodyParser.json()); // Parsing set for incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); //express URL-encoded parsing
app.use(morgan('common')); // Logging common predefined http requests to terminal

// Variables for models
const Movies = Models.Movie; //stores movie model to interact with database
const Users = Models.User;
const Genres = Models.Genre;
const Directors= Models.Director;

//Return: Homepage Landing -Returns text "http://localhost:8080"
app.get('/', (req, res) => {
  res.send('Welcome to the movie API landing page!'); 
});

//CRUD Mongoose -Create=Post Read=Get, Update=Put, Delete=Delete

// Error handling (middleware, will run during)
app.use((err, req, res, next) => {
  console.error(err.stack);//pre-built error code for console logging error & line location
  res.status(500).send('Error:Something went wrong!!');
});

//Return: all movies data -READ/GET -returns JSON data
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(200).json(movies); // This must be inside the .then() block
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//Return: single movie data -READ/GET -returns JSON data
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//Return: genre data -READ/GET -Returns JSON data
app.get('/genre/:genre', async (req, res) => {
  try {
    const genreName = req.params.genre;
    const movie = await Movies.findOne({ 'Genre.Name': { $regex: new RegExp(`^${genreName}$`, 'i') } }); // Find movie with genre name (case-insensitive = i)
    if (!movie) {
      return res.status(404).send('Genre not found');
    }
    res.json(movie.Genre);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});

//Return: director data -READ/GET --Returns JSON data
app.get('/directors/:name', async (req, res) => {
  try {
    const directorName = req.params.name.trim();
    // Find all movies directed by this director (case-insensitive)
    const movies = await Movies.find({ 'Director.Name': { $regex: new RegExp(`^${directorName}$`, 'i') } });

    if (movies.length === 0) {
      return res.status(404).send('Director not found');
    }

    // Get director info from first movie (assuming director details are consistent)
    const director = movies[0].Director;

    // Compose response with director info and list of movies directed
    res.json({
      name: director.Name,
      bio: director.Bio,
      movies: movies.map(movie => ({
        title: movie.Title,
        genre: movie.Genre.Name,
        _id: movie._id
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error: ' + err);
  }
});
// Return all users -READ/GET -Returns JSON data
app.get('/users', (req, res) => {
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
app.post('/users', async (req, res) => {
  await Users.findOne({ Username: req.body.Username }) 
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + ' already exists'); //for taken usernames
      } else {
        Users.create({
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        })
        .then((newUser) => {
          res.status(201).json(newUser);
        })
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
});
//Allow users to update information - UPDATE/PUT
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate(
    { Username: req.params.Username },
    {
      $set: {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday,
      },
    },
    { new: true }
  )
    .then(((updatedUser) => {
      if ((updatedUser)) {
        res.json(updatedUser);
      } else {
        res.status(404).send('User not found');
      }
    }))
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

//Allow users to add movie to favorites - CREATE/POST  "movie has been added"
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $addToSet: { FavoriteMovies: req.params.MovieID } }, // avoids duplicates from course option
      { new: true } // returns updated document
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
app.delete('/users/:Username/movies/:movieID', async (req, res) => {
  try {
    const updatedUser = await Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.movieID } },
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
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndDelete({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Create a movie - CREATE/POST "movie has been added"
// Create a new movie
app.post('/movies', (req, res) => {
  Movies.create({ 
    Title: req.body.Title,
    Description: req.body.Description,
    Genre: {
      Name: req.body.Genre?.Name,
      Bio: req.body.Genre?.Bio,
    },
    Director: {
      Name: req.body.Director?.Name,
      Bio: req.body.Director?.Bio,
    },
    Actors: req.body.Actors,
    ImagePath: req.body.ImagePath,
    Featured: req.body.Featured,
  })
    .then((newMovie) => {
      res.status(201).json(newMovie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send(`Error: ${err}`);
    });
});

// Serve static files (HTML, images, css) on local host
app.use(express.static('public')); 

// Start the server (STAYS AT BOTTOM)
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
