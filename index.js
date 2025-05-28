//Running nodemon for refresh of terminal while updating npm run dev (added to dev package.json)
const express = require('express');
const app = express(); //express js app
const morgan = require('morgan');//logging requests 'common'
const bodyParser = require('body-parser'); //handles req.body POST/PUT
const uuid = require('uuid'); //unique ID

app.use(bodyParser.json()); //using for req.body

const port = 8080; //port for server

app.use(morgan('common')); //common morgan style for server
app.use(express.static('public')); //encompasses for shorter version
//Return: Homepage landing -Returns text
app.get('/', (req, res) => {
  res.send('Welcome to the movie API landing page!'); 
});
//User profiles
let users=[
  {
    id: 1,
    name:"Kim",
    favoriteMovies:["The Dark Knight"]
  },
  {
    id: 2,
    name:"Nate",
    favoriteMovies:["Inception"]
  },
];
//Movies data
let movies=[
    {
        "title": "Die Hard",
        "description": "Die Hard is a high-stakes action thriller about NYPD officer John McClane, who battles a group of terrorists after they seize a Los Angeles skyscraper during a holiday party. Trapped inside, McClane must rely on his wits and grit to save the hostages — including his wife.",
        "genre": [
          {name: "Action",
          description: "Fast-paced, high-energy movies with stunts & explosions."
          },
          {name: "Sci-Fi",
            description: "Science fiction films exploring futuristic technology, space, time travel, and extraterrestrial life."
          },
          {name: "Thriller",
            description: "Suspenseful, edge-of-your-seat films with intense pacing and unexpected twists."
          }
        ],
        "actors": [
            "Bruce Willis"
        ],
        "release": 1988,
        "director": {
            "name": "John McTiernan",
            "bio": "John McTiernan is an American director known for shaping the modern action genre with films like Die Hard, Predator, and The Hunt for Red October. His signature style blends suspenseful storytelling with dynamic visuals, earning him a lasting legacy in Hollywood.",
            "birthYear": 1951,
            "deathYear": null
        },
        "imageURL": "https://static.wikia.nocookie.net/diehard/images/c/c3/DieHard.jpg/revision/latest?cb=20110515165526",
        "isFeatured": true
    },
    {
        "title": "Mad Max: Fury Road",
        "description": "In a post-apocalyptic wasteland, Max teams up with Furiosa to flee a tyrannical warlord and his army in a high-octane chase across the desert. With explosive action and stunning visuals, the film redefines survival and redemption on the open road.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Tom Hardy",
            "Charlize Theron"
        ],
        "release": 2015,
        "director": {
            "name": "George Miller",
            "bio": "George Miller is an Australian filmmaker best known for creating the Mad Max franchise. His work blends intense action with visionary storytelling, earning him acclaim across both genre films and family features.",
            "birthYear": 1945,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/2/23/Mad_Max_Fury_Road.jpg",
        "isFeatured": true
    },
    {
        "title": "John Wick",
        "description": "After the death of his beloved wife, former hitman John Wick is pulled back into the underworld when a group of gangsters steal his car and kill his dog. Fueled by vengeance, he unleashes a relentless assault on those who wronged him.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Keanu Reeves"
        ],
        "release": 2014,
        "director": {
            "name": "Chad Stahelski",
            "bio": "Chad Stahelski is an American stuntman and director best known for the John Wick franchise. With a background in martial arts and stunt coordination, his films are known for their innovative action choreography and visual style.",
            "birthYear": 1968,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/9/98/John_Wick_TeaserPoster.jpg",
        "isFeatured": true
    },
    {
        "title": "The Dark Knight",
        "description": "Batman faces his greatest psychological and moral challenge when he confronts the Joker, a criminal mastermind spreading chaos throughout Gotham City. As the lines between hero and vigilante blur, the fate of the city hangs in the balance.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Christian Bale",
            "Heath Ledger"
        ],
        "release": 2008,
        "director": {
            "name": "Christopher Nolan",
            "bio": "Christopher Nolan is a British-American filmmaker known for his cerebral storytelling and groundbreaking visuals. He has directed acclaimed films such as Inception, The Dark Knight Trilogy, and Interstellar.",
            "birthYear": 1970,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg",
        "isFeatured": true
    },
    {
        "title": "Gladiator",
        "description": "A betrayed Roman general fights for his freedom and honor in the brutal arenas of the Empire, seeking vengeance against the corrupt emperor who murdered his family. His courage inspires a nation to rise against tyranny.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Russell Crowe"
        ],
        "release": 2000,
        "director": {
            "name": "Ridley Scott",
            "bio": "Ridley Scott is an English director and producer known for epic films like Gladiator, Blade Runner, and Alien. His work often features strong visuals, historical themes, and ambitious world-building.",
            "birthYear": 1937,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/8/8d/Gladiator_ver1.jpg",
        "isFeatured": true
    },
    {
        "title": "The Raid: Redemption",
        "description": "A rookie SWAT officer is trapped in a high-rise controlled by a ruthless drug lord, where every floor is a fight for survival. Featuring relentless martial arts action, the film redefined the modern action genre.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Iko Uwais"
        ],
        "release": 2011,
        "director": {
            "name": "Gareth Evans",
            "bio": "Gareth Evans is a Welsh director and screenwriter best known for his innovative martial arts films like The Raid series. His work is praised for intense fight choreography and kinetic camerawork.",
            "birthYear": 1980,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/5/5f/The_Raid_2011_poster.jpg",
        "isFeatured": true
    },
    {
        "title": "The Matrix",
        "description": "A computer hacker discovers that reality is a simulation and joins a rebellion against the machines controlling humanity. As he learns to bend the rules of this false world, he becomes a symbol of hope for the future.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Keanu Reeves",
            "Carrie-Anne Moss"
        ],
        "release": 1999,
        "director": {
            "name": "Lana & Lilly Wachowski",
            "bio": "The Wachowskis are American filmmakers known for their groundbreaking sci-fi trilogy The Matrix. Their work blends philosophy, action, and visionary special effects.",
            "birthYear": 1965,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg",
        "isFeatured": true
    },
    {
        "title": "Terminator 2: Judgment Day",
        "description": "A reprogrammed Terminator is sent back in time to protect a young John Connor from a more advanced killing machine. Together, they fight to change the future and prevent a devastating war between humans and machines.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Arnold Schwarzenegger"
        ],
        "release": 1991,
        "director": {
            "name": "James Cameron",
            "bio": "James Cameron is a Canadian filmmaker known for directing some of the most successful films of all time, including Terminator 2, Titanic, and Avatar. He is celebrated for his technical innovation and epic storytelling.",
            "birthYear": 1954,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/8/85/Terminator2poster.jpg",
        "isFeatured": true
    },
    {
        "title": "Inception",
        "description": "A skilled thief who steals secrets through dream invasion is given a chance at redemption by planting an idea into a target’s subconscious. As dreams collapse into each other, the mission grows increasingly dangerous.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Leonardo DiCaprio"
        ],
        "release": 2010,
        "director": {
            "name": "Christopher Nolan",
            "bio": "Christopher Nolan is a British-American filmmaker known for his cerebral storytelling and groundbreaking visuals. He has directed acclaimed films such as Inception, The Dark Knight Trilogy, and Interstellar.",
            "birthYear": 1970,
            "deathYear": null
        },
        "imageURL": "https://m.media-amazon.com/images/I/71uKM+LdgFL._AC_UF894,1000_QL80_.jpg",
        "isFeatured": true
    },
    {
        "title": "James Bond: Skyfall",
        "description": "When MI6 is attacked and secrets are leaked, James Bond must confront a mysterious figure from M’s past. With loyalty tested and lives at stake, Bond races to protect the agency he serves.",
        "genre": {
            "name": "Action",
            "description": "Fast-paced, high-energy movies with stunts & explosions."
        },
        "actors": [
            "Daniel Craig"
        ],
        "release": 2012,
        "director": {
            "name": "Sam Mendes",
            "bio": "Sam Mendes is a British director known for films like American Beauty, 1917, and Skyfall. His work often blends visual artistry with emotional depth.",
            "birthYear": 1965,
            "deathYear": null
        },
        "imageURL": "https://upload.wikimedia.org/wikipedia/en/f/f6/Skyfall_poster.jpg",
        "isFeatured": true
    }
];

//CRUD -Create, Read, Update, Delete 

// Error handling (middleware, will run during)
app.use((err, req, res, next) => {
  console.error(err.stack);//pre-built error code for console logging error & line location
  res.status(500).send('THE END--Something went wrong!!');
});

//Return: all movies data -READ/GET -returns JSON data
app.get('/movies', (req, res) => {
  res.status(200).json(movies);
  });

//Return: single movie data -READ/GET -returns JSON data
app.get('/movies/:title', (req, res) => {
  const {title} = req.params;
  const movie = movies.find(movie =>movie.title === title);

  if (movie) {
  res.status(200).json(movie)
  }else {
  res.status(400).send('No matching movie title found')
  }
});
//Return genre data -READ/GET -Returns JSON data
app.get('/movies/genre/:genreName', (req, res) => {
  const { genreName } = req.params;
  const movie = movies.find(movie => movie.genre.name === genreName);

  if (movie) {
    res.status(200).json(movie.genre);
  } else {
    res.status(404).send('No genre information found');
  }
});

//Return director data -READ/GET --Returns JSON data
app.get('/movies/directors/:directorName', (req, res) => {
  const { directorName } = req.params;

  const movie = movies.find(movie => movie.director.name === directorName);
  if (movie) {
    res.status(200).json(movie.director);
  } else {
    res.status(404).send('No director information found');
  } // <== MISSING closing bracket for the route
});
//Allow users to register - CREATE/POST
app.post('/users', (req, res) => {
  const newUser=req.body;

  if (newUser.name) {
    newUser.id = uuid.v4(); //creates a unique uuid for ID
    users.push(newUser);//adds newUser to users
    res.status(201).json(newUser) //gives created status 201 success
  } else {
    res.send(400).send('Users need names') //error message
  }
});
//Allow users to update - UPDATE/PUT
app.put('/users/:id', (req, res)=> {
  const { id }=req.params;
  const updatedUser= req.body;

  let user=users.find( user => user.id == id); //number-string (== so not absolute matches for truthy)

  if (user) {
    user.name=updatedUser.name;
    res.status(200).json(user);
  }else {
    res.status(400).send('User not located');
  }
});
//Allow users to add movie to favorites - CREATE/POST  "movie has been added"
app.post('/users/:id/:movieTitle', (req, res) => {
  const {id, movieTitle} =req.params;

  let user =users.find(user => user.id == id);

  if (user) {
    user.favoriteMovies.push(movieTitle);
    res.status(200).send(`${movieTitle} has beed added to ${user.name}'s favorites`);;
  } else {
    res.status(400).json(user);
  }
});
//Allow users to remove a movie from favorites- DELETE/DELELTE "movie has been removed"
app.delete('/users/:id/:movieTitle', (req, res) => {
  const { id, movieTitle } = req.params;

  let user = users.find(user => user.id == id);

    if (user.favoriteMovies) {
      user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
      res.status(200).send(`${movieTitle} has been removed from ${user.name}'s favorites list!`);
  } else {
    res.status(400).send("User not found");
  }
});
//Allow users de-register - DELETE/DELETE "user has been removed"
app.delete('/users/:id',(req,res) => {
  const { id } = req.params;

  let user = users.find(user => user.id == id);

    if (user) {
      user = users.filter( user=> user.id !== id);
      res.status(200).send(`User ${id} has been deleted`)
  } else {
    res.status(400).send("User not found");
  }
});

// Start the server (STAYS AT BOTTOM)
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
