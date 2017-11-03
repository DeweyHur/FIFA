const EventEmitter = require('events');
const _ = require('lodash');
const request = require('request-promise');

module.exports = class extends EventEmitter {
  assign(updates) {
    console.log('assigning', updates, this.cache);
    this.cache = { ...this.cache, ...updates };
    console.log('assigned', this.cache);
    this.emit('assign', updates, this.cache);
    return this.cache;
  }

  generateParams(uri) {
    const bearer = localStorage.getItem('fifaweb-bearer');
    return _.assign({
      uri: `${window.location.origin}/api${uri}`,
      json: true
    }, bearer != null ? { auth: { bearer } } : {});
  }

  async request(method, uri, body) {
    return request(_.assign(this.generateParams(uri), { method, body }));
  }
}

