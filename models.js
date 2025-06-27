const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: String,
    description: String
  },
  director: {
    name: String,
    bio: String
  },
  actors: [String],
  imagePath: String,
  featured: Boolean,
});

// USER SCHEMA BLUEPRINT
let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: String, required: true },
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
});

// CREATION OF MODELS!!
let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

// EXPORT LINES!!
module.exports.Movie = Movie;
module.exports.User = User;
