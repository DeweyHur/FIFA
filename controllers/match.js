const _ = require('lodash');
const mongoose = require('mongoose');
const Match = require('../models/match');
const Squad = require('../models/squad');
const DoAMatch = require('../game');

exports.make = async (req, res) => {
  const homeUserId = _.get(req, 'user._id');
  const home = await Squad.findById(homeUserId);

  try {
    const candidates = await Squad.find({ id: { $ne: homeUserId }, teamid: { $ne: null }, formation: { $ne: null } }).lean();
    const away = _.sample(candidates);
    const match = new Match({
      _id: mongoose.Types.ObjectId().toString(),
      homeUserId,
      homeTeamId: home.teamid,
      homeFormation: home.formation,
      awayUserId: away._id,
      awayTeamId: away.teamid,
      awayFormation: away.formation,
      history: DoAMatch(home.formation, away.formation)
    });
    match.markModified('homeFormation');
    match.markModified('awayFormation');
    
    const results = await match.save();
    const serialized = match.toObject();
    console.log('match created.');

    res.status(200).send({ [match._id]: serialized });

  } catch (e) {
    console.error(e);
    res.sendStatus(500);
  }
}