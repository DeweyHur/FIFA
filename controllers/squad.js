const _ = require('lodash');
const util = require('./util');
const Squad = require('../models/squad');
const staticdata = require('../staticdata');

exports.getMine = async (req, res) => {
  const userid = _.get(req, 'user._id');
  try {
    const squad = await Squad.findById(userid).lean();
    res.status(200).send({ [squad._id]: squad });

  } catch (e) {
    return util.error(res, 500, 'saving db error', e, userid);
  }
}
 
exports.setTeam = async (req, res) => {
  const userid = _.get(req, 'user._id');
  const teamid = _.get(req, 'params.teamid');
  if (userid) {
    let squad;
    try { squad = await Squad.findById(userid).lean(); }
    catch (e) { console.log(`Creating a new squad.`, userid); }
    if (!squad) squad = new Squad({ _id: userid }).lean();
    squad.teamid = teamid;
    squad.formation = {};
    staticdata.teams[teamid].forEach((slot, index) => {
      if (slot) {
        for (const phase = 0; phase < 4; ++phase) {
          squad.formation[phase * 25 + index] = slot;
        }
      }
    });

    try {
      const result = await squad.save();
      res.status(200).send({ [squad.id]: squad });
    } catch (e) {
      return util.error(res, 500, `saving db error`, e, teamid, squad);
    }
  } else {
    return util.error(res, 403, `Not logged in.`);
  }
}