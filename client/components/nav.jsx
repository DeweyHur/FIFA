const React = require('react');
const ReactDOM = require('react-dom');
const Header = require('./header.jsx');
const userProxy = require('../proxies/user');
const squadProxy = require('../proxies/squad');

const Screen = {
  login: require('../screens/login.jsx'),
  team: require('../screens/team.jsx'),
  formation: require('../screens/formation.jsx'),
};

exports.go = (screen, props) => {
  if (!userProxy.me) screen = 'login';
  else {
    const squad = squadProxy.cache.data[userProxy.cache.myid];
    if (!squad || !squad.teamid) screen = 'team';
    else if (!squad.formations) screen = 'formation';
  }

  if (Screen[screen]) {
    const children = [
      <Header title={screen.toUpperCase()} />,
      React.createElement(Screen[screen], props)
    ];
    ReactDOM.render(
      <div>
        {children}
      </div>, document.getElementById('root')
    );
  }
};