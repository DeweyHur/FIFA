const nav = require('./components/nav.jsx');
const squadProxy = require('./proxies/squad');
const userProxy = require('./proxies/user');
const staticdata = require('./staticdata');

(async () => {
  try {
    const data = await staticdata.fetch();
    console.log('Fetched staticdata', data);
    const me = await userProxy.fetchMe();
    console.log('Fetched me', me);
    if (me) {
      const squad = await squadProxy.fetchMine();
      console.log('Fetched my squad', squad);
    }
  } catch (e) {
    console.error(e);
  }
  nav.go();
})();
