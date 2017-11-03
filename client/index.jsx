const nav = require('./components/nav.jsx');
const squadProxy = require('./proxies/squad');
const userProxy = require('./proxies/user');
const staticdata = require('./staticdata');

(async (screen) => {
  try {
    const me = await userProxy.fetchMe();
    console.log('Fetched me', me);
    const squad = await squadProxy.fetchMine();
    console.log('Fetched my squad', squad);
    const staticdata = await staticdata.fetch();
    console.log('Fetched static data');
  } catch (e) {
    // Do nothing.
  }
  nav.go();
})();
