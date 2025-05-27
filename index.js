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
  {
  title: 'Die Hard',
  description: 'Die Hard is a high-stakes action thriller about NYPD officer John McClane, who battles a group of terrorists after they seize a Los Angeles skyscraper during a holiday party. Trapped inside, McClane must rely on his wits and grit to save the hostages — including his wife.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Bruce Willis'],
  release: 1988,
  director: {
    name: 'John McTiernan',
    bio: 'John McTiernan is an American director known for shaping the modern action genre with films like Die Hard, Predator, and The Hunt for Red October. His signature style blends suspenseful storytelling with dynamic visuals, earning him a lasting legacy in Hollywood.',
    birthYear: 1951,
    deathYear: null
  },
  imageURL: 'https://static.wikia.nocookie.net/diehard/images/c/c3/DieHard.jpg/revision/latest?cb=20110515165526',
  isFeatured: true
  },
  {
  title: 'Mad Max: Fury Road',
  description: 'In a post-apocalyptic wasteland, Max teams up with Furiosa to flee a tyrannical warlord and his army in a high-octane chase across the desert. With explosive action and stunning visuals, the film redefines survival and redemption on the open road.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Tom Hardy', 'Charlize Theron'],
  release: 2015,
  director: {
    name: 'George Miller',
    bio: 'George Miller is an Australian filmmaker best known for creating the Mad Max franchise. His work blends intense action with visionary storytelling, earning him acclaim across both genre films and family features.',
    birthYear: 1945,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/2/23/Mad_Max_Fury_Road.jpg',
  isFeatured: true
  },
  {
  title: 'John Wick',
  description: 'After the death of his beloved wife, former hitman John Wick is pulled back into the underworld when a group of gangsters steal his car and kill his dog. Fueled by vengeance, he unleashes a relentless assault on those who wronged him.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Keanu Reeves'],
  release: 2014,
  director: {
    name: 'Chad Stahelski',
    bio: 'Chad Stahelski is an American stuntman and director best known for the John Wick franchise. With a background in martial arts and stunt coordination, his films are known for their innovative action choreography and visual style.',
    birthYear: 1968,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/9/98/John_Wick_TeaserPoster.jpg',
  isFeatured: true
  },
  {
  title: 'The Dark Knight',
  description: 'Batman faces his greatest psychological and moral challenge when he confronts the Joker, a criminal mastermind spreading chaos throughout Gotham City. As the lines between hero and vigilante blur, the fate of the city hangs in the balance.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Christian Bale', 'Heath Ledger'],
  release: 2008,
  director: {
    name: 'Christopher Nolan',
    bio: 'Christopher Nolan is a British-American filmmaker known for his cerebral storytelling and groundbreaking visuals. He has directed acclaimed films such as Inception, The Dark Knight Trilogy, and Interstellar.',
    birthYear: 1970,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/8/8a/Dark_Knight.jpg',
  isFeatured: true
  },
  {
  title: 'Gladiator',
  description: 'A betrayed Roman general fights for his freedom and honor in the brutal arenas of the Empire, seeking vengeance against the corrupt emperor who murdered his family. His courage inspires a nation to rise against tyranny.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Russell Crowe'],
  release: 2000,
  director: {
    name: 'Ridley Scott',
    bio: 'Ridley Scott is an English director and producer known for epic films like Gladiator, Blade Runner, and Alien. His work often features strong visuals, historical themes, and ambitious world-building.',
    birthYear: 1937,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/8/8d/Gladiator_ver1.jpg',
  isFeatured: true
  }, 
  {
  title: 'The Raid: Redemption',
  description: 'A rookie SWAT officer is trapped in a high-rise controlled by a ruthless drug lord, where every floor is a fight for survival. Featuring relentless martial arts action, the film redefined the modern action genre.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Iko Uwais'],
  release: 2011,
  director: {
    name: 'Gareth Evans',
    bio: 'Gareth Evans is a Welsh director and screenwriter best known for his innovative martial arts films like The Raid series. His work is praised for intense fight choreography and kinetic camerawork.',
    birthYear: 1980,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/5/5f/The_Raid_2011_poster.jpg',
  isFeatured: true
  },
  {
  title: 'The Matrix',
  description: 'A computer hacker discovers that reality is a simulation and joins a rebellion against the machines controlling humanity. As he learns to bend the rules of this false world, he becomes a symbol of hope for the future.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Keanu Reeves', 'Carrie-Anne Moss'],
  release: 1999,
  director: {
    name: 'Lana & Lilly Wachowski',
    bio: 'The Wachowskis are American filmmakers known for their groundbreaking sci-fi trilogy The Matrix. Their work blends philosophy, action, and visionary special effects.',
    birthYear: 1965,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Matrix_Poster.jpg',
  isFeatured: true
  },
  {
  title: 'Terminator 2: Judgment Day',
  description: 'A reprogrammed Terminator is sent back in time to protect a young John Connor from a more advanced killing machine. Together, they fight to change the future and prevent a devastating war between humans and machines.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Arnold Schwarzenegger'],
  release: 1991,
  director: {
    name: 'James Cameron',
    bio: 'James Cameron is a Canadian filmmaker known for directing some of the most successful films of all time, including Terminator 2, Titanic, and Avatar. He is celebrated for his technical innovation and epic storytelling.',
    birthYear: 1954,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/8/85/Terminator2poster.jpg',
  isFeatured: true
  },
  {
  title: 'Inception',
  description: 'A skilled thief who steals secrets through dream invasion is given a chance at redemption by planting an idea into a target’s subconscious. As dreams collapse into each other, the mission grows increasingly dangerous.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Leonardo DiCaprio'],
  release: 2010,
  director: {
    name: 'Christopher Nolan',
    bio: 'Christopher Nolan is a British-American filmmaker known for his cerebral storytelling and groundbreaking visuals. He has directed acclaimed films such as Inception, The Dark Knight Trilogy, and Interstellar.',
    birthYear: 1970,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/7/7f/Inception_ver3.jpg',
  isFeatured: true
  },
  {
  title: 'James Bond: Skyfall',
  description: 'When MI6 is attacked and secrets are leaked, James Bond must confront a mysterious figure from M’s past. With loyalty tested and lives at stake, Bond races to protect the agency he serves.',
  genre: {
    name: 'Action',
    description: 'Fast-paced, high-energy movies with stunts & explosions.'
  },
  actors: ['Daniel Craig'],
  release: 2012,
  director: {
    name: 'Sam Mendes',
    bio: 'Sam Mendes is a British director known for films like American Beauty, 1917, and Skyfall. His work often blends visual artistry with emotional depth.',
    birthYear: 1965,
    deathYear: null
  },
  imageURL: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Skyfall_poster.jpg',
  isFeatured: true
}
  ]);
});
//Genres 
const genres = [
  { name: 'Thriller', description: 'Suspenseful stories with unexpected twists.' },
  { name: 'Action', description: 'Fast-paced, often with stunts and explosions.' }
];
// Error handling (middleware, will run during)
app.use((err, req, res, next) => {
  console.error(err.stack);//pre-built error code for console logging error & line location
  res.status(500).send('THE END--Something went wrong!!');
});

// Start the server
app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`);
});
