const { Proxy, request } = require('./proxy');
const _ = require('lodash');

class UserProxy extends Proxy {
  constructor() {
    super();
    this.cache = { data: {} };
  }

  myid() {
    return _.get(this.cache, 'myid');
  }

  async who(userid) {
    let user = _.get(this.cache, `data["${userid}"]`);
    if (user) {
      await Promise.resolve(() => user);
    } else {
      user = await request('GET', `/user/${userid}`);
    }
    console.log('who', userid, user);
    return user;
  }

  async fetchMe() {
    try {
      const me = await request('GET', '/user/me');
      localStorage.setItem('fifaweb-bearer', JSON.stringify(me.accessToken));
      this.assign({
        myid: me._id,
        data: { ...this.cache.data, [me._id]: me }
      });
      this.me = me;
      return me;
    } catch (e) {
      this.assign({
        myid: undefined
      });
      Reflect.deleteProperty(this, 'me');
      return null;
    }
  }
}

module.exports = new UserProxy();