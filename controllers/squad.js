const _ = require('lodash');
const util = require('./util');
const Squad = require('../models/squad');

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
    if (!squad) squad = new Squad({ _id: userid, teamid }).lean();

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