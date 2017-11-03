const _ = require('lodash');
const Proxy = require('./proxy');

class SquadProxy extends Proxy {
  constructor() {
    super();
    this.cache = { data: {} };
  }

  async setTeam(teamid) {
    const updates = await this.request('PUT', `/squad/me/team/${teamid}`);
    return this.assign({ data: { ...this.cache.data, ...updates } });
  }

  async fetchMine() {
    const updates = await this.request('GET', '/squad/mine');
    return this.assign({ data: { ...this.cache.data, ...updates } });
  }
}

module.exports = new SquadProxy();