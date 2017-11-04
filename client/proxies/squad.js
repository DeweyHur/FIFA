const _ = require('lodash');
const Proxy = require('./proxy');
const userProxy = require('./user');
const SlotsPerPhase = 25;

class SquadProxy extends Proxy {
  constructor() {
    super();
    this.cache = { };
  }

  mySquad() {
    return this.cache.data[userProxy.cache.myid];
  }

  myFormation(phase) {
    const formation = this.mySquad().formation;
    return Array.from({length: SlotsPerPhase}, (slot, index) => {
      const playerid = formation[phase * SlotsPerPhase + index];
      return playerid;
    });
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