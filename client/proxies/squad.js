const _ = require('lodash');
const { Proxy, request } = require('./proxy');
const userProxy = require('./user');
const SlotsPerPhase = 25;

class SquadProxy extends Proxy {
  constructor() {
    super();
    this.cache = {};
  }

  whoseSquad(userid) {
    return _.get(this.cache, `data["${userid}"]`);
  }

  whoseFormation(userid, phase) {
    const formation = this.whoseSquad(userid).formation || {};
    return this.convertFormationToArray(formation, phase);
  }

  mySquad() {
    return this.whoseSquad(userProxy.myid());
  }

  myFormation(phase) {
    return this.whoseFormation(userProxy.myid(), phase);
  }

  async setTeam(teamid) {
    const updates = await request('PUT', `/squad/mine/team/${teamid}`);
    this.assign({ data: { ...this.cache.data, ...updates } });
    return this.mySquad();
  }

  async movePosition(src, dest) {
    const updates = await request('POST', '/squad/mine/position/move', { src, dest });
    this.assign({ data: { ...this.cache.data, ...updates } });
    return this.mySquad();
  }

  async swapPosition(src, dest) {
    const updates = await request('POST', '/squad/mine/position/swap', { src, dest });
    this.assign({ data: { ...this.cache.data, ...updates } });
    return this.mySquad();
  }

  async fetchMine() {
    const updates = await request('GET', '/squad/mine');
    this.assign({ data: { ...this.cache.data, ...updates } });
    return this.mySquad();
  }
}

SquadProxy.prototype.convertFormationToArray = (formation, phase = 0) => {
  return Array.from({ length: SlotsPerPhase }, (slot, index) => {
    const playerid = formation[phase * SlotsPerPhase + index];
    return playerid;
  });
}

module.exports = new SquadProxy();