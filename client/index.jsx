const React = require('react');
const ReactDOM = require('react-dom');
const Login = require('./components/login.jsx');
const Header = require('./components/header.jsx');
const userProxy = require('./proxies/user');

(async () => {
  const me = await userProxy.fetchMe();
  if (me) {
  } else {
    ReactDOM.render(
      <div>
        <Header title='LOGIN' />
        <Login />
      </div>
    , document.getElementById('root'));
  }
})();
