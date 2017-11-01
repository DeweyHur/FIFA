const Proxy = require('./proxy');
const _ = require('lodash');

class UserProxy extends Proxy {
  constructor() {
    super ();
    this.cache = { data: {} };
  }

  async fetchMe() {
    try {
      const me = await this.request('GET', '/user/me');
      localStorage.setItem('fifaweb-bearer', JSON.stringify(me.accessToken));
      this.assign({
        myid: me._id,
        data: _.assign({}, this.cache.data, { [me._id]: me })
      });
      return me;
    } catch (e) {
      this.assign({
        myid: undefined
      });
      return null;
    }
  }  
}

module.exports = new UserProxy();