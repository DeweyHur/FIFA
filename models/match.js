// Load required packages
let mongoose = require('mongoose');

// Define our user schema
let MatchSchema = new mongoose.Schema({
  _id: String,
  createdAt: { type: Date, default: Date.now },
  homeUserId: String,
  homeTeamId: Number,
  homeFormation: mongoose.Schema.Types.Mixed,
  awayUserId: String,
  awayTeamId: Number,
  awayFormation: mongoose.Schema.Types.Mixed,
  history: [mongoose.Schema.Types.Mixed]
});

// Export the Mongoose model
module.exports = mongoose.model('Match', MatchSchema);