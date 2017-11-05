const _ = require('lodash');
const Proxy = require('./proxy');
const userProxy = require('./user');
const SlotsPerPhase = 25;

class SquadProxy extends Proxy {
  constructor() {
    super();
    this.cache = { };
  }

  whoseSquad(userid) {
    return _.get(this.cache, `data["${userid}"]`);
  }

  whoseFormation(userid, phase) {
    const formation = this.whoseSquad(userid).formation || {};
    return Array.from({length: SlotsPerPhase}, (slot, index) => {
      const playerid = formation[phase * SlotsPerPhase + index];
      return playerid;
    });
  }

  mySquad() {
    return this.whoseSquad(userProxy.myid());
  }

  myFormation(phase) {
    return this.whoseFormation(userProxy.myid(), phase);
  }

  async setTeam(teamid) {
    const updates = await this.request('PUT', `/squad/mine/team/${teamid}`);
    this.assign({ data: { ...this.cache.data, ...updates } });
    return this.mySquad();
  }
  
  async fetchMine() {
    const updates = await this.request('GET', '/squad/mine');
    this.assign({ data: { ...this.cache.data, ...updates } });
    return this.mySquad();
  }
}

module.exports = new SquadProxy();