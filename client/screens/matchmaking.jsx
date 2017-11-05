const React = require('react');
const UserSquad = require('../components/usersquad.jsx');
const squadProxy = require('../proxies/squad');
const userProxy = require('../proxies/user');

module.exports = class extends React.Component {
  render() {
    return (
      <section id="matchmaking">
        <UserSquad userid={userProxy.myid()} teamid={squadProxy.mySquad().id} />
      </section>
    );
  }
}