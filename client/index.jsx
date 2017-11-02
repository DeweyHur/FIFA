const React = require('react');
const ReactDOM = require('react-dom');
const Header = require('./components/header.jsx');
const LoginScreen = require('./screens/login.jsx');
const TeamScreen = require('./screens/team.jsx');
const userProxy = require('./proxies/user');

(async () => {
  const me = await userProxy.fetchMe();
  let body;
  if (!me) {
    body =
      <div>
        <Header title='LOGIN' />
        <LoginScreen />
      </div>;

  } else if (!me.team) {
    body =
      <div>
        <Header title='TEAM SELECTION' />
        <TeamScreen />
      </div>;

  } else if (!me.squad) {
    body =
      <div>
        <Header title='SQUAD' />
      </div>;

  } else {
    body =
      <div>
        <Header title='HOME' />
      </div>;
  }
  ReactDOM.render(body, document.getElementById('root'));
})();
