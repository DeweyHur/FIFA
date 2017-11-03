const nav = require('./components/nav.jsx');
const squadProxy = require('./proxies/squad');
const userProxy = require('./proxies/user');

(async (screen) => {
  try {
    const me = await userProxy.fetchMe();
    console.log('Fetched me', me);
    const squad = await squadProxy.fetchMine();
    console.log('Fetched my squad', squad);
  } catch (e) {
    // Do nothing.
  }
  nav.go();
})();
