const _ = require('lodash');
const Proxy = require('./proxy');
const userProxy = require('./user');

class MatchProxy extends Proxy {
  constructor(props) {
    super(props);
    this.cache = { data: {} };
  }

  async make(match) {
    const updates = await this.request('PUT', `/match`);
    this.assign({ data: { ...this.cache.data, ...updates } });
    for (const key in updates) {
      return updates[key];
    }
  }  
}

module.exports = new MatchProxy();