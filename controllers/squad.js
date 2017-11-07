const _ = require('lodash');
const util = require('./util');
const Squad = require('../models/squad');
const staticdata = require('../staticdata');

exports.getMine = async (req, res) => {
  const userid = _.get(req, 'user._id');
  try {
    const squad = await Squad.findById(userid);
    if (squad && squad._id) {
      res.status(200).send({ [squad._id]: squad.toObject() });
    } else
      res.sendStatus(404);

  } catch (e) {
    return util.error(res, 500, 'findById db error', e, userid);
  }
}

exports.setTeam = async (req, res) => {
  const userid = _.get(req, 'user._id');
  const teamid = _.get(req, 'params.teamid');
  if (userid) {
    let squad;
    try { squad = await Squad.findById(userid); }
    catch (e) { console.log(`Creating a new squad.`, userid); }
    if (!squad) squad = new Squad({ _id: userid });
    squad.teamid = teamid;
    const selectedTeam = staticdata.teams[teamid];
    squad.formation = { GK: selectedTeam.GK };
    for (let index = 0; index < 25; ++index) {
      const playerid = selectedTeam[index];
      if (playerid) {
        for (let phase = 0; phase < 4; ++phase) {
          squad.formation[phase * 25 + index] = playerid;
        }
      }
    }
    squad.markModified('formation');

    try {
      const result = await squad.save();
      const theirSquad = squad.toObject();
      res.status(200).send({ [squad.id]: theirSquad });
    } catch (e) {
      return util.error(res, 500, `saving db error`, e, teamid, squad);
    }
  } else {
    return util.error(res, 403, `Not logged in.`);
  }
}