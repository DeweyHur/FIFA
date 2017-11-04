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
    return Array(SlotsPerPhase).map((slot, index) => formation[phase * SlotsPerPhase + index]);
  }

  async setTeam(teamid) {
    const updates = await this.request('PUT', `/squad/mine/team/${teamid}`);
    return this.assign({ data: { ...this.cache.data, ...updates } });
  }

  async fetchMine() {
    const updates = await this.request('GET', '/squad/mine');
    return this.assign({ data: { ...this.cache.data, ...updates } });
  }
}

module.exports = new SquadProxy();