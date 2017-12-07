const _ = require('lodash');
const util = require('./util');
const Squad = require('../models/squad');
const staticdata = require('../staticdata');
const { MaxPhase } = require('../game');

exports.getMine = async (req, res) => {
  const userid = _.get(req, 'user._id');
  try {
    const squad = await Squad.findById(userid);
    if (squad && squad._id) {
      res.status(200).send({ [squad._id]: squad.toObject() });
    } else {
      res.sendStatus(404);
    }

  } catch (e) {
    return util.error(res, 500, 'findById db error', e, userid);
  }
}

exports.setTeam = async (req, res) => {
  const userid = _.get(req, 'user._id');
  const teamid = _.get(req, 'params.teamid');
  if (userid) {
    let squad = null;
    try {
      squad = await Squad.findById(userid);
    } catch (e) {
      console.log('Creating a new squad.', userid);
    }
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
      await squad.save();
      const theirSquad = squad.toObject();
      res.status(200).send({ [squad.id]: theirSquad });
    } catch (e) {
      return util.error(res, 500, 'saving db error', e, teamid, squad);
    }
  } else {
    return util.error(res, 403, 'Not logged in.');
  }
}

exports.movePosition = async (req, res) => {
  const userid = _.get(req, 'user._id');
  const srcSlot = _.get(req, 'body.src');
  const destSlot = _.get(req, 'body.dest');
  if (userid) {
    let squad = null;
    try {
      squad = await Squad.findById(userid);
    } catch (e) {
      return util.error(res, 404, 'user squad not found');
    }

    if (!squad.formation[srcSlot]) {
      return util.error(res, 402, `no one in from slot ${srcSlot}.`);
    }
    if (squad.formation[destSlot]) {
      return util.error(res, 402, `slot ${destSlot} already occupied`);
    }
    if (!(srcSlot !== 'GK' || destSlot !== 'GK')) {
      return util.error(res, 402, 'GK cannot move');
    }

    squad.formation[destSlot] = squad.formation[srcSlot];
    Reflect.deleteProperty(squad.formation, srcSlot);
    squad.markModified('formation');

    try {
      await squad.save();
      const theirSquad = squad.toObject();
      res.status(200).send({ [squad.id]: theirSquad });
    } catch (e) {
      return util.error(res, 500, 'saving db error', e, squad, srcSlot, destSlot);
    }
  } else {
    return util.error(res, 403, 'Not logged in.');
  }
}

exports.swapPosition = async (req, res) => {
  const userid = _.get(req, 'user._id');
  const srcPlayer = _.get(req, 'body.src');
  const destPlayer = _.get(req, 'body.dest');
  if (userid) {
    let squad = null;
    try {
      squad = await Squad.findById(userid);
    } catch (e) {
      return util.error(res, 404, 'user squad not found');
    }

    const fromSlots = _(squad.formation)
      .map((playerid, slot) => [playerid, slot])
      .filter(([playerid]) => playerid === srcPlayer)
      .map(([, slot]) => slot)
      .value();
    if (!(fromSlots.length === MaxPhase || fromSlots.length === 1 && fromSlots[0] === 'GK')) {
      return util.error(res, 402, `Invalid from value ${srcPlayer}. Slot info: ${fromSlots.join(',')}`);
    }

    const toSlots = _(squad.formation)
      .map((playerid, slot) => [playerid, slot])
      .filter(([playerid]) => playerid === destPlayer)
      .map(([, slot]) => slot)
      .value();
    if (!(toSlots.length === MaxPhase || toSlots.length === 1 && toSlots[0] === 'GK' || toSlots.length === 0)) {
      return util.error(res, 402, `Invalid from value ${destPlayer}. Slot info: ${toSlots.join(',')}`);
    }

    fromSlots.forEach(slot => squad.formation[slot] = destPlayer);
    toSlots.forEach(slot => squad.formation[slot] = srcPlayer);
    squad.markModified('formation');

    try {
      await squad.save();
      const theirSquad = squad.toObject();
      res.status(200).send({ [squad.id]: theirSquad });
    } catch (e) {
      return util.error(res, 500, 'saving db error', e, squad, srcPlayer, destPlayer);
    }
  } else {
    return util.error(res, 403, 'Not logged in.');
  }
}