const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 8080;

// Morgan logs HTTP requests in 'common' format
app.use(morgan('common'));

// Serve static files from 'public' folder
app.use(express.static('public'));

// Default route for Home
app.get('/', (req, res) => {
  res.send('Welcome to the movie API landing page!');
});

// JSON data route for /movies URL
app.get('/movies', (req, res) => {
  res.json([
    { title: 'Die Hard', year: '1988', actors: ['Bruce Willis'], genre: ['Action', 'Thriller'] },
    { title: 'Mad Max: Fury Road', year: '2015', actors: ['Tom Hardy', 'Charlize Theron'], genre: ['Action', 'Adventure', 'Sci-Fi'] },
    { title: 'John Wick', year: '2014', actors: ['Keanu Reeves'], genre: ['Action', 'Thriller', 'Crime'] },
    { title: 'The Dark Knight', year: '2008', actors: ['Christian Bale', 'Heath Ledger'], genre: ['Action', 'Crime', 'Drama'] },
    { title: 'Gladiator', year: '2000', actors: ['Russell Crowe'], genre: ['Action', 'Drama'] },
    { title: 'The Raid: Redemption', year: '2011', actors: ['Iko Uwais'], genre: ['Action', 'Crime', 'Thriller'] },
    { title: 'The Matrix', year: '1999', actors: ['Keanu Reeves', 'Carrie-Anne Moss'], genre: ['Action', 'Sci-Fi'] },
    { title: 'Terminator 2: Judgment Day', year: '1991', actors: ['Arnold Schwarzenegger'], genre: ['Action', 'Sci-Fi'] },
    { title: 'Inception', year: '2010', actors: ['Leonardo DiCaprio'], genre: ['Action', 'Sci-Fi', 'Thriller'] },
    { title: 'James Bond: Skyfall', year: '2012', actors: ['Daniel Craig'], genre: ['Action', 'Thriller', 'Spy'] }
  ]);
});

// Error handling (middleware, will run during)
app.use((err, req, res, next) => {
  console.error(err.stack);//pre-built error code for console logging error & line location
  res.status(500).send('THE END--Something went wrong!!');
});

// Start the server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
