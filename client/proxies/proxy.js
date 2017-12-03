const EventEmitter = require('events');
const _ = require('lodash');
const request = require('request-promise');

const generateParams = (uri) => {
  const bearer = localStorage.getItem('fifaweb-bearer');
  let ret = {
    uri: `${window.location.origin}/api${uri}`,
    json: true
  };
  if (_.isEmpty(bearer)) {
    ret = { ...ret, auth: { bearer } };
  }
  return ret;
}

module.exports.request = (method, uri, body) => {
  return request({ ...generateParams(uri), method, body });
}

module.exports.Proxy = class extends EventEmitter {
  assign(updates) {
    console.log('assigning', updates, this.cache);
    this.cache = { ...this.cache, ...updates };
    console.log('assigned', this.cache);
    this.emit('assign', updates, this.cache);
    return this.cache;
  }
}

