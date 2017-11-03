// Load required packages
let mongoose = require('mongoose');

// Define our user schema
let SquadSchema = new mongoose.Schema({
  _id: String,
  teamid: Number,
});

// Export the Mongoose model
module.exports = mongoose.model('Squad', SquadSchema);