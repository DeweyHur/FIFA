const React = require('react');
const ReactDOM = require('react-dom');
const Header = require('./header.jsx');
const LoginScreen = require('../screens/login.jsx');
const TeamScreen = require('../screens/team.jsx');
const userProxy = require('../proxies/user');
const squadProxy = require('../proxies/squad');

exports.go = (screen) => {
  let body;  
  if (!userProxy.me) {
    body =
      <div>
        <Header title='LOGIN' />
        <LoginScreen />
      </div>;

  } else {
    const squad = squadProxy.cache.data[userProxy.cache.myid];
    if (!squad || !squad.teamid) {
      body =
        <div>
          <Header title='TEAM SELECTION' />
          <TeamScreen />
        </div>;
  
    } else if (!squad.formations) {
      body =
        <div>
          <Header title='SQUAD' />
        </div>;
  
    } else {
      switch (screen || '') {
        default:
          body =
            <div>
              <Header title='HOME' />
            </div>;
            break;
      }
    }    
  }
  
  if (body)
    ReactDOM.render(body, document.getElementById('root'));
};