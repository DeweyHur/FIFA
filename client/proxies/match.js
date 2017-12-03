const { Proxy, request } = require('./proxy');

class MatchProxy extends Proxy {
  constructor(props) {
    super(props);
    this.cache = { data: {} };
  }

  async make() {
    const updates = await request('PUT', '/match');
    this.assign({ data: { ...this.cache.data, ...updates } });
    for (const key in updates) {
      return updates[key];
    }
  }
}

module.exports = new MatchProxy();